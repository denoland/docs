---
last_modified: 2026-05-20
title: "Dependency management"
description: "Use Deno as your package manager for npm and JSR: install, add, update, audit, and inspect dependencies, manage lockfiles and lifecycle scripts, and override packages."
oldUrl:
  - /runtime/fundamentals/dependency_management/
  - /runtime/manual/basics/modules/integrity_checking/
  - /runtime/manual/basics/modules/reloading_modules/
  - /runtime/manual/basics/vendoring/
  - /runtime/manual/advanced/http_imports/
  - /runtime/manual/examples/manage_dependencies
  - /runtime/manual/node/cdns.md
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/fundamentals/esm.sh
---

Deno is a full package manager for npm and [JSR](https://jsr.io) packages, built
into the `deno` binary. It works with `deno.json`, `package.json`, or both at
once, and it is secure by default: npm lifecycle scripts don't run unless you
approve them. This page covers the day-to-day workflow; the
[toolbelt table](#the-dependency-toolbelt) lists every command.

## Quick start

In a project that already declares dependencies (in `package.json` or
`deno.json`), install them with:

```sh
deno install
```

Add a new dependency from npm or JSR. Unprefixed names are npm packages, like
`npm install`:

```sh
deno install express            # any npm package
deno install jsr:@std/assert    # a JSR package
```

The dependency is recorded in your project's config file, and you import it by
its bare name:

```ts
import express from "express";
import { assertEquals } from "@std/assert";
```

## The dependency toolbelt

Every dependency task has a built-in subcommand. Each links to its full
reference:

| Command                                                           | What it does                                              |
| ----------------------------------------------------------------- | --------------------------------------------------------- |
| [`deno install`](/runtime/reference/cli/install/)                 | Install the project's dependencies (or a tool, with `-g`) |
| [`deno add`](/runtime/reference/cli/add/)                         | Add a dependency to the config file                       |
| [`deno remove`](/runtime/reference/cli/remove/)                   | Remove a dependency from the config file                  |
| [`deno outdated`](/runtime/reference/cli/outdated/)               | List dependencies with newer versions                     |
| [`deno update`](/runtime/reference/cli/update/)                   | Update dependencies to newer versions                     |
| [`deno why`](/runtime/reference/cli/why/)                         | Explain why a package is in your dependency tree          |
| [`deno info`](/runtime/reference/cli/info/)                       | Show a module's full dependency graph and cache details   |
| [`deno audit`](/runtime/reference/cli/audit/)                     | Check installed dependencies for known vulnerabilities    |
| [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) | Approve npm lifecycle scripts for specific packages       |
| [`deno ci`](/runtime/reference/cli/ci/)                           | Clean, lockfile-strict install for CI (like `npm ci`)     |
| [`deno publish`](/runtime/reference/cli/publish/)                 | Publish a package to JSR                                  |
| [`deno pack`](/runtime/reference/cli/pack/)                       | Build an npm-compatible tarball from a Deno package       |
| [`deno uninstall`](/runtime/reference/cli/uninstall/)             | Remove a globally installed tool                          |
| [`deno clean`](/runtime/reference/cli/clean/)                     | Remove the global module cache                            |

## Choosing versions

It is possible to specify a version range for the package you are importing.
This is done using the `@` symbol followed by a version range specifier, and
follows the [semver](https://semver.org/) versioning scheme. If you need to
share a single version range across multiple workspace members, see
[`catalog:` for centralized dependency versions](/runtime/fundamentals/workspaces/#centralized-dependency-versions-with-catalog).

For example:

```bash
@scopename/mypackage           # highest version
@scopename/mypackage@16.1.0    # exact version
@scopename/mypackage@16        # highest 16.x version >= 16.0.0
@scopename/mypackage@^16.1.0   # highest 16.x version >= 16.1.0
@scopename/mypackage@~16.1.0   # highest 16.1.x version >= 16.1.0
```

Here is an overview of all the ways you can specify a version or a range:

| Symbol    | Description                                                                                                                                                         | Example   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `1.2.3`   | An exact version. Only this specific version will be used.                                                                                                          | `1.2.3`   |
| `^1.2.3`  | Compatible with version 1.2.3. Allows updates that do not change the leftmost non-zero digit. <br>For example, `1.2.4` and `1.3.0` are allowed, but `2.0.0` is not. | `^1.2.3`  |
| `~1.2.3`  | Approximately equivalent to version 1.2.3. Allows updates to the patch version. <br> For example, `1.2.4` is allowed, but `1.3.0` is not.                           | `~1.2.3`  |
| `>=1.2.3` | Greater than or equal to version 1.2.3. Any version `1.2.3` or higher is allowed.                                                                                   | `>=1.2.3` |
| `<=1.2.3` | Less than or equal to version 1.2.3. Any version `1.2.3` or lower is allowed.                                                                                       | `<=1.2.3` |
| `>1.2.3`  | Greater than version 1.2.3. Only versions higher than `1.2.3` are allowed.                                                                                          | `>1.2.3`  |
| `<1.2.3`  | Less than version 1.2.3. Only versions lower than `1.2.3` are allowed.                                                                                              | `<1.2.3`  |
| `1.2.x`   | Any patch version within the minor version 1.2. For example, `1.2.0`, `1.2.1`, etc.                                                                                 | `1.2.x`   |
| `1.x`     | Any minor and patch version within the major version 1. For example, `1.0.0`, `1.1.0`, `1.2.0`, etc.                                                                | `1.x`     |
| `*`       | Any version is allowed.                                                                                                                                             | `*`       |

## Inspecting and updating dependencies

See which dependencies have newer versions, then update them:

```sh
deno outdated      # display what's behind, without changing anything
deno update        # update to the latest semver-compatible versions
deno update --latest   # ignore semver ranges and go to the newest releases
```

When you want to know where a package comes from,
[`deno why`](/runtime/reference/cli/why/) prints every dependency path that
leads to it:

```sh
deno why npm:kleur
```

[`deno info`](/runtime/reference/cli/info/) shows a module's full dependency
graph, including sizes and cache locations, for your entry point or any
specifier:

```sh
deno info main.ts
deno info jsr:@std/http
```

## Auditing for vulnerabilities

[`deno audit`](/runtime/reference/cli/audit/) checks your installed dependencies
against vulnerability databases:

```sh
deno audit                 # report known vulnerabilities
deno audit --level=high    # only high and critical severity
deno audit --fix           # upgrade affected packages automatically
deno audit --socket        # check against the socket.dev database
```

Auditing is one part of keeping your dependency tree safe over time. See
[Supply chain management](/runtime/packages/supply_chain/) for the wider
practices: minimum dependency age, lockfile discipline, and a recommended CI
baseline.

## Lifecycle scripts

Unlike npm, Deno does not run `preinstall`/`postinstall` scripts by default: a
package's install scripts are a common attack vector, so running them is opt-in.
When a dependency genuinely needs its scripts (native addons, for example),
allow it explicitly:

```sh
deno install --allow-scripts=npm:better-sqlite3
```

Or manage approvals interactively with
[`deno approve-scripts`](/runtime/reference/cli/approve_scripts/). Scripts only
execute when a `node_modules` directory is in use.

## Lockfile and reproducible installs

Deno automatically maintains a `deno.lock` file recording the exact version and
integrity hash of every dependency, and verifies it on subsequent runs. Commit
it. In CI and production, install strictly from the lockfile with
[`deno ci`](/runtime/reference/cli/ci/), which errors if `deno.lock` is missing
or out of date instead of silently resolving new versions:

```sh
deno ci          # like npm ci
deno ci --prod   # additionally skip devDependencies
```

You can also enforce a frozen lockfile on any command with `--frozen`, or
configure the lockfile's behavior and path in
[`deno.json`](/runtime/reference/deno_json/#lockfile). For why this matters and
what to do when the lockfile fights you, see
[Supply chain management](/runtime/packages/supply_chain/).

## node_modules and the cache

By default Deno stores dependencies in a global cache and creates a local
`node_modules` directory only when your project has a `package.json`. Control
this with the `nodeModulesDir` option in
[`deno.json`](/runtime/reference/deno_json/#node-modules-directory).

By default, Deno uses a global cache directory (`DENO_DIR`) for downloaded
dependencies. This cache is shared across all projects.

You can force deno to refetch and recompile modules into the cache using the
`--reload` flag.

```bash
# Reload everything
deno run --reload my_module.ts

# Reload a specific module
deno run --reload=jsr:@std/fs my_module.ts
```

The reverse also works: `--cached-only` forbids the network entirely and fails
if anything in the dependency tree is not already cached, which is useful for
offline work and reproducible CI:

```shell
deno run --cached-only mod.ts
```

### Vendoring remote modules

If your project has external dependencies, you may want to store them locally to
avoid downloading them from the internet every time you build your project. This
is especially useful when building your project on a CI server or in a Docker
container, or patching or otherwise modifying the remote dependencies.

Deno offers this functionality through a setting in your `deno.json` file:

```json
{
  "vendor": true
}
```

Add the above snippet to your `deno.json` file and Deno will cache all
dependencies locally in a `vendor` directory when the project is run, or you can
optionally run the `deno install --entrypoint` command to cache the dependencies
immediately:

```bash
deno install --entrypoint main.ts
```

You can then run the application as usual with `deno run`:

```bash
deno run main.ts
```

After vendoring, you can run `main.ts` without internet access by using the
`--cached-only` flag, which forces Deno to use only locally available modules.

For more advanced overrides, such as substituting dependencies during
development, see [Overriding dependencies](#overriding-dependencies).

## Overriding dependencies

Deno provides mechanisms to override dependencies, enabling developers to use
custom or local versions of libraries during development or testing.

Note: If you need to cache and modify dependencies locally for use across
builds, consider [vendoring remote modules](#vendoring-remote-modules).

### Overriding local packages

For developers familiar with `npm link` in Node.js, Deno provides a similar
feature for local JSR and npm packages through the `links` field in `deno.json`.
This allows you to override dependencies with local versions during development
without needing to publish them.

Example:

```json title="deno.json"
{
  "links": [
    "../some-package-or-workspace"
  ]
}
```

Key points:

- The `links` field accepts paths to directories containing packages or
  workspaces. If you reference a single package within a workspace, the entire
  workspace will be included.
- Both JSR and npm packages are supported.
- This feature is only respected in the workspace root. Using `links` elsewhere
  will trigger warnings.

Limitations:

- Git-based dependency overrides are unavailable.
- The `links` field requires proper configuration in the workspace root.

### Overriding NPM packages

Deno supports linking npm packages with local versions, similar to how JSR
packages can be linked. This allows you to use a local copy of an npm package
during development without publishing it.

To use a local npm package, configure the `links` field in your `deno.json`:

```json
{
  "links": [
    "../path/to/local_npm_package"
  ]
}
```

This feature requires a `node_modules` directory and has different behaviors
depending on your `nodeModulesDir` setting:

- With `"nodeModulesDir": "auto"`: The directory is recreated on each run, which
  slightly increases startup time but ensures the latest version is always used.
- With `"nodeModulesDir": "manual"` (default when using package.json): You must
  run `deno install` after updating the package to get the changes into the
  workspace's `node_modules` directory.

Limitations:

- Specifying a local copy of an npm package or changing its dependencies will
  purge npm packages from the lockfile, which may cause npm resolution to work
  differently.
- The npm package name must exist in the registry, even if you're using a local
  copy.

### Overriding HTTPS imports

Deno also allows overriding HTTPS imports through the `scopes` field in
`deno.json`. This feature is particularly useful when substituting a remote
dependency with a local patched version for debugging or temporary fixes.

Example:

```json title="deno.json"
{
  "imports": {
    "example/": "https://deno.land/x/example/"
  },
  "scopes": {
    "https://deno.land/x/example/": {
      "https://deno.land/x/my-library@1.0.0/mod.ts": "./patched/mod.ts"
    }
  }
}
```

Key points:

- The `scopes` field in the import map allows you to redirect specific imports
  to alternative paths.
- This is commonly used to override remote dependencies with local files for
  testing or development purposes.
- Scopes apply only to the root of your project. Nested scopes within
  dependencies are ignored.

## Development only dependencies

Sometimes dependencies are only needed during development, for example
dependencies of test files or build tools. In Deno, the runtime does not require
you to distinguish between development and production dependencies, as the
[runtime will only load and install dependencies that are actually used in the
code that is being executed](#why-does-deno-not-have-a-devimports-field).

However, it can be useful to mark dev dependencies to aid people who are reading
your package. When using `deno.json`, the convention is to add a `// dev`
comment after any "dev only" dependency:

```json title="deno.json"
{
  "imports": {
    "@std/fs": "jsr:@std/fs@1",
    "@std/testing": "jsr:@std/testing@1" // dev
  }
}
```

When using a `package.json` file, dev dependencies can be added to the separate
`devDependencies` field:

```json title="package.json"
{
  "dependencies": {
    "pg": "npm:pg@^8.0.0"
  },
  "devDependencies": {
    "prettier": "^3"
  }
}
```

### JSR packages in package.json

You can depend on JSR packages directly from `package.json` using the `jsr:`
scheme, without needing a separate `deno.json`:

```json title="package.json"
{
  "dependencies": {
    "@std/path": "jsr:^1.0.9"
  }
}
```

This works with `deno install` and brings JSR packages to any project that uses
`package.json` for dependency management.

### Dependency overrides

The `overrides` field in `package.json` lets you control transitive dependency
versions throughout your dependency tree. This is useful for applying security
patches, fixing version compatibility issues, or replacing packages:

```json title="package.json"
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "overrides": {
    "cookie": "0.7.0",
    "express": {
      "qs": "6.13.0"
    }
  }
}
```

In this example, `cookie` is pinned globally to `0.7.0`, while `qs` is
overridden only when required by `express`.

### Why does Deno not have a `devImports` field?

To understand why Deno does not separate out dev dependencies in the package
manifest it is important to understand what problem dev dependencies are trying
to solve.

When deploying an application you frequently want to install only the
dependencies that are actually used in the code that is being executed. This
helps speed up startup time and reduce the size of the deployed application.

Historically, this has been done by separating out dev dependencies into a
`devDependencies` field in the `package.json`. When deploying an application,
the `devDependencies` are not installed, and only the dependencies.

This approach has shown to be problematic in practice. It is easy to forget to
move a dependency from `dependencies` to `devDependencies` when a dependency
moves from being a runtime to a dev dependency. Additionally, some packages that
are semantically "development time" dependencies, like (`@types/*`), are often
defined in `dependencies` in `package.json` files, which means they are
installed for production even though they are not needed.

Deno offers two approaches for installing production-only dependencies:

- **`deno install --prod`** — skips `devDependencies` from `package.json`. You
  can also pass `--skip-types` to additionally exclude `@types/*` packages.
- **`deno install --entrypoint`** — installs only the dependencies that are
  actually (transitively) imported by the specified entrypoint file. When
  combined with `--prod`, type-only dependencies are also excluded from the
  module graph.

See the [`deno install` reference](/runtime/reference/cli/install/) for more
details.

## HTTPS imports

Deno can import modules directly from `https:` URLs, either inline or mapped in
`deno.json`. This suits small single-file scripts, but registries (JSR, npm) are
recommended for applications: HTTPS imports can drift to different versions
across files, aren't managed by `deno add`/`deno install`, and trust the serving
host. To pin and localize them, see [vendoring](#vendoring-remote-modules).

## Go deeper

- **[Publishing packages](/runtime/packages/publishing/)**: JSR, npm via
  `deno pack`, and choosing a registry.
- **[Supply chain management](/runtime/packages/supply_chain/)**: lockfile
  discipline, minimum dependency age, audit workflows, and a CI baseline.
- **[Private repositories](/runtime/packages/private_repositories/)**:
  authenticate remote module hosts with `DENO_AUTH_TOKENS`. For private npm
  registries, see [npm support](/runtime/fundamentals/node/#private-registries).
