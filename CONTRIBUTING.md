# Contributing and Publishing Governance

## Authority

An approved private career source-of-truth workflow remains authoritative for Andrew Pella's career facts. This public repository is downstream and derived.

## Change workflow

1. Work on a branch.
2. Use only approved public-safe facts or approved generalized language.
3. Validate human and machine-readable outputs against the same public content model.
4. Review privacy and disclosure before publication.
5. Open a pull request and allow required automated checks to pass.
6. Merge to `main` only after review/approval.
7. Material new career facts or corrections must first be validated in the private source-of-truth workflow.

## Public-content rules

Do not commit or publish:

- private evidence or evidence notes;
- application packages or job-search records;
- private workflow material;
- confidential or proprietary employer information;
- internal employer URLs;
- private repository URLs or content;
- credentials, API keys, tokens, private keys, or registrar information;
- compensation or personal financial information;
- home address, private identifiers, or unapproved contact information.

Machine-readable files are public disclosures and follow the same rules as human-facing pages.

## Release 1 architecture guardrails

Release 1 remains static-first. Do not add a database, authentication system, persistent application server, writable API, complex contact form, or substantial third-party client-side JavaScript without explicit approval and a security review.

The intended stack is Astro -> static output -> GitHub Actions -> GitHub Pages -> `andrewpella.com`.

## Career-content changes

Presentation, search language, and machine representation may be adapted for their audience, but the underlying facts must remain consistent with the authoritative private career record. If a proposed change alters a title, date, employer, metric, outcome, skill claim, role boundary, or material professional positioning, reconcile it with the private source-of-truth workflow before publication.