# Postman API Tests

[![Postman API Tests](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/postman.yml/badge.svg)](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/postman.yml)

A Postman collection targeting the same [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API covered functionally in [`../tests/api-testing.spec.ts`](../tests/api-testing.spec.ts) (Playwright) and under load in [`../jmeter/`](../jmeter/). Run through [Newman](https://github.com/postmanlabs/newman) in CI on every push/PR that touches `postman/**`.

This suite exists to show the parts of API testing that live more naturally in Postman than in Playwright or JMeter: JSON schema validation, response-time assertions declared as first-class checks, and a chained request workflow driven by collection variables extracted at runtime — plus how Postman's built-in AI assistant fits into writing that.

## Stack

- [Postman](https://www.postman.com/) — collection authoring, manual exploration, AI-assisted test generation
- [Newman](https://github.com/postmanlabs/newman) — CLI collection runner, what CI actually executes
- `newman-reporter-htmlextra` — HTML report generation
- GitHub Actions — CI on every push/PR touching `postman/**`

## Getting started

**In the Postman app** (for editing/exploring, and for using the AI assistant):

1. Import [`collection.json`](collection.json) and [`environment.json`](environment.json) (File → Import).
2. Select the "JSONPlaceholder" environment in the top-right environment picker.
3. Run individual requests, or use Runner to run a folder/collection.

**From the CLI, the way CI does it:**

```bash
npm install
npx newman run postman/collection.json -e postman/environment.json
```

With the HTML report (matches CI):

```bash
npx newman run postman/collection.json -e postman/environment.json \
  --reporters cli,htmlextra --reporter-htmlextra-export postman/report/report.html
```

## Test suite

| Folder | What it demonstrates |
|---|---|
| **Posts API** | The same five cases as the Playwright suite — list, get-by-id, 404, create, delete — as a direct point of comparison between the two tools |
| **Schema & Performance** | `pm.response.to.have.jsonSchema()` for structural validation and a `pm.response.responseTime` assertion — checks that don't map cleanly onto Playwright's `expect()` API |
| **CRUD Workflow** | POST → GET → PUT → DELETE chained with `pm.collectionVariables`, mirroring [`05-crud-workflow.jmx`](../jmeter/test-plans/05-crud-workflow.jmx) — same API, same fabricated-id problem (see below), solved with Postman's own scripting model instead of JMeter's `JSONPostProcessor` |

## Using Postman's AI Assistant (Postbot) here

Postman's AI Assistant can draft `pm.test()` blocks, JSON schemas, and negative-path cases directly from a saved response, which is a real speed-up over hand-writing assertions — but it drafts against whatever the API *returned in that one response*, not against how the API actually behaves across methods. Two things worth knowing before trusting its output as-is:

- Ask it to generate tests **after** sending a request that already has a response attached, via the "Generate tests" action in the response pane or by asking directly in the assistant panel (e.g. *"write tests that check status code, response time, and JSON schema for this response"*). It scaffolds from the live payload rather than guessing.
- Review what it produces against the API's actual semantics, not just the happy-path response — see the JSONPlaceholder write-behavior note below. An AI assistant scaffolding from a single sample response has no way to know that `POST`'s `id: 101` doesn't persist; that only surfaces by chaining requests and reading real follow-up responses, which is exactly what the CRUD Workflow folder does.

## Notes from building this

- **JSONPlaceholder doesn't persist writes, and the same discovery from the JMeter suite applies here.** `POST /posts` always returns a fabricated `id: 101` with `201`, but nothing is actually stored — a follow-up `GET /posts/101` is `404` and `PUT /posts/101` is `500`. `DELETE`, however, returns `200` for any id at all, existing or not. The **CRUD Workflow** folder works around this the same way [`05-crud-workflow.jmx`](../jmeter/test-plans/05-crud-workflow.jmx) does: GET/PUT target a post that actually exists (`/posts/1`), while the fabricated id from the POST response is captured with `pm.collectionVariables.set()` and only ever used against DELETE, the one verb that tolerates it.
- **`pm.response.to.have.jsonSchema()` needs a schema without `additionalProperties: false`.** JSONPlaceholder posts don't return extra fields today, but pinning the schema too strictly turned an API-shape assertion into an API-completeness assertion that would break on any harmless additive change. The schema in **Schema & Performance** only asserts required fields and their types.
- **Newman's exit code is the actual CI gate.** Newman returns a non-zero exit code if any `pm.test()` assertion fails, so unlike JMeter (which needed a separate error-rate script because its CLI exits 0 regardless of sample failures), the CI step here doesn't need extra tooling to fail the build correctly.

## CI

[`.github/workflows/postman.yml`](../.github/workflows/postman.yml) installs Newman, runs the collection against the JSONPlaceholder environment on every push/PR touching `postman/**`, and uploads the HTML report as a build artifact for 30 days.
