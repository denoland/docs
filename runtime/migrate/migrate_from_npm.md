---
title: "Migrate from npm"
description: "How to move an npm project to Deno: install dependencies from your existing package.json, keep your pinned versions, map npm CLI commands to Deno, run workspaces unchanged, and handle lifecycle scripts."
last_modified: 2026-06-25
oldUrl:
  - /runtime/migrate/switch_package_manager/
---

npm is a package manager, not a runtime, so most of what you are "migrating" is
configuration rather than code. Deno is fully compatible with `package.json`: it
reads your existing manifest, installs and resolves the same npm dependencies,
and runs your scripts. In most cases you point Deno at an existing npm project
and it just works.

You don't have to switch runtimes to start. The smallest possible step is to use
Deno purely as a faster, more secure package manager for an app you still run
with Node: `deno install` reads your `package.json`, resolves the same packages,
and writes a normal `node_modules` directory, so the app keeps running under
Node exactly as before. From there you can run your `package.json` scripts with
`deno task` and switch the runtime when you are ready. It is also reversible: if
it doesn't work out, delete `deno.lock` and run `npm install` again.

## Run your project

Install dependencies and run your entrypoint:

```sh
cd my-npm-app
deno install
deno run main.js
```

`deno install` reads your existing `package.json` and resolves the same npm
packages, like `npm install`. It writes a `node_modules` directory and its own
[`deno.lock`](/runtime/packages/#lockfile-and-reproducible-installs).

On your first `deno install`, when there is no `deno.lock` yet, Deno seeds it
from your existing `package-lock.json`: the exact versions and integrity hashes
you already had pinned carry over, so you don't get a surprise round of upgrades
on the way in. After that, Deno maintains `deno.lock` and leaves
`package-lock.json` untouched, so teammates who haven't switched yet are
unaffected. Commit `deno.lock` once you're happy with it.

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

| npm                    | Deno                |
| ---------------------- | ------------------- |
| `npm install`          | `deno install`      |
| `npm install <pkg>`    | `deno add <pkg>`    |
| `npm install -D <pkg>` | `deno add -D <pkg>` |
| `npm uninstall <pkg>`  | `deno remove <pkg>` |
| `npm update`           | `deno update`       |
| `npm outdated`         | `deno outdated`     |
| `npm ci`               | `deno ci`           |
| `npm audit`            | `deno audit`        |
| `npm explain <pkg>`    | `deno why <pkg>`    |

### Run and execute

| npm                | Deno                 |
| ------------------ | -------------------- |
| `node file.js`     | `deno file.js`       |
| `npm run <script>` | `deno task <script>` |
| `npx <pkg>`        | `dx <pkg>`           |

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
  with [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/). This
  is a security default, not a missing feature.
- **`overrides`.** Pin a transitive dependency through an
  [import map](/runtime/fundamentals/configuration/) entry rather than the
  `overrides` field in `package.json`.
- **node_modules layout.** By default Deno uses an isolated layout similar to
  pnpm's: real files live in `node_modules/.deno/` and packages are exposed
  through symlinks. Tools that expect npm's flat, hoisted layout can opt into it
  with `"nodeModulesDir": "manual"` and `"nodeModulesLinker": "hoisted"` in
  `deno.json`. See the
  [node_modules directory reference](/runtime/reference/deno_json/#node-modules-directory).

## Keep going

- **[Migrate from Node.js](/runtime/migrate/migrate_from_node/).** If you are also moving the
  runtime, this covers CommonJS and ES module resolution and the Node built-ins
  Deno supports.
- **[Migrate from pnpm](/runtime/migrate/migrate_from_pnpm/)** and
  **[Migrate from Yarn](/runtime/migrate/migrate_from_yarn/).** The same Deno
  commands, with notes on each tool's workspace format.
- **[Dependency management](/runtime/packages/).** npm, JSR, and `package.json`
  workflows in detail.
- **[Supply chain management](/runtime/packages/supply_chain/).** `deno audit`,
  lockfile discipline, and minimum dependency age.
