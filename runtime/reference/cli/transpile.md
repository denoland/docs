---
last_modified: 2026-04-29
title: "deno transpile"
command: transpile
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno transpile"
description: "Transpile TypeScript, JSX, or TSX to JavaScript"
---

The `deno transpile` command emits JavaScript from TypeScript, JSX, or TSX
sources. It is useful when you need plain `.js` output to ship to a runtime
that does not understand TypeScript, or to feed into a build step that expects
JavaScript.

For most workflows you do **not** need `deno transpile` — `deno run`,
`deno test`, and `deno serve` already accept `.ts`/`.tsx` files directly.

## Usage

```sh
deno transpile <input> [flags]
```

### Output modes

- **stdout** (default): write the transpiled output to standard out.
- **single file** with `-o <path>`: write a single input file's output to
  `<path>`.
- **directory** with `--outdir <dir>`: transpile multiple inputs and mirror the
  layout under `<dir>`.

```sh
# Print to stdout
deno transpile main.ts

# Write to a single file
deno transpile main.ts -o dist/main.js

# Transpile a tree of files
deno transpile src/ --outdir dist/
```

### Source maps

Pass `--source-map` with one of:

| Mode       | Effect                                                 |
| ---------- | ------------------------------------------------------ |
| `none`     | (default) no source map                                |
| `inline`   | embed the source map as a `data:` comment in each file |
| `separate` | write a sibling `.js.map` file                         |

```sh
deno transpile main.ts -o dist/main.js --source-map separate
```

### Type declarations

Use `--declaration` to emit `.d.ts` files alongside the JavaScript output.
Declarations are produced by the TypeScript compiler, so this flag honors the
`compilerOptions` from your `deno.json` / `tsconfig.json`.

```sh
deno transpile src/ --outdir dist/ --declaration
```
