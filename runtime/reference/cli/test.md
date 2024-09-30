---
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
---

## Description

Evaluate the given modules, run all tests declared with 'Deno.test()' and report
results to standard output:

```bash
deno test
```

Directory arguments are expanded to all contained files matching the glob
`{__,_.,}test.{js,mjs,ts,mts,jsx,tsx}`

The test runner is rich in functionality and supports a number of options.

It can be executed in watch mode (`--watch`), supports parallel execution
(`--parallel`), and can be configured to run tests in a random order with
(`--shuffle`). Additionally, there is built in support for code coverage
(`--coverage`) and leak detection (`--trace-leaks`).

## Examples

- Run tests

```bash
deno test
```

- Run tests in specific files

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

- Run tests where glob matches

```bash
deno test src/*.test.ts
```

- Run tests and skip type-checking

```bash
deno test --no-check
```

- Run tests, re-running on file change

```bash
deno test --watch
```

- Reload everything

```bash
--reload
```

- Reload only standard modules

```bash
--reload=jsr:@std/http/file-server
```

- Reloads specific modules

```bash
--reload=jsr:@std/http/file-server,jsr:@std/assert/assert-equals
```

- Reload all npm modules

```bash
--reload=npm:
```

- Reload specific npm module

```bash
--reload=npm:chalk
```
