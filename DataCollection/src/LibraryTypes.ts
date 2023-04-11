/**
 * Define types for use in formal math libraries study 
 */

import { ParsedUrlQuery } from "querystring";

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

export type PullRequest = {
    author?: string;
    number: number;
    diff_summary: DiffSum[];
    state: string;
    open_date: string;
    update_date: string;
    discussion: Comment[];
    review_discussion: ReviewComment[];
    tags: Tag[];
    commits: PRCommit[]
}

export type DiffSum = {
    file: string;
    status?: string;
    additions: number;
    deletions: number;
}

export type Comment = {
    author?: string;
    date: string;
    comment?: string;
}

export type ReviewComment = {
    author: string;
    file: string;
    date: string;
    comment: string;
}

export type PRCommit = {
    author?: string;
    committer?: string;
    hash: string;
    message: string;
    date?: string | null;
}

export type Tag = {
    tag?: string;
    description?: string | null;
}

export type Issue = {
    author?: string;
    number: number;
    state: string;
    open_date: string;
    update_date: string;
    discussion: Comment[];
    tags: Tag[];
    pull_requests: number[]
}

export type Commit = {
    hash: string;
    author: string;
    committer: string;
    date: string;
    message: string;
    body: string;
    diff: DiffSum[]
}

export type Repository = {
    name: string;
    full_name: string;
    owner: {
        login: string;
        type: string;
    };
    html_url: string;
    description?: string | null;
    is_fork: boolean;
    stars: number;
    created_at?: string | null;
    updated_at?: string | null;
    clone_url: string;
    commits: number;
    contributors: Contributor[];
    issues: number;
    pull_requests: number;
    forks: number;
    archived: boolean;
    allow_forking?: boolean;
    topics?: string[];
    watchers: number
}

export type Contributor = {
    login?: string;
    email?: string;
    commits: number;
}