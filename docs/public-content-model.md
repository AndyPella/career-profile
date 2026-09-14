# Shared Public Content Model

## Purpose

B1 defines the single structured public data model that feeds the human site, machine-readable resources, metadata, and resume outputs for `andrewpella.com`.

The public model is downstream from the approved private career source-of-truth workflow. It is intentionally public-safe and must not become an independent factual authority.

## Representation decision

Release 1 uses JSON in `src/data/career.json` as the shared public model because it is:

- directly consumable by Astro at build time,
- easy to transform into HTML, Markdown, JSON-LD, `llms.txt`, and resume formats,
- easy to validate with JSON Schema,
- readable by humans and machines,
- independent of a client-side framework.

`src/data/career.schema.json` defines the initial validation contract.

## Object model

The Release 1 model contains:

- `profile` — canonical identity, public positioning, summary, and role-boundary guidance.
- `skills[]` — public semantic taxonomy with stable IDs and optional aliases/boundaries.
- `experience[]` — employer/role records, approved highlights, boundaries, skill relationships, and safe source-claim IDs.
- `projects[]` — approved public evidence/case studies, including the sanitized Agentic Career Workflow.
- `links[]` — canonical public external links.
- `contact` — approved recruiter-contact route only.
- `resume` — assembly instructions and references to the same experience/project/skill objects.
- `provenance` — approval-level traceability without exposing private evidence or private repository content.

## Stable IDs and references

Objects use stable IDs. Downstream outputs should reference these IDs rather than copying and independently maintaining facts.

Examples:

- `salesforce-sre-product`
- `sre-platforms`
- `otel-evaluation`
- `agentic-career-workflow`

The `resume` object therefore stores ordered ID lists instead of a second copy of career history.

## SRE role-positioning rule

The data model encodes the approved distinction between domain/product leadership and hands-on engineering.

Andrew's Salesforce SRE experience is represented as Product Owner/Product Manager, product, platform, portfolio, and domain leadership. The use of `Site Reliability Engineering` as the functional assignment name or an alias for `SRE Platforms` must not be transformed into an unsupported claim of hands-on SRE engineering, production configuration, or tool administration.

Direct hands-on engineering remains attached to separately approved experience such as Client Engineering and other explicitly verified work.

Downstream generators must preserve this distinction.

## Resume strategy

`resume.json` will **not** become the master public data store.

Instead:

1. `src/data/career.json` remains the shared public authoring model.
2. Release 1 resume content is assembled from the IDs in the `resume` object.
3. C2 may generate or adapt that content into JSON Resume-compatible `resume.json`.
4. `resume.md`, the human `/resume` page, JSON-LD, and other representations use the same underlying records.
5. Any factual change must enter through the approved source workflow and then update this model; downstream outputs must not be edited as competing sources of truth.

## Provenance

Public records may contain safe claim identifiers such as `SF-010` or `SIMON-PUBLIC-001`. These identifiers provide traceability to the approved source workflow without exposing evidence files, private repository locations, internal URLs, or confidential source material.

The public model does not contain private evidence notes or private-only claims.

## Privacy and disclosure

The model intentionally excludes:

- private phone number and personal email,
- home address and private identifiers,
- compensation or financial data,
- private repository URLs and contents,
- application records and recruiter communications,
- internal employer URLs,
- credentials, tokens, keys, or secrets,
- confidential architecture details,
- private Simon implementation details.

The generalized `Agentic Career Workflow` project is the only public representation authorized from that private workflow and must continue to follow its explicit boundaries.

## Validation

B1 adds a JSON Schema describing required objects and field types. Automated schema execution belongs to the later D2 validation-gate work; B1 establishes the schema now so Astro integration and downstream generators have a stable contract.

Later validation should also verify referential integrity—for example, every `skillId`, `projectId`, `experienceId`, and `link` reference must point to an existing object.

## Downstream mapping

| Public model | Human / machine consumers |
| --- | --- |
| `profile` | Home, About/Profile content, JSON-LD, `llms.txt`, resume header |
| `experience[]` | Experience page, resume, JSON Resume adapter, JSON-LD |
| `skills[]` | Home/Experience taxonomy, search metadata, JSON-LD, resume |
| `projects[]` | Projects pages, evidence links, `llms.txt`, JSON-LD |
| `links[]` | Navigation, contact, `sameAs`, machine outputs |
| `contact` | Contact surface and recruiter CTA |
| `resume` | `/resume`, `/resume.md`, `/resume.json` adapter |

## B1 acceptance

B1 is complete when:

- one structured public model can feed all human and machine outputs,
- the Release 1 A2-approved content is represented,
- role and privacy boundaries are encoded with the content,
- the schema contract exists,
- `resume.json` is explicitly downstream/adapted rather than authoritative,
- no output format is treated as an independent factual authority.
