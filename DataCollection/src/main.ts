/**
 * 
 */


import { Getter } from "./Getter"
import fs from 'fs'

// Comment out the one not being used
//import { Searcher } from "./MathLibraryPRs";
<<<<<<< HEAD
import { Searcher } from "./MathLibraryISs"
=======
//import { Searcher } from "./MathLibraryISs"
>>>>>>> 28b72a8b32648ce1189afa45c331d964e4df3dcb
import { CommitGetter } from "./MathLibraryCMs"

import dotenv from 'dotenv';

dotenv.config();

// async function main() {
    // Language name and github token
<<<<<<< HEAD
    const search = new Searcher('lean', process.env.GH_TOKEN)
    // owner, library name, https clone link
    //search.getPRList('leanprover-community', 'lean', 'https://github.com/leanprover-community/lean.git')
    search.getISList('leanprover-community', 'lean', 'https://github.com/leanprover-community/lean.git')
}

async function othermain() {
    //Language name and github token
    const com = new CommitGetter('Isabelle', 'isabelle-prover', 'mirror-isabelle', 'https://github.com/isabelle-prover/mirror-isabelle.git')
=======
    // const search = new Searcher('Coq', process.env.GH_TOKEN)
    // owner, library name, https clone link
    // search.getPRList('coq', 'coq', 'https://github.com/coq/coq.git')
// }

async function othermain() {
    // Language name and github token
    const com = new CommitGetter('Coq', 'coq-community', 'bertrand', 'https://github.com/coq-community/bertrand.git')
>>>>>>> 28b72a8b32648ce1189afa45c331d964e4df3dcb
    await com.setup()
    await com.getCommits()
}

othermain()

