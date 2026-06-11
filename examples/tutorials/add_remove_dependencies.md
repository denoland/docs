---
title: "Add and remove dependencies"
description: "Manage project dependencies with deno add and deno remove: npm and JSR packages, version pinning, dev dependencies, and aliasing packages in your import map."
url: /examples/add_remove_dependencies_tutorial/
---

Deno manages dependencies through your project's `deno.json` import map, or
through `package.json` when you have one. The `deno add` and `deno remove`
commands edit those files for you.

## Adding packages

Unprefixed package names are treated as npm packages. Use the `jsr:` prefix for
JSR packages:

```sh
$ deno add express jsr:@std/path
Add npm:express@5.2.1
Add jsr:@std/path@1.1.5
```

Both end up in the `imports` map of `deno.json`, with a semver-compatible caret
range:

```json title="deno.json"
{
  "imports": {
    "@std/path": "jsr:@std/path@^1.1.5",
    "express": "npm:express@^5.2.1"
  }
}
```

Import them by their bare name anywhere in the project:

```ts
import express from "express";
import { join } from "@std/path";
```

To pin an exact version instead of a caret range, pass `--save-exact`. To
request a specific version or tag, spell it out:

```sh
deno add --save-exact npm:express@4.21.2
deno add npm:typescript@next
```

## Where dependencies are written

If the project contains a `package.json`, npm packages are added to its
`dependencies` instead of `deno.json` — handy in projects shared with Node.js
tooling. You can force this with `--package-json`.

Dev dependencies only exist in the `package.json` world:

```sh
deno add --dev npm:typescript
```

:::note

Without a `package.json`, the `--dev` flag has no effect: `deno.json` has a
single `imports` map, so the package is added as a regular import.

:::

## Aliasing a package

The import map maps any name you like to any specifier. This installs a fork
under the name of the original, so existing imports keep working:

```json title="deno.json"
{
  "imports": {
    "lodash": "npm:lodash-es@^4.17.21"
  }
}
```

Aliases are also the way to use two versions of one package side by side:

```json title="deno.json"
{
  "imports": {
    "preact": "npm:preact@^10.27.2",
    "preact-canary": "npm:preact@11.0.0-experimental.4"
  }
}
```

## Removing packages

`deno remove` deletes the entry by its import-map name (not the package name, if
they differ):

```sh
$ deno remove express
Removed express
```

The lockfile keeps records of removed packages until you run `deno install`
again; see
[the lockfile documentation](/runtime/packages/#integrity-checking-and-lock-files)
for how `deno.lock` tracks all of this.
