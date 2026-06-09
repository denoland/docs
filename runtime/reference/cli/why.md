---
last_modified: 2026-05-20
title: "deno why"
command: why
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno why"
description: "Explain why a package is installed by showing its dependency chains"
---

The `deno why` command explains why a particular package is in your dependency
tree by printing every path from your project's direct dependencies down to the
queried package. It reads the
[lockfile](/runtime/fundamentals/dependency_management/#integrity-checking-and-lock-files),
so it works regardless of which node_modules / npm resolver mode you use and
without touching the network.

It pairs with [`deno add`](/runtime/reference/cli/add/) and
[`deno remove`](/runtime/reference/cli/remove/): once you know _why_ a
transitive dependency is in your tree, you can decide whether to remove a direct
dependency that's pulling it in.

## Usage

```sh
deno why <package>
```

`<package>` is an npm or JSR package name, optionally pinned with `@<version>`:

| Form            | Meaning                                      |
| --------------- | -------------------------------------------- |
| `ms`            | every version of `ms` in the tree            |
| `ms@2.0.0`      | only the `2.0.0` version                     |
| `@std/path`     | a JSR package by its bare name               |
| `jsr:@std/path` | a JSR package by its full specifier          |
| `npm:express`   | force npm lookup (useful when names collide) |

## Examples

### Multiple paths to a single package

```sh
$ deno why ms
ms@2.0.0
  npm:express@^4.18.0 > debug@2.6.9 > ms@2.0.0
  npm:express@^4.18.0 > body-parser@1.20.4 > debug@2.6.9 > ms@2.0.0
  npm:express@^4.18.0 > finalhandler@1.3.2 > debug@2.6.9 > ms@2.0.0

ms@2.1.3
  npm:express@^4.18.0 > send@0.19.2 > ms@2.1.3
```

When the same package appears at multiple versions, each is shown in its own
block — handy for diagnosing duplicated dependencies that bloat `node_modules`.

### Pinned to a single version

```sh
$ deno why ms@2.1.3
ms@2.1.3
  npm:express@^4.18.0 > send@0.19.2 > ms@2.1.3
```

### JSR packages

```sh
$ deno why @std/path
@std/path@1.0.6
  @scope/my-lib@^1.0.0 > @std/path@1.0.6
  @std/fs@^1.0.16 > @std/path@1.0.6
```

JSR packages added in Deno 2.8+ resolve the same way npm packages do — you can
pass either the bare name (`@std/path`) or the full specifier (`jsr:@std/path`).

### Workspace members

In a [workspace](/runtime/fundamentals/workspaces/), each member's direct
dependencies appear as roots in the output, so a transitive dep introduced by
one package is clearly attributable to that package.

## Exit codes

| Exit code | Meaning                                                                                |
| --------- | -------------------------------------------------------------------------------------- |
| `0`       | The package was found in the resolved tree — at least one dependency path was printed. |
| Non-zero  | The package is not in the resolved tree, or the argument is malformed.                 |

The non-zero exit is the easy way to gate CI on a package _not_ being pulled in.
For example, to assert that `left-pad` never enters your tree:

```sh
# fails the build if left-pad is reachable
! deno why left-pad
```

## Common pitfalls

- **"Package not found" but you _know_ it's used at runtime.** `deno why`
  reports what's _in the lockfile_, not what's _imported by your code_. If
  you've added a `npm:` or `jsr:` specifier but haven't run `deno install` (or
  any subcommand that resolves), the package won't appear yet.
- **Resolution depends on workspace mode.** A package only consumed by one
  workspace member may not show up when run from a different member's directory
  if your workspace setup uses per-member lockfiles. Run `deno why` from the
  workspace root for the complete picture.
