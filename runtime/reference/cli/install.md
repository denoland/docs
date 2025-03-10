---
title: "`deno install`"
oldUrl:
 - /runtime/manual/tools/script_installer/
 - /runtime/reference/cli/script_installer/
 - /runtime/manual/tools/script_installer/
 - /runtime/manual/tools/cache/
 - /runtime/reference/cli/cache/
command: install
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno install"
---

## Examples

### deno install

Use this command to install all dependencies defined in `deno.json` and/or
`package.json`.

The dependencies will be installed in the global cache, but if your project has
a `package.json` file, a local `node_modules` directory will be set up as well.

### deno install [PACKAGES]

Use this command to install particular packages and add them to `deno.json` or
`package.json`.

```shell
$ deno install jsr:@std/testing npm:express
```

:::tip

You can also use `deno add` which is an alias to `deno install [PACKAGES]`

:::

If your project has a `package.json` file, the packages coming from npm will be
added to `dependencies` in `package.json`. Otherwise all packages will be added
to `deno.json`.

### deno install --entrypoint [FILES]

Use this command to install all depenedencies that are used in the provided
files and their dependencies.

This is particularly useful if you use `jsr:`, `npm:`, `http:` or `https:`
specifiers in your code and want to cache all the dependencies before deploying
your project.

```js title="main.js"
import * as colors from "jsr:@std/fmt/colors";
import express from "npm:express";
```

```shell
$ deno install -e main.js
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

```shell
$ deno install --global --allow-net --allow-read jsr:@std/http/file-server
Download jsr:@std/http/file-server...

✅ Successfully installed file-server.
/Users/deno/.deno/bin/file-server
```

To change the executable name, use `-n`/`--name`:

```shell
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

```shell
deno install -g -N -R --root /usr/local/bin jsr:@std/http/file-server
```

The installation root is determined, in order of precedence:

- `--root` option
- `DENO_INSTALL_ROOT` environment variable
- `$HOME/.deno/bin`

These must be added to the path manually if required.

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

You must specify permissions that will be used to run the script at installation
time.

```shell
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

```shell
# Install using deno install

$ deno install -n awesome_cli https://example.com/awesome/cli.ts
```

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

```shell
deno install --allow-scripts=npm:sqlite3
```

_Install all dependencies and allow `npm:sqlite3` package to run its lifecycle
scripts_.

## Uninstall

You can uninstall dependencies or binary script with `deno uninstall` command:

```shell
$ deno uninstall express
Removed express
```

```shell
$ deno uninstall -g file-server
deleted /Users/deno/.deno/bin/file-server
✅ Successfully uninstalled file-server
```

See [`deno uninstall` page for more details](/runtime/reference/cli/uninstall/).
