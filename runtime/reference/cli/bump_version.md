---
last_modified: 2026-04-29
title: "deno bump-version"
command: bump-version
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bump-version"
description: "Bump the project version field in deno.json or package.json"
---

The `deno bump-version` command updates the `version` field in your project's
configuration file. It works with the first `version` field found in either
`deno.json(c)` or `package.json`, similar to `npm version`.

## Usage

```sh
deno bump-version <increment>
```

The `increment` argument selects how the version is bumped:

| Increment    | Example                |
| ------------ | ---------------------- |
| `patch`      | `1.4.6` → `1.4.7`      |
| `minor`      | `1.4.6` → `1.5.0`      |
| `major`      | `1.4.6` → `2.0.0`      |
| `prepatch`   | `1.4.6` → `1.4.7-0`    |
| `preminor`   | `1.4.6` → `1.5.0-0`    |
| `premajor`   | `1.4.6` → `2.0.0-0`    |
| `prerelease` | `1.4.7-0` → `1.4.7-1`  |

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

After bumping, commit the updated configuration file as part of your release.
