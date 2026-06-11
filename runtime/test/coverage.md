---
title: "Test coverage"
description: "Collect coverage data with deno test --coverage and turn it into terminal summaries, HTML reports, and lcov files for CI with deno coverage."
oldUrl:
  - /runtime/manual/basics/testing/coverage/
---

Code coverage tells you which lines, branches, and functions of your code
actually ran while your tests executed. Deno has coverage built in: no
instrumentation step, no extra dependencies. The workflow is two commands:
`deno test --coverage` collects the data, and
[`deno coverage`](/runtime/reference/cli/coverage/) turns it into a report.

## Collect coverage data

Pass `--coverage` when you run your tests:

```sh
deno test --coverage
```

This writes raw coverage data into a `coverage/` directory as one JSON profile
per module. The data comes directly from the V8 JavaScript engine, which tracks
execution as your code runs, so the numbers reflect exactly what executed rather
than an approximation from source rewriting.

Deno also prints a coverage summary table after the test results and writes an
`lcov.info` file and an HTML report into the coverage directory. If you only
want the raw profiles, pass `--coverage-raw-data-only`.

To use a different directory, give the flag a value, or set the
`DENO_COVERAGE_DIR` environment variable:

```sh
deno test --coverage=cov_profile
```

Coverage data accumulates across runs. When you rename or delete files, stale
profiles can linger and skew the report, so pass `--clean` to empty the
directory before the tests run:

```sh
deno test --clean --coverage
```

## Read the report

Point `deno coverage` at the directory you collected into:

```sh
deno coverage coverage/
```

For a fresh project created with `deno init`, which generates a `main.ts` HTTP
handler and a `main_test.ts` that exercises it, the report looks like this:

```console
$ deno coverage coverage/
| File      | Branch % | Function % | Line % |
| --------- | -------- | ---------- | ------ |
| main.ts   |     75.0 |      100.0 |   80.0 |
| All files |     75.0 |      100.0 |   80.0 |
```

Each row shows three percentages for a file:

- **Branch %**: how many conditional paths (each side of an `if`, ternary, and
  so on) were taken
- **Function %**: how many declared functions were called at least once
- **Line %**: how many executable lines ran

To see which lines were missed, add `--detailed`. Uncovered lines are listed
under each file:

```console
$ deno coverage --detailed coverage/
cover file:///dev/my-project/main.ts ... 80.000% (12/15)
  16 | if (import.meta.main) {
  17 |   Deno.serve(handler);
  18 | }
```

Here the tests import and call the `handler` function directly but never start
the server, so the `import.meta.main` block at the bottom of `main.ts` is the
code that never ran. That is exactly the kind of insight to act on: either test
the missing path or [exclude it deliberately](#ignore-code-in-the-report).

## Generate an HTML report

For anything bigger than a couple of files, the HTML report is easier to
navigate. It shows the summary table as a clickable file tree, with each source
file rendered line by line and uncovered code highlighted:

```sh
deno coverage --html coverage/
```

This writes the report to `coverage/html/`. Open `coverage/html/index.html` in a
browser to explore it.

## Export lcov for CI

Most coverage services and editor extensions consume the
[lcov format](https://github.com/linux-test-project/lcov). Export one with
`--lcov`:

```sh
deno coverage --lcov --output=coverage.lcov coverage/
```

Without `--output`, the lcov report is written to stdout. In a GitHub Actions
workflow, generate the file and upload it to your coverage service, for example
with the Codecov action:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: denoland/setup-deno@v2
  - run: deno test --coverage
  - run: deno coverage --lcov --output=coverage.lcov coverage/
  - uses: codecov/codecov-action@v5
    with:
      files: coverage.lcov
```

## Enforce a coverage threshold

`deno coverage` reports coverage but has no built-in flag to fail when coverage
drops below a target. There are two common ways to gate on coverage:

1. Let your coverage service do it. Codecov, Coveralls, and similar services can
   fail a pull request status check when coverage decreases or falls below a
   configured target, and they track trends over time.
2. Check the lcov file yourself in CI. Each file's record contains `LF` (lines
   found) and `LH` (lines hit), so summing them gives the overall line coverage:

```sh
deno coverage --lcov coverage/ > coverage.lcov
awk -F: '/^LF/ {lf += $2} /^LH/ {lh += $2}
  END {pct = 100 * lh / lf; printf "line coverage: %.1f%%\n", pct;
  exit (pct < 80)}' coverage.lcov
```

The `awk` script exits non-zero when line coverage is below 80%, which fails the
CI step.

## Choose which files appear

By default the report includes your local code and its imports (URLs matching
`^file:`), and excludes anything with `test.js`, `test.mjs`, `test.ts`,
`test.jsx`, or `test.tsx` in its name so your test files do not inflate the
numbers. Adjust this with the `--include` and `--exclude` regex options. A file
appears in the report only if it matches the include pattern and does not match
the exclude pattern:

```sh
# Report on main.ts only
deno coverage --include="main.ts" coverage/

# Also include remote modules fetched over https
deno coverage --include="^file:|https:" coverage/
```

## Ignore code in the report

Some code is intentionally untested: platform-specific fallbacks, debug helpers,
or an entry-point block like the `import.meta.main` example above. Mark it with
coverage ignore comments and it is treated as blank lines rather than counted
against you:

```ts
// deno-coverage-ignore
console.log("this single line is ignored");

// deno-coverage-ignore-start
if (import.meta.main) {
  Deno.serve(handler);
}
// deno-coverage-ignore-stop
```

To drop a whole file from the report, put `// deno-coverage-ignore-file` at the
top of the file. Every `-start` comment needs a matching `-stop`, and ranges
cannot be nested. See
[ignoring code](/runtime/reference/cli/coverage/#ignoring-code) in the reference
for the full rules.

## Keep going

- [Testing in Deno](/runtime/test/): the test runner, assertions, and mocking
- [`deno coverage` reference](/runtime/reference/cli/coverage/): every flag and
  ignore-comment rule
- [`deno test` reference](/runtime/reference/cli/test/): all test runner
  options, including coverage collection
