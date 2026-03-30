---
last_modified: 2025-03-10
title: "deno eval"
oldUrl: /runtime/manual/tools/eval/
command: eval
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno eval"
description: "Evaluate JavaScript and TypeScript code in the command line"
---

`deno eval` executes a string of code directly from the command line without
needing a file. Unlike `deno run`, **`deno eval` runs with all permissions
enabled by default**.

## Basic usage

```sh
deno eval "console.log('Hello from Deno')"
```

TypeScript works out of the box:

```sh
deno eval "const greeting: string = 'Hello'; console.log(greeting)"
```

## CommonJS support

CommonJS modules are automatically recognized and supported:

```sh
deno eval "const path = require('path'); console.log(path.join('a', 'b'))"
```

## Printing expression results

Use `--print` (or `-p`) to evaluate an expression and print its result, similar
to `node -p`:

```sh
deno eval -p "1 + 2"
# 3

deno eval -p "Deno.version"
# { deno: "2.x.x", v8: "...", typescript: "..." }
```

## Reading from stdin

Combine with piped input for quick data processing:

```sh
echo '{"name":"deno"}' | deno eval -p "
  const text = await new Response(Deno.stdin.readable).text();
  JSON.parse(text).name
"
```
