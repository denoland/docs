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

```bash
deno test
```

Run tests in specific files:

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

Run tests matching a glob pattern:

```bash
deno test src/*.test.ts
```

Run tests whose name matches a string or pattern:

```bash
deno test --filter "database"
deno test --filter "/^connect.*/"
```

Skip type-checking:

```bash
deno test --no-check
```

## Watch mode

Re-run tests automatically when files change:

```bash
deno test --watch
```

## Parallel execution

Run test files across multiple worker threads:

```bash
deno test --parallel
```

By default, `--parallel` uses the number of available CPUs. Use `DENO_JOBS=<N>`
to control the number of threads:

```bash
DENO_JOBS=4 deno test --parallel
```

## Code coverage

Collect coverage data and generate a report:

```bash
deno test --coverage
```

This writes raw coverage data to a `coverage/` directory. To generate a summary
from existing coverage data, use
[`deno coverage`](/runtime/reference/cli/coverage/):

```bash
deno coverage coverage/
```

You can also output an `lcov` report for use with external tools:

```bash
deno coverage --lcov coverage/ > coverage.lcov
```

## Reporters

Choose an output format with `--reporter`:

```bash
deno test --reporter=dot
deno test --reporter=tap
```

Write a JUnit XML report for CI systems:

```bash
deno test --junit-path=report.xml
```

## Randomize order

Shuffle the order tests run in to catch hidden dependencies between tests:

```bash
deno test --shuffle
```

## Leak detection

Detect tests that leak async operations, timers, or resources:

```bash
deno test --trace-leaks
```

## Testing code in documentation

Evaluate code blocks in JSDoc and Markdown files as tests:

```bash
deno test --doc
```

See [Testing code in docs](/runtime/reference/documentation/) for details.

## Permissions

Tests run with the same [permission model](/runtime/fundamentals/security/) as
`deno run`. Grant permissions for your test suite:

```bash
deno test --allow-read --allow-net
```
