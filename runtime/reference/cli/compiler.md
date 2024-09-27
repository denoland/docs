---
title: "`deno compile`, standalone executables"
oldUrl: /runtime/manual/tools/compiler/
---

`deno compile` allows you to create self-contained executables from a TypeScript
or JavaScript file.

This feature allows distribution of a Deno application to systems that do not
have Deno installed. Under the hood, `deno compile` bundles a slimmed down
version of the Deno runtime along with your JavaScript or TypeScript code.

```sh
deno compile https://docs.deno.com/examples/welcome.ts
```

```sh
deno compile --output ./game game.tsx
```

If you omit the `--output` flag, the name of the executable file will be
inferred from the script name.

## Flags

As with [`deno install`](./script_installer.md), the runtime flags used to
execute the script must be specified at compilation time. This includes
permission flags.

```sh
deno compile --allow-read --allow-net jsr:@std/http@1.0.0/file-server
```

[Script arguments](../getting_started/command_line_interface.md#script-arguments)
can be partially embedded.

```console
deno compile --allow-read --allow-net jsr:@std/http@1.0.0/file-server -p 8080

./file_server --help
```

## Cross Compilation

You can cross-compile binaries for other platforms by using the `--target` flag.

```
# Cross compile for Apple Silicon
deno compile --target aarch64-apple-darwin main.ts

# Cross compile for Windows with an icon
deno compile --target x86_64-pc-windows-msvc --icon ./icon.ico main.ts
```

### Supported Targets

Deno supports cross compiling to all targets regardless of the host platform.

| OS      | Architecture | Target                      |
| ------- | ------------ | --------------------------- |
| Windows | x86_64       | `x86_64-pc-windows-msvc`    |
| macOS   | x86_64       | `x86_64-apple-darwin`       |
| macOS   | ARM64        | `aarch64-apple-darwin`      |
| Linux   | x86_64       | `x86_64-unknown-linux-gnu`  |
| Linux   | ARM64        | `aarch64-unknown-linux-gnu` |

## Icons

It is possible to add an icon to the executable by using the `--icon` flag when
targeting Windows. The icon must be in the `.ico` format.

```
deno compile --icon icon.ico main.ts

# Cross compilation with icon
deno compile --target x86_64-pc-windows-msvc --icon ./icon.ico main.ts
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
default. There are two ways to include workers:

1. Use the `--include <path>` flag to include the worker code.

```shell
deno compile --include worker.ts main.ts
```

2. Import worker module using a statically analyzable import.

```ts
// main.ts
import "./worker.ts";
```

```shell
deno compile main.ts
```

## Code Signing

### macOS

By default, on macOS, the compiled executable will be signed using an ad-hoc
signature which is the equivalent of running `codesign -s -`:

```shell
$ deno compile -o main main.ts
$ codesign --verify -vv ./main

./main: valid on disk
./main: satisfies its Designated Requirement
```

You can specify a signing identity when code signing the executable just like
you would do with any other macOS executable:

```shell
codesign -s "Developer ID Application: Your Name" ./main
```

Refer to the
[official documentation](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution)
for more information on codesigning and notarization on macOS.

### Windows

On Windows, the compiled executable can be signed using the `SignTool.exe`
utility.

```shell
$ deno compile -o main.exe main.ts
$ signtool sign /fd SHA256 main.exe
```

## Unavailable in executables

- [Web Storage API](../runtime/web_storage_api.md)
