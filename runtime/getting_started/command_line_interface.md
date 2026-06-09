---
last_modified: 2026-05-28
title: Command line interface
description: "A comprehensive guide to using Deno's command-line interface (CLI). Learn about running scripts, managing permissions, using watch mode, and configuring Deno's runtime behavior through command-line flags and options."
oldUrl:
  - /manual/getting_started/command_line_interface
  - /runtime/manual/getting_started/command_line_interface/
  - /runtime/fundamentals/command_line_interface/
  - /runtime/manual/tools/
---

The Deno CLI is an all-in-one toolchain for JavaScript and TypeScript projects:
it runs and tests code, formats and lints, manages dependencies, compiles to
standalone binaries, and a lot more. Each subcommand (`run`, `test`, `fmt`,
`compile`, etc.) has its own flags; run `deno help` or
`deno <subcommand> --help` to see them.

For the complete list of subcommands and flags, see the
[CLI reference](/runtime/reference/cli/). This page covers the patterns you'll
hit early on: how to run code, how to pass arguments, and how to use watch mode.

## Running scripts

You can run a local TypeScript or JavaScript file by specifying its path
relative to the current working directory:

```shell
deno run main.ts
```

Deno supports running scripts directly from URLs. This is particularly useful
for quickly testing or running code without downloading it first:

```shell
deno run https://docs.deno.com/examples/scripts/hello_world.ts
```

You can also run a script by piping it through standard input. This is useful
for integrating with other command-line tools or dynamically generating scripts:

```shell
cat main.ts | deno run -
```

## Passing script arguments

Script arguments are additional parameters you can pass to your script when
running it from the command line. These arguments can be used to customize the
behavior of your program based on the input provided at runtime. Arguments
should be passed **after** the script name.

To test this out we can make a script that will log the arguments passed to it:

```ts title="main.ts"
console.log(Deno.args);
```

When we run that script and pass it some arguments it will log them to the
console:

```shell
$ deno run main.ts arg1 arg2 arg3
[ "arg1", "arg2", "arg3" ]
```

For anything beyond a flat list, parse the arguments with
[`parseArgs` from `jsr:@std/cli`](https://jsr.io/@std/cli/doc/parse-args/~/parseArgs)
or
[`parseArgs` from `node:util`](https://nodejs.org/api/util.html#utilparseargsconfig).

## Argument and flag ordering

:::caution

Anything passed after the script name will be passed as a script argument and
not consumed as a Deno runtime flag. This is a common source of confusion, so
double-check that runtime flags appear **before** the script name.

:::

This leads to the following pitfall:

```shell
# Good. We grant net permission to net_client.ts.
deno run --allow-net net_client.ts

# Bad! --allow-net was passed to Deno.args, throws a net permission error.
deno run net_client.ts --allow-net
```

## Watch mode

You can supply the `--watch` flag to `deno run`, `deno test`, and `deno fmt` to
enable the built-in file watcher. The watcher enables automatic reloading of
your application whenever changes are detected in the source files. This is
particularly useful during development, as it allows you to see the effects of
your changes immediately without manually restarting the application.

The files that are watched will depend on the subcommand used:

- for `deno run` and `deno test` the entrypoint, and all local files that the
  entrypoint statically imports will be watched.
- for `deno fmt` all local files and directories specified as command line
  arguments (or the working directory if no specific files/directories is
  passed) are watched.

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

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

### Hot module replacement

`deno run` also supports the `--watch-hmr` flag, which hot-replaces changed
modules in the running process instead of restarting it. This keeps your
application's state across edits. If hot replacement fails, the process falls
back to a full restart.

```shell
deno run --watch-hmr main.ts
```

#### Editors with atomic save

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

## Where to go next

For deeper coverage of the topics this page only hints at:

- [CLI reference](/runtime/reference/cli/): every subcommand and flag.
- [Security and permissions](/runtime/fundamentals/security/): the `--allow-*`
  and `--deny-*` flags in full.
- [Modules and dependencies](/runtime/fundamentals/modules/): lockfiles,
  imports, and integrity checking.
- [TypeScript](/runtime/fundamentals/typescript/): when Deno type-checks and how
  to control it.
- [Debugging](/runtime/fundamentals/debugging/): the `--inspect` family of flags
  and how to attach a debugger.
