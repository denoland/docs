---
title: "Switch your package manager to Deno"
description: "Use Deno as a drop-in replacement for npm, yarn, or pnpm while still running your app with Node: a command mapping, secure installs, and the differences to know."
---

You don't have to switch runtimes to get something out of Deno. `deno install`
reads your existing `package.json`, resolves the same npm packages from the same
registry, and writes a regular `node_modules` directory. Your app keeps running
with Node, your deploy pipeline doesn't change, and Deno takes over the job npm,
yarn, or pnpm was doing: installing, updating, auditing, and explaining
dependencies.

Why bother? Installs are fast, npm lifecycle scripts don't run unless you
approve them, and the auditing and supply-chain tooling that usually requires
extra flags or extra packages is built in. This is deliberately the smallest
possible adoption step: if it doesn't work out, delete `deno.lock` and run
`npm install` again.

## Install your dependencies with Deno

In any project with a `package.json`:

```sh
cd my-node-app
deno install
node server.js
```

`deno install` creates `node_modules` and a `deno.lock` lockfile. It leaves an
existing `package-lock.json` (or `yarn.lock`, or `pnpm-lock.yaml`) untouched, so
nothing breaks for teammates who haven't switched yet. Node resolves packages
from the resulting `node_modules` exactly as before.

## Command mapping

The table uses modern Yarn (Berry) command names. Yarn 1 (classic) differs in a
few places, such as `yarn upgrade` instead of `yarn up`.

| Task                 | npm                 | yarn                       | pnpm                             | Deno                |
| -------------------- | ------------------- | -------------------------- | -------------------------------- | ------------------- |
| Install everything   | `npm install`       | `yarn install`             | `pnpm install`                   | `deno install`      |
| Add a package        | `npm install ms`    | `yarn add ms`              | `pnpm add ms`                    | `deno add ms`       |
| Add a dev dependency | `npm install -D ms` | `yarn add -D ms`           | `pnpm add -D ms`                 | `deno add -D ms`    |
| Remove a package     | `npm uninstall ms`  | `yarn remove ms`           | `pnpm remove ms`                 | `deno remove ms`    |
| Update dependencies  | `npm update`        | `yarn up <pattern>`        | `pnpm update`                    | `deno update`       |
| List outdated        | `npm outdated`      | `yarn upgrade-interactive` | `pnpm outdated`                  | `deno outdated`     |
| Run a script         | `npm run build`     | `yarn run build`           | `pnpm run build`                 | `deno task build`   |
| Audit dependencies   | `npm audit`         | `yarn npm audit`           | `pnpm audit`                     | `deno audit`        |
| Explain a dependency | `npm explain ms`    | `yarn why ms`              | `pnpm why ms`                    | `deno why ms`       |
| Run a one-off binary | `npx cowsay`        | `yarn dlx cowsay`          | `pnpm dlx cowsay`                | `deno x npm:cowsay` |
| Clean install (CI)   | `npm ci`            | `yarn install --immutable` | `pnpm install --frozen-lockfile` | `deno ci`           |

A few details worth knowing:

- Unprefixed names in `deno add` default to npm packages. Deno can also install
  from [JSR](https://jsr.io) with `deno add jsr:@std/path`.
- In a project with a `package.json`, `deno add -D` writes to `devDependencies`,
  the same as `npm install -D`. `deno ci --prod` and `deno install` honor that
  split the way you'd expect.
- `deno update` respects your semver ranges by default; add `--latest` to cross
  major versions, or `-i` to pick updates interactively. It is an alias of
  `deno outdated --update`.
- Modern Yarn has no built-in `outdated` command, so the interactive upgrade UI
  is the closest equivalent.
- `deno ci` requires `deno.lock`, deletes any existing `node_modules`, and
  installs strictly from the lockfile, erroring if it is missing or out of date
  with `package.json`.

## What Deno does differently

### Lifecycle scripts are off by default

npm runs `postinstall` and other lifecycle scripts automatically, which is the
most common vector for supply-chain attacks. Deno never runs them unless you opt
in, either per install:

```sh
deno install --allow-scripts=npm:better-sqlite3
```

or interactively after the fact with
[`deno approve-scripts`](/runtime/reference/cli/approve_scripts/), which prompts
you to pick from the installed packages that declare lifecycle scripts. Most
packages work fine without their scripts; the ones that don't (native addons,
mostly) tell you at runtime.

### Audit with automatic fixes

`deno audit` checks installed packages against the npm advisory database, and
`deno audit --fix` upgrades vulnerable packages for you. You can filter with
`--level=high`, ignore specific CVEs with `--ignore`, or check the socket.dev
database with `--socket`.

### A waiting period for new releases

Deno can refuse to install package versions younger than a configured age, which
catches most malicious releases before they reach you, since they are typically
detected and yanked within days:

```jsonc title="deno.json"
{
  "minimumDependencyAge": "P3D"
}
```

The same control is available as `deno install --minimum-dependency-age=P3D` or
as `min-release-age` in `.npmrc`. See
[Supply chain management](/runtime/packages/supply_chain/) for the full picture.

### The lockfile

Deno maintains its own lockfile, `deno.lock`, and does not read or write
`package-lock.json`. In practice that means:

- The first `deno install` resolves your `package.json` ranges fresh, so the
  versions it picks can be newer than what your old lockfile pinned. Review the
  result before committing `deno.lock`.
- During a transition both lockfiles can coexist, but they can drift apart,
  since each tool only updates its own. Once the team has switched, delete the
  old lockfile and commit `deno.lock`.

## What to watch out for

**node_modules layout.** By default Deno uses an isolated layout similar to
pnpm: real files live in a content-addressed `node_modules/.deno/` directory and
packages are exposed through symlinks, so each package only sees its declared
dependencies. Most projects never notice, and the layout catches phantom
dependencies that hoisted layouts hide. Tools that walk `node_modules` expecting
npm's flat layout can opt into the hoisted linker (Deno 2.8+) with
`"nodeModulesDir": "manual"` and `"nodeModulesLinker": "hoisted"` in
`deno.json`. See the
[node_modules directory reference](/runtime/reference/deno_json/#node-modules-directory)
and
[isolated vs hoisted layouts](/runtime/fundamentals/node/#node_modules-layout%3A-isolated-vs-hoisted).

**pnpm workspaces.** Deno supports the `workspace:` protocol in `package.json`
(`workspace:*`, `workspace:~`, `workspace:^`) and, since Deno 2.8, the
`catalog:` protocol for centralized dependency versions. A `pnpm-workspace.yaml`
file itself is not read, though: convert it to a `"workspace"` field in
`deno.json`. See [Workspaces and monorepos](/runtime/fundamentals/workspaces/).

**Yarn Plug'n'Play.** Deno always installs npm packages into a real
`node_modules` directory. Yarn PnP setups that have no `node_modules` (the
`.pnp.cjs` approach) should switch Yarn back to its `node-modules` linker before
trying Deno.

**Lifecycle scripts, again.** If your install "succeeds but the app breaks",
check whether a dependency needed its `postinstall` script and approve it with
`deno approve-scripts`. This is the most common difference people hit.

## Keep going

- **[Migrate from Node.js](/runtime/migrate/).** When you're ready for the next
  step: run your scripts with `deno task`, then run the app itself with Deno.
- **[Dependency management](/runtime/packages/).** The full toolbelt: versions,
  lockfiles, overrides, vendoring, and JSR.
- **[Supply chain management](/runtime/packages/supply_chain/).** Lockfile
  discipline, minimum dependency age, and a recommended CI baseline.
