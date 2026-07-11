---
name: verify-tutorial
description: Reproduce a docs tutorial's code with Deno-native tooling and confirm it builds and runs, without editing the tutorial. Use for a QA pass on a tutorial before trusting or shipping it.
---

# Verify a tutorial runs

Confirm the named tutorial under `examples/tutorials/` actually works when
followed exactly, using only Deno-native tooling. This is a QA pass: do not edit
the tutorial. Produce a pass/fail report backed by real command output.

1. Read the tutorial and extract the concrete steps a reader would run: the
   scaffold command, install command(s), every file they create with its
   contents, and the run and build commands.

2. Work in a throwaway directory (a scratch location, not this repo). Follow the
   steps literally and in order, using only `deno` (`deno run`, `deno install`,
   `deno task`, `deno serve`). If the tutorial tells the reader to run
   `npm`/`npx`/`node`, that itself is a finding: record it and use the
   Deno-native equivalent to continue.

3. Prove it works, do not assert it:
   - Dev server: start it in the background, then `curl` the root and the main
     entry module and record the HTTP status.
   - Build: run the production build and capture the result (module count and
     exit code).
   - If the tutorial has a backend, stand it up and `curl` an endpoint.

4. Report:
   - Verdict: passes as written, passes with deviations, or broken.
   - Each deviation you had to make (wrong command, missing import, deprecated
     API, stale version) with the exact error and what fixed it.
   - The commands you ran and their output as evidence.

5. If you found problems, recommend the `modernize-tutorial` skill to fix them.
   This skill does not edit or open a PR.
