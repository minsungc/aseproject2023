/**
 * 
 */

import { cloneMirrorTask } from "simple-git/dist/src/lib/tasks/clone";
import { Library } from "./LibraryTypes";
import { Getter } from "./Getter"
import fs from 'fs'
import { Searcher } from "./MathLibraryPRs";

import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Language name and github token
    const search = new Searcher('Lean', process.env.GH_TOKEN)
    // owner, library name, https clone link
    search.getPRList('leanprover-community', 'mathlib', 'https://github.com/leanprover-community/mathlib.git')
}

main()

