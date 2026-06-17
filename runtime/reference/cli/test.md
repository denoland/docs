---
last_modified: 2026-06-17
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno test"
description: "Run tests for your project with Deno's built-in test runner"
---

Deno ships with a built-in test runner using the
[`Deno.test()`](/api/deno/~/Deno.test) API. To learn how to write tests, see the
[Testing fundamentals](/runtime/test/) guide. For assertions, see
[`@std/assert`](/runtime/reference/std/assert/) and
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

Skip type-checking:

```sh
deno test --no-check
```

## Filtering

Run only the tests whose name matches a string or a pattern with `--filter`:

```sh
# Run tests whose name contains "database"
deno test --filter "database"

# Run tests whose name matches a regular expression
deno test --filter "/^connect.*/"
```

Wrap the filter value in forward slashes (`/`) to treat it as a regular
expression, like JavaScript's regex literal syntax. Filtering does not affect
test steps: when a test's name matches the filter, all of its steps run.

To control which test files are collected in the first place, set `test.include`
and `test.exclude` in your config file. See
[include and exclude](/runtime/reference/deno_json/#include-and-exclude).

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

Choose an output format with `--reporter`. Four reporters are built in:

- `pretty` (default): detailed, human-readable output
- `dot`: one character per test, for a concise overview
- `junit`: JUnit XML format, for CI systems
- `tap`: [Test Anything Protocol](https://testanything.org/) output

```sh
deno test --reporter=dot
deno test --reporter=tap
```

Write a JUnit XML report to a file while keeping the human-readable `pretty`
output in the terminal:

```sh
deno test --junit-path=report.xml
```

## Randomize order

Shuffle the order tests run in to catch hidden dependencies between tests:

```sh
deno test --shuffle
```

## Sharding

Split a test suite across several machines with `--shard=<index>/<count>`, where
`index` is 1-based. The discovered test files are sorted for a stable order and
divided into `<count>` balanced groups; the run executes only the files in group
`<index>`:

```sh
# On machine 1 of 3
deno test --shard=1/3

# On machine 2 of 3
deno test --shard=2/3
```

Sharding is applied before `--shuffle`, so a given shard runs the same files on
every machine regardless of the shuffle seed.

## Retrying and repeating

Set a run-wide default for retries and repetitions with `--retry` and
`--repeats`:

```sh
# Re-run each failing test up to twice before reporting failure
deno test --retry=2

# Run every test three times and fail if any run fails
deno test --repeats=3
```

A test that sets its own `retry` or `repeats` option overrides the flag. See
[retrying and repeating tests](/runtime/test/#retrying-and-repeating-tests) for
the per-test options.

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

See [documentation tests](/runtime/test/doc_tests/) for details.
