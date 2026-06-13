---
last_modified: 2026-06-08
title: "Migrate from Node.js"
description: "How to move a Node.js project to Deno: use Deno as a drop-in package manager, run your existing project and package.json scripts, understand how CommonJS and ES modules are resolved, and map your Node commands to Deno."
oldUrl:
  - /runtime/fundamentals/migrate_from_node/
  - /runtime/manual/node/migrate/
  - /runtime/manual/references/cheatsheet/
  - /runtime/manual/node/cheatsheet/
---

Most Node.js projects run in Deno **with no changes at all**. Deno reads your
`package.json`, installs and resolves the same npm dependencies, and runs both
CommonJS and ES modules, so in most cases you point Deno at your existing
project and it just works.

You can also adopt Deno incrementally: use it purely as a faster, drop-in
package manager for an app you still run with Node, run your existing
`package.json` scripts with `deno task`, or switch to Deno as the runtime and
pick up its built-in toolchain. This guide walks through each step.

## Use Deno as your package manager

Deno is fully compatible with npm and `package.json`, so the easiest place to
start is dependency management, without changing how you run your code at all.
`deno install` reads your existing `package.json`, resolves the same npm
packages, and writes a `node_modules` directory, just like `npm install`:

```sh
cd my-node-app
deno install
```

You can keep running the app with Node from here, using Deno only as a faster
package manager, or manage dependencies with Deno's built-in commands:

```sh
deno add    npm:express   # add a dependency
deno remove express       # remove one
deno outdated             # see what has newer versions
```

Deno understands dependencies declared in both `package.json` and `deno.json`,
and individual npm packages can also be imported inline with `npm:` specifiers.
See [Dependency management](/runtime/packages/) for the full picture.

## Run your project with Deno

To run an existing Node project with Deno, install its dependencies and run the
entrypoint:

```sh
cd my-node-app
deno install
deno run main.js
```

Expect one immediate difference from Node: Deno is
[secure by default](/runtime/fundamentals/security/), so the first time your app
touches the network, filesystem, or environment, Deno prompts for permission.
Grant what the app needs up front with flags (`deno run -N -R -E main.js`), or
run with `-A` for Node-equivalent behavior while migrating and tighten later.
See [Permissions](/runtime/reference/permissions/) for the full flag list.

If your `package.json` defines scripts, run them with
[`deno task`](/runtime/reference/cli/task/), the equivalent of `npm run`:

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "node server.js"
  }
}
```

```sh
deno task start
```

Most code runs unchanged. The main thing to understand is how Deno decides
whether a file is CommonJS or an ES module, which follows your `package.json`.
That is covered next.

## CommonJS and ES modules

Deno runs both ES modules and CommonJS, and decides how to treat a file using
the same rules as Node.js:

- A `.cjs` file is **always** CommonJS, and a `.mjs` file is **always** an ES
  module. The extension is enough.
- A `.js`, `.ts`, `.jsx`, or `.tsx` file is loaded as **CommonJS** when the
  nearest `package.json` sets `"type": "commonjs"`, and as an **ES module**
  otherwise. Deno walks up the directory tree to find that `package.json`, just
  like Node.

```json title="package.json"
{
  "type": "commonjs"
}
```

So an existing CommonJS project keeps working: with `"type": "commonjs"` in
`package.json`, your `require()`-based `.js` files run under both Node and Deno.
CommonJS code needs its dependencies present in `node_modules` (set
`"nodeModulesDir": "auto"` in `deno.json`) and the usual
[permission flags](/runtime/fundamentals/security/).

You can also mix the two module systems: `require()` is available in `.cjs`
files or via `createRequire`, Deno's `require()` can load synchronous ES
modules, and you can `import` CommonJS files from ES modules. See
[CommonJS support](/runtime/fundamentals/node/#commonjs-support) for the details
and edge cases.

## Common errors and fixes

The handful of errors most Node projects hit on first run, and what they mean:

- **`NotCapable: Requires read access to "...", run again with the
  --allow-read flag`**:
  the permission sandbox at work. Grant the listed permission (`-R` here) or run
  with `-A` until you're ready to scope permissions down.
- **`ReferenceError: require is not defined`**: Deno treated the file as an ES
  module. Set `"type": "commonjs"` in `package.json`, or rename the file to
  `.cjs`. See [CommonJS and ES modules](#commonjs-and-es-modules) above.
- **Cannot find module / missing `node_modules`**: run `deno install`. If your
  tools expect a `node_modules` directory to exist, set
  `"nodeModulesDir": "auto"` in `deno.json`.
- **A dependency's install/postinstall script didn't run** (native addons,
  `node-gyp` builds): Deno does not run npm lifecycle scripts by default. Allow
  them per package with `deno install --allow-scripts=npm:<pkg>`, or manage
  approvals with
  [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/).
- **A `node:` API behaves differently or is missing**: check the
  [Node API compatibility list](/runtime/reference/node_apis/) for status and
  known gaps.

If you're migrating a framework app (Next.js, SvelteKit, Nuxt, and friends),
most run under Deno by replacing `npm run dev` with `deno task dev`. See
[Web development](/runtime/fundamentals/web_dev/) and the
[tutorials](/examples/) for framework-specific walkthroughs.

## Node to Deno Cheatsheet

In a Node project, many of these are separate packages you install and
configure: eslint, prettier, jest, ts-node, nodemon, nyc, tsc. In Deno they're
the same binary, with no extra dependencies and no config files to maintain. You
can keep your existing `package.json`, or move configuration into `deno.json`.

<div class="cheatsheet">

### Run and watch

| Node.js           | Deno               |
| ----------------- | ------------------ |
| `node file.js`    | `deno file.js`     |
| `ts-node file.ts` | `deno file.ts`     |
| `node -e "…"`     | `deno eval "…"`    |
| `nodemon`         | `deno run --watch` |

### Dependencies and scripts

| Node.js                 | Deno                    |
| ----------------------- | ----------------------- |
| `npm install` / `npm i` | `deno install`          |
| `npm install -g <pkg>`  | `deno install -g <pkg>` |
| `npm run <script>`      | `deno task <script>`    |
| `npm explain <pkg>`     | `deno why <pkg>`        |

### Quality and testing (built in, no install or config)

| Node.js                          | Deno            |
| -------------------------------- | --------------- |
| `eslint`                         | `deno lint`     |
| `prettier`                       | `deno fmt`      |
| `jest` / `mocha` / `ava` / `tap` | `deno test`     |
| `nyc` / `c8` / `istanbul`        | `deno coverage` |
| benchmark libraries              | `deno bench`    |

### TypeScript, docs, and builds

| Node.js        | Deno           |
| -------------- | -------------- |
| `tsc`          | `deno check` ¹ |
| `typedoc`      | `deno doc`     |
| `nexe` / `pkg` | `deno compile` |

¹ TypeScript runs directly: there's no build step. `deno check` type-checks
without emitting, and the compiler is built into the `deno` binary.

### Toolchain

| Node.js             | Deno             |
| ------------------- | ---------------- |
| `tsserver`          | `deno lsp`       |
| `nvm` / `n` / `fnm` | `deno upgrade` ² |

² `deno upgrade` updates the single installed binary and can pin any release
(`deno upgrade 2.1.0`); unlike `nvm`, it doesn't keep multiple versions
installed side by side.

</div>

## Keep going

- **[Node.js and npm compatibility](/runtime/fundamentals/node/).** What's
  supported (`node:` built-ins, npm packages, globals) and the known gaps.
- **[Node API compatibility list](/runtime/reference/node_apis/).** Per-module
  support status for every `node:` built-in.
- **[Migrating your tsconfig.json](/runtime/reference/ts_config_migration/).**
  Map `tsconfig.json` options onto `deno.json`.
