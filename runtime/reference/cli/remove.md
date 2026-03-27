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

```sh
deno remove @std/path
```

Remove multiple packages at once:

```sh
deno remove @std/path @std/assert npm:express
```

## Where dependencies are removed from

`deno remove` will look at both `deno.json` and `package.json` (if present) and
remove the matching dependency from whichever file it is found in.
