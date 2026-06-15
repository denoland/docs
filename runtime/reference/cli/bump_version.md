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

## Workspace mode

When run at the root of a [workspace](/runtime/fundamentals/workspaces/),
`deno bump-version` operates on every member package in a single pass instead of
just the root config:

- The same increment is applied to each member's `version` field.
- `jsr:` version constraints in the workspace root config and in any
  [import map](/runtime/reference/deno_json/#dependencies) are rewritten in
  place so cross-package references keep matching the bumped versions.
- Members without a `version` field are left alone.

```sh
# At the workspace root: patch every member from 1.4.6 to 1.4.7
deno bump-version patch
```

This avoids the manual coordination step where a workspace release used to
require updating each member's `deno.json`/`package.json` and the root import
map one at a time.

## Deriving bumps from Conventional Commits

Inside a workspace, running `deno bump-version` with no `increment` argument
switches to deriving per-package bumps from
[Conventional Commits](https://www.conventionalcommits.org/) between a base ref
and the current branch. Each member's bump is computed independently from the
commits that touched files inside it (honoring scoped commits and wildcard `*`
scopes), and the bumped versions are written back to the member configs and any
import-map constraints.

The derivation rules:

- `fix:` and other patch-level types → `patch`.
- `feat:` → `minor`.
- A commit marked `BREAKING CHANGE:` in the body or with a `!` after the type
  (e.g. `feat!:`) → `major`.
- For packages still on `0.x.y`, semver rules are applied conservatively: a
  breaking change yields a `minor` bump rather than `major`, and a `feat:`
  yields `patch`.
- Prereleases (`-0`, `-1`, …) get a `prerelease` increment.
- Any manual edits to a package's version since the base ref are treated as
  authoritative and skipped — the tool won't overwrite a deliberate version
  pick.

```sh
# Derive the bumps from commits between `main` and the current branch
deno bump-version --base=main
```

### Selecting the range

Two flags pin the comparison range when the default (the current branch since
the latest tag) isn't what you want:

- `--base=<ref>` — the ref to compare against. Usually a release branch or tag
  (`--base=main`, `--base=v1.4.7`).
- `--start=<ref>` — the ref where the changeset begins. Defaults to the merge
  base between `--base` and `HEAD`.

```sh
# Bump based on commits between v1.4.7 and the current branch
deno bump-version --base=v1.4.7

# Bump based on commits between two explicit refs
deno bump-version --base=v1.4.7 --start=release/1.5
```

### `--dry-run`

Pass `--dry-run` to print the planned changes — which packages would bump, the
old/new version pairs, and the rewritten `jsr:` constraints — without writing
anything to disk:

```sh
deno bump-version --base=main --dry-run
```

This is a good fit for CI checks ("does this branch produce the bumps we
expect?") and for previewing a release locally before committing.
