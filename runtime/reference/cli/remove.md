---
last_modified: 2026-06-25
title: "deno remove"
command: remove
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno remove"
description: "Remove a dependency from your project"
---

`deno remove` removes dependencies from your project's configuration file. It is
the inverse of [`deno add`](/runtime/reference/cli/add/).

## Basic usage

Remove a package:

```sh
deno remove @std/path
```

Remove multiple packages at once:

```sh
deno remove @std/path @std/assert npm:express
```

## Where dependencies are removed from

`deno remove` will look at both
[`deno.json`](/runtime/fundamentals/configuration/) and `package.json` (if
present) and remove the matching dependency from whichever file it is found in.

Removing a dependency does not delete it from the global cache. To reclaim disk
space, see [`deno clean`](/runtime/reference/cli/clean/).

## Removing a global executable

Pass `--global` (or `-g`) to remove a globally installed executable script, the
same as [`deno uninstall --global`](/runtime/reference/cli/uninstall/):

```sh
deno remove --global serve
```

A global removal targets a single executable, so you cannot combine `--global`
with multiple names. Use `--root` to target a custom installation root.
