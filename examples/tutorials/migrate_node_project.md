---
title: "Use Deno in an existing Node.js project"
description: "Run an existing Node.js project with Deno without rewriting it: install from package.json, run npm scripts with deno task, use node: built-ins, and adopt Deno's built-in tooling incrementally."
url: /examples/migrate_node_project_tutorial/
---

Most Node.js projects run in Deno with no changes. Deno reads `package.json`,
installs the same npm dependencies into `node_modules`, runs both CommonJS and
ES modules, and executes your existing npm scripts. This tutorial takes a
typical Node project and runs it with Deno, step by step.

## Install dependencies from package.json

`deno install` is the equivalent of `npm install`: it reads your existing
`package.json` and materializes a `node_modules` directory:

```sh
$ deno install
Initialize ms@2.1.3
Installed 1 package in 2ms

Dependencies:
+ npm:ms 2.1.3
```

No `deno.json` is required; `package.json` alone is enough. A `deno.lock` file
is created to pin exact versions.

## Run your npm scripts

`deno task` is the equivalent of `npm run` and reads the `scripts` from your
`package.json` unchanged:

```json title="package.json"
{
  "name": "my-node-app",
  "type": "module",
  "scripts": {
    "start": "node main.js"
  },
  "dependencies": {
    "ms": "^2.1.3"
  }
}
```

```sh
$ deno task start
Task start node main.js
172800000
```

## Run the entrypoint with Deno

To use Deno as the runtime, point it at the same entrypoint:

```sh
$ deno run main.js
172800000
```

:::note

Deno is secure by default: if your code reads files, opens sockets, or accesses
environment variables, grant the access explicitly, e.g.
`deno run --allow-net --allow-env main.js`, or start permissive with
`deno run -A main.js` and tighten later.

:::

Two compatibility rules cover almost everything else:

- **Node built-ins use the `node:` prefix**: write `import os from "node:os"`
  rather than `import os from "os"`. Node itself supports this prefix, so the
  change is backwards-compatible.
- **CommonJS and ES modules both work**: `.cjs` and `.mjs` are unambiguous, and
  `.js` follows the `"type"` field of the nearest `package.json`. A
  `require()`-based project with `"type": "commonjs"` runs as-is.

:::note

Deno assumes ES modules by default. A `.js` file is only treated as CommonJS
when the nearest `package.json` declares `"type": "commonjs"`, unlike Node,
which assumes CommonJS when the field is missing. Add that one line to older
projects that rely on the implicit default.

:::

## Replace tooling incrementally

You don't have to switch everything at once: Deno works fine as just a package
manager or just a task runner. When you're ready, the built-in toolchain
replaces several dev dependencies with zero configuration:

| Node.js tooling    | Deno         |
| ------------------ | ------------ |
| `npm install`      | deno install |
| `npm run <script>` | deno task    |
| `eslint`           | deno lint    |
| `prettier`         | deno fmt     |
| `jest` / `mocha`   | deno test    |
| `tsc --noEmit`     | deno check   |

For module resolution details, the full command cheatsheet, and tsconfig
migration, see the [Migrate from Node.js guide](/runtime/migrate/).
