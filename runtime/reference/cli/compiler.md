---
title: "`deno compile`, standalone executables"
oldUrl: /runtime/manual/tools/compiler/
command: compile
---

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
