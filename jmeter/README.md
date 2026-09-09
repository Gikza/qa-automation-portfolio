# JMeter Performance Tests

[![JMeter Performance Tests](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/jmeter.yml/badge.svg)](https://github.com/Gikza/qa-automation-portfolio/actions/workflows/jmeter.yml)

Performance test plans built with [Apache JMeter](https://jmeter.apache.org/), targeting the same [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API covered functionally in [`../tests/api-testing.spec.ts`](../tests/api-testing.spec.ts) — this suite checks how it behaves under concurrency instead of just correctness. Five plans cover the standard performance-testing shapes: smoke, load, stress, spike, and a multi-step CRUD workflow. Every push and PR that touches `jmeter/**` runs the full set in CI, non-GUI, with an HTML dashboard report uploaded as a build artifact.

## Stack

- [Apache JMeter](https://jmeter.apache.org/) 5.6.3 — load generation and assertions
- GitHub Actions — CI, runs all five plans non-GUI on every push/PR, generates the HTML dashboard

## Getting started

Requires Java 17+ and [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi).

Open a plan in the GUI (for editing/debugging only — never run load from the GUI):

```bash
jmeter -t jmeter/test-plans/02-load-test.jmx
```

Run a plan headless, the way CI does, and generate the HTML dashboard:

```bash
jmeter -n -t jmeter/test-plans/02-load-test.jmx \
  -l jmeter/results/02-load-test.jtl \
  -e -o jmeter/report/02-load-test
```

Open `jmeter/report/02-load-test/index.html` in a browser to view it.

## Test plans

| File | What it demonstrates |
|---|---|
| [`01-smoke-test.jmx`](test-plans/01-smoke-test.jmx) | Single-user sanity check (status code, JSON shape, response time) — the gate before running heavier plans |
| [`02-load-test.jmx`](test-plans/02-load-test.jmx) | 20 concurrent users browsing posts/users/comments with think time, ramped over 20s — simulates expected everyday traffic |
| [`03-stress-test.jmx`](test-plans/03-stress-test.jmx) | 100 concurrent users, ramped over 30s — pushes past expected load to see where response time or error rate degrades |
| [`04-spike-test.jmx`](test-plans/04-spike-test.jmx) | 150 users ramped up in just 5s — an abrupt burst instead of a gradual climb, to check the system copes with sudden traffic |
| [`05-crud-workflow.jmx`](test-plans/05-crud-workflow.jmx) | A realistic user journey under concurrency: POST (create) → GET (read an existing post) → PUT (update it) → DELETE, using a `JSONPostProcessor` to extract the created post's `id` and feed it into the DELETE request |

All plans share `HTTP Request Defaults` and a `HTTP Header Manager` at the Test Plan level, use `Response Assertion`/`Duration Assertion` per request instead of just eyeballing pass/fail, and log to CSV (`.jtl`) rather than embedding response data, keeping result files small enough to commit or upload as CI artifacts.

## Notes from building this

A few real issues found while running these against the live API, kept here because they're more informative than a green checkmark:

- **JSONPlaceholder is a fake REST API — it doesn't persist writes, and it fails in different ways depending on the operation.** `POST /posts` always returns a fabricated `id: 101` with a `201`, but that post was never actually stored: a follow-up `GET /posts/101` returns `404`, and `PUT /posts/101` returns `500` (not even a clean error). `DELETE`, on the other hand, returns `200` for *any* id, existing or not. `05-crud-workflow.jmx` was originally written to chain the created `id` into every subsequent request and had a 50% failure rate as a result (verified locally: 30/30 GETs at 404, 30/30 PUTs at 500). Fixed by pointing GET/PUT at a post that actually exists (`/posts/1`) while still using the `JSONPostProcessor`-extracted `id` for DELETE, the one verb that tolerates it — 0% errors after the fix.
- **Error-rate gate, not just green/red — and CSV needs a real parser, not `split(",")`.** JMeter's CLI exits 0 even when every sample fails, so pass/fail has to be computed from the results file. The first version of the CI check used `awk -F','` on the `.jtl`, which silently miscounts whenever a field (e.g. `failureMessage`) contains a comma and gets quoted — columns shift and the wrong field gets checked. Replaced with [`check_jmeter_error_rate.py`](../.github/scripts/check_jmeter_error_rate.py), which uses Python's `csv.DictReader` and reads columns by name instead of position, and fails the build if any plan's error rate exceeds 5%.
- **Spike traffic degraded latency, not availability.** Run locally: `02-load-test.jmx` (20 users) averaged 105ms with a 556ms max; `03-stress-test.jmx` (100 users) actually averaged *faster* at 79ms; but `04-spike-test.jmx` (150 users ramped in 5s) averaged 436ms with a 1.47s max — all with 0% errors in every case. The bottleneck under a sudden burst showed up as response time, not failed requests, which is exactly the kind of thing a pure pass/fail check would miss and only response-time percentiles catch.
- **Ramp-up time is the actual variable between load/stress/spike, not thread count.** `03-stress-test.jmx` and `04-spike-test.jmx` use similar or higher thread counts than each other, but spike compresses the ramp-up from 30s to 5s — that's the part that stresses connection handling differently, as the latency numbers above show.
- **No JMeter plugins.** Everything here uses only core JMeter components (`ThreadGroup`, `HTTPSamplerProxy`, `ResponseAssertion`, `DurationAssertion`, `JSONPathAssertion`, `JSONPostProcessor`, `UniformRandomTimer`) so the CI workflow only needs to download vanilla `apache-jmeter-5.6.3.tgz` — no plugin manager step, no extra jar wrangling.

## CI

[`.github/workflows/jmeter.yml`](../.github/workflows/jmeter.yml) downloads (and caches) JMeter, runs all five `.jmx` plans non-GUI on every push/PR touching `jmeter/**`, generates an HTML dashboard per plan (`-e -o`), runs [`check_jmeter_error_rate.py`](../.github/scripts/check_jmeter_error_rate.py) against each plan's `.jtl` with a 5% error-rate threshold, and uploads the reports and raw results as a build artifact for 30 days. On pushes to `main`, it also publishes the dashboards to GitHub Pages — see the [live reports](https://gikza.github.io/qa-automation-portfolio/jmeter/).
