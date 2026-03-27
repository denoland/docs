---
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno test"
description: "Run tests for your project with Deno's built-in test runner"
---

Deno ships with a built-in test runner. To learn how to write tests, see the
[Testing fundamentals](/runtime/fundamentals/testing/) guide.

## Running tests

Run all tests in the current directory and subdirectories:

```sh title=">_"
deno test
```

Run tests in specific files:

```sh title=">_"
deno test src/fetch_test.ts src/signal_test.ts
```

Run tests matching a glob pattern:

```sh title=">_"
deno test src/*.test.ts
```

Run tests whose name matches a string or pattern:

```sh title=">_"
deno test --filter "database"
deno test --filter "/^connect.*/"
```

Skip type-checking:

```sh title=">_"
deno test --no-check
```

## Permissions

Tests run with the same [permission model](/runtime/fundamentals/security/) as
`deno run`. Grant permissions for your test suite:

```sh title=">_"
deno test --allow-read --allow-net
```

## Watch mode

Re-run tests automatically when files change:

```sh title=">_"
deno test --watch
```

## Parallel execution

Run test files across multiple worker threads:

```sh title=">_"
deno test --parallel
```

By default, `--parallel` uses the number of available CPUs. Use `DENO_JOBS=<N>`
to control the number of threads:

```sh title=">_"
DENO_JOBS=4 deno test --parallel
```

## Code coverage

Collect coverage data and generate a report:

```sh title=">_"
deno test --coverage
```

This writes raw coverage data to a `coverage/` directory. To generate a summary
from existing coverage data, use
[`deno coverage`](/runtime/reference/cli/coverage/):

```sh title=">_"
deno coverage coverage/
```

You can also output an `lcov` report for use with external tools:

```sh title=">_"
deno coverage --lcov coverage/ > coverage.lcov
```

## Reporters

Choose an output format with `--reporter`:

```sh title=">_"
deno test --reporter=dot
deno test --reporter=tap
```

Write a JUnit XML report for CI systems:

```sh title=">_"
deno test --junit-path=report.xml
```

## Randomize order

Shuffle the order tests run in to catch hidden dependencies between tests:

```sh title=">_"
deno test --shuffle
```

## Leak detection

Trace the source of leaked async operations, timers, or resources:

```sh title=">_"
deno test --trace-leaks
```

## Testing code in documentation

Evaluate code blocks in JSDoc and Markdown files as tests:

```sh title=">_"
deno test --doc
```

See [Testing code in docs](/runtime/reference/documentation/) for details.
