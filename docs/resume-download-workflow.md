# Public résumé download workflow

The website publishes an approved PDF at `/downloads/Andrew-Pella-Resume.pdf`. The private career source remains authoritative. Only the approved PDF and non-sensitive publication metadata belong in this public repository; do not copy source authorities, evidence, private repository URLs, credentials, or application records here.

## Current selection and monitoring

V5 is the selected general résumé. A daily Codex check at 9 a.m. America/Los_Angeles compares the selected approved source, its presentation rules, and the version registry against `public/downloads/resume-version.json`. The scheduled check uses the owner's existing connected access; the public site needs no private-repository token. Its private source locations are held in the monitor instructions, not in this repository.

A content fingerprint detects edits even when the V5 filename or label stays unchanged. A changed registry triggers inspection for a new general résumé or a changed selection rule; unrelated targeted résumés do not replace the public selection. V6 or another successor requires Andrew's explicit choice before publication. A changed presentation policy triggers review of its effect on the selected résumé. Checks stay quiet when nothing relevant changes. The monitor reports failures rather than treating an inaccessible source as current.

## Controlled replacement

1. Read the current, merged source authorities and approved source. Verify the selected version and public-safe content. Preserve the approved wording and applicable version-specific layout exception.
2. Generate the PDF with `scripts/build-public-resume.py`. It consumes an approved local source and explicit font files; it never fetches, rewrites or chooses a résumé. Dependencies are ReportLab for creation and pypdf/Poppler for verification. Use the supported document runtime. The V5 profile is three pages, left aligned, with Calibri or its metric-compatible Carlito rendering substitute.
3. Verify all wording against source, page count, links and Letter page size. Render and inspect every page. Do not mark visual review passed without inspection. Do not infer approval from a successful build.
4. Update the PDF, source/policy/registry fingerprints, rendering-profile hash, PDF hash and publication date together. Keep the public URL stable. Use publication date, not a claimed source-revision date, beside the website button.
5. Open a website PR containing the replacement and a clear change summary. Reuse an existing pending update PR rather than creating duplicates. Obtain Andrew's approval before merging future replacements. A new general version also needs his selection before generation.
6. After approval and merge, wait for successful Pages deployment. Download the live PDF and confirm its fingerprint matches the approved artifact. Do not describe an open PR as published.

Run `node scripts/check-resume-download.mjs` to validate the local publication. With authorized transient source inputs, add `--source FILE --format-policy FILE --version-index FILE` to compare fingerprints. Exit 0 means matching provided inputs, 2 means review is required, and 1 means validation failed. A build-only run does not establish source freshness; the private-source monitor performs that check.

`npm run check:release` validates that the PDF exists, its bytes match the metadata, the build profile is unchanged, and the website links resolve. Tests cover same-filename changes, harmless line-ending changes, successor review, and formatting changes.

## Rollback and retention

The website's Git history retains earlier public PDFs. Revert a replacement through the PR process to restore an earlier approved publication. PDF contents and retained history are public. Never publish documents containing unapproved private information. Do not write private source paths or review evidence into the public manifest.
