# Claude Code Skills for QA

Custom skills for **Claude Code** that standardize everyday QA deliverables: pull request descriptions, Gherkin test cases and bug reports. Skills are written in Spanish, the language of the teams I work with.

## Skills

| Skill | What it does | Triggered when... |
|---|---|---|
| [`pr-description`](pr-description/SKILL.md) | Writes the PR description with testing steps, and flags test quality issues: empty tests, missing `expect`, `.only`/`.skip`, hard waits | You ask to write or create a PR |
| [`gherkin-cases`](gherkin-cases/SKILL.md) | Turns a user story into Gherkin scenarios: happy path, negative cases and boundary values, with tags and a coverage table | You ask for test cases, scenarios or a `.feature` file |
| [`bug-report`](bug-report/SKILL.md) | Writes reproducible, Jira-ready bug reports with justified severity and suggested regression tests. Asks for missing data instead of inventing it | You describe a bug or paste a log |

## Installation

Copy any skill folder into your personal skills directory:

- **Windows:** `C:\Users\<user>\.claude\skills\`
- **macOS / Linux:** `~/.claude/skills/`

Claude Code discovers them automatically and loads each one when a request matches its description.

## Example

**Prompt:** a password-recovery user story with three acceptance criteria (registered email, 24-hour link expiry, 8–20 character password).

**Output:** [`examples/recuperar_contrasena.feature`](examples/recuperar_contrasena.feature), with 14 scenarios covering boundary values (7/8/20/21 characters; link at 23:59, 24:00 and 24:01), negative cases, and a list of assumptions to validate with the business.

## Design principles

- **The AI proposes, QA decides.** Skills surface assumptions and missing data instead of filling gaps silently.
- **Quality gates built in.** The PR skill reviews the tests themselves, not just the diff.
- **Consistent output.** Every deliverable follows the same structure, whoever writes it.
