---
title: "deno bundle"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bundle"
info: "`deno bundle` is currently an experimental subcommand and is subject to changes."
---

`deno bundle` combines your module and all of its dependencies into a single
JavaScript file.

## Basic usage

```sh
deno bundle main.ts output.js
```

The output file can then be run with Deno or in other JavaScript runtimes:

```sh
deno run output.js
```

For more on bundling strategies with Deno, see the
[Bundling](/runtime/reference/bundling/) guide.
