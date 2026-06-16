---
title: "Migrate from npm"
description: "How to move an npm project to Deno: install dependencies from your existing package.json, map npm CLI commands to Deno, run workspaces unchanged, and handle lifecycle scripts."
last_modified: 2026-06-16
---

npm is a package manager, not a runtime, so most of what you are "migrating" is
configuration rather than code. Deno is fully compatible with `package.json`: it
reads your existing manifest, installs and resolves the same npm dependencies,
and runs your scripts. In most cases you point Deno at an existing npm project
and it just works.

You can also adopt Deno gradually. Use it purely as a faster, drop-in package
manager for an app you still run with Node, run your `package.json` scripts with
`deno task`, and switch the runtime later. None of this requires converting your
project layout.

## Run your project

Install dependencies and run your entrypoint:

```sh
cd my-npm-app
deno install
deno run main.js
```

`deno install` reads your existing `package.json` and resolves the same npm
packages, like `npm install`. It writes a `node_modules` directory and its own
[`deno.lock`](/runtime/fundamentals/configuration/#dependency-lockfile). Deno
does not read `package-lock.json`; it resolves your `package.json` dependencies
fresh on the first install.

Scripts defined in `package.json` run with
[`deno task`](/runtime/reference/cli/task/), the equivalent of `npm run`:

```sh
deno task start
```

If you also switch from running your app on Node to running it on Deno, expect
one immediate difference: **Deno is sandboxed by default**. The first time your
program touches the network, file system, or environment, Deno prompts for
permission. Grant everything up front with `deno run -A main.js` to match Node's
behavior, then tighten the flags later. See
[Security and permissions](/runtime/fundamentals/security/).

## npm to Deno cheatsheet

<div class="cheatsheet">

### Dependencies

| npm                    | Deno                 |
| ---------------------- | -------------------- |
| `npm install`          | `deno install`       |
| `npm install <pkg>`    | `deno add npm:<pkg>` |
| `npm uninstall <pkg>`  | `deno remove <pkg>`  |
| `npm update`           | `deno update`        |
| `npm outdated`         | `deno outdated`      |

### Run and execute

| npm                 | Deno                 |
| ------------------- | -------------------- |
| `node file.js`      | `deno file.js`       |
| `npm run <script>`  | `deno task <script>` |
| `npx <pkg>`         | `deno x npm:<pkg>`   |

</div>

Deno also ships a formatter and linter in the box, so
[`deno fmt`](/runtime/reference/cli/fmt/) and
[`deno lint`](/runtime/reference/cli/lint/) replace Prettier and ESLint with no
extra dependencies.

## Workspaces

npm stores workspace globs in `package.json` under `workspaces`, and Deno reads
that field directly. A monorepo like this runs as-is:

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

Members reference each other through the
[`workspace:` protocol](/runtime/fundamentals/workspaces/#using-workspace-protocol-in-package-json)
in their `package.json` dependencies, exactly as they do under npm. There is
nothing to convert. See [Workspaces](/runtime/fundamentals/workspaces/) for how
resolution works.

## What to watch for

- **Lifecycle scripts do not run by default.** If a dependency relies on an
  `install` or `postinstall` script (native addons, `node-gyp` builds), allow it
  per package with `deno install --allow-scripts=npm:<pkg>`, or manage approvals
  with [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/). This is
  a security default, not a missing feature.
- **`overrides`.** Pin a transitive dependency through an
  [import map](/runtime/fundamentals/configuration/) entry rather than the
  `overrides` field in `package.json`.

## Keep going

- **[Migrate from Node.js](/runtime/migrate/).** If you are also moving the
  runtime, this covers CommonJS and ES module resolution and the Node built-ins
  Deno supports.
- **[Migrate from pnpm](/runtime/migrate/migrate_from_pnpm/)** and
  **[Migrate from Yarn](/runtime/migrate/migrate_from_yarn/).** The same Deno
  commands, with notes on each tool's workspace format.
- **[Dependency management](/runtime/packages/).** npm, JSR, and `package.json`
  workflows in detail.
