---
last_modified: 2026-05-20
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

## CommonJS and ESM auto-detection

Starting in Deno 2.8, `deno eval` defaults to ESM but switches to CommonJS when
the snippet looks like a CJS script. A snippet is treated as CJS only when it
has no `import` / `export` declarations **and** it references one of the
CommonJS-specific bindings: `require(`, `module.exports`, `exports.`,
`__dirname`, or `__filename`. Anything else — including plain expressions — runs
as ESM, matching the longstanding `deno eval` default.

```sh
# Detected as CommonJS — uses require()
deno eval "const path = require('path'); console.log(path.join('a', 'b'))"

# Runs as ESM (the default) — no CJS-specific patterns
deno eval "console.log(1 + 2)"

# Runs as ESM because of the static import
deno eval "import { ok } from 'node:assert'; ok(true); console.log('ok')"
```

If the heuristic gets it wrong — for example when a snippet mentions `require`
only inside a string — pass `--ext=mjs` to force ESM or `--ext=cjs` to force
CommonJS.

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
