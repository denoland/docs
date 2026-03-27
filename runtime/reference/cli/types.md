---
title: "deno types"
oldUrl: /runtime/manual/tools/types/
command: types
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno types"
description: "Print Deno's built-in TypeScript type declarations"
---

`deno types` prints the TypeScript type declarations for all Deno-specific APIs.
This is useful for editors and tools that need Deno's type information.

## Basic usage

Print type declarations to stdout:

```sh
deno types
```

Save to a file for use with an editor or type checker:

```sh
deno types > deno.d.ts
```

## When to use this

Most editors with the [Deno extension](/runtime/reference/vscode/) handle types
automatically. You may need `deno types` if you are:

- Using an editor without Deno LSP support
- Generating type declarations for a build pipeline
- Inspecting which APIs are available at your current Deno version
