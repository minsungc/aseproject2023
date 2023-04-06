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
    const search = new Searcher('Coq', process.env.GH_TOKEN)
    // owner, library name, https clone link
    search.getPRList('math-comp', 'math-comp', 'https://github.com/math-comp/math-comp')
}

main()

