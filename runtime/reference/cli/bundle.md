---
last_modified: 2026-03-12
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

For more on bundling strategies with Deno, see the
[Bundling](/runtime/reference/bundling/) guide.
