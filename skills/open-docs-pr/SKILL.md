---
name: open-docs-pr
description: Run this repo's required checks and open a PR in the project's house style. Use when a docs change is ready to propose against main.
---

# Open a docs PR

Open a pull request for the current branch's changes against `main`, but only
after this repo's required checks pass.

1. Sanity-check the branch. If you are on `main`, stop and create a topic branch
   off `origin/main` first. Run `git status` and
   `git diff origin/main...HEAD --stat` and confirm the diff is only what you
   intend. If running the checks below touched unrelated files (for example
   `deno.lock`), revert those so the PR stays focused.

2. Confirm freshness. Every changed content page must have `last_modified` set
   to today. Run `deno task check:freshness` and fix any page it flags.

3. Run the required gate and make it green. Paste the results; do not open the
   PR while any of these fail:
   - `deno fmt` (then re-stage any files it reformats)
   - `deno lint`
   - `deno task test` (frontmatter, sidebar, and API link tests)
   - `deno task build:light` (must build with no broken links or invalid MDX)

4. Push the branch to `origin` with `-u` under its own name. Never push to
   `main`.

5. Open the PR against `main` with a house-style description:
   - Prose only. No `## Summary`, `## Test plan`, or any section headers.
   - Hard-wrap every body line at 80 columns.
   - Lead with why the change exists and what it does at a high level; let the
     diff show the mechanics. One short paragraph is usually enough.
   - Title under 70 characters, using the repo's `docs:` prefix convention
     (check recent `git log origin/main --oneline`).

6. Return the PR URL.
