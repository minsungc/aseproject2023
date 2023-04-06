import { throttling } from '@octokit/plugin-throttling'
    octokit: Octokit;
        const MyOctokit = Octokit.plugin(throttling)
        this.octokit = new MyOctokit({auth: auth,
            throttle: {
                onRateLimit: (retryAfter :number, options: any, octokit: any, retryCount: any) => {
                    octokit.log.warn(
                        `Request quota exhausted for request ${options.method} ${options.url}`
                    );
                
                    if (retryCount < 1) {
                        // only retries once
                        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
                        return true;
                    }
                    },
                    onSecondaryRateLimit: (retryAfter: number, options : any, octokit:any) => {
                    // does not retry, only logs a warning
                    octokit.log.warn(
                        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
                    );
                    },
            }
        })
    async _getPRS(owner: string, repo: string, url: string){
        const cacheDirectory = `cache/PRs/${owner}/${repo}`
        const cacheFile = `${cacheDirectory}/list.json`
        if(fs.existsSync(cacheFile)){
            return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8'));
        //console.log(`Fetching PR list for ${owner}/${repo}`)
            //console.log(`Retrieved page: ${pageNumber}`)
        if(!fs.existsSync(cacheDirectory)){
            fs.mkdirSync(cacheDirectory, {recursive : true})
        }
        await fs.promises.writeFile(cacheFile, JSON.stringify(prs));
        return prs;
    }
    async getPRList(owner: string, repo: string, url: string) {

        // Make sure the library has been cloned and pull
        if (!fs.existsSync(`${this.language}/${owner}/${repo}`)) {
            await simpleGit().clone(url, `Libraries/${this.language}/${owner}/${repo}`)
        } else {
            await simpleGit(`Libraries/${this.language}/${owner}/${repo}`).pull()
        }

        const {
            data: { login },
        } = await this.octokit.rest.users.getAuthenticated()
        
        const prs = await this._getPRS(owner, repo, url);
            pullRequests.push(await this.analyzePR(prs[index], owner, repo))
        const cacheDirectory = `source/PRs/${owner}/${repo}`
        const cacheFile = `${cacheDirectory}/${pr.number}.json`
        if (fs.existsSync(cacheFile)) {
            return JSON.parse(await fs.promises.readFile(cacheFile, 'utf-8')) as PullRequest
        }
        //console.log(`Processing PR: ${pr.number}`)
            pageNumber++;
            //console.log(`Retrieving commits, got ${response.data.length}`)
        //console.log(`Retrieving diff_url ${pr.diff_url}`)
        //console.log("Processing diff")
        //console.log(`Retrieving first review comment surl`)
            pageNumber++;
            //console.log(`Retrieving review comments, got ${response.data.length}`)
        //console.log(`Retreiving pr comments`)
            pageNumber++;
            //console.log(`pr comments page ${pageNumber}, ${response.data.length}`)
        //console.log(`Finishing`)
        var description = {author: pr.user?.login, number: pr.number, diff_summary: prDiffs, state: state, open_date: open_date, update_date: update_date, 
        if (!fs.existsSync(cacheDirectory)) {
            fs.mkdirSync(cacheDirectory, {recursive: true})
        }
        await fs.promises.writeFile(cacheFile, JSON.stringify(description))
        return description