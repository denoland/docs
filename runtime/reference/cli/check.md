---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno check"
description: "Download and type-check code without execution"
---

## Examples

Type-check a TypeScript file without execution:

```ts title="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```

## Type-checking JavaScript files

If you have a JavaScript-only project and want to type-check it with Deno, you
can use the `--check-js` flag instead of adding `// @ts-check` to every file or
setting `compilerOptions.checkJs` in your `deno.json`:

```bash
deno check --check-js main.js
```
