# Andrew Pella — Career Profile

Public source repository for the career-discovery website at `andrewpella.com`.

## Purpose

This repository publishes a simple, static, recruiter-friendly and machine-readable professional profile for Andrew Pella. Release 1 is organized around **Discovery -> Evidence -> Contact** and exposes human-readable career content alongside structured outputs for search engines and AI systems.

## Source-of-truth boundary

This repository is a **derived public publishing layer**. It is not the authoritative source for career facts.

An approved private career source-of-truth workflow remains authoritative. Only explicitly approved, verified, public-safe facts or approved generalized language may be published here.

Do not copy private evidence, internal workflow material, application packages, confidential employer information, private-only source material, credentials, secrets, or unapproved personal information into this repository.

New facts or corrections discovered while working here must return to the private source-of-truth workflow for validation before they are treated as authoritative or propagated publicly.

## Architecture

- Canonical domain: `andrewpella.com`
- Static-site generator: Astro
- Hosting: GitHub Pages
- Deployment: GitHub Actions
- Runtime model: static-first; no database, authentication system, persistent server, or writable API for Release 1
- Human and machine-readable surfaces derive from one approved public content model

Machine-readable outputs include `resume.json`, `resume.md`, JSON-LD, `llms.txt`, `sitemap.xml`, and `robots.txt`.

## Security and privacy

Everything committed to this public repository must be treated as publicly disclosed, including source code, structured data, generated files, Git history, and build artifacts.

- Never commit secrets, API keys, tokens, private keys, registrar credentials, or private evidence.
- Never publish private repository URLs, internal employer URLs, proprietary implementation details, or application records.
- Publish only explicitly approved recruiter contact information.
- Machine-readable files receive the same privacy review as human-readable pages.
- Production deployment uses least-privilege GitHub Actions permissions and protected review/validation gates.

## Change workflow

Normal changes should be made on a branch and reviewed through a pull request before merging to `main`. Material career-fact or positioning changes require reconciliation with the authoritative private career record before publication.

## Current status

Release 1 is deployed at `https://andrewpella.com` and remains subject to production smoke, privacy, security, and discovery validation.