/**
 * Gets information on pull requests
 */

import fs from 'fs'
import { simpleGit } from 'simple-git'
import { Octokit } from 'octokit'
import { components } from '@octokit/openapi-types'
import { DiffSum, PRCommit, PullRequest, ReviewComment, Comment, Tag } from './LibraryTypes'
import axios from 'axios'
import { throttling } from '@octokit/plugin-throttling'

type PRResponse = {
    status: number;
    url: string;
    headers: Object;
    data: components['schemas']['pull-request'][]
}

export class Searcher {

    octokit: Octokit;

    language: string

    constructor(lang: string, auth?: string) {
        this.language = lang
        const MyOctokit = Octokit.plugin(throttling)
        this.octokit = new MyOctokit({auth: auth,
            throttle: {
                onRateLimit: async (retryAfter: number, options: any, octokit: any, retryCount: any) => {
                    await octokit.log.warn(
                        `Request quota exhausted for request ${options.method} ${options.url}`
                    );
                
                    if (options.request.retryCount < 2) {
                        // Re-tries twice with a 60 second delay
                        await new Promise(resolve => setTimeout(resolve, 6000))
                        await octokit.log.info(`Retrying after ${retryAfter} seconds!`);
                        return true;
                    }
                },
                    onSecondaryRateLimit: (retryAfter: number, options : any, octokit:any) => {
                    // does not retry, only logs a warning
                    octokit.log.warn(
                        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
                    );
                },
            }
        })
    }

    async _getPRS(owner: string, repo: string, url: string){
        const cacheDirectory = `cache/PRs/${owner}/${repo}`
        const cacheFile = `${cacheDirectory}/${this.language}.json`
        if(fs.existsSync(cacheFile)){
            return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8'));
        }
        //console.log(`Fetching PR list for ${owner}/${repo}`)
        var prs: components['schemas']['pull-request'][] = []
        var pageNumber = 1

        let response: PRResponse = await this.octokit.request(`Get /repos/${owner}/${repo}/pulls`, {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }, 
            state: 'all',
            per_page: 100,
            page: pageNumber
        })
        pageNumber += 1

        while (response.data.length != 0) {
            prs = prs.concat(response.data)

            response = await this.octokit.request(`Get /repos/${owner}/${repo}/pulls`, {
                owner: owner,
                repo: repo,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }, 
                state: 'all',
                per_page: 100,
                page: pageNumber
            })
            //console.log(`Retrieved page: ${pageNumber}`)
           pageNumber += 1
        }
        if(!fs.existsSync(cacheDirectory)){
            fs.mkdirSync(cacheDirectory, {recursive : true})
        }
        await fs.promises.writeFile(cacheFile, JSON.stringify(prs));
        return prs;
    }
    async getPRList(owner: string, repo: string, url: string) {

        // Make sure the library has been cloned and pull
        if (!fs.existsSync(`Libraries/${this.language}/${owner}/${repo}`)) {
            await simpleGit().clone(url, `Libraries/${this.language}/${owner}/${repo}`)
        } else {
            await simpleGit(`Libraries/${this.language}/${owner}/${repo}`).pull()
        }

        const {
            data: { login },
        } = await this.octokit.rest.users.getAuthenticated()
        
        const prs = await this._getPRS(owner, repo, url);

        var pullRequests: PullRequest[] = []
        for (var index in prs) {
            pullRequests.push(await this.analyzePR(prs[index], owner, repo))
        }

        fs.writeFileSync(`${owner}_${repo}_PullRequests.json`, JSON.stringify(pullRequests))

    }

    async analyzePR(pr: components['schemas']['pull-request'], owner: string, repo: string): Promise<PullRequest> {
        const cacheDirectory = `cache/PRs/${owner}/${repo}`
        const cacheFile = `${cacheDirectory}/${pr.number}.json`
        if (fs.existsSync(cacheFile)) {
            return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8')) as PullRequest
        }
        console.log(`Processing PR: ${pr.number}`)
        // Get state and dates of PR
        var open_date = pr.created_at
        var state = 'open'
        var update_date = pr.updated_at
        if (pr.state === 'closed') {
            if (pr.merged_at === null) {
                const mergedByBors = /\[Merged by Bors\]/
                if (mergedByBors.test(pr.title)) {
                    state = 'merged'
                }
                    state = 'closed'
                if (pr.closed_at) {
                    update_date = pr.closed_at
                }
            } else {
                state = 'merged'
                if (pr.merged_at) {
                    update_date = pr.merged_at
                }
            }
        }
        // Get the list of commits
        var commits: components['schemas']['commit'][] = []
        var pageNumber = 1
        var response = (await this.octokit.request(pr.commits_url, {
            per_page: 100,
            page: pageNumber
        }))
        while (response.data.length != 0) {
            pageNumber++;
            //console.log(`Retrieving commits, got ${response.data.length}`)
            commits = commits.concat(response.data)
            response = (await this.octokit.request(pr.commits_url, {
                per_page: 100,
                page: pageNumber
            }))
        }
        var prCommits: PRCommit[] = []
        for (var commit of commits) {
            prCommits.push({author: commit.author?.login, committer: commit.committer?.login, hash: commit.sha, message: commit.commit.message, date: commit.commit.committer?.date})
        }
        // Get the diff summary of the current state of the PR
        //console.log(`Retrieving diff_url ${pr.diff_url}`)
        let diff: string = (await axios.get(pr.diff_url)).data
        //console.log("Processing diff")
        let prDiffs = this.processDiff(diff)
        // Get the PR review discussion
        var reviewComments: components['schemas']['pull-request-review-comment'][] = []
        pageNumber = 1
        //console.log(`Retrieving first review comment surl`)
        response = await (this.octokit.request(pr.review_comments_url, {
            per_page: 100,
            page: pageNumber
        }))
        while (response.data.length != 0) {
            pageNumber++;
            //console.log(`Retrieving review comments, got ${response.data.length}`)
            reviewComments = reviewComments.concat(response.data)
            response = await (this.octokit.request(pr.review_comments_url, {
                per_page: 100,
                page: pageNumber
            }))
        }
        var prReviewComments: ReviewComment[] = reviewComments.map(comment => {
            return {author: comment.user.login, file: comment.path, date: comment.created_at, comment: comment.body}
        })
        // Get PR discussion
        var comments: components['schemas']['issue-comment'][] = []
        pageNumber = 1
        //console.log(`Retreiving pr comments`)
        response = await (this.octokit.request(pr.comments_url, {
            per_page: 100,
            page: pageNumber
        }))
        while (response.data.length != 0) {
            pageNumber++;
            //console.log(`pr comments page ${pageNumber}, ${response.data.length}`)
            comments = comments.concat(response.data)
            response = await (this.octokit.request(pr.comments_url, {
                per_page: 100,
                page: pageNumber
            }))
        }
        var prComments: Comment[] = comments.map(comment => {
            return {author: comment.user?.login, date: comment.created_at, comment: comment.body}
        })
        // Get the list of tags
        var tags: Tag[] = pr.labels.map(label => {
            return {tag: label.name, description: label.description}
        })
        // Create and return PR Description
        //console.log(`Finishing`)
        var description = {author: pr.user?.login, number: pr.number, diff_summary: prDiffs, state: state, open_date: open_date, update_date: update_date, 
            discussion: prComments, review_discussion: prReviewComments, tags: tags, commits: prCommits}
        if (!fs.existsSync(cacheDirectory)) {
            fs.mkdirSync(cacheDirectory, {recursive: true})
        }
        await fs.promises.writeFile(cacheFile, JSON.stringify(description))
        return description
    }

    processDiff(diff: string) {
        const fileRegex = /^diff --git a\/(.+?) b\/.+$/gm;
        const matches = diff.matchAll(fileRegex);
        const files: DiffSum[] = [];

        if (matches) {
            for (const match of matches) {
                const file: DiffSum = {file: match[1], status: 'M', additions: 0, deletions: 0}
                if (match.input) {
                    const lines = match.input.split('\n')
    
                    for (const line of lines) {
                        if (line.startsWith('new file mode')) {
                            file.status = 'A'
                        } else if (line.startsWith('deleted file mode')) {
                            file.status = 'D'
                        } else if (line.startsWith('+') && !line.startsWith('+++')) {
                            file.additions++
                        } else if (line.startsWith('-') && !line.startsWith('---')) {
                            file.deletions++
                        }
                    }
                    files.push(file)
                }
            }
        }
        return files;

    }
}
