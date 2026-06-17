---
last_modified: 2026-06-17
title: "deno bundle"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bundle"
info: "`deno bundle` is currently an experimental subcommand and is subject to changes."
---

`deno bundle` combines your module and all of its dependencies into a single
JavaScript file, using [esbuild](https://esbuild.github.io/) under the hood.

## Basic usage

```sh
deno bundle -o output.js main.ts
```

Without `-o`/`--output`, the bundle is written to standard output. The output
file can then be run with Deno or in other JavaScript runtimes:

```sh
deno run output.js
```

## Common options

Target a platform with `--platform` (`deno` by default, or `browser`), shrink
the output with `--minify`, and emit source maps with `--sourcemap`:

```sh
deno bundle --platform=browser --minify --sourcemap -o dist/app.js main.ts
```

Split shared code into separate chunks with `--code-splitting` and an output
directory:

```sh
deno bundle --code-splitting --outdir dist/ main.ts worker.ts
```

Keep a dependency out of the bundle with `--external`:

```sh
deno bundle --external npm:sharp -o output.js main.ts
```

Generate TypeScript declarations alongside the JS output with `--declaration`.
Deno rolls up the types for each entry point into a single self-contained
`.d.ts` file:

```sh
deno bundle main.ts --outdir dist --declaration
# Produces dist/main.js and dist/main.d.ts
```

## The `browser` field

When bundling with `--platform=browser`, Deno honors the npm `browser` field in a
dependency's `package.json`, including its object form. The object maps modules
to browser-specific replacements:

```json
{
  "browser": {
    "./server.js": "./client.js",
    "crypto": false,
    "foo": "./shims/foo.js"
  }
}
```

- A relative-path key remaps a resolved file to a browser-specific one
  (`./server.js` becomes `./client.js`).
- A bare-specifier key remaps an import (`foo` becomes `./shims/foo.js`). A
  leading `node:` prefix is stripped before lookup, so `import "node:crypto"`
  matches the `"crypto"` key.
- A value of `false` excludes the module: the bundler substitutes an empty stub.

For more on bundling strategies with Deno, see the
[Bundling](/runtime/reference/bundling/) guide.
