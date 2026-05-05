---
last_modified: 2026-04-29
title: "deno pack"
command: pack
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno pack"
description: "Create an npm tarball from a Deno project for publishing to npm"
---

The `deno pack` command builds an npm-compatible tarball from your Deno
project. It transpiles TypeScript to JavaScript, rewrites import specifiers,
and generates the `package.json` fields that npm needs — so you can publish a
Deno-authored library straight to the npm registry.

## Usage

```sh
deno pack
```

`deno pack` reads the package metadata from `deno.json` (the `name`,
`version`, `exports`, etc. you'd normally use to publish to JSR) and emits a
gzipped tarball in the current directory.

## Publishing to npm

Once `deno pack` produces a tarball, hand it to `npm publish`:

```sh
deno pack
npm publish ./my-package-1.0.0.tgz
```

`deno pack` shares its transpilation, specifier-rewriting, and type-extraction
pipeline with `deno publish`, so a project that publishes cleanly to JSR will
also pack cleanly for npm.

## When to use `deno pack` vs `deno publish`

- Use [`deno publish`](/runtime/reference/cli/publish/) when releasing a
  package to [JSR](https://jsr.io).
- Use `deno pack` when you also want to ship the same library to the npm
  registry — for example, to reach Node.js consumers who can't yet use JSR.
