---
last_modified: 2026-05-20
title: "deno transpile"
command: transpile
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno transpile"
description: "Transpile TypeScript, JSX, or TSX to JavaScript"
---

The `deno transpile` command emits JavaScript from TypeScript, JSX, or TSX
sources. It is useful when you need plain `.js` output to ship to a runtime that
does not understand TypeScript, or to feed into a build step that expects
JavaScript.

For most workflows you do **not** need `deno transpile` — `deno run`,
`deno test`, and `deno serve` already accept `.ts`/`.tsx` files directly.

## Usage

```sh
deno transpile <files...> [flags]
```

`<files>` is one or more source file paths (globs are expanded by the shell).
`deno transpile` does **not** crawl a directory — pass the files you want
transpiled, optionally via a shell glob.

### Output modes

- **stdout** (default): write the transpiled output to standard out.
- **single file** with `-o <path>`: write the output to `<path>`. Conflicts with
  `--outdir`.
- **directory** with `--outdir <dir>`: write the output of each input file into
  `<dir>`, mirroring the source layout.

```sh
# Print to stdout
deno transpile main.ts

# Write to a single file
deno transpile main.ts -o dist/main.js

# Transpile multiple files into an output directory
deno transpile src/main.ts src/helpers.ts --outdir dist

# Use a shell glob
deno transpile src/*.ts --outdir dist
```

### Input/output extension mapping

| Input  | Output | Source map |
| ------ | ------ | ---------- |
| `.ts`  | `.js`  | `.js.map`  |
| `.tsx` | `.js`  | `.js.map`  |
| `.jsx` | `.js`  | `.js.map`  |
| `.mts` | `.mjs` | `.mjs.map` |
| `.cts` | `.cjs` | `.cjs.map` |

JSX transform, decorators, and other emit settings come from `compilerOptions`
in your `deno.json` (or `tsconfig.json`), so the output matches what `deno run`
would execute.

### Source maps

Pass `--source-map` with one of:

| Mode       | Effect                                                 |
| ---------- | ------------------------------------------------------ |
| `none`     | (default) no source map                                |
| `inline`   | embed the source map as a `data:` comment in each file |
| `separate` | write a sibling `.js.map` (or `.mjs.map` / `.cjs.map`) |

```sh
deno transpile main.ts -o dist/main.js --source-map separate
```

### Type declarations

Use `--declaration` to emit `.d.ts` declaration files. Declarations are produced
by `tsc`, so this flag honors the `compilerOptions` from your `deno.json` /
`tsconfig.json`.

`.d.ts` files are always written to disk — next to the source when no output
location is set, or into `--outdir` when one is supplied — even if the
JavaScript output is going to stdout or a single `-o` file.

```sh
deno transpile src/*.ts --outdir dist --declaration
```
