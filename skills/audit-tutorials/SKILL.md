---
name: audit-tutorials
description: Scan examples/tutorials for staleness and report a ranked worklist without editing. Use to find deprecated APIs, version-pinned doc links, old last_modified dates, and snippet bugs across the tutorials.
---

# Audit tutorials for staleness

Scan the tutorials under `examples/tutorials/` (or a narrower target if the
author names one) and report a ranked worklist. Do not edit anything and do not
open a PR: this skill only produces the report that feeds `modernize-tutorial`.

For each tutorial, check for:

1. Version-pinned documentation links. Grep the code and prose for URLs that pin
   an old major, for example `tanstack.com/.../v1/`, `.../v4/`, or any `/vN/`
   segment that is behind the library's current major. Flag each with the file
   and line.

2. Stale `last_modified`. Sort pages by their frontmatter date and surface the
   oldest. Treat anything older than about a year as worth a review, and call
   out any page missing the field (CI requires it).

3. Deprecated or renamed APIs in code blocks. Look for patterns you know have
   moved (for example `new RootRoute()` / `new Route()` for TanStack Router) and
   anything the framework's current docs mark as deprecated. When unsure, say so
   rather than guessing.

4. Snippet bugs a reader would hit: identifiers used but never imported, files
   referenced by a name that no earlier step created, and install or scaffold
   commands that are not Deno-native (`npm install`, `npx`, `node`).

5. Non-Deno-native setup. Flag tutorials that reach for the Node toolchain where
   a `deno` equivalent exists.

Output a single ranked table: file, issue, severity (high = wrong or broken
code, medium = deprecated but working, low = stale link or old date), and the
suggested fix. Order by severity, then by how many readers the page likely gets
(getting-started and framework tutorials rank higher). End with the two or three
pages you would fix first and the exact `modernize-tutorial` runs to do it.
