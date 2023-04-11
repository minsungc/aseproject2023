/**
 * Run scripts
 */

// Comment out the one not being used
//import { Searcher } from "./MathLibraryPRs";
import { Searcher } from "./MathLibraryISs"
import { CommitGetter } from "./MathLibraryCMs"

import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Language name and github token
    const search = new Searcher('Coq', process.env.GH_TOKEN)
    // owner, library name, https clone link
    //search.getPRList('isabelle-prover', 'mirror-isabelle', 'https://github.com/isabelle-prover/mirror-isabelle.git')
    search.getISList('coq', 'coq', 'https://github.com/coq/coq.git')
}

async function othermain() {
    //Language name and github token
    const com = new CommitGetter('Isabelle', 'isabelle-prover', 'mirror-isabelle', 'https://github.com/isabelle-prover/mirror-isabelle.git')
    await com.setup()
    await com.getCommits()
}

main()

