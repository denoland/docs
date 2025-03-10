---
title: Command line interface
description: "A comprehensive guide to using Deno's command-line interface (CLI). Learn about running scripts, managing permissions, using watch mode, and configuring Deno's runtime behavior through command-line flags and options."
oldUrl:
 - /manual/getting_started/command_line_interface
 - /runtime/manual/getting_started/command_line_interface/
 - /runtime/fundamentals/command_line_interface/
 - /runtime/manual/tools/
---

Deno is a command line program. The Deno command line interface (CLI) can be
used to run scripts, manage dependencies, and even compile your code into
standalone executables. You may be familiar with some simple commands having
followed the examples thus far. This page will provide a more detailed overview
of the Deno CLI.

The Deno CLI has a number of subcommands (like `run`, `init` and `test`, etc.).
They are used to perform different tasks within the Deno runtime environment.
Each subcommand has its own set of flags and options (eg --version) that can be
used to customize its behavior.

You can view all of the available commands and flags by running the `deno help`
subcommand in your terminal, or using the `-h` or `--help` flags.

Check out the [CLI reference guide](/runtime/reference/cli/) for a further
documentation on all the subcommands and flags available. We'll take a look at a
few commands in a bit more detail below to see how they can be used and
configured.

## An example subcommand - `deno run`

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

## Argument and flag ordering

_Note that anything passed after the script name will be passed as a script
argument and not consumed as a Deno runtime flag._ This leads to the following
pitfall:

```shell
# Good. We grant net permission to net_client.ts.
deno run --allow-net net_client.ts

# Bad! --allow-net was passed to Deno.args, throws a net permission error.
deno run net_client.ts --allow-net
```

## Common flags

Some flags can be used with multiple related subcommands. We discuss these
below.

### Watch mode

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

### Hot Module Replacement mode

You can use `--watch-hmr` flag with `deno run` to enable the hot module
replacement mode. Instead of restarting the program, the runtime will try to
update the program in-place. If updating in-place fails, the program will still
be restarted.

```sh
deno run --watch-hmr main.ts
```

When a hot module replacement is triggered, the runtime will dispatch a
`CustomEvent` of type `hmr` that will include `path` property in its `detail`
object. You can listen for this event and perform any additional logic that you
need to do when a module is updated (eg. notify a browser over a WebSocket
connection).

```ts
addEventListener("hmr", (e) => {
  console.log("HMR triggered", e.detail.path);
});
```

### Integrity flags (lock files)

Affect commands which can download resources to the cache: `deno install`,
`deno run`, `deno test`, `deno doc`, and `deno compile`.

```sh
--lock <FILE>    Check the specified lock file
--frozen[=<BOOLEAN>] Error out if lockfile is out of date
```

Find out more about these
[here](/runtime/fundamentals/modules/#integrity-checking-and-lock-files).

### Cache and compilation flags

Affect commands which can populate the cache: `deno install`, `deno run`,
`deno test`, `deno doc`, and `deno compile`. As well as the flags above, this
includes those which affect module resolution, compilation configuration etc.

```sh
--config <FILE>               Load configuration file
--import-map <FILE>           Load import map file
--no-remote                   Do not resolve remote modules
--reload=<CACHE_BLOCKLIST>    Reload source code cache (recompile TypeScript)
--unstable                    Enable unstable APIs
```

### Runtime flags

Affect commands which execute user code: `deno run` and `deno test`. These
include all of the above as well as the following.

### Type checking flags

You can type-check your code (without executing it) using the command:

```shell
> deno check main.ts
```

You can also type-check your code before execution by using the `--check`
argument to deno run:

```shell
> deno run --check main.ts
```

This flag affects `deno run` and `deno eval`. The following table describes the
type-checking behavior of various subcommands. Here "Local" means that only
errors from local code will induce type-errors, modules imported from https URLs
(remote) may have type errors that are not reported. (To turn on type-checking
for all modules, use `--check=all`.)

| Subcommand     | Type checking mode |
| -------------- | ------------------ |
| `deno bench`   | 📁 Local           |
| `deno check`   | 📁 Local           |
| `deno compile` | 📁 Local           |
| `deno eval`    | ❌ None            |
| `deno repl`    | ❌ None            |
| `deno run`     | ❌ None            |
| `deno test`    | 📁 Local           |

### Permission flags

These are listed [here](/runtime/fundamentals/security/).

### Other runtime flags

More flags which affect the execution environment.

```sh
--cached-only                Require that remote dependencies are already cached
--inspect=<HOST:PORT>        activate inspector on host:port ...
--inspect-brk=<HOST:PORT>    activate inspector on host:port and break at ...
--inspect-wait=<HOST:PORT>   activate inspector on host:port and wait for ...
--location <HREF>            Value of 'globalThis.location' used by some web APIs
--prompt                     Fallback to prompt if required permission wasn't passed
--seed <NUMBER>              Seed Math.random()
--v8-flags=<v8-flags>        Set V8 command line options. For help: ...
```
