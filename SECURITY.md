# Security Policy

## Scope

This repository publishes the static source and public career data for `andrewpella.com`.

Security concerns include accidental disclosure of private information, exposed credentials or secrets, unauthorized changes to public career content, unsafe GitHub Actions configuration, dependency/supply-chain risks, and domain or deployment misconfiguration.

## Reporting a vulnerability

Do not open a public GitHub issue if the report contains a credential, secret, private personal information, or details that would increase exploitation risk.

Use Andrew Pella's approved private contact route once it is published on `andrewpella.com` or contact him through his established LinkedIn profile. Do not include sensitive credentials in the initial report.

## Repository security principles

- Everything committed here is assumed public.
- Secrets and private source material must never be committed.
- Changes should flow through pull requests and required validation.
- `main` should be protected from force pushes and deletion.
- GitHub Actions should use least privilege and no unnecessary long-lived credentials.
- Third-party Actions and dependencies should be minimized and reviewed.
- Production deployment should occur only from the approved `main` workflow/environment.
- Human and machine-readable career outputs receive the same privacy/disclosure review.

## Release 1 security boundary

Release 1 is a static site. It must not introduce authentication, a database, a writable API, persistent server-side processing, or sensitive transactions. Any future feature that expands this boundary requires an explicit threat-model and security review before implementation.