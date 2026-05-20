---
last_modified: 2026-04-29
title: "deno pack"
command: pack
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno pack"
description: "Create an npm tarball from a Deno project for publishing to npm"
---

The `deno pack` command builds an npm-compatible tarball from your Deno project.
It transpiles TypeScript to JavaScript, generates `.d.ts` declaration files,
rewrites import specifiers, and synthesizes the `package.json` that npm needs:
so you can publish a Deno-authored library straight to the npm registry.

## Usage

```sh
deno pack
```

`deno pack` reads the package metadata from `deno.json` (the `name`, `version`,
and `exports` you'd normally use to publish to JSR) and emits a gzipped tarball
in the current directory.

Given a `deno.json` like:

```json title="deno.json"
{
  "name": "@scope/my-lib",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

`deno pack` produces `scope-my-lib-1.0.0.tgz` containing:

- A generated `package.json` with `name`, `version`, `type: "module"`,
  conditional `exports` (`types`/`import`/`default`), and a `dependencies` field
  extracted from your `jsr:`/`npm:` imports.
- Transpiled `.js` files (with inline source maps by default).
- Generated `.d.ts` declaration files (produced the same way as
  [`deno publish`](/runtime/reference/cli/publish/)).
- `README` and `LICENSE` files from the project root, if present.

Only files reachable through the module graph from `exports` are included.
Non-JS assets such as data files or WASM are only included if they are imported.

## Specifier rewriting

So the generated package works on Node and other npm consumers, `deno pack`
rewrites imports as it transpiles:

- `jsr:@std/path` → `@jsr/std__path`
- `npm:express@4` → `express`
- `./utils.ts` → `./utils.js`
- `node:fs` → unchanged

The `@jsr/` scope means consumers of the published tarball need the JSR npm
registry configured (for example via `npx jsr add`) to install JSR dependencies.

## Deno API shimming

If `deno pack` detects use of the `Deno.*` global, it adds
[`@deno/shim-deno`](https://www.npmjs.com/package/@deno/shim-deno) as a
dependency and injects the shim so the package can run under Node.js. Pass
`--no-deno-shim` to opt out.

## Publishing to npm

Hand the tarball to `npm publish`:

```sh
deno pack
npm publish ./scope-my-lib-1.0.0.tgz
```

## Examples

Pack the current project:

```sh
deno pack
```

Override the version from `deno.json`:

```sh
deno pack --set-version 2.0.0
```

Write the tarball to a specific path:

```sh
deno pack --output my-package.tgz
```

Preview tarball contents without writing the file:

```sh
deno pack --dry-run
```

Allow packing when [slow types](https://jsr.io/docs/about-slow-types) are
present (skips `.d.ts` generation):

```sh
deno pack --allow-slow-types
```

Don't inject the `@deno/shim-deno` polyfill:

```sh
deno pack --no-deno-shim
```

Pack even though the git working tree has uncommitted changes:

```sh
deno pack --allow-dirty
```

Exclude paths from the tarball:

```sh
deno pack --ignore=tests/
```

## When to use `deno pack` vs `deno publish`

- Use [`deno publish`](/runtime/reference/cli/publish/) when releasing a package
  to [JSR](https://jsr.io).
- Use `deno pack` when you also want to ship the same library to the npm
  registry. For example, to reach Node.js consumers who can't yet use JSR.

`deno pack` is not equivalent to `npm pack`: it is a build step that converts a
Deno/JSR project into an npm-publishable package, closer to
[`deno transpile`](/runtime/reference/cli/transpile/) plus `npm pack` combined.
It does not read an existing `package.json`, does not honor `.npmignore`, and
does not run `prepublishOnly`/`prepare` lifecycle scripts.

Before packing, bump the `version` field with
[`deno bump-version`](/runtime/reference/cli/bump_version/) so the generated
tarball name and `package.json` carry the new version.
