# F2 Search and Discovery Closure

**Closure date:** September 19, 2026  
**Status:** Complete  
**Operating state after closure:** Maintenance / monitoring

## Closure decision

F2 search, discovery, structured-data, and production-regression validation is complete. The website implementation and technical search/discovery architecture are considered production complete.

Search-engine indexing latency is an external propagation condition and is not a blocker to website closure when the production pages are discoverable, crawlable, indexable, and technically valid.

## Validation summary

| Area | Result | Closure state |
| --- | --- | --- |
| F2.1 — Google discovery and indexing | Pass with external propagation in progress | Homepage indexed; remaining canonical pages discovered and eligible for indexing. |
| F2.2 — Bing discovery and indexing | Pass | Canonical pages passed Bing Live URL inspection and were eligible for indexing. |
| F2.3 — Public search baseline | Pass | Initial public-search visibility baseline established. |
| F2.4 — Metadata and search-result quality | Pass | Canonical Northstar Ridge routing and related metadata issues remediated. |
| F2.5 — Structured discovery and machine consumption | Pass | `resume.json`, `resume.md`, `llms.txt`, `robots.txt`, `sitemap.xml`, JSON-LD, project canonicalization, and contact-policy representation validated and remediated where needed. |
| F2.6 — Search presentation and identity | Pass | Andrew Pella, canonical domain, professional positioning, external profiles, project attribution, and structured identity signals are coherent. |
| F2.7 — Production regression | Pass | Merged production build, release validation, Pages deployment, and representative human browser checks passed with no known production regression. |

## Production state at closure

- Canonical site: `https://andrewpella.com`
- Nine canonical human-facing pages are represented in the sitemap.
- Public crawling is allowed and the canonical sitemap is referenced by `robots.txt`.
- Machine-readable resume and AI-discovery resources are available.
- Project case studies use first-party canonical project pages, with external repositories treated as supporting evidence.
- Public identity and contact policy are consistent across the source model, human-facing pages, and machine-readable outputs.
- Release validation and deployment controls are active.
- No known production defects remain from F2 validation.

## External propagation state

Google indexing is still propagating beyond the homepage. This is tracked as an external search-engine condition rather than unfinished website engineering. Bing validation has confirmed that the tested URLs can be indexed.

Search-engine propagation should be monitored periodically, but lack of immediate indexing alone does not reopen F2 unless a technical crawl, canonicalization, indexing-policy, metadata, or content defect is identified.

## Maintenance / monitoring mode

After this closure, normal work on the site should be treated as maintenance or enhancement rather than continuation of the original build/validation phase.

Maintenance includes:

- career-fact, resume, project, identity, or contact updates;
- defects or regressions discovered in production;
- dependency, build, deployment, accessibility, or security maintenance;
- periodic Google/Bing indexing and search-presentation monitoring;
- new portfolio evidence or case studies;
- approved enhancements to the human experience, including visual design, look and feel, information presentation, readability, interaction quality, and overall visitor experience.

Human-experience improvements are intentionally classified as post-closure enhancements. They should preserve the validated content model, canonical/search architecture, accessibility behavior, and release controls unless an approved change explicitly modifies one of those boundaries.

## Reopening criteria

F2 should be reopened only if monitoring identifies a material search/discovery defect, such as:

- canonical pages becoming non-crawlable or non-indexable;
- sitemap or robots-policy regression;
- broken or conflicting canonical URLs;
- structured-data or machine-output regression;
- identity fragmentation or materially misleading search presentation;
- production deployment changes that invalidate the F2 technical baseline.

Visual or human-experience enhancements alone do not reopen F2.
