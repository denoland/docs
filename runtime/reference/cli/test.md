---
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno test"
---

## Additional information

It can be executed in watch mode (`--watch`), supports parallel execution
(`--parallel`), and can be configured to run tests in a random order with
(`--shuffle`). Additionally, there is built in support for code coverage
(`--coverage`) and leak detection (`--trace-leaks`).

## Examples

Run tests

```bash
deno test
```

Run tests in specific files

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

Run tests where glob matches

```bash
deno test src/*.test.ts
```

Run tests and skip type-checking

```bash
deno test --no-check
```

Run tests, re-running on file change

```bash
deno test --watch
```
