---
title: "deno eval"
oldUrl: /runtime/manual/tools/eval/
command: eval
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno eval"
description: "Evaluate JavaScript and TypeScript code in the command line"
---

`deno eval` executes a string of code directly from the command line without
needing a file.

## Basic usage

```bash
deno eval "console.log('Hello from Deno')"
```

TypeScript works out of the box:

```bash
deno eval "const greeting: string = 'Hello'; console.log(greeting)"
```

## Printing expression results

Use `--print` (or `-p`) to evaluate an expression and print its result, similar
to `node -e`:

```bash
deno eval -p "1 + 2"
# 3

deno eval -p "Deno.version"
# { deno: "2.x.x", v8: "...", typescript: "..." }
```

## Reading from stdin

Combine with piped input for quick data processing:

```bash
echo '{"name":"deno"}' | deno eval -p "
  const text = await new Response(Deno.stdin.readable).text();
  JSON.parse(text).name
"
```

## Permissions

By default, eval runs in a sandbox. Grant permissions as needed:

```bash
deno eval --allow-net "
  const resp = await fetch('https://api.github.com');
  console.log(resp.status);
"
```

Or grant all permissions with `-A`:

```bash
deno eval -A "console.log(Deno.cwd())"
```
