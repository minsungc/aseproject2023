/**
 * 
 */
// Comment out the one not being used
// import { Searcher } from "./MathLibraryPRs";
import { Searcher } from "./MathLibraryISs"
// import { CommitGetter } from "./MathLibraryCMs"

import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Language name and github token
    const search = new Searcher('Coq', process.env.GH_TOKEN)
    console.log(process.env.GH_TOKEN)
    // owner, library name, https clone link
    // search.getPRList('leanprover-community', 'lean', 'https://github.com/leanprover-community/lean.git')
    // search.getISList('coq-community', 'HighSchoolGeometry', 'https://github.com/coq-community/HighSchoolGeometry.git')
    // search.getISList('GeoCoq', 'GeoCoq', 'https://github.com/GeoCoq/GeoCoq.git')
    // search.getISList('coq-community', 'hydra-battles', 'https://github.com/coq-community/hydra-battles.git')
    // search.getISList('coq-contribs', 'fermat4', 'https://github.com/coq-contribs/fermat4.git')
    // search.getISList('coq-community', 'coq-100-theorems', 'https://github.com/coq-community/coq-100-theorems.git')
    // search.getISList('fblanqui', 'color', 'https://github.com/fblanqui/color.git')
    // search.getISList('coq-community', 'fourcolor', 'https://github.com/coq-community/fourcolor.git')
    // search.getISList('IBM', 'FormalML', 'https://github.com/IBM/FormalML.git')
    // search.getISList('math-comp', 'Coq-Combi', 'https://github.com/math-comp/Coq-Combi.git')
    // search.getISList('math-comp', 'analysis', 'https://github.com/math-comp/analysis.git')
    search.getISList('coq-community', 'bertrand', 'https://github.com/coq-community/bertrand.git')
}

// async function othermain() {
//     //Language name and github token
//     const com = new CommitGetter('Isabelle', 'isabelle-prover', 'mirror-isabelle', 'https://github.com/isabelle-prover/mirror-isabelle.git')
//     await com.setup()
//     await com.getCommits()
// }

main()

