---
last_modified: 2026-06-25
title: "deno list"
command: list
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno list"
description: "List the dependencies declared in your project"
---

The `deno list` command prints the packages your project declares as
dependencies. It reads them from the `imports` in your
[`deno.json`](/runtime/fundamentals/configuration/) and from the `dependencies`
and `devDependencies` in your `package.json`, resolves each to the version
currently in use, and prints them grouped by package, similar to `npm ls` or
`pnpm list`.

It answers a different question than
[`deno info`](/runtime/reference/cli/info/): `deno info` walks the module graph
from an entrypoint and reports every file it reaches, while `deno list` reports
what the project depends on straight from the manifest, without an entrypoint.

## Usage

```sh
deno list [OPTIONS] [filters...]
```

By default `deno list` prints a flat table of your direct dependencies. Optional
positional `filters` narrow the output by package name and support wildcards and
`!` negation, the same matcher
[`deno outdated`](/runtime/reference/cli/outdated/) uses.

## Options

| Option        | Description                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `--depth <N>` | Render the resolved dependency tree N levels deep, for both npm and JSR packages (read from the lockfile). |
| `--prod`      | Show only production dependencies.                                                                         |
| `--dev`       | Show only development dependencies.                                                                        |
| `--recursive` | Include the dependencies of every workspace member.                                                        |

## Examples

List direct dependencies:

```sh
deno list
```

Show the dependency tree two levels deep:

```sh
deno list --depth 2
```

List only production dependencies whose name starts with `@std/`:

```sh
deno list --prod "@std/*"
```
