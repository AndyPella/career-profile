# Shared Public Content Model

## Purpose

The public model defines the structured data used to build the human site, machine-readable resources, metadata, and canonical public resume outputs for `andrewpella.com`.

Only information intended for public disclosure belongs in this repository. Upstream approval and evidence-management details remain outside this public project.

## Representation

Release 1 uses JSON in `src/data/career.json` because it is directly consumable by Astro, easy to transform into HTML and machine-readable formats, easy to validate, and readable by both people and software.

`src/data/career.schema.json` defines the public validation contract.

## Object model

The Release 1 model contains:

- `profile` — canonical identity, positioning, location, and summary.
- `skills[]` — public semantic taxonomy with stable IDs and optional aliases.
- `experience[]` — employer and role records, approved highlights, and skill relationships.
- `projects[]` — public project and case-study evidence.
- `links[]` — canonical public external links.
- `contact` — the approved public contact route.
- `resume` — the canonical public resume definition and ordered references to approved experience and project records.

Internal traceability, approval workflow details, and authoring instructions are intentionally excluded.

## Stable IDs and references

Public objects use stable IDs so downstream outputs can reference shared records instead of copying facts into multiple independent sources.

Examples include:

- `salesforce-sre-product`
- `sre-platforms`
- `otel-evaluation`
- `agentic-career-workflow`

## Role positioning

Public content preserves the distinction between product or platform leadership and hands-on engineering. Andrew's Salesforce SRE assignment is presented as Product Owner/Product Manager and platform leadership. Earlier Client Engineering work represents hands-on engineering experience.

That distinction is established before information enters this public model rather than through embedded authoring instructions.

## Canonical public resume

The website exposes one canonical static public resume.

1. `src/data/career.json` is the shared public model.
2. The `resume` object defines the fixed public resume presentation.
3. `/resume`, `/resume.md`, and `/resume.json` are format-specific representations of the same public resume.
4. Job-specific application materials remain outside this public repository.
5. Material factual changes must be approved upstream before the public model changes.

Canonical public resume headline:

`Senior Product Manager | Observability & SRE Platforms | Enterprise Platforms | Automation & AI`

## Public disclosure rules

The model excludes information that is not needed for public professional discovery, including nonpublic contact details, financial information, internal employer locations, nonpublic repository information, application records, credentials, and internal workflow implementation details.

## Validation

Release validation checks both generated site output and tracked repository source. The source check prevents internal workflow or traceability metadata from remaining visible in the public Git repository even when it is not rendered on the website.

## Downstream mapping

| Public model | Human / machine consumers |
| --- | --- |
| `profile` | Home, JSON-LD, `llms.txt`, resume header |
| `experience[]` | Experience page, public resume, JSON Resume adapter |
| `skills[]` | Experience taxonomy, metadata, public resume |
| `projects[]` | Project pages, `llms.txt`, public resume |
| `links[]` | Contact, identity links, machine outputs |
| `contact` | Contact surface and recruiter CTA |
| `resume` | `/resume`, `/resume.md`, and `/resume.json` |

## Acceptance

The model is acceptable when one structured public data source feeds all human and machine outputs, only intended public information is present, the schema matches the model, and automated validation rejects internal workflow or traceability metadata from tracked public source.