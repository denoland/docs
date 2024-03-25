# `deno compile`, standalone executables

`deno compile [--output <OUT>] <SRC>` will compile the script into a
self-contained executable.

```console
> deno compile https://docs.deno.com/examples/welcome.ts
```

If you omit the `OUT` parameter, the name of the executable file will be
inferred.

## Flags

As with [`deno install`](./script_installer.md), the runtime flags used to
execute the script must be specified at compilation time. This includes
permission flags.

```console
> deno compile --allow-read --allow-net jsr:@std/http@^0/file_server
```

[Script arguments](../getting_started/command_line_interface.md#script-arguments)
can be partially embedded.

```console
> deno compile --allow-read --allow-net jsr:@std/http@^0/file_server -p 8080
> ./file_server --help
```

## Dynamic Imports

By default, statically analyzable dynamic imports (imports that have the string
literal within the `import("...")` call expression) will be included in the
output.

```ts
// calculator.ts and its dependencies will be included in the binary
const calculator = await import("./calculator.ts");
```

But non-statically analyzable dynamic imports won't:

```ts
const specifier = condition ? "./calc.ts" : "./better_calc.ts";
const calculator = await import(specifier);
```

To include non-statically analyzable dynamic imports, specify an
`--include <path>` flag.

```shell
deno compile --include calc.ts --include better_calc.ts main.ts
```

## Workers

Similarly to non-statically analyzable dynamic imports, code for
[workers](../runtime/workers.md) is not included in the compiled executable by
default. You must use the `--include <path>` flag to include the worker code.

```shell
deno compile --include worker.ts main.ts
```

## Cross Compilation

You can compile binaries for other platforms by adding the `--target` CLI flag.
Deno currently supports compiling to Windows x64, macOS x64, macOS ARM and Linux
x64. Use `deno compile --help` to list the full values for each compilation
target.

## Unavailable in executables

- [Web Storage API](../runtime/web_storage_api.md)
