/**
 * Gets information on pull requests
 */

import fs from 'fs'
import { SimpleGit, simpleGit, StatusResult } from 'simple-git'
import { readFile } from 'fs/promises'
import { Octokit } from 'octokit'
import { components } from '@octokit/openapi-types'
import { DiffSum, PRCommit, PullRequest, ReviewComment, Comment, Tag } from './LibraryTypes'
import { fileURLToPath } from 'url'
import axios from 'axios'

type PRResponse = {
    status: number;
    url: string;
    headers: Object;
    data: components['schemas']['pull-request'][]
}

export class Searcher {

    octokit: Octokit = new Octokit({auth: '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'})

    language: string

    constructor(lang: string) {
        this.language = lang
    }

    async getPRList(owner: string, repo: string, url: string) {

        // Make sure the library has been cloned and pull
        if (!fs.existsSync(`${this.language}/${owner}/${repo}`)) {
            await simpleGit().clone(url, `${this.language}/${owner}/${repo}`)
        } else {
            await simpleGit(`${this.language}/${owner}/${repo}`).pull()
        }

        const {
            data: { login },
        } = await this.octokit.rest.users.getAuthenticated()
        
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
            
           pageNumber += 1
        }

        var pullRequests: PullRequest[] = []
        for (var index in prs) {
            // Check rate limit and wait if needed
            var status = await this.octokit.rest.rateLimit.get()
            if (status.headers['x-ratelimit-remaining'] && parseInt(status.headers['x-ratelimit-remaining']) < 10) {
                var resetTime = status.headers['x-ratelimit-reset'] ? parseInt(status.headers['x-ratelimit-reset']) * 1000 : 0
                var currentTime = Date.now()
                var waitTime = resetTime - currentTime
                console.log(`Rate limit reached. Waiting for ${waitTime} ms`)
                var progress: number = (parseInt(index) / prs.length) * 100
                console.log(`Progress: ${progress}%`)
                await new Promise((resolve) => setTimeout(resolve, waitTime))
            }
            pullRequests.push(await this.analyzePR(prs[index], owner, repo))
        }

        fs.writeFileSync(`${owner}_${repo}_PullRequests.json`, JSON.stringify(pullRequests))

    }

    async analyzePR(pr: components['schemas']['pull-request'], owner: string, repo: string): Promise<PullRequest> {
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
        pageNumber += 1
        while (response.data.length != 0) {
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
        let diff: string = (await axios.get(pr.diff_url)).data
        let prDiffs = this.processDiff(diff)
        // Get the PR review discussion
        var reviewComments: components['schemas']['pull-request-review-comment'][] = []
        pageNumber = 1
        response = await (this.octokit.request(pr.review_comments_url, {
            per_page: 100,
            page: pageNumber
        }))
        while (response.data.length != 0) {
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
        response = await (this.octokit.request(pr.comments_url, {
            per_page: 100,
            page: pageNumber
        }))
        while (response.data.length != 0) {
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
        return {author: pr.user?.login, number: pr.number, diff_summary: prDiffs, state: state, open_date: open_date, update_date: update_date, 
            discussion: prComments, review_discussion: prReviewComments, tags: tags, commits: prCommits}
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
