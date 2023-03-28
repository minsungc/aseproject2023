/**
 * Define types for use in formal math libraries study 
 */

// Represents a math library
export type Library  = {
    name: string;
    clone_url: string;
    commits?: Commit[];
}

// Represents a library commit
export type Commit = {
    id: string;
    author: string;
    date: string;
    message: string; 
}

// Represents a math library at some historical checkpoint
export type LibraryCheckpoint  = {

}

// Represents a theorem
export type Theorem = {
    theorem?: string,
    theorem_number: number,
    sources: Source[]
}

// Represents a theorem proof source
export type Source = {
    link: string
    repo?: string
    repo_clone_url?: string
    filename?: string
    not_github?: boolean
    commits?: ProofCommit[]
}

// Represents a commit for a proof source
export type ProofCommit = {
    current_name: string;
    author: string;
    date: string;
    message: string;
    hash: string;
    diff: Diff;
    link: string;
}

// Represents a file diff
export type Diff = {
    insertions: number;
    deletions: number;
    diff?: string;
}