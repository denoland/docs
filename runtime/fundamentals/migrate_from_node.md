---
last_modified: 2026-06-08
title: "Migrating from Node.js to Deno"
description: "How to migrate an existing Node.js project to Deno: most projects run unchanged. Covers the rare compatibility points, running npm scripts with deno task, adopting Deno's toolchain, and a Node-to-Deno command cheatsheet."
oldUrl:
  - /runtime/manual/node/migrate/
  - /runtime/manual/references/cheatsheet/
  - /runtime/manual/node/cheatsheet/
---

Most Node.js projects run in Deno **with no changes at all**. Point Deno at your
entry file or your `package.json` scripts and it just works: Deno reads
`package.json`, resolves your npm and `node:` dependencies, and runs both ES
modules and CommonJS out of the box.

```sh
# An existing Node project — no migration step required
deno run main.js
deno task start
```

If something doesn't run immediately, it's almost always one of a few
well-defined compatibility points rather than a real porting effort:

- **Bare built-in imports need the `node:` prefix** — `import os from "node:os"`
  rather than `import os from "os"`. Modern Node code already uses the prefix,
  and Deno's error messages tell you exactly which import to update.
- **A few Node globals must be imported explicitly** — for example `Buffer` is
  imported from `node:buffer` (see
  [Node.js global objects](/runtime/fundamentals/node/#nodejs-global-objects)).
  The most common one, `process`, is available globally.
- **CommonJS-only APIs** such as `require()` are available in `.cjs` files or
  via `createRequire` (see
  [CommonJS support](/runtime/fundamentals/node/#commonjs-support)).

For the complete picture of what's supported, see
[Node and npm compatibility](/runtime/fundamentals/node/).

## Running scripts

Deno supports running npm scripts natively with the
[`deno task`](/runtime/reference/cli/task/) subcommand (If you're migrating from
Node.js, this is similar to the `npm run script` command). Consider the
following Node.js project with a script called `start` inside its
`package.json`:

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "eslint"
  }
}
```

You can execute this script with Deno by running:

```sh
deno task start
```

## Optional improvements

Deno ships a unified toolchain (configuration, linter, formatter, test runner)
that can simplify your setup when migrating:

- [Configuration](/runtime/fundamentals/configuration/)
- [Linter](/runtime/reference/cli/lint/)
- [Formatter](/runtime/reference/cli/fmt/)
- [Test runner](/runtime/reference/cli/test/)

## Node to Deno Cheatsheet

| Node.js                                | Deno                          |
| -------------------------------------- | ----------------------------- |
| `node file.js`                         | `deno file.js`                |
| `ts-node file.ts`                      | `deno file.ts`                |
| `nodemon`                              | `deno run --watch`            |
| `node -e`                              | `deno eval`                   |
| `npm i` / `npm install`                | `deno install`                |
| `npm install -g`                       | `deno install -g`             |
| `npm run`                              | `deno task`                   |
| `eslint`                               | `deno lint`                   |
| `prettier`                             | `deno fmt`                    |
| `package.json`                         | `deno.json` or `package.json` |
| `tsc`                                  | `deno check` ¹                |
| `typedoc`                              | `deno doc`                    |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                   |
| `nexe` / `pkg`                         | `deno compile`                |
| `npm explain`                          | `deno info`                   |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                |
| `tsserver`                             | `deno lsp`                    |
| `nyc` / `c8` / `istanbul`              | `deno coverage`               |
| benchmarks                             | `deno bench`                  |

¹ Type checking happens automatically, TypeScript compiler is built into the
`deno` binary.
