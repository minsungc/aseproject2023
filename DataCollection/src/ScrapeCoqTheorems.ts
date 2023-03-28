/**
 * Gets list of source files for 100 theorems for Coq
 * 
 * Manual changes:
 * Friendship theorem link should be: https://github.com/aleloi/coq-friendship-theorem/blob/master/theories/friendship_theorem.v
 * Deragements should be: https://github.com/FabianWolff/coq-derangements-formula/blob/master/drmformula.v
 */

import { simpleGit } from 'simple-git'
import fs from 'fs'
import { readFile } from 'fs/promises'
import YAML from 'yaml'
import { Theorem } from './LibraryTypes'

/**
 * Clone repo
 */
async function clone() {
    await simpleGit().clone('https://github.com/coq-community/coq-100-theorems.git')
}

type FileTheorem = {
    theorem: number,
    link: string
}

/**
 * Get theorem links
 */
async function getCoqTheorems() {
    if (!fs.existsSync('coq-100-theorems')) {
        await clone()
    }

    const result = YAML.parse(await readFile('coq-100-theorems/statements.yml', 'utf-8')) as FileTheorem[]
    var theorems: Theorem[] = result.map(theorem => {
        return {theorem_number: theorem.theorem, sources: [{link: theorem.link}]}
    })   

    theorems = theorems.reduce((acc: Theorem[], curr: Theorem) => {
    const existingTheorem = acc.find((t) => t.theorem_number === curr.theorem_number);
    if (existingTheorem) {
        // Combine the link arrays
        existingTheorem.sources = existingTheorem.sources.concat(curr.sources);
    } else {
        // Add the new theorem to the accumulator
        acc.push(curr);
    }
    return acc;
    }, []);

    fs.writeFileSync('CoqTheoremSources.json', JSON.stringify(theorems))
}

getCoqTheorems()