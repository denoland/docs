---
last_modified: 2025-03-10
title: "deno clean"
command: clean
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno clean"
description: "Remove cached dependencies for a clean start"
---

`deno clean` removes Deno's global module cache directory. See
[Modules](/runtime/fundamentals/modules/) for more information about how Deno
caches dependencies.

## Basic usage

```sh
deno clean
```

## Dry run

Preview what would be deleted without actually removing anything:

```sh
deno clean --dry-run
```

## Keeping what a project still needs

Use `--except` with one or more entry points to remove everything from the cache
except the data those files need:

```sh
deno clean --except main.ts
```

## When to use this

Use `deno clean` when you need to:

- Resolve issues caused by corrupted or stale cached modules
- Free disk space used by cached dependencies
