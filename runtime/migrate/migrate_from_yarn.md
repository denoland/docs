---
title: "Migrate from Yarn"
description: "How to move a Yarn project to Deno: install dependencies from your existing package.json, keep your pinned versions, map Yarn CLI commands to Deno, run workspaces unchanged, and what to do about Plug'n'Play."
last_modified: 2026-06-25
---

Yarn is a package manager, not a runtime, so most of what you are "migrating" is
configuration rather than code. Both Yarn Classic and Yarn Berry describe a
project with a standard `package.json`, and Deno reads that directly: it
installs and resolves the same npm dependencies and runs your scripts. A typical
Yarn project runs under Deno with no changes.

The one Yarn feature that needs a decision is Plug'n'Play, Yarn Berry's default
install mode. Deno does not use PnP; it installs a real `node_modules`
directory. That is covered below.

## Run your project

Install dependencies and run your entrypoint:

```sh
cd my-yarn-app
deno install
deno run main.js
```

`deno install` reads your existing `package.json` and resolves the same npm
packages, like `yarn install`. It writes a `node_modules` directory and its own
[`deno.lock`](/runtime/packages/#lockfile-and-reproducible-installs).

On your first `deno install`, when there is no `deno.lock` yet, Deno seeds it
from a Yarn Classic (v1) `yarn.lock`, carrying over the versions and integrity
hashes you already had pinned. Yarn Berry (v2+) uses a different lockfile format
that Deno does not seed from; in that case Deno resolves your `package.json`
ranges fresh, so review `deno.lock` before committing it.

Scripts defined in `package.json` run with
[`deno task`](/runtime/reference/cli/task/), the equivalent of `yarn run`:

```sh
deno task start
```

If you also switch from running your app on Node to running it on Deno, expect
one immediate difference: **Deno is sandboxed by default**. The first time your
program touches the network, file system, or environment, Deno prompts for
permission. Grant everything up front with `deno run -A main.js` to match Node's
behavior, then tighten the flags later. See
[Security and permissions](/runtime/fundamentals/security/).

## Yarn to Deno cheatsheet

<div class="cheatsheet">

### Dependencies

| Yarn                       | Deno                |
| -------------------------- | ------------------- |
| `yarn install`             | `deno install`      |
| `yarn add <pkg>`           | `deno add <pkg>`    |
| `yarn add -D <pkg>`        | `deno add -D <pkg>` |
| `yarn remove <pkg>`        | `deno remove <pkg>` |
| `yarn up <pkg>`            | `deno update`       |
| `yarn outdated`            | `deno outdated`     |
| `yarn install --immutable` | `deno ci`           |
| `yarn npm audit`           | `deno audit`        |
| `yarn why <pkg>`           | `deno why <pkg>`    |

### Run and execute

| Yarn                | Deno                 |
| ------------------- | -------------------- |
| `node file.js`      | `deno file.js`       |
| `yarn <script>`     | `deno task <script>` |
| `yarn run <script>` | `deno task <script>` |
| `yarn dlx <pkg>`    | `dx <pkg>`           |

</div>

Deno also ships a formatter and linter in the box, so
[`deno fmt`](/runtime/reference/cli/fmt/) and
[`deno lint`](/runtime/reference/cli/lint/) replace Prettier and ESLint with no
extra dependencies.

## Workspaces

Yarn stores workspace globs in `package.json` under `workspaces`, and Deno reads
that field directly. A monorepo like this runs as-is:

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

Members reference each other through the
[`workspace:` protocol](/runtime/fundamentals/workspaces/#using-workspace-protocol-in-package-json)
in their `package.json` dependencies, exactly as they do under Yarn. There is
nothing to convert. See [Workspaces](/runtime/fundamentals/workspaces/) for how
resolution works.

## Plug'n'Play

Yarn Berry defaults to Plug'n'Play, which skips `node_modules` and resolves
packages through a generated `.pnp.cjs` file. Deno does not implement PnP. When
you run `deno install`, it writes a normal `node_modules` directory instead, so
you do not need PnP at all under Deno.

In practice this means the PnP-specific files and settings stop applying once
you move to Deno:

- `.pnp.cjs` and `.pnp.loader.mjs` are no longer used. Deno resolves from
  `node_modules`.
- `.yarnrc.yml` resolver settings (`nodeLinker`, `pnpMode`, plugins) configure
  Yarn specifically and do not carry over.
- `yarn patch` has no built-in Deno equivalent. Vendor the dependency or keep
  the patch in a fork.

## What to watch for

- **Lifecycle scripts do not run by default.** If a dependency relies on an
  `install` or `postinstall` script (native addons, `node-gyp` builds), allow it
  per package with `deno install --allow-scripts=npm:<pkg>`, or manage approvals
  with [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/). This
  is a security default, not a missing feature.

## Keep going

- **[Migrate from Node.js](/runtime/migrate/migrate_from_node/).** If you are also moving the
  runtime, this covers CommonJS and ES module resolution and the Node built-ins
  Deno supports.
- **[Migrate from npm](/runtime/migrate/migrate_from_npm/)** and
  **[Migrate from pnpm](/runtime/migrate/migrate_from_pnpm/).** The same Deno
  commands, with notes on each tool's workspace format.
- **[Dependency management](/runtime/packages/).** npm, JSR, and `package.json`
  workflows in detail.
- **[Supply chain management](/runtime/packages/supply_chain/).** `deno audit`,
  lockfile discipline, and minimum dependency age.
