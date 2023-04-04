// Given a formal math library:
// 1. Clone the library
// 2. Get list of commits
// 3. Divide the list of commits into chunks - by time, number of chunks?
// 4. Checkout the library for each chunk into a new folder
// Use chunks to answer question 1

import {SimpleGit, simpleGit} from 'simple-git'
import fsPromise from 'fs/promises'
import fs from 'fs'
import { Library, Commit } from './LibraryTypes' 

export class Getter {

    git: SimpleGit = simpleGit()

    /**
     * Given a list of libraries, clone each repository
     * @param repos List of library repositories to clone
     */
    async cloner(repos: Library[]) {
        let promises: Promise<void>[] = []
        repos.forEach((repo) => {
            var path = 'Libraries/' + repo.name
            promises.push(this.clone(repo, path))
        })
        await Promise.all(promises)
    }

    /**
     * Clones a repo
     */
    async clone(repo: Library, path: string): Promise<void> {
        await this.git.clone(repo.clone_url, path)
    }

    /**
     * Gets the log of commits reachable from the current version of the library
     * @param lib The library
     */
    async findCommits(lib: Library) {
        // Check that the library has been cloned
        if (!fs.existsSync('Libraries/' + lib.name)) {
            console.log('missing')
            throw new Error
        }
        // Get list of commits
        var result = await simpleGit('Libraries/' + lib.name).log()
        lib.commits = []
        for (var entry of result.all) {
            lib.commits?.push({id: entry.hash, author: entry.author_name, date: entry.date, message: entry.message})
        }
    }

}
