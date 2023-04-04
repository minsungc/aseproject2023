/**
 * 
 */

import { cloneMirrorTask } from "simple-git/dist/src/lib/tasks/clone";
import { Library } from "./LibraryTypes";
import { Getter } from "./Getter"
import fs from 'fs'
import { Searcher } from "./MathLibraryPRs";

async function main() {
    // Language name
    const search = new Searcher('Lean')
    // owner, library name, https clone link
    search.getPRList('leanprover-community', 'mathlib', 'https://github.com/leanprover-community/mathlib.git')
}

main()

