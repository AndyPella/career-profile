# Release Publication Checklist

Use this checklist before any first production publication and for later material changes to career facts, project claims, identity, or contact information.

## Public-content review

- [ ] All career facts come from the approved downstream public content model.
- [ ] No private repository URL, internal employer URL, application record, recruiter communication, evidence note, private prompt, context-loader detail, credential, token, key, compensation detail, private phone number, or private email address is exposed unless specifically approved.
- [ ] Salesforce SRE wording preserves the Product Owner/Product Manager and platform-leadership boundary; it does not imply hands-on SRE engineering or production tool administration without a separately approved claim.
- [ ] OpenTelemetry content makes no unapproved cost-savings or financial-savings claim.
- [ ] Agentic Career Workflow content remains sanitized and does not disclose private candidate/application data or claim Andrew personally coded every agent/automation capability.
- [ ] Human-facing pages and machine-readable outputs represent the same approved facts and privacy boundaries.

## Generated-output review

- [ ] `/resume` renders correctly.
- [ ] `/resume.json` contains only approved public-safe data and parses as JSON.
- [ ] `/resume.md` contains only approved public-safe data.
- [ ] `/llms.txt` contains only approved public identity/context and canonical public links.
- [ ] JSON-LD contains only approved public facts and identities.
- [ ] `/sitemap.xml` contains the intended canonical human pages.
- [ ] `/robots.txt` permits intended public crawling and references the canonical sitemap.
- [ ] Generated source/assets contain no private-source markers or obvious credentials/secrets.

## Contact and identity review

- [ ] Andrew Pella is the consistent public identity.
- [ ] `https://andrewpella.com` is the canonical site URL.
- [ ] LinkedIn remains the approved primary professional contact route unless Andrew explicitly approves another public method.
- [ ] No unnecessary personal contact information is exposed.

## Release authorization

- [ ] Automated D2 validation passes on the exact commit proposed for deployment.
- [ ] Material career-fact or contact changes have received explicit human review before publication.
- [ ] Production deployment uses only the approved `main` path and cannot proceed from unreviewed pull-request code.
