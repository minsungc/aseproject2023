/**
 * Runs scripts for q3 data collection
 */

import { ServerResponse } from "http";
import { ReposByLanguage } from "./MathLibraryProjects";

async function main() {
    const search = new ReposByLanguage('Lean', process.env.GH_TOKEN)
    var repos = await search.searchRepos()
    console.log(repos)

}

main()