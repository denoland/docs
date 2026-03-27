---
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

```bash
deno x --install-alias
```

Then use it directly:

```bash
dx npm:create-vite my-app
```

You can customize the alias name:

```bash
deno x --install-alias=denox
```

## Basic usage

Run an npm package:

```bash
deno x npm:create-vite my-app
```

Run a JSR package:

```bash
deno x jsr:@std/http/file-server
```

## How it works

`deno x` downloads the package to the global cache (if not already cached),
resolves the package's binary entry point, and executes it. The package is not
added to your project's `deno.json` or `package.json`.

## Permissions

The executed package runs with the permissions you specify:

```bash
deno x --allow-read --allow-net npm:serve .
```

Or grant all permissions:

```bash
deno x -A npm:create-vite my-app
```
