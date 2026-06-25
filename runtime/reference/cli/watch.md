---
last_modified: 2026-06-25
title: "deno watch"
command: watch
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno watch"
description: "Run a program in watch mode with hot module replacement"
---

The `deno watch` command runs a program and reloads it when its source files
change. It is a shorthand for
[`deno run --watch-hmr`](/runtime/reference/cli/run/): the program runs with hot
module replacement enabled, so on a change Deno swaps the updated modules in
place where it can instead of doing a full restart.

## Usage

```sh
deno watch main.ts
```

This is equivalent to:

```sh
deno run --watch-hmr main.ts
```

Because `deno watch` reuses `deno run`, every `deno run` flag works, including
the watch options:

- `--watch-hmr=<paths>` adds extra paths to watch.
- `--watch-exclude=<paths>` excludes paths from triggering a reload.
- `--no-clear-screen` keeps previous output instead of clearing the screen on
  each reload.

```sh
deno watch --watch-exclude=dist/ -RN main.ts
```
