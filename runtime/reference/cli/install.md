---
title: "`deno install`"
oldUrl:
 - /runtime/manual/tools/script_installer/
 - /runtime/reference/cli/script_installer/
 - /runtime/manual/tools/script_installer/
 - /runtime/manual/tools/cache/
 - /runtime/reference/cli/cache/
---

`deno install` is a tool that allows you to install remote dependencies to use
in your project or as executables available on your machine.

There are four ways to use `deno install`:

- `deno install` - install all dependencies specified in `deno.json` and
  `package.json`
- `deno install [PACKAGES]` - install and add specified dependencies to
  `deno.json` or `package.json`
- `deno install --entrypoint [FILES]` - install all remote dependencies
  discovered from the provided files
- `deno install --global [PACKAGE_OR_URL]` - install a dependency as an
  executable program on your machine

:::info

`deno install` works in similar manner to other package managers like `npm`,
`yarn`, `pnpm` or `bun`.

:::

## `deno install`

Use this command to install all dependencies defined in `deno.json` and/or
`package.json`.

The dependencies will be installed in the global cache, but if your project has
a `package.json` file, a local `node_modules` directory will be set up as well.

// TODO: show example `deno.json` and `package.json` combinations and project
state after running `deno install`

## `deno install [PACKAGES]`

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

// TODO: show project structure based on the info above

## `deno install --entrypoint [FILES]`

Use this command to install all depenedencies that are used in the provided
files. This is particularly useful if you use `jsr:`, `npm:`, `http:` or
`https:` specifiers in your code and want to cache all the dependencies before
deploying your project.

```js title="main.js"
import * as colors from "jsr:@std/fmt/colors";
import express from "npm:express";
```

```shell
$ deno install -e main.js
Download jsr:@std/fmt
Download npm:express
```

## `deno install --global [PACKAGE_OR_URL]`

Use this command to install provide package or script as a globally available
binary on your system.

// TODO: revise this section

Deno provides `deno install` to easily install and distribute executable code.

`deno install [OPTIONS...] [URL] [SCRIPT_ARGS...]` will install the script
available at `URL` under the name `EXE_NAME`.

This command creates a thin, executable shell script which invokes `deno` using
the specified CLI flags and main module. It is placed in the installation root's
`bin` directory.

Example:

```shell
$ deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts
[1/1] Compiling https://deno.land/std/http/file_server.ts

✅ Successfully installed file_server.
/Users/deno/.deno/bin/file_server
```

To change the executable name, use `-n`/`--name`:

```shell
deno install --allow-net --allow-read -n serve https://deno.land/std/http/file_server.ts
```

The executable name is inferred by default:

- Attempt to take the file stem of the URL path. The above example would become
  'file_server'.
- If the file stem is something generic like 'main', 'mod', 'index' or 'cli',
  and the path has no parent, take the file name of the parent path. Otherwise
  settle with the generic name.
- If the resulting name has an '@...' suffix, strip it.

To change the installation root, use `--root`:

```shell
deno install --allow-net --allow-read --root /usr/local https://deno.land/std/http/file_server.ts
```

The installation root is determined, in order of precedence:

- `--root` option
- `DENO_INSTALL_ROOT` environment variable
- `$HOME/.deno`

These must be added to the path manually if required.

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

You must specify permissions that will be used to run the script at installation
time.

```shell
deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts -- -p 8080
```

The above command creates an executable called `file_server` that runs with
network and read permissions and binds to port 8080.

For good practice, use the
[`import.meta.main`](../../tutorials/module_metadata.md) idiom to specify the
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

## Uninstall

You can uninstall the script with `deno uninstall` command.

```shell
$ deno uninstall file_server
deleted /Users/deno/.deno/bin/file_server
✅ Successfully uninstalled file_server
```

See `deno uninstall -h` for more details.
