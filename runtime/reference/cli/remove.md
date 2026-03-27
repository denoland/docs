---
title: "deno remove"
command: remove
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno remove"
description: "Remove a dependency from your project"
---

`deno remove` removes dependencies from your project's configuration file. It is
the inverse of [`deno add`](/runtime/reference/cli/add/).

## Basic usage

Remove a package:

```bash
deno remove @std/path
```

Remove multiple packages at once:

```bash
deno remove @std/path @std/assert npm:express
```

## Where dependencies are removed from

If your project has a `package.json`, npm packages will be removed from
`dependencies` in `package.json`. Otherwise, packages are removed from the
`imports` field in `deno.json`.
