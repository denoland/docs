---
title: "deno clean"
command: clean
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno clean"
description: "Remove cached dependencies for a clean start"
---

`deno clean` removes Deno's global module cache directory. This forces all
dependencies to be re-downloaded on the next run.

## Basic usage

```bash
deno clean
```

## When to use this

Use `deno clean` when you need to:

- Resolve issues caused by corrupted or stale cached modules
- Free disk space used by cached dependencies
- Start fresh after switching between Deno versions
