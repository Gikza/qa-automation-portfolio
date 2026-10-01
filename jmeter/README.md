# JMeter Performance Tests

[![JMeter Performance Tests](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/jmeter.yml/badge.svg)](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/jmeter.yml)

Performance test plans built with [Apache JMeter](https://jmeter.apache.org/), targeting the same `/posts` API covered functionally in [`../tests/api-testing.spec.ts`](../tests/api-testing.spec.ts) and [`../postman/`](../postman/), served by a local [json-server](https://github.com/typicode/json-server) seeded from [`../test-data/db.json`](../test-data/db.json) — this suite checks how it behaves under concurrency instead of just correctness. Five plans cover the standard performance-testing shapes: smoke, load, stress, spike, and a multi-step CRUD workflow. Every push and PR that touches `jmeter/**`, `test-data/**` or the npm manifests runs the full set in CI, non-GUI, with an HTML dashboard report uploaded as a build artifact.

The suite originally targeted [JSONPlaceholder](https://jsonplaceholder.typicode.com/), which started returning `404` on writes ([#2](https://github.com/Gikza/qa-automation-portfolio/issues/2)).

## What these numbers mean

**The results measure the methodology, not the performance of a real system.** The target is a single-process json-server running on the same machine as JMeter (your laptop, or a shared GitHub Actions runner), serving a few hundred records from a JSON file. Its response times say nothing about how a production API — with a real database, network, caching and horizontal scaling — would behave, and they shouldn't be compared to production numbers or read as capacity figures.

What the suite does demonstrate is the part that carries over to a real system: how the load shapes are built (smoke → load → stress → spike), per-request assertions, a multi-step workflow with extracted ids, isolation of test data under concurrency, and a CI gate computed from the results file.

The thresholds follow from that:

- **Duration assertions (2s smoke, 3s load, 5s stress) are sanity limits, not SLOs.** Against localhost, requests take tens of milliseconds, so these only fire on something pathological (a hang, a timeout). Tightening them to match local latency would just make CI depend on the runner's CPU.
- **The 5% error-rate gate stays meaningful.** The server is deterministic, so any error is a real bug in a plan or in the seed data (a missing route, a broken id chain), not network noise.

## Stack

- [Apache JMeter](https://jmeter.apache.org/) 5.6.3 — load generation and assertions
- [json-server](https://github.com/typicode/json-server) — local target API (`npm run api:mock`, port 3001)
- [start-server-and-test](https://github.com/bahmutov/start-server-and-test) — starts json-server with clean data, waits for it, runs a plan, and stops it
- GitHub Actions — CI, runs all five plans non-GUI on every push/PR, generates the HTML dashboard

## Getting started

Requires Java 17+, Node.js 22+ and [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi) on your `PATH`. Run `npm install` once from the repo root.

Open a plan in the GUI (for editing/debugging only — never run load from the GUI). Start the API first with `npm run api:mock`:

```bash
jmeter -t jmeter/test-plans/02-load-test.jmx
```

Run a plan headless, the way CI does — each plan against a fresh json-server — and generate the HTML dashboard:

```bash
npx start-server-and-test api:mock http://localhost:3001/posts \
  "jmeter -n -t jmeter/test-plans/02-load-test.jmx -l jmeter/results/02-load-test.jtl -e -o jmeter/report/02-load-test"
```

Open `jmeter/report/02-load-test/index.html` in a browser to view it. `-e -o` needs an empty or missing output folder, so delete `jmeter/report/02-load-test` before re-running.

The target comes from JMeter properties, with local defaults (`host=localhost`, `port=3001`, `protocol=http`), so pointing a plan somewhere else doesn't require editing the `.jmx`:

```bash
jmeter -n -t jmeter/test-plans/01-smoke-test.jmx -Jhost=staging.example.com -Jport=443 -Jprotocol=https -l results.jtl
```

## Test plans

| File | What it demonstrates |
|---|---|
| [`01-smoke-test.jmx`](test-plans/01-smoke-test.jmx) | Single-user sanity check (status code, JSON shape, response time) — the gate before running heavier plans |
| [`02-load-test.jmx`](test-plans/02-load-test.jmx) | 20 concurrent users browsing posts/users/comments with think time, ramped over 20s — simulates expected everyday traffic |
| [`03-stress-test.jmx`](test-plans/03-stress-test.jmx) | 100 concurrent users, ramped over 30s — pushes past expected load to see where response time or error rate degrades |
| [`04-spike-test.jmx`](test-plans/04-spike-test.jmx) | 150 users ramped up in just 5s — an abrupt burst instead of a gradual climb, to check the system copes with sudden traffic |
| [`05-crud-workflow.jmx`](test-plans/05-crud-workflow.jmx) | A realistic user journey under concurrency (10 users × 3 iterations): POST (create) → GET → PUT → DELETE → GET (expects `404`), all on the post that thread just created. A `JSONPostProcessor` extracts its `id`, and `JSONPathAssertion`s check that GET returns that post and PUT really changed the title |

All plans share `HTTP Request Defaults` (host, port and protocol from the `HOST`/`PORT`/`PROTOCOL` variables, backed by `-J` properties) and a `HTTP Header Manager` at the Test Plan level, use `Response Assertion`/`Duration Assertion` per request instead of just eyeballing pass/fail, and log to CSV (`.jtl`) rather than embedding response data, keeping result files small enough to commit or upload as CI artifacts.

## Notes from building this

A few real issues found while building and running these, kept here because they're more informative than a green checkmark. The first note, and the latency numbers in the spike and ramp-up notes, come from the original runs against JSONPlaceholder.

- **JSONPlaceholder is a fake REST API — it doesn't persist writes, and it fails in different ways depending on the operation.** `POST /posts` always returns a fabricated `id: 101` with a `201`, but that post was never actually stored: a follow-up `GET /posts/101` returns `404`, and `PUT /posts/101` returns `500` (not even a clean error). `DELETE`, on the other hand, returns `200` for *any* id, existing or not. `05-crud-workflow.jmx` was originally written to chain the created `id` into every subsequent request and had a 50% failure rate as a result (verified locally: 30/30 GETs at 404, 30/30 PUTs at 500). It was then worked around by pointing GET/PUT at a post that actually exists (`/posts/1`), and only sending the extracted `id` to DELETE, the one verb that tolerated it.
- **Moving to json-server made the original design possible again — and exposed what the workaround hid.** json-server stores writes, so the workflow is back to a real CRUD on the created `id`, plus a final GET that proves the DELETE worked. Two things changed along the way:
  - **Isolation.** With persistent writes, all 10 threads hitting `PUT /posts/1` would share (and fight over) one record, and any DELETE on a seed post would break other threads' reads. Now each thread only touches the post it created, the read-only plans (01–04) never write, and CI starts a fresh json-server for each plan, so no plan sees another's leftovers.
  - **A silent fallback.** The `JSONPostProcessor` default value was `1`, so a failed id extraction would have sent the DELETE to a seed post and still passed. It's now `NOT_FOUND`, so a broken chain fails loudly.
  - The final GET expects a `404`, which JMeter counts as an error before assertions run. Its Response Assertion therefore uses *Ignore Status* (`assume_success`) and checks for `404` explicitly.
- **Error-rate gate, not just green/red — and CSV needs a real parser, not `split(",")`.** JMeter's CLI exits 0 even when every sample fails, so pass/fail has to be computed from the results file. The first version of the CI check used `awk -F','` on the `.jtl`, which silently miscounts whenever a field (e.g. `failureMessage`) contains a comma and gets quoted — columns shift and the wrong field gets checked. Replaced with [`check_jmeter_error_rate.py`](../.github/scripts/check_jmeter_error_rate.py), which uses Python's `csv.DictReader` and reads columns by name instead of position, and fails the build if any plan's error rate exceeds 5%.
- **Spike traffic degraded latency, not availability** (historical, against JSONPlaceholder over the internet; see [What these numbers mean](#what-these-numbers-mean) for why the local json-server numbers aren't comparable). Run locally: `02-load-test.jmx` (20 users) averaged 105ms with a 556ms max; `03-stress-test.jmx` (100 users) actually averaged *faster* at 79ms; but `04-spike-test.jmx` (150 users ramped in 5s) averaged 436ms with a 1.47s max — all with 0% errors in every case. The bottleneck under a sudden burst showed up as response time, not failed requests, which is exactly the kind of thing a pure pass/fail check would miss and only response-time percentiles catch.
- **Ramp-up time is the actual variable between load/stress/spike, not thread count.** `03-stress-test.jmx` and `04-spike-test.jmx` use similar or higher thread counts than each other, but spike compresses the ramp-up from 30s to 5s — that's the part that stresses connection handling differently, as the latency numbers above show.
- **No JMeter plugins.** Everything here uses only core JMeter components (`ThreadGroup`, `HTTPSamplerProxy`, `ResponseAssertion`, `DurationAssertion`, `JSONPathAssertion`, `JSONPostProcessor`, `UniformRandomTimer`) so the CI workflow only needs to download vanilla `apache-jmeter-5.6.3.tgz` — no plugin manager step, no extra jar wrangling.

## CI

[`.github/workflows/jmeter.yml`](../.github/workflows/jmeter.yml) installs the npm dependencies, downloads (and caches) JMeter, and runs all five `.jmx` plans non-GUI on every push/PR touching `jmeter/**`, `test-data/**` or the npm manifests. Each plan runs through `start-server-and-test` against its own fresh json-server. The workflow then generates an HTML dashboard per plan (`-e -o`), runs [`check_jmeter_error_rate.py`](../.github/scripts/check_jmeter_error_rate.py) against each plan's `.jtl` with a 5% error-rate threshold, and uploads the reports and raw results as a build artifact for 30 days. On pushes to `main`, it also publishes the dashboards to GitHub Pages — see the [live reports](https://gikza.github.io/qa-automation-portfolio/jmeter/).
