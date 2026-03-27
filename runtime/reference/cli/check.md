---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno check"
description: "Download and type-check code without execution"
---

`deno check` type-checks your TypeScript (or JavaScript) code without running
it. This is useful in CI pipelines or before deploying to catch type errors
early.

## Basic usage

```sh title=">_"
$ deno check main.ts
```

Check multiple files:

```sh title=">_"
$ deno check src/server.ts src/utils.ts
```

## Type-checking remote modules

By default, only local modules are type-checked. Use `--all` to also type-check
remote dependencies:

```sh title=">_"
$ deno check --all main.ts
```

## Type-checking JavaScript files

If you have a JavaScript project and want to type-check it without adding
`// @ts-check` to every file, use the `--check-js` flag:

```sh title=">_"
$ deno check --check-js main.js
```

## Using in CI

`deno check` exits with a non-zero status code if there are type errors, making
it suitable for CI pipelines:

```sh title=">_"
$ deno check main.ts && echo "Types OK"
```

Note that [`deno test`](/runtime/reference/cli/test/) and
[`deno bench`](/runtime/reference/cli/bench/) already perform type-checking by
default, so you don't need a separate `deno check` step if you're already
running tests. Use `deno check` when you want to type-check without running
anything — for example, as a fast early step in CI:

```sh title=">_"
$ deno check main.ts
$ deno lint
$ deno test
```
