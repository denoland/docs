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
JavaScript file, using [esbuild](https://esbuild.github.io/) under the hood. It
is useful for deploying or distributing a project as a single optimized file,
but it is not currently intended as a replacement for complex or interactive
build tools such as [Vite](https://vite.dev/) or
[webpack](https://webpack.js.org/).

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

## Type checking

`deno bundle` does not type-check your code by default. Enable type-checking
with the `--check` flag:

```sh
# type-check local modules while bundling
deno bundle --check -o output.js main.ts

# also type-check remote modules
deno bundle --check=all -o output.js main.ts
```

You can also skip type-checking explicitly with `--no-check`, and
`--no-check=remote` ignores diagnostics from remote modules only.

For more on bundling strategies with Deno, see the
[Bundling](/runtime/reference/bundling/) guide.
