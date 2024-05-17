# `deno run`, run a file

`deno run [OPTIONS] [SCRIPT_ARG]` run a JavaScript or TypeScript file.

## Usage

To run the file at
[https://examples.deno.land/hello-world.ts](https://examples.deno.land/hello-world.ts)
use:

```console
deno run https://examples.deno.land/hello-world.ts
```

You can also run files locally. Ensure that you are in the correct directory and
use:

```console
deno run hello-world.ts
```

By default, Deno runs programs in a sandbox without access to disk, network or
ability to spawn subprocesses. This is because the Deno runtime is
[secure by default](/runtime/manual/runtime/permission_apis). You can grant or
deny required permissions using the
[`--allow-*` and `--deny-*` flags](/runtime/manual/basics/permissions).

### Permissions examples

Grant permission to read from disk and listen to network:

```console
deno run --allow-read --allow-net server.ts
```

Grant permission to read allow-listed files from disk:

```console
deno run --allow-read=/etc server.ts
```

Grant all permissions _this is not recommended and should only be used for
testing_:

```console
deno run -A server.ts
```

If your project requires multiple security flags you should consider using a
[`deno task`](./task_runner) to execute them.

## Watch

To watch for file changes and restart process automatically use the `--watch`
flag. Deno's built in application watcher will restart your application as soon
as files are changed.

_Be sure to put the flag before the file name_ eg:

```console
deno run --allow-net --watch server.ts
```

Deno's watcher will notify you of changes in the console, and will warn in the
console if there are errors while you work.

## Running a package.json script

`package.json` scripts can be executed with the [`deno task`](./task_runner)
command.

## Running code from stdin

You can pipe code from stdin and run it immediately with:

```console
curl https://examples.deno.land/hello-world.ts | deno run -
```

## Terminate run

To stop the run command use `ctrl + c`.
