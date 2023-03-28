/**
 * Load in a JSON theorms file
 * For each source file of a theorem:
 *      - Clone the repository, if applicable, or record that it isnt in a repo
 *      - Record and save the history of the file
 */

import fs from 'fs'
import { SimpleGit, simpleGit } from 'simple-git'
import { Theorem, ProofCommit} from './LibraryTypes'
import { readFile } from 'fs/promises'

/**
 * Transforms a github source file url into a repository clone url
 * @param source Source file url
 * @returns Repository url or null if the url is not for github
 */
function getCloneUrl(source: string) {
    const regex = /^(https:\/\/github.com\/[\w_-]+\/[\w_-]+)/
    const match = source.match(regex)
    return match ? match[1] + '.git' : null
}

/**
 * Clones the given repository at the given location
 * @param cloneUrl Repository clone url
 * @param location File path
 */
async function cloneRepo(cloneUrl: string, location: string) {
    // Check if the repo has already been cloned
    if (!fs.existsSync(location)) {
        await simpleGit().clone(cloneUrl, location)
    }
}

/**
 * Explores the history of a source file
 * @param repo Path to the repository
 * @param filename Most recent name of the source file
 */
async function exploreSourceHistory(repo: string, filename: string, repoName: string) {
    // Store proof commits
    var proofCommits: ProofCommit[] = []
    // git log --follow -- filename
    const git: SimpleGit = await simpleGit(repo)
    try {
        var result = (await git.log(['--follow', '--numstat', '--', filename])).all
        for (var log of result) {
            var hash = log.hash
            var author = log.author_name
            var date = log.date
            var message = log.message
            if (!log.diff) {
                throw Error(`${repo}/${filename} log diff not present`)
            }
            var insertions = log.diff.insertions
            var deletions = log.diff.deletions
            var name = log.diff.files[log.diff?.files.length - 1].file
            proofCommits.push({
                current_name: name,
                author: author,
                date: date,
                message: message,
                hash: hash,
                diff: {insertions: insertions, deletions: deletions},
                link: `https://github.com/${repoName}/blob/${hash}/${name}`
            })
        }
        // Save raw diffs
        await Promise.all(proofCommits.map(async (commit, idx) => {
            if (idx != proofCommits.length - 1) {
                var commands = [`${proofCommits[idx + 1].hash}...${commit.hash}`,
                    '-C', '--', proofCommits[idx + 1].current_name, commit.current_name]
                commit.diff.diff = (await git.diff(commands)) as string
            }
        }))
        return proofCommits

    } catch (error) {
        console.log(repo)
        console.log(filename)
        throw error
    }
}

/**
 * Explores and saves the history of each source file for a theorem proof
 * @param language The language
 * @param theorems File containing list of theorem sources
 */
async function exploreTheorems(language: string, inputFile: string) {
    // Read in the file
    var theorems = JSON.parse(await readFile(inputFile, 'utf-8')) as Theorem[]
    // Explore the history of each source file
    await Promise.all(theorems.map(async (theorem) => {
        await Promise.all(theorem.sources.map(async (source) => {

            // Confirm that the source file is a part of a GitHub Repository
            const cloneUrl = getCloneUrl(source.link)
            if (!cloneUrl) {
                //console.log("Not a GithubSource")
                //console.log(`Language: ${language}`)
                //console.log(`Theorem: ${theorem.theorem_number}`)
                //console.log(`Source: ${source.link}\n`)
                source.not_github = true
                return
            }
            source.not_github= false
            source.repo_clone_url = cloneUrl

            // Clone the repository
            var regex = /^https:\/\/github.com\/([\w_-]+)\/([\w_-]+)/
            var match = cloneUrl.match(regex)
            var path = ''
            if (match) {
                path = `${language}/${match[1]}/${match[2]}`
                source.repo = `${match[1]}/${match[2]}`
            } else {
                throw Error(`No match for repository path for ${source.link}`)
            }
            await cloneRepo(cloneUrl, path)

            // Explore the commit history of the file
            regex = /^https:\/\/github.com\/[\w_-]+\/[\w_-]+\/[\w]+\/[\w]+\/(.+)/
            match = source.link.match(regex)
            if (match) {
                source.commits = await exploreSourceHistory(path, match[1], source.repo)
            } else {
                throw Error(`No match for filename for ${source.link}`)
            }
        }))
    }))

    // Save updated theorems
    fs.writeFileSync(`${language}Theorems.json`, JSON.stringify(theorems))
}

//exploreTheorems('Coq', 'CoqTheoremSources.json')
//exploreTheorems('Lean', 'LeanTheoremSources.json')
exploreTheorems('Isabelle', 'IsabelleTheoremSources.json')