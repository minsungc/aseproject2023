/**
 * Runs scripts for q3 data collection
 */

import { ReposByLanguage } from "./MathLibraryProjects";
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const search = new ReposByLanguage('Lean', process.env.GH_TOKEN)
    var repos = await search.searchRepos()
    console.log(repos.length)

}

main()