---
last_modified: 2026-05-17
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

## How it works

`deno x` downloads the package to the global cache (if not already cached),
resolves the package's binary entry point, and executes it. The package is not
added to your project's [`deno.json`](/runtime/fundamentals/configuration/) or
`package.json`.

### JSR executable entry points

JSR packages do not use the `package.json` `bin` field. When you run
`deno x jsr:<package>`, Deno resolves the JSR specifier through the package's
`exports` field in [`deno.json`](/runtime/fundamentals/configuration/) or
`jsr.json`, then runs the resolved module.

To make a JSR package runnable with `deno x`, publish a module that can run as a
script and expose it from `exports`:

```json title="deno.json"
{
  "name": "@scope/tool",
  "version": "1.0.0",
  "exports": {
    ".": "./mod.ts",
    "./cli": "./cli.ts"
  }
}
```

With this configuration, users run the CLI entry point with:

```sh
deno x jsr:@scope/tool/cli
```

If the package is only meant to be used as a command, point the root export at
the CLI module instead, for example `"exports": "./cli.ts"`, so
`deno x jsr:@scope/tool` runs that module.

## Permissions

The executed package runs with the permissions you specify:

```sh
deno x --allow-read --allow-net npm:serve .
```

Or grant all permissions:

```sh
deno x -A npm:create-vite my-app
```
