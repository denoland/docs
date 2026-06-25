---
title: "Migrate from pnpm"
description: "How to move a pnpm project to Deno: install dependencies from your existing package.json, keep your pinned versions, map pnpm CLI commands to Deno, and let Deno migrate pnpm-workspace.yaml workspaces and catalogs automatically."
last_modified: 2026-06-25
---

pnpm is a package manager, not a runtime, so most of what you are "migrating" is
configuration rather than code. Deno reads your existing `package.json`,
installs the same npm dependencies, and runs your scripts, so a single-package
pnpm project usually needs no changes at all.

The one place pnpm differs from npm, Yarn, and Bun is where it stores workspace
configuration. npm, Yarn, and Bun keep their workspace globs in `package.json`
under `workspaces`, which Deno reads directly. pnpm keeps them in a separate
`pnpm-workspace.yaml` file. Deno does not read that file during resolution, but
it migrates it for you automatically the first time it is needed, covered below.

## Run your project

Install dependencies and run your entrypoint:

```sh
cd my-pnpm-app
deno install
deno run main.ts
```

`deno install` reads your existing `package.json` and resolves the same npm
packages, like `pnpm install`. It writes a `node_modules` directory and its own
[`deno.lock`](/runtime/packages/#lockfile-and-reproducible-installs).

On your first `deno install`, when there is no `deno.lock` yet, Deno seeds it
from your existing `pnpm-lock.yaml`: the versions and integrity hashes you
already had pinned carry over, so you don't get a surprise round of upgrades on
the way in. The `node_modules` layout will feel familiar too: like pnpm, Deno
uses an isolated layout where each package only sees its declared dependencies.

Scripts defined in `package.json` run with
[`deno task`](/runtime/reference/cli/task/), the equivalent of `pnpm run`:

```sh
deno task dev
```

If you also switch from running your app on Node to running it on Deno, expect
one immediate difference: **Deno is sandboxed by default**. The first time your
program touches the network, file system, or environment, Deno prompts for
permission. Grant everything up front with `deno run -A main.ts` to match Node's
behavior, then tighten the flags later. See
[Security and permissions](/runtime/fundamentals/security/).

## pnpm to Deno cheatsheet

<div class="cheatsheet">

### Dependencies

| pnpm                             | Deno                    |
| -------------------------------- | ----------------------- |
| `pnpm install`                   | `deno install`          |
| `pnpm add <pkg>`                 | `deno add npm:<pkg>`    |
| `pnpm add -D <pkg>`              | `deno add -D npm:<pkg>` |
| `pnpm remove <pkg>`              | `deno remove <pkg>`     |
| `pnpm update`                    | `deno update`           |
| `pnpm outdated`                  | `deno outdated`         |
| `pnpm install --frozen-lockfile` | `deno ci`               |
| `pnpm audit`                     | `deno audit`            |
| `pnpm why <pkg>`                 | `deno why <pkg>`        |

### Run and execute

| pnpm                | Deno                 |
| ------------------- | -------------------- |
| `pnpm <script>`     | `deno task <script>` |
| `pnpm run <script>` | `deno task <script>` |
| `pnpm dlx <pkg>`    | `deno x npm:<pkg>`   |
| `pnpm exec <cmd>`   | `deno task <cmd>`    |

</div>

Unlike pnpm, Deno also ships a formatter and linter in the box, so
[`deno fmt`](/runtime/reference/cli/fmt/) and
[`deno lint`](/runtime/reference/cli/lint/) replace Prettier, ESLint, or Biome
with no extra dependencies.

## Workspaces and pnpm-workspace.yaml

npm, Yarn, and Bun store their workspace globs in `package.json`, but pnpm keeps
them in a separate `pnpm-workspace.yaml`, which Deno does not read during
resolution. You don't have to convert that file by hand: the first time a
workspace member or catalog version fails to resolve because of it, Deno finds
the nearby `pnpm-workspace.yaml`, converts its `packages`, `catalog`, and
`catalogs` into the equivalent Deno config fields, and prints a hint:

```console
warning: Found pnpm-workspace.yaml nearby, which Deno does not read directly.
hint: Migrated its workspace configuration into package.json. Run the command again.
```

Run the same command again and it resolves normally. After the migration your
workspace globs live in a `workspace` array, the equivalent of pnpm's `packages`
list:

```yaml title="pnpm-workspace.yaml (before)"
packages:
  - "packages/*"
  - "apps/*"
```

```json title="deno.json (after)"
{
  "workspace": ["packages/*", "apps/*"]
}
```

A couple of differences are worth knowing when you read the migrated globs:

- **Depth is explicit in Deno.** `packages/*` matches one level
  (`packages/foo`), and `packages/*/*` matches two levels. There is no `**`
  recursive glob; add a `/*` segment per level instead. See
  [Workspace path patterns](/runtime/fundamentals/workspaces/#workspace-path-patterns).
- **Exclusions are not supported.** pnpm's `!packages/excluded` negation has no
  equivalent in the `workspace` field, so list the members you want explicitly
  rather than excluding a few from a wildcard.

### Catalogs

pnpm [catalogs](https://pnpm.io/catalogs) share dependency versions across
members, and Deno supports the same `catalog:` protocol (added in Deno 2.8). The
auto-migration moves your catalog definitions into the root `deno.json` for you,
using the same field names:

```json title="deno.json"
{
  "workspace": ["packages/*"],
  "catalog": {
    "react": "^19.0.0"
  },
  "catalogs": {
    "react18": {
      "react": "^18.3.0"
    }
  }
}
```

The `catalog:` references inside each member's `package.json` stay exactly as
they are: `"react": "catalog:"` resolves to the default `catalog`, and
`"react": "catalog:react18"` resolves to a named entry in `catalogs`. See
[Centralized dependency versions with `catalog:`](/runtime/fundamentals/workspaces/#centralized-dependency-versions-with-catalog).

## What has no direct equivalent

A few `pnpm-workspace.yaml` settings are pnpm-specific and have no Deno
counterpart. Plan around them rather than translating them:

- **`overrides`.** Force a transitive dependency to a specific version through
  the `npm:` resolution your project already uses, or with an
  [import map](/runtime/fundamentals/configuration/) entry.
- **`patchedDependencies`.** Deno has no built-in patch-package mechanism.
  Vendor the dependency or maintain the patch in your own fork.
- **`registries`, `packageExtensions`, and similar tuning.** These configure
  pnpm's resolver specifically and do not carry over.

## Keep going

- **[Migrate from npm](/runtime/migrate/migrate_from_npm/).** The npm and pnpm
  CLI workflows map to the same Deno commands.
- **[Migrate from Node.js](/runtime/migrate/).** If you are also moving the
  runtime, this covers CommonJS and ES module resolution and the Node built-ins
  Deno supports.
- **[Workspaces](/runtime/fundamentals/workspaces/).** How Deno resolves
  members, shared imports, and catalogs in detail.
- **[Dependency management](/runtime/packages/).** npm, JSR, and `package.json`
  workflows.
- **[Supply chain management](/runtime/packages/supply_chain/).** `deno audit`,
  lockfile discipline, and minimum dependency age.
