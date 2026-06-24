---
last_modified: 2026-06-17
title: "Config files"
description: "How Deno projects are configured: first-class package.json support, the deno.json file for Deno's own tooling, .jsonc support and discovery, and an overview of what you can configure. See the deno.json reference for every field."
oldUrl:
  - /runtime/manual/getting_started/configuration_file/
---

Deno reads two configuration files: Node's `package.json` and its own
`deno.json`. Both are first-class and both are optional, so Deno works with
either one or both together. The rule of thumb:

- Use a **`package.json`** for dependencies and scripts. Deno reads it directly,
  so most Node.js projects run with no changes and you do not need a `deno.json`
  at all.
- Add a **`deno.json`** when you want to configure Deno's own tooling, such as
  the formatter, linter, TypeScript compiler, or tasks.

## package.json

Deno has first-class `package.json` support. Point Deno at an existing Node.js
project and it resolves the same npm dependencies from `package.json` and runs
the project's `scripts` with [`deno task`](/runtime/reference/cli/task/), with
no `deno.json` and no conversion step:

```sh
deno install        # install the dependencies from package.json
deno task <script>  # run a script defined in package.json
```

A `package.json` configures your project's dependencies and scripts, but it does
not configure Deno itself. Deno-specific settings such as the formatter, linter,
TypeScript compiler options, and lockfile behavior live only in `deno.json`.
When both files are present, Deno reads dependencies from each and takes its own
configuration from `deno.json`.

This is what lets you adopt Deno incrementally: keep running an app on Node
while using Deno as a faster drop-in package manager, run your existing scripts
with `deno task`, and add a `deno.json` for Deno's toolchain when you are ready.
The [Migrate from Node.js](/runtime/migrate/) guide walks through each step, and
[Node compatibility in Deno](/runtime/fundamentals/node/) covers how the runtime
maps Node's APIs and module resolution.

## deno.json

`deno.json` is where you configure Deno itself: tasks, dependencies, and tools
like the TypeScript compiler, linter, and formatter. It is optional; a minimal
file looks like this:

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@^1"
  },
  "fmt": {
    "lineWidth": 100
  }
}
```

It supports `.json` and
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
extensions, so with `deno.jsonc` you can add comments and trailing commas.

Deno automatically detects a `deno.json` or `deno.jsonc` file in your current
working directory or any parent directory, which is what makes a project's
settings apply to every file under it. Use the `--config` flag to point at a
different file. In a monorepo, a root `deno.json` can define a
[workspace](/runtime/fundamentals/workspaces/) whose members each carry their
own `deno.json`.

## What you can configure

A `deno.json` file configures Deno's tooling and your project. Every field is
documented in the
[Configuration file (deno.json) reference](/runtime/reference/deno_json/),
including:

- [Dependencies and import maps](/runtime/reference/deno_json/#dependencies)
- [Tasks](/runtime/reference/deno_json/#tasks)
- [Linting](/runtime/reference/deno_json/#linting) and
  [formatting](/runtime/reference/deno_json/#formatting)
- [Lockfile](/runtime/reference/deno_json/#lockfile) and the
  [node_modules directory](/runtime/reference/deno_json/#node-modules-directory)
- [TypeScript compiler options](/runtime/reference/deno_json/#typescript-compiler-options)
- [Unstable feature flags](/runtime/reference/deno_json/#unstable-features)
- [`include` and `exclude`](/runtime/reference/deno_json/#include-and-exclude)
- [Exports](/runtime/reference/deno_json/#exports)
- [Permissions](/runtime/reference/deno_json/#permissions)
- [Compile options](/runtime/reference/deno_json/#compile-config)
- [Minimum dependency age](/runtime/reference/deno_json/#minimum-dependency-age)

See the reference for a
[full example deno.json file](/runtime/reference/deno_json/#an-example-deno.json-file)
and the [JSON schema](/runtime/reference/deno_json/#json-schema) for editor
autocompletion.
