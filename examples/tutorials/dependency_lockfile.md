---
title: "Lock dependencies with deno.lock"
description: "Use deno.lock for reproducible installs: what the lockfile records, reviewing lockfile diffs, frozen lockfiles for CI with --frozen and deno ci, and regenerating or relocating the lockfile."
url: /examples/dependency_lockfile_tutorial/
---

`deno.lock` pins every dependency to an exact resolved version with an integrity
hash, so every machine — and your CI — runs identical code. Deno creates and
updates it automatically whenever a `deno.json` (or `package.json`) is present;
your job is just to commit it and decide when it may change.

## What deno.lock records

Add a dependency (for example `deno add npm:chalk`) and Deno writes the lockfile
alongside your config:

```json title="deno.lock"
{
  "version": "5",
  "specifiers": {
    "npm:chalk@^5.6.2": "5.6.2"
  },
  "npm": {
    "chalk@5.6.2": {
      "integrity": "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA=="
    }
  },
  "workspace": {
    "dependencies": ["npm:chalk@^5.6.2"]
  }
}
```

Each semver range from your config is mapped to one exact version, and each
package gets a hash that Deno verifies on every install. Commit `deno.lock` to
git — on other machines and in CI, [`deno ci`](/runtime/reference/cli/ci/) then
installs exactly what the lockfile says.

## Reviewing lockfile diffs

A version bump shows up as a changed resolution plus a changed hash:

```diff
   "specifiers": {
-    "npm:ms@2.1.2": "2.1.2"
+    "npm:ms@^2.1.3": "2.1.3"
   },
   "npm": {
-    "ms@2.1.2": {
-      "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4Xqe..."
+    "ms@2.1.3": {
+      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU..."
```

A new dependency adds entries instead — including its transitive dependencies,
listed under `dependencies`:

```diff
   "npm": {
+    "debug@4.4.3": {
+      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru...",
+      "dependencies": ["ms"]
+    },
```

Unexpected new packages in a lockfile diff are worth a closer look in review.

## Freeze the lockfile for CI

By default the lockfile is additive: new dependencies are recorded without
complaint. In CI you usually want the opposite — fail if anything is not already
locked:

```json title="deno.json"
{
  "lock": {
    "frozen": true
  }
}
```

The same is available ad hoc as the `--frozen` flag. With a frozen lockfile, any
command that would modify `deno.lock` exits with an error showing the changes it
wanted to make:

```sh
$ deno install
error: The lockfile is out of date. Run `deno install --frozen=false`, or rerun with `--frozen=false` to update it.
changes:
 4 | -    "npm:chalk@^5.6.2": "5.6.2"
 4 | +    "npm:chalk@^5.6.2": "5.6.2",
 5 | +    "npm:ms@^2.1.3": "2.1.3"
```

[`deno ci`](/runtime/reference/cli/ci/) wraps the recommended CI flow: it
requires `deno.lock`, removes any existing `node_modules`, installs strictly
from the lockfile, and errors if the lockfile is missing or out of date.

## Updating and regenerating

To intentionally update dependencies, disable freezing for one command:

```sh
deno install --frozen=false
```

Because the lockfile is additive, entries for removed dependencies can linger.
To regenerate it from scratch, delete it and reinstall:

```sh
rm deno.lock
deno install
```

## Custom path or disabling

```json title="deno.json"
{
  "lock": { "path": "deps.lock" }
}
```

Set `"lock": false` to disable the lockfile entirely (not recommended for
applications). For the full picture, including supply chain practices built on
the lockfile, see
[Integrity checking and lock files](/runtime/packages/#integrity-checking-and-lock-files).
