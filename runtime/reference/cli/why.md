---
last_modified: 2026-04-29
title: "deno why"
command: why
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno why"
description: "Explain why a package is installed by showing its dependency chains"
---

The `deno why` command explains why a particular package is installed by
printing every dependency path from your project's direct dependencies down to
the queried package. It reads the lockfile, so it works regardless of which
node_modules / npm resolver mode you use.

## Usage

```sh
deno why <package>
```

The argument is an npm or JSR package name, optionally pinned to a specific
version with `@<version>`.

## Examples

Find every path that pulls in `ms`:

```sh
deno why ms
ms@2.0.0
  npm:express@^4.18.0 > debug@2.6.9 > ms@2.0.0
  npm:express@^4.18.0 > body-parser@1.20.4 > debug@2.6.9 > ms@2.0.0
  npm:express@^4.18.0 > finalhandler@1.3.2 > debug@2.6.9 > ms@2.0.0

ms@2.1.3
  npm:express@^4.18.0 > send@0.19.2 > ms@2.1.3
```

When more than one version is in the tree, each is shown in its own block.

Filter to a single version:

```sh
deno why ms@2.0.0
```

If the package is not part of the resolved dependency tree, `deno why` reports
that and exits non-zero — useful in CI scripts that assert a package is _not_
pulled in.
