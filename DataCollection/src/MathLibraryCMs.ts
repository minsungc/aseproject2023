/**
 * Diff - changed files and file diffs
 * Authors
 * Date
 * Commit message
 * Links?
 */

import { simpleGit, SimpleGit} from 'simple-git'
import fs from 'fs'

export class CommitGetter {

    language: string;
    owner: string;
    repo: string;
    cloneURL: string;
    location: string;

    constructor(lang: string, owner: string, repo: string, cloneURL: string) {
        this.language = lang
        this.owner = owner
        this.repo = repo
        this.cloneURL = cloneURL
        this.location = `Libraries/${owner}/${repo}`
    }

    async setup() {
        if (!fs.existsSync(this.location)) {
            await simpleGit().clone(this.cloneURL, this.location)
        } else {
            await simpleGit(this.location).pull()
        }
    }

    async getCommits() {
        
    }

}