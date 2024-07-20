---
title: "Test Coverage"
---

Deno will collect test coverage into a directory for your code if you specify the `--coverage` flag when starting `deno test`. 
This coverage information is acquired directly from the JavaScript engine (V8), ensuring high accuracy.

This can then be further processed from the internal format into well known formats by the `deno coverage` tool.

> ⚠️ To ensure consistent coverage results, make sure to process coverage data
> immediately after running tests. Otherwise source code and collected coverage
> data might get out of sync and unexpectedly show uncovered lines.

The `--clean` flag has been introduced to the test runner [with Deno v1.44](https://deno.com/blog/v1.44#clean-coverage-directory-on-test-runs). This flag empties the coverage directory before running the test suite, preventing outdated coverage data from long-deleted files from lingering. However, be aware that this flag will cause conflicts when running multiple `deno test` commands in parallel or in series, and then viewing the aggregated coverage report. If you are running tests in parallel, you should not use this flag. If running in series, only pass this flag to the first `deno test` invocation.

```bash
# Go into your project's working directory
git clone https://github.com/oakserver/oak && cd oak

# Collect your coverage profile with deno test --coverage=<output_directory>
deno test --coverage=cov_profile

# Use the --clean flag if you need to ensure old coverage data is cleared
deno test --coverage=cov_profile --clean

# From this you can get a pretty printed diff of uncovered lines
deno coverage cov_profile

# Or generate an HTML report
deno coverage cov_profile --html

# Or generate an lcov report
deno coverage cov_profile --lcov --output=cov_profile.lcov

# Which can then be further processed by tools like genhtml
genhtml -o cov_profile/html cov_profile.lcov
```

By default, `deno coverage` will exclude any files matching the regular
expression `test\.(ts|tsx|mts|js|mjs|jsx|cjs|cts)` and only consider including
specifiers matching the regular expression `^file:` - ie. remote files will be
excluded from coverage report.

These filters can be overridden using the `--exclude` and `--include` flags. A
module specifier must _match_ the include_regular expression and _not match_ the
exclude_ expression for it to be a part of the report.
