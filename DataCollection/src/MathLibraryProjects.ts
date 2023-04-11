/**
 * Find and return statistics on repositories written in a given language.
 */

import { Octokit } from 'octokit'
import { simpleGit, SimpleGit } from 'simple-git'
import { components } from '@octokit/openapi-types'
import { throttling } from '@octokit/plugin-throttling'
import fs from 'fs'
import { Repository } from './LibraryTypes'

export class ReposByLanguage {

    octokit: Octokit
    language: string
    repos: components['schemas']['repository'][] | undefined = undefined
    analyzedRepos: Repository[] = []

    /**
     * Constructs a searcher to find repositories written in a given language
     * @param lang Language to search for
     * @param auth Authentication token for github
     */
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

    /**
     * Searches github for repositories written in the language specified
     * Writes repos to cache and returns
     * @returns List of repositories written in the language specified
     */
    async searchRepos() {
        var cacheDirectory = `cache/repos/${this.language}`
        var cacheFile = `${cacheDirectory}/repos.json`
        if (fs.existsSync(cacheFile)) {
            return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8')) as components['schemas']['repository'][]
        }
        var query = `language:${this.language}`
        var pageNumber = 1
        var repos: components['schemas']['repository'][] = []
        var response = await this.octokit.rest.search.repos({
            q: query, 
            //per_page: 100,
            per_page: 1,
            page: pageNumber
        })
        while (response.data.items.length != 0) {
            repos = repos.concat(response.data.items as components['schemas']['repository'][])
            response = await this.octokit.rest.search.repos({
                q: query, 
                per_page: 100,
                page: ++pageNumber
            })
        }
        if (!fs.existsSync(cacheDirectory)) {
            fs.mkdirSync(cacheDirectory, {recursive: true})
        }
        //await fs.writeFileSync(cacheFile, JSON.stringify(repos))
        this.repos = repos
        return repos
    }

    async analyzeRepos() {
        // Check that there are repos to be analyzed
        var cacheDirectory = `cache/repos/${this.language}`
        var cacheFile = `${cacheDirectory}/repos.json`
        if (!this.repos && !fs.existsSync(cacheFile)) {
            await this.searchRepos()
        } else if (!this.repos) {
            this.repos = JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8')) as components['schemas']['repository'][]
        }
        if (this.repos) {
            this.analyzedRepos = this.repos.map((repo) => {

                var {commits, contributors} = getCommits()
                var issues = getIssues()
                var prs = getPRs()

                return {name: repo.name, 
                    full_name: repo.full_name,
                    owner: { login: repo.owner.login, type: repo.owner.type},
                    html_url: repo.html_url,
                    description: repo.description,
                    is_fork: repo.fork,
                    stars: repo.stargazers_count,
                    created_at: repo.created_at,
                    updated_at: repo.updated_at,
                    clone_url: repo.clone_url,
                    commits: commits,
                    contributors: contributors,
                    issues: issues,
                    pull_requests: prs,
                    forks: repo.forks,
                    archived: repo.archived,
                    allow_forking: repo.allow_forking,
                    topics: repo.topics,
                    watchers: repo.watchers
                }
            })
        }
    }

    async getCommits(full_name: string, clone_url: string) {
        var dir = `Libraries/${this.language}/${full_name}`
        // Make sure the repository is cloned 
        if (!fs.existsSync(dir)) {
            await simpleGit().clone(clone_url, dir)
        } else {
            await simpleGit(dir).pull()
        }
        const git: SimpleGit = simpleGit(dir)
        // Get the commits
        const log = (await git.log()).all
        
    }

    async getIssues() {

    }

    async getPRs() {

    }

}