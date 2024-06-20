---
sidebar_position: 4
---

# Command Line Interface

Deno is a command line program. You should be familiar with some simple commands
having followed the examples thus far and already understand the basics of shell
usage.

There are multiple ways of viewing the main help text:

```shell
# Using the subcommand.
deno help

# Using the short flag -- outputs the same as above.
deno -h

# Using the long flag -- outputs more detailed help text where available.
deno --help
```

Deno's CLI is subcommand-based. The above commands should show you a list of
subcommands supported, such as `deno compile`. To see subcommand-specific help,
for example for `compile`, you can similarly run one of:

```shell
deno help compile
deno compile -h
deno compile --help
```

Detailed guides for each subcommand can be found [here](../tools/index.md).

## Script source

Deno can grab the scripts from multiple sources, a filename, a url, and '-' to
read the file from stdin. The latter is useful for integration with other
applications.

```shell
deno run main.ts
deno run https://mydomain.com/main.ts
cat main.ts | deno run -
```

## Script arguments

Separately from the Deno runtime flags, you can pass user-space arguments to the
script you are running by specifying them **after** the script name:

```shell
deno run main.ts a b -c --quiet
```

```ts
// main.ts
console.log(Deno.args); // [ "a", "b", "-c", "--quiet" ]
```

**Note that anything passed after the script name will be passed as a script
argument and not consumed as a Deno runtime flag.** This leads to the following
pitfall:

```shell
# Good. We grant net permission to net_client.ts.
deno run --allow-net net_client.ts

# Bad! --allow-net was passed to Deno.args, throws a net permission error.
deno run net_client.ts --allow-net
```

Some see it as unconventional that:

> a non-positional flag is parsed differently depending on its position.

However:

1. This is the most logical and ergonomic way of distinguishing between runtime
   flags and script arguments.
2. This is, in fact, the same behaviour as that of any other popular runtime.
   - Try `node -c index.js` and `node index.js -c`. The first will only do a
     syntax check on `index.js` as per Node's `-c` flag. The second will
     _execute_ `index.js` with `-c` passed to `require("process").argv`.

---

There exist logical groups of flags that are shared between related subcommands.
We discuss these below.

## Watch mode

You can supply the `--watch` flag to `deno run`, `deno test`, `deno compile`,
and `deno fmt` to enable the built-in file watcher. The files that are watched
depend on the subcommand used:

- for `deno run`, `deno test`, and `deno compile` the entrypoint, and all local
  files the entrypoint(s) statically import(s) will be watched.
- for `deno fmt` all local files and directories specified as command line
  arguments (or the working directory if no specific files/directories is
  passed) are watched.

Whenever one of the watched files is changed on disk, the program will
automatically be restarted / formatted / tested / bundled.

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

## Hot Module Replacement mode

You can use `--unstable-hmr` flag with `deno run` to enable the hot module
replacement mode. Instead of restarting the program, the runtime will try to
update the program in-place. If updating in-place fails, the program will still
be restarted.

```shell
deno run --unstable-hmr main.ts
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

## Integrity flags (lock files)

Affect commands which can download resources to the cache: `deno cache`,
`deno run`, `deno test`, `deno doc`, and `deno compile`.

```terminal
--lock <FILE>    Check the specified lock file
--lock-write     Write lock file. Use with --lock.
```

Find out more about these [here](../basics/modules/integrity_checking.md).

## Cache and compilation flags

Affect commands which can populate the cache: `deno cache`, `deno run`,
`deno test`, `deno doc`, and `deno compile`. As well as the flags above, this
includes those which affect module resolution, compilation configuration etc.

```terminal
--config <FILE>               Load configuration file
--import-map <FILE>           Load import map file
--no-remote                   Do not resolve remote modules
--reload=<CACHE_BLOCKLIST>    Reload source code cache (recompile TypeScript)
--unstable                    Enable unstable APIs
```

## Runtime flags

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

This flag affects `deno run`, `deno eval`, `deno repl` and `deno cache`. The
following table describes the type-checking behavior of various subcommands.
Here "Local" means that only errors from local code will induce type-errors,
modules imported from https URLs (remote) may have type errors that are not
reported. (To turn on type-checking for all modules, use `--check=all`.)

| Subcommand     | Type checking mode |
| -------------- | ------------------ |
| `deno bench`   | 📁 Local           |
| `deno cache`   | ❌ None            |
| `deno check`   | 📁 Local           |
| `deno compile` | 📁 Local           |
| `deno eval`    | ❌ None            |
| `deno repl`    | ❌ None            |
| `deno run`     | ❌ None            |
| `deno test`    | 📁 Local           |

### Permission flags

These are listed [here](../basics/permissions.md#permissions-list).

### Other runtime flags

More flags which affect the execution environment.

```terminal
--cached-only                Require that remote dependencies are already cached
--inspect=<HOST:PORT>        activate inspector on host:port ...
--inspect-brk=<HOST:PORT>    activate inspector on host:port and break at ...
--inspect-wait=<HOST:PORT>   activate inspector on host:port and wait for ...
--location <HREF>            Value of 'globalThis.location' used by some web APIs
--prompt                     Fallback to prompt if required permission wasn't passed
--seed <NUMBER>              Seed Math.random()
--v8-flags=<v8-flags>        Set V8 command line options. For help: ...
```
