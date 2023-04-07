/**
 * 
 */


import { Getter } from "./Getter"
import fs from 'fs'

// Comment out the one not being used
import { Searcher } from "./MathLibraryPRs";
//import { Searcher } from "./MathLibraryISs"
import { CommitGetter } from "./MathLibraryCMs"

import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Language name and github token
    const search = new Searcher('Lean', process.env.GH_TOKEN)
    // owner, library name, https clone link
    search.getPRList('leanprover-community', 'mathlib', 'https://github.com/leanprover-community/mathlib.git')
}

async function othermain() {
    // Language name and github token
    const com = new CommitGetter('Lean', 'leanprover-community', 'mathlib', 'https://github.com/leanprover-community/mathlib.git')
    await com.setup()
    await com.getCommits()
}

othermain()

