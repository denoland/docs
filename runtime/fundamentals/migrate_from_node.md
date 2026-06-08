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

The main thing to be aware of is CommonJS interop: it's well supported but
doesn't cover every situation. `require()` is available in `.cjs` files or via
`createRequire`, and you can mix CommonJS and ES modules — see
[CommonJS support](/runtime/fundamentals/node/#commonjs-support) for the cases
that need attention.

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
