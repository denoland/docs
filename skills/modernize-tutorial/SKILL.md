---
name: modernize-tutorial
description: Update an existing docs tutorial to a framework's current API and tooling, verifying the new code runs under Deno before editing. Use when a tutorial references a deprecated API, an outdated scaffolder, or version-pinned documentation links.
---

# Modernize a tutorial

Bring the named tutorial under `examples/tutorials/` up to date so a reader
following it today uses the current, supported API and tooling, and every code
block actually runs under Deno.

Work in this order:

1. Read the tutorial. List every external-facing thing that can rot: package
   APIs used in code blocks, scaffolding commands, install commands,
   version-pinned documentation links (for example `/v1/` or `/v4/` in a
   tanstack.com URL), and any snippet that imports or references something it
   never defines.

2. Establish what "current" is. Check the framework's official docs for the
   supported API and the recommended Deno-native setup. Do not trust memory for
   version-specific details. Note deprecations explicitly (for example TanStack
   Router's `new RootRoute()` / `new Route()` became `createRootRoute()` /
   `createRoute()`).

3. Verify before you rewrite. Reproduce the relevant part of the tutorial in a
   throwaway directory using only Deno-native tooling (`deno run`,
   `deno install`, `deno task`; never `npm`/`npx`/`node`). Get the updated code
   to pass a real build (for a Vite app, `deno task build` runs `tsc` plus
   `vite build`) and to serve from the dev server. If it will not run, fix the
   code until it does. The version you paste into the tutorial is the version
   you ran.

4. Apply the edits: replace deprecated API usage, refresh scaffold and install
   commands to the Deno-native path, fix version-pinned links to `latest` (or
   the correct current major), and correct any snippet bugs you found (missing
   imports, stale filenames). Keep the tutorial's app and narrative intact
   unless asked otherwise. Modernize, do not rewrite.

5. Housekeeping: bump `last_modified` to today. Replace em-dash joins with
   colons or shorter sentences. Keep frontmatter titles backtick-free. Run
   `deno fmt` on the file.

6. Show the `git diff` and a short note on what you verified: the exact command
   that built or ran, and its result. Then hand off to the `open-docs-pr` skill.
   Do not push until the author confirms.
