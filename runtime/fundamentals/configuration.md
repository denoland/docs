---
last_modified: 2026-03-09
title: "Config files"
description: "How Deno projects are configured: the deno.json file, .jsonc support and discovery, how package.json is used for Node compatibility, and an overview of what you can configure. See the deno.json reference for every field."
oldUrl:
  - /runtime/manual/getting_started/configuration_file/
---

You can configure Deno using a `deno.json` file. This file can be used to
configure the TypeScript compiler, linter, formatter, and other Deno tools.

The configuration file supports `.json` and
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
extensions.

Deno will automatically detect a `deno.json` or `deno.jsonc` configuration file
if it's in your current working directory or parent directories. The `--config`
flag can be used to specify a different configuration file.

## package.json support

For compatibility with Node.js projects, Deno also reads an existing
`package.json`. You don't need to add a `deno.json` to run a Node project: Deno
resolves the project's dependencies from `package.json`, and you can run its
`scripts` with [`deno task`](/runtime/reference/cli/task/).

A `package.json` is not, however, a way to configure Deno itself. Deno-specific
settings such as the linter, formatter, TypeScript compiler options, and
lockfile are read only from `deno.json`. When both files are present, Deno reads
dependencies from each and uses `deno.json` for its own configuration.

Read more about
[Node compatibility in Deno](/runtime/fundamentals/node/#node-compatibility).

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
