---
last_modified: 2025-03-10
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno test"
description: "Run tests for your project with Deno's built-in test runner"
---

Deno ships with a built-in test runner using the
[`Deno.test()`](/api/deno/~/Deno.test) API. To learn how to write tests, see the
[Testing fundamentals](/runtime/fundamentals/testing/) guide. For assertions,
see [`@std/assert`](/runtime/reference/std/assert/) and
[`@std/expect`](/runtime/reference/std/expect/).

## Running tests

Run all tests in the current directory and subdirectories:

```sh
deno test
```

Run tests in specific files:

```sh
deno test src/fetch_test.ts src/signal_test.ts
```

Run tests matching a glob pattern:

```sh
deno test src/*.test.ts
```

Run tests whose name matches a string or pattern:

```sh
deno test --filter "database"
deno test --filter "/^connect.*/"
```

Skip type-checking:

```sh
deno test --no-check
```

## Permissions

Tests run with the same [permission model](/runtime/fundamentals/security/) as
`deno run`. Grant permissions for your test suite:

```sh
deno test --allow-read --allow-net
```

## Watch mode

Re-run tests automatically when files change:

```sh
deno test --watch
```

## Parallel execution

Run test files across multiple worker threads:

```sh
deno test --parallel
```

By default, `--parallel` uses the number of available CPUs. Use `DENO_JOBS=<N>`
to control the number of threads:

```sh
DENO_JOBS=4 deno test --parallel
```

## Code coverage

Collect coverage data and generate a report:

```sh
deno test --coverage
```

This writes raw coverage data to a `coverage/` directory. To generate a summary
from existing coverage data, use
[`deno coverage`](/runtime/reference/cli/coverage/):

```sh
deno coverage coverage/
```

You can also output an `lcov` report for use with external tools:

```sh
deno coverage --lcov coverage/ > coverage.lcov
```

## Reporters

Choose an output format with `--reporter`:

```sh
deno test --reporter=dot
deno test --reporter=tap
```

Write a JUnit XML report for CI systems:

```sh
deno test --junit-path=report.xml
```

## Randomize order

Shuffle the order tests run in to catch hidden dependencies between tests:

```sh
deno test --shuffle
```

## Leak detection

Trace the source of leaked async operations, timers, or resources:

```sh
deno test --trace-leaks
```

## Testing code in documentation

Evaluate code blocks in JSDoc and Markdown files as tests:

```sh
deno test --doc
```

See [Testing code in docs](/runtime/reference/documentation/) for details.
