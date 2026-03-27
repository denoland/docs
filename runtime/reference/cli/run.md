---
title: "deno run"
oldUrl: /runtime/manual/tools/run/
command: run
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno run"
description: "Run a JavaScript or TypeScript program from a file or URL with Deno's runtime"
---

## Usage

Run a local file:

```sh title=">_"
deno run main.ts
```

The `run` subcommand is optional — you can also just use `deno <file>`:

```sh title=">_"
deno main.ts
```

By default, Deno runs programs in a sandbox without access to disk, network or
ability to spawn subprocesses. This is because the Deno runtime is
[secure by default](/runtime/fundamentals/security/). You can grant or deny
required permissions using the
[`--allow-*` and `--deny-*` flags](/runtime/fundamentals/security/#permissions-list).

### Permissions examples

Grant permission to read from disk and listen to network:

```sh title=">_"
deno run --allow-read --allow-net server.ts
```

Grant permission to read allow-listed files from disk:

```sh title=">_"
deno run --allow-read=/etc server.ts
```

Grant all permissions _this is not recommended and should only be used for
testing_:

```sh title=">_"
deno run -A server.ts
```

If your project requires multiple security flags you should consider using a
[`deno task`](/runtime/reference/cli/task/) to execute them.

## Watch

To watch for file changes and restart process automatically use the `--watch`
flag. Deno's built in application watcher will restart your application as soon
as files are changed.

_Be sure to put the flag before the file name_ eg:

```sh title=">_"
deno run --allow-net --watch server.ts
```

Deno's watcher will notify you of changes in the console, and will warn in the
console if there are errors while you work.

## Running a package.json script

`package.json` scripts can be executed with the
[`deno task`](/runtime/reference/cli/task/) command.

## Running code from stdin

You can pipe code from stdin and run it immediately:

```sh title=">_"
echo "console.log('hello')" | deno run -
```

## Terminate run

To stop the run command use `ctrl + c`.
