---
last_modified: 2026-05-20
title: "deno pack"
command: pack
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno pack"
description: "Create an npm tarball from a Deno project for publishing to npm"
---

The `deno pack` command builds an npm-compatible tarball (`.tgz`) from a Deno
project, so you can publish a Deno-authored library straight to the npm
registry. It transpiles TypeScript to JavaScript, generates `.d.ts` declaration
files, rewrites import specifiers, and synthesizes a `package.json` that
npm-only consumers can understand.

`deno pack` is **not** equivalent to `npm pack`. It's a build step that converts
a Deno/JSR project into an npm-publishable package — closer to
[`deno transpile`](/runtime/reference/cli/transpile/) plus `npm pack` combined.
It does not read an existing `package.json`, does not honor `.npmignore`, and
does not run `prepublishOnly` / `prepare` lifecycle scripts.

## Quick start

```sh
deno pack
```

`deno pack` reads the package metadata from `deno.json` (the `name`, `version`,
and `exports` you'd use to publish to JSR) and writes a gzipped tarball to the
current directory.

Given a `deno.json` like:

```json title="deno.json"
{
  "name": "@scope/my-lib",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

`deno pack` produces `scope-my-lib-1.0.0.tgz` (the `@` is stripped and `/`
becomes `-`, matching `npm pack`'s naming convention).

## What's in the tarball

| Contents                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A generated `package.json` with `name`, `version`, `type: "module"`, conditional `exports` (`types` / `import` / `default`), and a `dependencies` field derived from your `jsr:` / `npm:` imports. |
| Transpiled `.js` files (with inline source maps by default; pass `--no-source-maps` to omit).                                                                                                      |
| Generated `.d.ts` declaration files (produced via the same fast-check pipeline as [`deno publish`](/runtime/reference/cli/publish/)).                                                              |
| `README` and `LICENSE` files from the project root, if present.                                                                                                                                    |

Only files reachable through the module graph from `exports` are included.
Non-JS assets such as data files or WASM are only included if they're imported
from JS/TS. If you need to ship arbitrary files, list them as positional
arguments:

```sh
deno pack assets/icon.svg locales/*.json
```

## Specifier rewriting

For the generated package to work on Node and other npm consumers, `deno pack`
rewrites imports as it transpiles:

| In your source  | In the tarball   | Notes                                                |
| --------------- | ---------------- | ---------------------------------------------------- |
| `jsr:@std/path` | `@jsr/std__path` | Consumers need the JSR npm registry configured.      |
| `npm:express@4` | `express`        | Version moves into `dependencies` in `package.json`. |
| `./utils.ts`    | `./utils.js`     | Extension only — no path restructuring.              |
| `node:fs`       | `node:fs`        | Unchanged.                                           |

Because JSR imports turn into `@jsr/...` specifiers, anyone installing the
published tarball needs the JSR npm registry configured. The simplest way is to
run [`npx jsr add`](https://jsr.io/docs/npm-compatibility) once in the consumer
project; that sets up the `.npmrc` entries for the `@jsr` scope.

## Deno API shimming

If your code uses the `Deno.*` global, `deno pack` adds
[`@deno/shim-deno`](https://www.npmjs.com/package/@deno/shim-deno) as a runtime
dependency and injects the shim so the package can run under Node.js. The shim
covers the subset of `Deno.*` that maps cleanly onto Node APIs — review the
shim's docs to see what's polyfilled.

Pass `--no-deno-shim` to opt out, e.g. if you've already provided your own
abstraction or only intend the package to run under Deno-on-npm.

## Publishing to npm

```sh
deno pack
npm publish ./scope-my-lib-1.0.0.tgz
```

A typical release flow:

```sh
# 1. Bump the version
deno bump-version patch

# 2. Build the tarball
deno pack

# 3. Verify the contents (extracted view)
tar -tzf scope-my-lib-1.0.0.tgz

# 4. Push to npm
npm publish ./scope-my-lib-1.0.0.tgz
```

For JSR releases, use [`deno publish`](/runtime/reference/cli/publish/) instead
— `deno pack` is specifically for the npm registry.

## Workspace support

In a [workspace](/runtime/fundamentals/workspaces/), `deno pack` runs against
the current working directory's member. To pack a specific member from the root:

```sh
cd packages/my-lib
deno pack
```

Cross-workspace `npm:` / `jsr:` dependencies are rewritten in the generated
`package.json` to point at their published versions, not to other workspace
members — make sure those dependencies have been released independently before
publishing your tarball.

## Examples

### Override the version

Useful when releasing a one-off prerelease without editing `deno.json`:

```sh
deno pack --set-version 2.0.0-rc.1
```

### Pick the output path

```sh
deno pack --output dist/my-package.tgz
```

### Preview without writing

```sh
deno pack --dry-run
```

`--dry-run` prints what _would_ be in the tarball without producing one — handy
in CI to verify file inclusion rules.

### Allow slow types

[Slow types](https://jsr.io/docs/about-slow-types) prevent `.d.ts` generation.
Pass `--allow-slow-types` to pack anyway; the tarball will not include
declaration files.

```sh
deno pack --allow-slow-types
```

### Skip the Deno shim

```sh
deno pack --no-deno-shim
```

### Pack despite a dirty working tree

```sh
deno pack --allow-dirty
```

By default `deno pack` refuses to pack when the git working tree has uncommitted
changes, to make releases reproducible from the commit hash.

### Exclude files

```sh
deno pack --ignore=tests/ --ignore='**/*.test.ts'
```

`--ignore` accepts glob patterns. Combine multiple `--ignore` flags to add
patterns.

### Omit source maps

```sh
deno pack --no-source-maps
```

By default, source maps are inlined in the emitted `.js` files. Use
`--no-source-maps` to strip them — smaller tarballs, but harder to debug
upstream.

## Limitations

- **No `bin` entries.** `deno pack` does not synthesize the `package.json` `bin`
  field. Library publishing is supported; CLI tools that need a `node`-shebanged
  executable still need a hand-rolled npm package.
- **No native addons.** Packages that link against native code or ship a
  `node-gyp` build step are out of scope.
- **No `.npmignore`.** Use `--ignore` for excludes; `.gitignore` is honored for
  what's considered part of the project.
- **No lifecycle scripts.** `prepublishOnly` / `prepare` / `postinstall` hooks
  from a hand-written `package.json` are not run because the `package.json` is
  generated, not read.

## When to use `deno pack` vs `deno publish`

| Need                                                | Use                                               |
| --------------------------------------------------- | ------------------------------------------------- |
| Release to [JSR](https://jsr.io)                    | [`deno publish`](/runtime/reference/cli/publish/) |
| Release the same library to npm                     | `deno pack` → `npm publish ./*.tgz`               |
| Reach Node-only consumers without forcing JSR setup | `deno pack` (rewrites JSR imports for them)       |

A library can ship to both — release to JSR with `deno publish`, then build and
push a tarball to npm with `deno pack` for users who haven't adopted JSR yet.

## See also

- [`deno publish`](/runtime/reference/cli/publish/) — release to JSR
- [`deno transpile`](/runtime/reference/cli/transpile/) — the emit step that
  `deno pack` uses internally
- [`deno bump-version`](/runtime/reference/cli/bump_version/) — bump `version`
  in `deno.json` / `package.json` before packing
- [Publishing modules](/runtime/packages/#publishing-modules)
  — overview of where Deno-authored libraries can be published
