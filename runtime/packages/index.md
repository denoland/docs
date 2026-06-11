---
last_modified: 2026-05-20
title: "Dependency management"
description: "A practical guide to managing dependencies in Deno: adding and removing packages, pinning versions, overriding and vendoring dependencies, lockfiles and integrity checking, supply chain management, publishing, and private registries."
oldUrl:
  - /runtime/fundamentals/dependency_management/
  - /runtime/manual/basics/modules/integrity_checking/
  - /runtime/manual/basics/modules/publishing_modules/
  - /runtime/manual/basics/modules/reloading_modules/
  - /runtime/manual/basics/vendoring/
  - /runtime/manual/advanced/http_imports/
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
  - /runtime/manual/examples/manage_dependencies
  - /runtime/manual/node/cdns.md
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/fundamentals/esm.sh
---

This guide covers the day-to-day tasks of working with dependencies in Deno:
adding and removing packages, choosing versions, overriding and vendoring
dependencies, lockfiles, supply chain hygiene, publishing, and private
registries. For an introduction to how Deno's module system and import maps
work, see [Modules](/runtime/fundamentals/modules/).

## Adding dependencies with `deno add`

The installation process is made easy with the `deno add` subcommand. It will
automatically add the latest version of the package you requested to the
`imports` section in `deno.json`.

```sh
# Add the latest version of the module to deno.json
$ deno add jsr:@luca/cases
Add @luca/cases - jsr:@luca/cases@1.0.0
```

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0"
  }
}
```

You can also specify an exact version:

```sh
# Passing an exact version
$ deno add jsr:@luca/cases@1.0.0
Add @luca/cases - jsr:@luca/cases@1.0.0
```

:::info Deno 2.8

Unprefixed package names passed to `deno add` / `deno install` are treated as
npm packages by default. `deno add express` is now equivalent to
`deno add npm:express`. JSR packages still need the `jsr:` prefix to stay
unambiguous.

:::

Read more in [`deno add` reference](/runtime/reference/cli/add/).

You can also remove dependencies using `deno remove`:

```sh
$ deno remove @luca/cases
Remove @luca/cases
```

```json title="deno.json"
{
  "imports": {}
}
```

Read more in [`deno remove` reference](/runtime/reference/cli/remove/).

## Package Versions

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

## HTTPS imports

Deno also supports import statements that reference HTTP/HTTPS URLs, either
directly:

```js
import { Application } from "https://deno.land/x/oak/mod.ts";
```

or part of your `deno.json` import map:

```json
{
  "imports": {
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

Supporting HTTPS imports enables us to support the following JavaScript CDNs, as
they provide URL access to JavaScript modules:

- [deno.land/x](https://deno.land/x)
- [esm.sh](https://esm.sh)
- [unpkg.com](https://unpkg.com)

HTTPS imports are useful if you have a small, often single file, Deno project
that doesn't require any other configuration. With HTTPS imports, you can avoid
having a `deno.json` file at all. It is **not** advised to use this style of
import in larger applications however, as you may end up with version conflicts
(where different files use different version specifiers). HTTP imports are not
supported by `deno add`/`deno install` commands.

:::info

Use HTTPS imports with caution, and only **from trusted sources**. If the server
is compromised, it could serve malicious code to your application. They can also
cause versioning issues if you import different versions in different files.
HTTPS imports remain supported, **but we recommend using a package registry for
the best experience.**

:::

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

## Vendoring remote modules

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

## Publishing modules

Any Deno program that defines an export can be published as a module. This
allows other developers to import and use your code in their own projects.
Modules can be published to:

- [JSR](https://jsr.io) - recommended, supports TypeScript natively and
  auto-generates documentation for you
- [npm](https://www.npmjs.com/) - use
  [`deno pack`](/runtime/reference/cli/pack/) (Deno 2.8+) to build an
  npm-compatible tarball from a Deno project, or
  [dnt](https://github.com/denoland/dnt) for a more configurable build pipeline
- [deno.land/x](https://deno.com/add_module) - for HTTPS imports, use JSR
  instead if possible

To publish to JSR, give your package a name, version, and entry point in
`deno.json`, then run [`deno publish`](/runtime/reference/cli/publish/):

```json title="deno.json"
{
  "name": "@scope/my-package",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

```sh
deno publish --dry-run   # check what will be published
deno publish             # publish (authenticates via jsr.io)
```

See [Publishing packages on jsr.io](https://jsr.io/docs/publishing-packages) for
scopes, versioning, and provenance.

## Managing the module cache

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

## Integrity Checking and Lock Files

Imagine your module relies on a remote module located at
<https://some.url/a.ts>. When you compile your module for the first time, `a.ts`
is fetched, compiled, and cached. This cached version will be used until you
either run your module on a different machine (such as in a production
environment) or manually reload the cache (using a command like
`deno install --reload`).

But what if the content at `https://some.url/a.ts` changes? This could result in
your production module running with different dependency code than your local
module. To detect this, Deno uses integrity checking and lock files.

Deno uses a `deno.lock` file to check external module integrity. To opt into a
lock file, either:

1. Create a `deno.json` file in the current or an ancestor directory, which will
   automatically create an additive lockfile at `deno.lock`.

   Note that this can be disabled by specifying the following in your deno.json:

   ```json title="deno.json"
   {
     "lock": false
   }
   ```

2. Use the `--lock` flag to enable and specify lock file checking.

### Frozen lockfile

By default, Deno uses an additive lockfile, where new dependencies are added to
the lockfile instead of erroring.

This might not be desired in certain scenarios (ex. CI pipelines or production
environments) where you'd rather have Deno error when it encounters a dependency
it's never seen before. To enable this, you can specify the `--frozen` flag or
set the following in a deno.json file:

```json title="deno.json"
{
  "lock": {
    "frozen": true
  }
}
```

When running a deno command with a frozen lockfile, any attempts to update the
lockfile with new contents will cause the command to exit with an error showing
the modifications that would have been made.

If you wish to update the lockfile, specify `--frozen=false` on the command line
to temporarily disable the frozen lockfile.

### Changing lockfile path

The lockfile path can be configured by specifying `--lock=deps.lock` or the
following in a Deno configuration file:

```json title="deno.json"
{
  "lock": {
    "path": "deps.lock"
  }
}
```

## Supply chain management

Lockfile discipline, a minimum dependency age, `deno audit`, and intentional
update workflows keep your dependency tree deterministic and safe. See
[Supply chain management](/runtime/packages/supply_chain/) for the practices and
a recommended CI baseline.

## Private repositories

Deno can load remote modules from private hosts by sending bearer tokens from
the `DENO_AUTH_TOKENS` environment variable. For private npm registries and
`.npmrc`, see [npm support](/runtime/fundamentals/node/#private-registries)
instead. See [Private repositories](/runtime/packages/private_repositories/) for
setup, including a GitHub walkthrough.
