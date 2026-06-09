---
last_modified: 2026-03-09
title: "Configuration"
description: "How Deno projects are configured with deno.json and package.json: file discovery, jsonc support, and an overview of what you can configure. See the deno.json reference for every field."
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

Deno also supports a `package.json` file for compatibility with Node.js
projects. If you have a Node.js project, it is not necessary to create a
`deno.json` file. Deno will use the `package.json` file to configure the
project.

If both a `deno.json` and `package.json` file are present in the same directory,
Deno will understand dependencies specified in both `deno.json` and
`package.json`; and use the `deno.json` file for Deno-specific configurations.
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
