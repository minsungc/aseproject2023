/**
 * Gets lists of source files for the 100 theorems for Isabelle from csv
 * 
 */

import * as fs from 'fs'
import { parse } from 'csv-parse'
import { Theorem } from './LibraryTypes'

type CSVEntry = {
    Number: number,
    Link: string,
    Data: string
}

async function getIsabelleTheorems(path: string) {
    const headers = ['Number', 'Link', 'Data']
    const fileContent = fs.readFileSync(path, 'utf-8')

    parse(fileContent, {
        delimiter: ',',
        columns: headers,
    }, (error, result: CSVEntry[]) => {
        if (error) {
            console.error(error)
        }

        let theorems: Theorem[] = []
        
        for (var entry of result) {
            if (entry.Link !== '') {
                theorems.push({ theorem_number: entry.Number, sources: [{ link: entry.Link }] })
            }
        }

        fs.writeFileSync('IsabelleTheoremSources.json', JSON.stringify(theorems))
    })
}

getIsabelleTheorems('aseproject2023/fixing isabelle - Sheet1.csv')