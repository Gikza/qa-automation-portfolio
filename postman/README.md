# Postman API Tests

[![Postman API Tests](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/postman.yml/badge.svg)](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/postman.yml)

A Postman collection targeting the same `/posts` endpoints covered functionally in [`../tests/api-testing.spec.ts`](../tests/api-testing.spec.ts) (Playwright), served by a local [json-server](https://github.com/typicode/json-server) seeded from [`../test-data/db.json`](../test-data/db.json). It previously targeted JSONPlaceholder, which started returning `404` on writes (see [#2](https://github.com/Gikza/qa-automation-portfolio/issues/2)). Run through [Newman](https://github.com/postmanlabs/newman) in CI on every push/PR that touches `postman/**`, `test-data/**` or the npm manifests.

This suite exists to show the parts of API testing that live more naturally in Postman than in Playwright or JMeter: JSON schema validation, response-time assertions declared as first-class checks, and a chained request workflow driven by collection variables extracted at runtime — plus how Postman's built-in AI assistant fits into writing that.

## Stack

- [Postman](https://www.postman.com/) — collection authoring, manual exploration, AI-assisted test generation
- [Newman](https://github.com/postmanlabs/newman) — CLI collection runner, what CI actually executes
- `newman-reporter-htmlextra` — HTML report generation
- [json-server](https://github.com/typicode/json-server) — local `/posts` API, started fresh for every run
- [start-server-and-test](https://github.com/bahmutov/start-server-and-test) — starts json-server, waits for it, runs Newman, and stops the server
- GitHub Actions — CI on every push/PR touching `postman/**`, `test-data/**` or the npm manifests

## Getting started

**From the CLI, the way CI does it:**

```bash
npm install
npm run test:postman:local
```

`test:postman:local` runs exactly what CI runs:

1. `npm run api:mock` copies the seed [`../test-data/db.json`](../test-data/db.json) to the git-ignored `test-data/db.runtime.json` and serves it on port 3001, so every run starts from clean data and the seed is never modified.
2. It waits until `http://localhost:3001/posts` responds.
3. It runs `npm run test:postman` (Newman with the CLI and HTML reporters; report at `postman/report/index.html`).
4. It stops json-server when Newman finishes, pass or fail, and exits with Newman's exit code.

It works the same on Windows, macOS and Linux. Don't run `npm run test:postman` against a server left over from a previous run: the collection really creates and deletes posts, so stale data breaks it (for example, `GET /posts/1` returns `404` once the Posts API folder has deleted it).

**In the Postman app** (for editing/exploring, and for using the AI assistant):

1. Start the local API in a terminal with `npm run api:mock`, and restart it before each full collection run to reset the data.
2. Import [`collection.json`](collection.json) and [`environment.json`](environment.json) (File → Import).
3. Select the "Local json-server" environment in the top-right environment picker.
4. Run individual requests, or use Runner to run a folder/collection.

## Test suite

| Folder | What it demonstrates |
|---|---|
| **Posts API** | The same five cases as the Playwright suite — list, get-by-id, 404, create, delete — as a direct point of comparison between the two tools |
| **Schema & Performance** | `pm.response.to.have.jsonSchema()` for structural validation and a `pm.response.responseTime` assertion — checks that don't map cleanly onto Playwright's `expect()` API |
| **CRUD Workflow** | A real CRUD cycle on one post: POST → GET → PUT → DELETE → GET (`404`), all on the id returned by the POST and chained with `pm.collectionVariables`, using Postman's own scripting model instead of JMeter's `JSONPostProcessor` |

## Using Postman's AI Assistant (Postbot) here

Postman's AI Assistant can draft `pm.test()` blocks, JSON schemas, and negative-path cases directly from a saved response, which is a real speed-up over hand-writing assertions — but it drafts against whatever the API *returned in that one response*, not against how the API actually behaves across methods. Two things worth knowing before trusting its output as-is:

- Ask it to generate tests **after** sending a request that already has a response attached, via the "Generate tests" action in the response pane or by asking directly in the assistant panel (e.g. *"write tests that check status code, response time, and JSON schema for this response"*). It scaffolds from the live payload rather than guessing.
- Review what it produces against the API's actual semantics, not just the happy-path response — see the write-behavior note below. An AI assistant scaffolding from a single sample response has no way to know whether the id a `POST` returns is actually stored; that only surfaces by chaining requests and reading real follow-up responses, which is exactly what the CRUD Workflow folder does.

## Notes from building this

- **The CRUD Workflow was rewritten when the suite moved from JSONPlaceholder to json-server.** JSONPlaceholder never persisted writes: `POST /posts` returned a fabricated `id: 101` that a follow-up `GET` answered with `404` and `PUT` with `500`, while `DELETE` returned `200` for any id. The original workflow worked around that the same way [`05-crud-workflow.jmx`](../jmeter/test-plans/05-crud-workflow.jmx) does, reading and updating `/posts/1` and only sending the fabricated id to DELETE. json-server stores writes for real, which broke that workaround (the **Posts API** folder deletes `/posts/1` earlier in the run) and made a better test possible: every step now targets the created id, and a final `GET` checks that the DELETE really removed it. The flip side is that runs are no longer independent of the data, which is why every run starts json-server from a fresh copy of the seed.
- **`pm.response.to.have.jsonSchema()` needs a schema without `additionalProperties: false`.** The seeded posts don't return extra fields today, but pinning the schema too strictly turned an API-shape assertion into an API-completeness assertion that would break on any harmless additive change. The schema in **Schema & Performance** only asserts required fields and their types.
- **Newman's exit code is the actual CI gate.** Newman returns a non-zero exit code if any `pm.test()` assertion fails, so unlike JMeter (which needed a separate error-rate script because its CLI exits 0 regardless of sample failures), the CI step here doesn't need extra tooling to fail the build correctly.

## CI

[`.github/workflows/postman.yml`](../.github/workflows/postman.yml) installs dependencies with `npm ci` and runs the same `npm run test:postman:local` used locally, against a fresh json-server, on every push/PR touching `postman/**`, `test-data/**` or the npm manifests. It uploads the HTML report as a build artifact for 30 days. On pushes to `main`, it also publishes the report to GitHub Pages — see the [live report](https://gikza.github.io/qa-automation-portfolio/postman/).
