/**
 * Diff - changed files and file diffs
 * Authors
 * Date
 * Commit message
 * Links?
 */

import { simpleGit, SimpleGit} from 'simple-git'
import fs from 'fs'
import { Commit, DiffSum } from './LibraryTypes'

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
        const git: SimpleGit = simpleGit(this.location)

        // Get the full git log
        const log = (await git.log()).all

        // Transform
        var commits: Commit[] = await Promise.all(log.map(async entry => {
            // Get the whole commit
            var show = await git.show([entry.hash, '--pretty=fuller'])
            // Get diff
            var diff: DiffSum[] = this.processDiff(show)
            // Get committer email
            const comPattern = /Commit:\s+[\w\s]+\s+<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/
            const matches = show.match(comPattern)
            var committer_email = ''
            if (matches) {
                committer_email = matches[1]
            }
            return {hash: entry.hash, author: entry.author_email, committer: committer_email, date: entry.date,
                message: entry.message, diff: diff}
        }))

        // Save commits in a JSON file
        await fs.promises.writeFile(`${this.language}_${this.owner}_${this.repo}_Commits.json`, JSON.stringify(commits))
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