---
last_modified: 2026-03-09
title: "Config files"
description: "How Deno projects are configured: the deno.json file, .jsonc support and discovery, how package.json is used for Node compatibility, and an overview of what you can configure. See the deno.json reference for every field."
oldUrl:
  - /runtime/manual/getting_started/configuration_file/
---

You can configure Deno using a `deno.json` file. It is where you define tasks,
manage dependencies, and adjust the TypeScript compiler, linter, formatter, and
other Deno tools.

A configuration file is optional. Deno runs a single script with no `deno.json`
at all; you add one when you want to script common commands, pin dependencies,
or change a tool's defaults. A minimal file looks like this:

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

The configuration file supports `.json` and
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
extensions, so with `deno.jsonc` you can add comments and trailing commas.

Deno automatically detects a `deno.json` or `deno.jsonc` file in your current
working directory or any parent directory, which is what makes a project's
settings apply to every file under it. Use the `--config` flag to point at a
different file.

In a monorepo, a root `deno.json` can define a
[workspace](/runtime/fundamentals/workspaces/) whose members each carry their
own `deno.json`.

## Using deno.json and package.json together

Deno has first-class `package.json` support, so it works with `deno.json`,
`package.json`, or both together. Most Node.js projects run in Deno with no
changes: point Deno at an existing project and it resolves the same npm
dependencies from `package.json` and runs the project's `scripts` with
[`deno task`](/runtime/reference/cli/task/). You do not need to add a
`deno.json` to run a Node project at all.

A `package.json` does not, however, configure Deno itself. Deno-specific
settings such as the linter, formatter, TypeScript compiler options, tasks, and
lockfile behavior are read only from `deno.json`. When both files are present,
Deno reads dependencies from each and uses `deno.json` for its own
configuration.

This dual support is what lets you adopt Deno incrementally. You can keep
running an app on Node while using Deno as a faster drop-in package manager, run
your existing `package.json` scripts with `deno task`, and add a `deno.json` to
pick up Deno's built-in toolchain when you are ready. The
[Migrate from Node.js](/runtime/migrate/) guide walks through each step, and
[Node compatibility in Deno](/runtime/fundamentals/node/) covers how the runtime
maps Node's APIs and module resolution.

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

See the reference for a
[full example deno.json file](/runtime/reference/deno_json/#an-example-deno.json-file)
and the [JSON schema](/runtime/reference/deno_json/#json-schema) for editor
autocompletion.
