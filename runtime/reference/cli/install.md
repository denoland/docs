---
last_modified: 2026-03-12
title: "deno install"
oldUrl:
  - /runtime/manual/tools/script_installer/
  - /runtime/reference/cli/script_installer/
  - /runtime/manual/tools/script_installer/
  - /runtime/manual/tools/cache/
  - /runtime/reference/cli/cache/
command: install
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno install"
description: "Install and cache dependencies for your project"
---

`deno install` installs dependencies and caches them for your project. For more
on how Deno handles modules, see
[Modules and dependencies](/runtime/fundamentals/modules/).

## Examples

### deno install

Use this command to install all dependencies defined in
[`deno.json`](/runtime/fundamentals/configuration/) and/or `package.json`.

The dependencies will be installed in the global cache, but if your project has
a `package.json` file, a local `node_modules` directory will be set up as well.

### deno install [PACKAGES]

Use this command to install particular packages and add them to `deno.json` or
`package.json`.

```sh
deno install jsr:@std/testing npm:express
```

:::tip

You can also use `deno add` which is an alias to `deno install [PACKAGES]`

:::

If your project has a `package.json` file, the packages coming from npm will be
added to `dependencies` in `package.json`. Otherwise all packages will be added
to `deno.json`.

### Installing from npm tarballs

Starting in Deno 2.8, `deno install` accepts npm tarballs directly — both local
files and any `http(s):` URL — matching how `npm`, `pnpm`, and `bun` resolve
tarball dependencies:

```sh
# Local tarball
deno install ./my-package-1.0.0.tgz

# Remote tarball from the npm registry
deno install https://registry.npmjs.org/is-odd/-/is-odd-3.0.1.tgz

# GitHub-hosted tarball
deno install https://github.com/user/repo/tarball/v1.0
```

Detection rules:

- **Local**: paths ending in `.tgz` or `.tar.gz`.
- **Remote**: any `http:` / `https:` URL (unless it's a `git+` URL) is treated
  as a tarball.

The tarball's `package.json` is read to determine the package name, version,
and dependency list — transitive dependencies are then resolved through the
normal npm resolver. The integrity hash and tarball source are recorded in
`deno.lock`. Remote tarballs are cached locally under `.deno_tarball_cache/`.

:::info Limitation

Tarball installs only work in `package.json` mode — Deno's import map
resolver in `deno.json` does not currently support `npm:name@file:path`
specifiers.

:::

### deno install --entrypoint [FILES]

Use this command to install all dependencies that are used in the provided files
and their dependencies.

This is particularly useful if you use `jsr:`, `npm:`, `http:` or `https:`
specifiers in your code and want to cache all the dependencies before deploying
your project.

```js title="main.js"
import * as colors from "jsr:@std/fmt/colors";
import express from "npm:express";
```

```sh
deno install -e main.js
Download jsr:@std/fmt
Download npm:express
```

:::tip

If you want to set up local `node_modules` directory, you can pass
`--node-modules-dir=auto` flag.

Some dependencies might not work correctly without a local `node_modules`
directory.

:::

### deno install --global [PACKAGE_OR_URL]

Use this command to install provide package or script as a globally available
binary on your system.

This command creates a thin, executable shell script which invokes `deno` using
the specified CLI flags and main module. It is placed in the installation root.

Example:

```sh
deno install --global --allow-net --allow-read jsr:@std/http/file-server
Download jsr:@std/http/file-server...

✅ Successfully installed file-server.
/Users/deno/.deno/bin/file-server
```

To change the executable name, use `-n`/`--name`:

```sh
deno install -g -N -R -n serve jsr:@std/http/file-server
```

The executable name is inferred by default:

- Attempt to take the file stem of the URL path. The above example would become
  'file-server'.
- If the file stem is something generic like 'main', 'mod', 'index' or 'cli',
  and the path has no parent, take the file name of the parent path. Otherwise
  settle with the generic name.
- If the resulting name has an '@...' suffix, strip it.

To change the installation root, use `--root`:

```sh
deno install -g -N -R --root /usr/local/bin jsr:@std/http/file-server
```

The installation root is determined, in order of precedence:

- `--root` option
- `DENO_INSTALL_ROOT` environment variable
- `$HOME/.deno/bin`

These must be added to the path manually if required.

```sh
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

You must specify permissions that will be used to run the script at installation
time.

```sh
deno install -g -N -R jsr:@std/http/file-server -- -p 8080
```

The above command creates an executable called `file_server` that runs with
network and read permissions and binds to port 8080.

For good practice, use the
[`import.meta.main`](/runtime/tutorials/module_metadata/) idiom to specify the
entry point in an executable script.

Example:

```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  // -- snip --
}

if (import.meta.main) {
  myAwesomeCli();
}
```

When you create an executable script make sure to let users know by adding an
example installation command to your repository:

```sh
# Install using deno install

deno install -n awesome_cli https://example.com/awesome/cli.ts
```

### deno install --global --compile [PACKAGE_OR_URL]

Use this command to compile a package or script into a standalone,
self-contained binary. The resulting executable can be distributed and run
without requiring Deno to be installed on the target system.

```sh
deno install --global --compile -A npm:@anthropic-ai/claude-code
```

This combines the behavior of [`deno compile`](/runtime/reference/cli/compile/)
with global installation — producing a native binary placed in the installation
root (same as `--global` without `--compile`).

## Native Node.js addons

A lot of popular packages npm packages like
[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) or
[`npm:duckdb`](https://www.npmjs.com/package/duckdb) depend on
["lifecycle scripts"](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts),
eg. `preinstall` or `postinstall` scripts. Most often running these scripts is
required for a package to work correctly.

Unlike npm, Deno does not run these scripts by default as they pose a potential
security vulnerability.

You can still run these scripts by passing the `--allow-scripts=<packages>` flag
when running `deno install`:

```sh
deno install --allow-scripts=npm:sqlite3
```

_Install all dependencies and allow `npm:sqlite3` package to run its lifecycle
scripts_.

## --quiet flag

The `--quiet` flag suppresses diagnostic output when installing dependencies.
When used with `deno install`, it will hide progress indicators, download
information, and success messages.

```sh
deno install --quiet jsr:@std/http/file-server
```

This is useful for scripting environments or when you want cleaner output in CI
pipelines.

## Uninstall

You can uninstall dependencies or binary script with `deno uninstall` command:

```sh
deno uninstall express
Removed express
```

```sh
deno uninstall -g file-server
deleted /Users/deno/.deno/bin/file-server
✅ Successfully uninstalled file-server
```

See [`deno uninstall` page for more details](/runtime/reference/cli/uninstall/).
