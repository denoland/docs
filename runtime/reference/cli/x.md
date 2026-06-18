---
last_modified: 2026-06-18
title: "deno x"
command: x
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno x"
description: "Execute npm or JSR packages with Deno."
---

`deno x` executes a package from npm or JSR without installing it permanently.
It is similar to `npx` in the npm ecosystem.

## Installing the `dx` alias

For convenience, you can install `deno x` as a standalone `dx` binary that runs
with all permissions by default:

```sh
deno x --install-alias
```

Then use it directly:

```sh
dx npm:create-vite my-app
```

You can customize the alias name:

```sh
deno x --install-alias=denox
```

## Basic usage

Run an npm package:

```sh
deno x npm:create-vite my-app
```

Run a JSR package:

```sh
deno x jsr:@std/http/file-server
```

## Specifying the package separately from the binary

Some npm packages expose multiple binaries — `typescript` ships both `tsc` and
`tsserver`, for example. Starting in Deno 2.8, `--package` (`-p`) lets you
choose the package and the binary independently, matching the
`npx -p <package> <binary>` convention:

```sh
# Run `tsc` from the typescript package
deno x -p typescript tsc

# Pin the package version
deno x -p typescript@5 tsc
```

The previous form `deno x typescript/tsc` still works.

## How it works

`deno x` downloads the package to the global cache (if not already cached),
resolves the package's binary entry point, and executes it. The package is not
added to your project's [`deno.json`](/runtime/fundamentals/configuration/) or
`package.json`.

## Authoring a package that runs with `deno x`

How `deno x` finds something to execute depends on the registry:

- **npm packages** expose runnable binaries through the `bin` field in
  `package.json`. `deno x npm:<package>` runs the package's default binary, and
  `deno x -p <package> <binary>` (or `deno x npm:<package>/<binary>`) selects a
  specific one when the package ships several. To make your own npm package
  runnable, publish it with a `bin` entry as you would for `npx`.
- **JSR packages** are run by pointing `deno x` at an export that executes when
  imported, for example `deno x jsr:@std/http/file-server`. To make your own JSR
  package runnable, expose the entry point as a module export (guard top-level
  side effects with `import.meta.main` so the module can still be imported as a
  library), then document the subpath users should run, such as
  `deno x jsr:@you/tool/cli`.

If you want the tool available as a permanent command rather than run on demand,
install it with [`deno install`](/runtime/reference/cli/install/) or compile it
to a standalone executable. See [Build CLI apps](/runtime/cli_apps/) for the
full workflow, and [Publishing modules](/runtime/packages/publishing/) for
publishing to JSR.

## Permissions

The executed package runs with the permissions you specify:

```sh
deno x --allow-read --allow-net npm:serve .
```

Or grant all permissions:

```sh
deno x -A npm:create-vite my-app
```
