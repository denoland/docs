---
last_modified: 2026-06-02
title: "deno compile"
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

```sh
deno compile --allow-read --allow-net jsr:@std/http/file-server -p 8080

./file_server --help
```

## Framework detection

Starting in Deno 2.8, `deno compile .` (or `deno compile <directory>`) detects
common web frameworks and produces an entrypoint that knows how to start them.
The detected build script is run first, so the compiled binary always contains a
fresh build.

Supported frameworks:

- Next.js
- Astro
- Fresh (1.x and 2.x)
- Remix
- SvelteKit
- Nuxt
- SolidStart
- TanStack Start
- Vite (SSR mode)

```sh
# In a Next.js / Astro / Fresh / etc. project
deno compile .

# Or pointing at a specific app directory
deno compile ./apps/web
```

Generated entrypoints use `import.meta.dirname` so framework asset paths resolve
correctly against the [virtual filesystem](#including-data-files-or-directories)
inside the compiled binary.

If the project doesn't match any supported framework, `deno compile` will error
out.

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

```sh
deno compile --include calc.ts --include better_calc.ts main.ts
```

## Including Data Files or Directories

Starting in Deno 2.1, you can include files or directories in the executable by
specifying them via the `--include <path>` flag.

```sh
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

### Configuring `include` / `exclude` in `deno.json`

The `--include` and `--exclude` paths can be set declaratively in `deno.json` so
you don't have to repeat them on every `deno compile` invocation:

```jsonc title="deno.json"
{
  "compile": {
    "include": ["names.csv", "data", "worker.ts"],
    "exclude": ["data/secrets", "**/*.test.ts"]
  }
}
```

CLI flags are merged with the config: `--include` and `--exclude` add to the
lists in `deno.json` rather than replacing them. See the
[Compile config](/runtime/fundamentals/configuration/#compile-config) section in
the configuration guide for more details, including how to declare `permissions`
on the same block.

## Workers

Similarly to non-statically analyzable dynamic imports, code for
[workers](../web_platform_apis/#web-workers) is not included in the compiled
executable by default. There are two ways to include workers:

1. Use the `--include <path>` flag to include the worker code.

```sh
deno compile --include worker.ts main.ts
```

2. Import worker module using a statically analyzable import.

```ts
// main.ts
import "./worker.ts";
```

```sh
deno compile main.ts
```

## Bundling dependencies

:::caution

`--bundle` is experimental and subject to change. Some dynamic patterns are not
yet supported (see [Limitations](#limitations) below).

:::

By default, `deno compile` embeds the entire resolved `node_modules` tree in the
executable. For projects with many npm dependencies this can make binaries large
and slow to start. The `--bundle` flag instead runs your entrypoint through the
bundler before embedding, so only the code your program actually reaches ends up
in the binary.

```sh
deno compile --bundle main.ts
```

For a pure-ESM dependency tree, tree-shaking removes everything unused and the
npm payload is dropped entirely, producing a much smaller binary. When a
CommonJS package or a native addon (`.node`) is reached, the relevant packages
are embedded so they keep working at runtime, but unreached packages are still
left out.

`--bundle` understands several real-world patterns automatically:

- **CommonJS and native addons** — CJS dependencies and `.node` native addons
  are detected and the packages that provide them are embedded.
- **Workers** — `new Worker(new URL("./worker.ts", import.meta.url), ...)` calls
  are discovered, each worker is bundled separately and embedded alongside the
  main bundle.
- **`package.json` reads** — packages that read their own `package.json` at
  runtime (for example to report a version) have it included automatically.

### Minifying the bundle

Combine `--bundle` with `--minify` to minify the bundled output. This reduces
both the embedded bundle size and runtime memory use, at the cost of less
readable stack traces.

```sh
deno compile --bundle --minify main.ts
```

`--minify` is only meaningful together with `--bundle`.

### Limitations

Because bundling relies on statically analyzing your code, patterns that can't
be traced are dropped from the binary:

- Dynamic `require()` / `import()` of specifiers that aren't string literals.
- Workers spawned with computed URLs, or spawned from transitive dependencies
  rather than your own source.

If your program relies on these, either keep them statically analyzable, add the
needed files with [`--include`](#including-data-files-or-directories), or
compile without `--bundle`.

## Self-Extracting Executables

By default, compiled executables serve embedded files from an in-memory virtual
file system. The `--self-extracting` flag changes this behavior so that the
binary extracts all embedded files to disk on first run and uses real file
system operations at runtime.

```sh
deno compile --self-extracting main.ts
```

This is useful for scenarios where code needs real files on disk, such as native
addons or native code that reads relative files.

The extraction directory is chosen in order of preference:

1. `<exe_dir>/.<exe_name>/<hash>/` (next to the compiled binary)
2. Platform data directory fallback:
   - Linux: `$XDG_DATA_HOME/<exe_name>/<hash>` or
     `~/.local/share/<exe_name>/<hash>`
   - macOS: `~/Library/Application Support/<exe_name>/<hash>`
   - Windows: `%LOCALAPPDATA%\<exe_name>\<hash>`

Files are only extracted once — subsequent runs reuse the extracted directory if
it already exists and the hash matches.

### Trade-offs

Self-extracting mode enables broader compatibility, but comes with some
trade-offs:

- **Initial startup cost**: The first run takes longer due to file extraction.
- **Disk usage**: Extracted files take up additional space on disk.
- **Memory usage**: Higher memory usage since embedded content can no longer be
  referenced as static data.
- **Tamper risk**: Users or other code can modify the extracted files on disk.

## Code Signing

### macOS

By default, on macOS, the compiled executable will be signed using an ad-hoc
signature which is the equivalent of running `codesign -s -`:

```sh
deno compile -o main main.ts
codesign --verify -vv ./main

./main: valid on disk
./main: satisfies its Designated Requirement
```

You can specify a signing identity when code signing the executable just like
you would do with any other macOS executable:

```sh
codesign -s "Developer ID Application: Your Name" ./main
```

Refer to the
[official documentation](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution)
for more information on codesigning and notarization on macOS.

### Windows

On Windows, the compiled executable can be signed using the `SignTool.exe`
utility.

```sh
deno compile -o main.exe main.ts
signtool sign /fd SHA256 main.exe
```

## Unavailable in executables

- [Web Storage API](/runtime/reference/web_platform_apis/#web-storage)
- [Web Cache](/api/web/~/Cache)
