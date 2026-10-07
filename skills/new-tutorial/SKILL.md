---
name: new-tutorial
description: Author a new docs tutorial that follows this repo's conventions, with code verified under Deno. Use when adding a tutorial for a framework, tool, or workflow that no existing page covers.
---

# Write a new tutorial

Write a new tutorial for the requested topic, following this repo's conventions,
with code you have actually run under Deno.

First check for overlap: search `examples/tutorials/` for an existing page on
this topic. If one exists, stop and recommend the `modernize-tutorial` skill
instead of a second page. A topic's depth should live in exactly one place.

Then:

1. Decide the smallest real app that teaches the concept, and confirm it runs.
   Build it in a throwaway directory (a scratch location, not this repo) using
   only Deno-native tooling (`deno run`, `deno install`, `deno task`,
   `deno serve`; never `npm`/`npx`/`node`). Get it to build and serve for real
   before writing any prose. Every code block must come from code you ran.

2. Create `examples/tutorials/<snake_case_name>.md` with frontmatter matching
   the existing tutorials:
   - `last_modified: <today>`
   - `title:` a plain string, no backticks
   - `description:` one or two sentences for search and previews
   - `url: /examples/<snake_case_name>_tutorial/`

3. Write the body as a teaching guide: introduce at most one or two concepts at
   a time, show each file with a `// path` comment header, and explain the why,
   not just the code. Link out to the framework's official docs and to related
   Deno tutorials rather than repeating detail. Prefer plain sentences and
   colons over em-dash joins.

4. Register it in navigation if the section requires it: check
   `examples/_data.ts` (or the section's `_data.ts`) and add the page where the
   sibling tutorials are listed. Keep any sidebar label within the section's
   length limit (the sidebar test enforces this).

5. Run `deno fmt` on the new file, then `deno lint`, `deno task test`, and
   `deno task build:light`, and fix anything they flag.

6. Show the new file and a note on what you verified (the exact build or run
   command and result). Then hand off to the `open-docs-pr` skill. Do not push
   until the author confirms.
