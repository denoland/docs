---
last_modified: 2026-05-20
title: "deno add"
command: add
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno add"
description: "Add and manage project dependencies with Deno"
---

The `deno add` command adds dependencies to your project's configuration file.
It is an alias for
[`deno install [PACKAGES]`](/runtime/reference/cli/install/#deno-install-packages).
For more on how Deno handles dependencies, see
[Modules and dependencies](/runtime/fundamentals/modules/).

## Examples

Add packages from JSR and npm. Starting in Deno 2.8, unprefixed package names
are treated as npm packages by default, so the `npm:` prefix is no longer
required at the CLI:

```sh
# Deno 2.8+ — unprefixed names install from npm
deno add express
deno add express hono zod

# JSR packages still need the jsr: prefix
deno add jsr:@std/path

# The npm: prefix still works and remains required in `import` specifiers
deno add npm:express
```

By default, dependencies are added with a caret (`^`) version range. Use
`--save-exact` to pin to an exact version:

```sh
deno add --save-exact @std/path
```

This saves the dependency without the `^` prefix (e.g., `1.0.0` instead of
`^1.0.0`).

## Where dependencies are stored

If your project has a `package.json`, npm packages will be added to
`dependencies` in `package.json`. Otherwise, all packages are added to the
`imports` field in [`deno.json`](/runtime/fundamentals/configuration/).

To force every dependency to be written to `package.json` (creating one if
needed), pass `--package-json` (Deno 2.8+):

```sh
deno add --package-json npm:express jsr:@std/path
```

JSR packages added with `--package-json` are written in their npm-compatible
form (`npm:@jsr/...`). The same flag works on
[`deno install`](/runtime/reference/cli/install/),
[`deno remove`](/runtime/reference/cli/remove/), and
[`deno uninstall`](/runtime/reference/cli/uninstall/).
