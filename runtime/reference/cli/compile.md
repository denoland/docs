---
title: "`deno compile`, standalone executables"
oldUrl:
 - /runtime/manual/tools/compile/
 - /runtime/manual/tools/compiler/
 - /runtime/reference/cli/compiler/
command: compile
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno compile"
description: "Compile your code into a standalone executable"
---

## Flags

As with [`deno install`](/runtime/reference/cli/install/), the runtime flags
used to execute the script must be specified at compilation time. This includes
permission flags.

```sh
deno compile --allow-read --allow-net jsr:@std/http/file-server
```

[Script arguments](/runtime/getting_started/command_line_interface/#passing-script-arguments)
can be partially embedded.

```console
deno compile --allow-read --allow-net jsr:@std/http/file-server -p 8080

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

## Including Data Files or Directories

Starting in Deno 2.1, you can include files or directories in the executable by
specifying them via the `--include <path>` flag.

```shell
deno compile --include names.csv --include data main.ts
```

Then read the file relative to the directory path of the current module via
`import.meta.dirname`:

```ts
// main.ts
const names = Deno.readTextFileSync(import.meta.dirname + "/names.csv");
const dataFiles = Deno.readDirSync(import.meta.dirname + "/data");

// use names and dataFiles here
```

Note this currently only works for files on the file system and not remote
files.

## Workers

Similarly to non-statically analyzable dynamic imports, code for
[workers](../web_platform_apis/#web-workers) is not included in the compiled
executable by default. There are two ways to include workers:

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

- [Web Storage API](/runtime/reference/web_platform_apis/#web-storage)
- [Web Cache](/api/web/~/Cache)
