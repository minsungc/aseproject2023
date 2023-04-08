/**
 * Gets information on issues
 */

 import fs from 'fs'
 import { simpleGit } from 'simple-git'
 import { Octokit } from 'octokit'
 import { components } from '@octokit/openapi-types'
 import { Issue, Comment, Tag } from './LibraryTypes'
 import axios from 'axios'
 import { throttling } from '@octokit/plugin-throttling'
 
 type ISResponse = {
     status: number;
     url: string;
     headers: Object;
     data: components['schemas']['issue'][]
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
 
     async _getISS(owner: string, repo: string, url: string){
         const cacheDirectory = `cache/ISs/${owner}/${repo}`
         const cacheFile = `${cacheDirectory}/${this.language}.json`
         if(fs.existsSync(cacheFile)){
             return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8'));
         }
         //console.log(`Fetching is list for ${owner}/${repo}`)
         var iss: components['schemas']['issue'][] = []
         var pageNumber = 1
 
         let response: ISResponse = await this.octokit.request(`Get /repos/${owner}/${repo}/issues`, {
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
             iss = iss.concat(response.data)
 
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
         await fs.promises.writeFile(cacheFile, JSON.stringify(iss));
         return iss;
     }

     async getISList(owner: string, repo: string, url: string) {
 
         // Make sure the library has been cloned and pull
         if (!fs.existsSync(`Libraries/${this.language}/${owner}/${repo}`)) {
             await simpleGit().clone(url, `Libraries/${this.language}/${owner}/${repo}`)
         } else {
             await simpleGit(`Libraries/${this.language}/${owner}/${repo}`).pull()
         }
 
         const {
             data: { login },
         } = await this.octokit.rest.users.getAuthenticated()
         
         const iss = await this._getISS(owner, repo, url);
 
         var issues: Issue[] = []
         for (var index in iss) {
             issues.push(await this.analyzeIS(iss[index], owner, repo))
         }
 
         fs.writeFileSync(`${owner}_${repo}_Issues.json`, JSON.stringify(issues))
 
     }
 
     async analyzeIS(is: components['schemas']['issue'], owner: string, repo: string): Promise<Issue> {
         const cacheDirectory = `cache/iss/${owner}/${repo}`
         const cacheFile = `${cacheDirectory}/${is.number}.json`
         if (fs.existsSync(cacheFile)) {
             return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8')) as Issue
         }
         console.log(`processing issue: ${is.number}`)
         // Get state and dates of issue
         var open_date = is.created_at
         var state = is.state
         var update_date = is.updated_at
         // Get is discussion
         var comments: components['schemas']['issue-comment'][] = []
         var pageNumber = 1
         //console.log(`Retreiving is comments`)
         var response = await (this.octokit.request(is.comments_url, {
             per_page: 100,
             page: pageNumber
         }))
         while (response.data.length != 0) {
             pageNumber++;
             //console.log(`is comments page ${pageNumber}, ${response.data.length}`)
             comments = comments.concat(response.data)
             response = await (this.octokit.request(is.comments_url, {
                 per_page: 100,
                 page: pageNumber
             }))
         }
         var isComments: Comment[] = comments.map(comment => {
             return {author: comment.user?.login, date: comment.created_at, comment: comment.body}
         })
         // Get the list of tags
         var tags: Tag[] = is.labels.map(label => {
            if (typeof label === 'string') {
                return {tag: label}
            } else {
                return {tag: label.name, description: label.description}
            }
         })
         // Get the list of pull request ids
         pageNumber = 1
         var prs: components['schemas']['pull-request'][] = []
         response = await this.octokit.request(`GET /repos/${owner}/${repo}/issues/${is.number}/pulls`), {
            owner: owner,
            repo: repo,
            issue_number: is.number,
            state: 'all',
            per_page: 100,
            page: pageNumber
         }
         while (response.data.length != 0) {
            pageNumber++;
            prs = prs.concat(response.data)
            response = await this.octokit.request(`GET /repos/${owner}/${repo}/issues/${is.number}/pulls`), {
                owner: owner,
                repo: repo,
                issue_number: is.number,
                state: 'all',
                per_page: 100,
                page: pageNumber
             }
        }
        var prIDs: number[] = prs.map(pr => {
            return pr.number
        })
         // Create and return issue Description
         var description = {author: is.user?.login, number: is.number, state: state, open_date: open_date, update_date: update_date, 
             discussion: isComments, tags: tags, pull_requests: prIDs}
         if (!fs.existsSync(cacheDirectory)) {
             fs.mkdirSync(cacheDirectory, {recursive: true})
         }
         await fs.promises.writeFile(cacheFile, JSON.stringify(description))
         return description
     }
 }
 