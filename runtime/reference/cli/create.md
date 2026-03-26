---
title: "deno create"
command: create
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno create"
description: "Scaffold a new project from a template package"
---

The `deno create` command scaffolds a new project from a template package. It
works with both [JSR](https://jsr.io/) and [npm](https://www.npmjs.com/)
packages that provide project templates.

## Usage

```sh
deno create [OPTIONS] [PACKAGE] [-- [ARGS]...]
```

By default, unprefixed package names are resolved from JSR. You can use the
`npm:` or `jsr:` prefix to be explicit, or use the `--npm` / `--jsr` flags.

## How it works

Package resolution differs between npm and JSR:

- **npm packages** use the `create-` naming convention. Running
  `deno create npm:vite` resolves to the `create-vite` package on npm and
  executes its main entry point.
- **JSR packages** use the `./create` export. Any JSR package can act as a
  template by defining a `./create` entry point in its `deno.json`:

```json title="deno.json"
{
  "name": "@my-scope/my-template",
  "version": "1.0.0",
  "exports": {
    ".": "./mod.ts",
    "./create": "./create.ts"
  }
}
```

When you run `deno create @my-scope/my-template`, Deno looks for the `./create`
export and runs it as the scaffolding script.

## Examples

Create a project from a JSR package:

```sh
deno create @fresh/init
```

Create a project from an npm package:

```sh
deno create npm:vite my-app
```

Using the `--npm` flag to treat unprefixed names as npm packages:

```sh
deno create --npm create-vite my-app
```

Pass arguments to the template package:

```sh
deno create @fresh/init -- --force
```

## Flags

- `--npm` - Treat unprefixed package names as npm packages
- `--jsr` - Treat unprefixed package names as JSR packages (default)
- `-y, --yes` - Bypass the prompt and run with full permissions
