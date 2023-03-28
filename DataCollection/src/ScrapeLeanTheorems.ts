/**
 * Gets lists of source files for the 100 theorems for Lean
 * 
 */

import axios, { AxiosError } from 'axios'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import { Theorem, Source } from './LibraryTypes'

function fetchPage(url: string): Promise<string | undefined> {
    const result = axios.get(url). then(res => res.data).catch((error: AxiosError) => {
        console.log(`Error getting ${url}`)
    })

    return result
}

// Lean
async function getLeanTheorems(url: string) {
    // Read the webpage
    const page = await fetchPage(url)
    const document = new JSDOM(page).window.document

    // Section by headers (theorems)
    const headers: HTMLHeadingElement[] = await Array.from(document.querySelectorAll('h5'))
    const links = headers.map(header => {
        // Get all the section information
        var content: Element[] = []
        let currentElement = header.nextElementSibling
        while (currentElement && currentElement.tagName != 'H5') {
            content.push(currentElement)
            currentElement = currentElement.nextElementSibling
        }
        // Get only the hyperlinks from the section
        var elements = document.createRange().createContextualFragment(content.map(el => el.outerHTML).join(''));
        var localLinks = elements.querySelectorAll('a')

        // Get theorem
        const regex = /^([0-9]+)\.\s(.+)\s<a.*>.*<\/a>$/
        const matches = header.innerHTML.match(regex)
        if (matches) {
            var theorem = matches[2]
            var theorem_number = +matches[1]

            let th: Theorem = {theorem: theorem, theorem_number: theorem_number, sources: []}

            // Clean line numbers from links
            const regex = /(^.+\.lean)/

            // Get link and target type
            for (var link of localLinks) {
                if (link.innerHTML === 'source' || link.innerHTML === 'result' || link.innerHTML === 'mathlib archive') {
                    var match = link.href.match(regex)
                    th.sources.push({link: match? match[1] : link.href})
                }
            }
            return th
        }
    })
    fs.writeFileSync('LeanTheoremSources.json', JSON.stringify(links))
}

// Coq


getLeanTheorems('https://leanprover-community.github.io/100.html#1')