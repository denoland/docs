---
last_modified: 2026-06-25
title: "Watch mode and HMR"
description: "Deno's built-in file watcher: re-run code on change with --watch, control what gets watched, and hot-replace modules with --watch-hmr."
---

Deno has a built-in file watcher, so you don't need `nodemon` or any other
external tool to reload your program as you edit. This page covers what gets
watched, how to exclude paths, and hot module replacement.

## Watch mode

You can supply the `--watch` flag to `deno run`, `deno test`, and `deno fmt` to
enable the built-in file watcher. The watcher enables automatic reloading of
your application whenever changes are detected in the source files. This is
particularly useful during development, as it allows you to see the effects of
your changes immediately without manually restarting the application.

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

The files that are watched will depend on the subcommand used:

- for `deno run` and `deno test` the entrypoint, and all local files that the
  entrypoint statically imports will be watched.
- for `deno fmt` all local files and directories specified as command line
  arguments (or the working directory if no specific files/directories is
  passed) are watched.

You can exclude paths or patterns from watching by providing the
`--watch-exclude` flag. The syntax is `--watch-exclude=path1,path2`. For
example:

```shell
deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
```

This will exclude file1.ts and file2.ts from being watched.

To exclude a pattern, remember to surround it in quotes to prevent your shell
from expanding the glob:

```shell
deno run --watch --watch-exclude='*.js' main.ts
```

## Hot module replacement

`deno run` also supports the `--watch-hmr` flag, which hot-replaces changed
modules in the running process instead of restarting it. This keeps your
application's state across edits. If hot replacement fails, the process falls
back to a full restart.

```shell
deno run --watch-hmr main.ts
```

Because this is such a common development workflow,
[`deno watch`](/runtime/reference/cli/watch/) is a shorthand for
`deno run --watch-hmr`:

```shell
deno watch main.ts
```

### Editors with atomic save

Some editors use "atomic save" (also called safe write), where the editor writes
your changes to a temporary file and then renames it over the original on each
save. On Linux this replaces the file with a new one on disk, which can detach
the file watcher used by `--watch-hmr` after the first change. The symptom is
that hot replacement works once and then stops detecting further edits to that
module.

If you hit this, disable atomic save in your editor:

- **Helix**: set `[editor] atomic-save = false` (it is enabled by default).
- **Neovim/Vim**: set `:set backupcopy=yes`.

Plain `--watch` is not affected, because each change triggers a full restart
that re-establishes the watchers.
