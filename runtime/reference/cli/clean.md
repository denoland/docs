---
title: "deno clean"
command: clean
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno clean"
description: "Remove cached dependencies for a clean start"
---

`deno clean` removes Deno's global module cache directory.

## Basic usage

```sh
deno clean
```

## Dry run

Preview what would be deleted without actually removing anything:

```sh
deno clean --dry-run
```

## Keeping specific caches

Use `--except` to preserve certain cache types while cleaning the rest:

```sh
deno clean --except=npm,jsr
```

## When to use this

Use `deno clean` when you need to:

- Resolve issues caused by corrupted or stale cached modules
- Free disk space used by cached dependencies
