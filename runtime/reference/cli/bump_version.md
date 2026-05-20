---
last_modified: 2026-04-29
title: "deno bump-version"
command: bump-version
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bump-version"
description: "Bump the project version field in deno.json or package.json"
---

The `deno bump-version` command updates the `version` field in your project's
configuration file, similar to `npm version`. It reads and writes the `version`
field in `deno.json(c)` if present, otherwise it falls back to `package.json`.

:::caution

`deno bump-version` is experimental and subject to change.

:::

## Usage

```sh
deno bump-version [increment]
```

The `increment` argument selects how the version is bumped:

| Increment    | Example               |
| ------------ | --------------------- |
| `patch`      | `1.4.6` → `1.4.7`     |
| `minor`      | `1.4.6` → `1.5.0`     |
| `major`      | `1.4.6` → `2.0.0`     |
| `prepatch`   | `1.4.6` → `1.4.7-0`   |
| `preminor`   | `1.4.6` → `1.5.0-0`   |
| `premajor`   | `1.4.6` → `2.0.0-0`   |
| `prerelease` | `1.4.7-0` → `1.4.7-1` |

If `increment` is omitted, the current version is printed and the configuration
file is left unchanged.

If the configuration file has no `version` field and an increment is given, the
version defaults to `0.1.0`.

The command exits with an error if neither `deno.json` nor `package.json` is
found in the current directory.

## Examples

Release a patch:

```sh
deno bump-version patch
```

Cut a new minor release:

```sh
deno bump-version minor
```

Iterate on a prerelease:

```sh
deno bump-version prerelease
```

Print the current version without modifying the file:

```sh
deno bump-version
```

After bumping, commit the updated configuration file as part of your release.
For publishing the bumped version to JSR, see
[`deno publish`](/runtime/reference/cli/publish/); for an npm tarball, see
[`deno pack`](/runtime/reference/cli/pack/).
