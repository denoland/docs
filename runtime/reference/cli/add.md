---
last_modified: 2026-03-12
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

Add packages from JSR and npm:

```sh
deno add @std/path npm:express
```

Starting in Deno 2.8, **unprefixed names default to the npm registry**, since
npm is by far the most common source. Explicit `npm:` and `jsr:` prefixes
always take precedence:

```sh
# Resolves from npm by default
deno add express react

# Mixed sources still work with explicit prefixes
deno add express jsr:@std/async
```

To resolve unprefixed names from JSR instead, pass `--jsr`:

```sh
deno add --jsr @std/path
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
