---
title: "deno coverage"
oldUrl: /runtime/manual/tools/coverage/
command: coverage
---

## Description

Print coverage reports from coverage profiles.

By default, when you run `deno test --coverage` a coverage profile will be
generated in the `/coverage` directory in the current working directory.
Subsequently you can run `deno coverage` to print a coverage report to stdout.

```bash
deno test --coverage
deno coverage
```

## Inclusions and Exclusions

By default coverage includes any of your code that exists on the local file
system, and it's imports.

You can customize the inclusions and exclusions by using the `--include` and
`--exclude` options.

You can expand the coverage to include files that are not on the local file
system by using the `--include` option and customizing the regex pattern.

```bash
deno coverage --include="^file:|https:"
```

The default inclusion pattern should be sufficient for most use cases, but you
can customize it to be more specific about which files are included in your
coverage report.

Files that contain `test.js`, `test.ts`, `test.jsx`, or `test.tsx` in their name
are excluded by default.

This is equivalent to:

```bash
deno coverage --exclude="test\.(js|mjs|ts|jsx|tsx)$"
```

This default setting prevents your test code from contributing to your coverage
report. For a URL to match it must match the include pattern and not match the
exclude pattern.

## Output Formats

By default we support Deno's own coverage format - but you can also output
coverage reports in the lcov format, or in html.

```bash
deno coverage --lcov --output=cov.lcov
```

This lcov file can be used with other tools that support the lcov format.

```bash
deno coverage --html
```

This will output a coverage report as a html file

## Examples

- Generate a coverage report from the default coverage profile in your workspace

```bash
deno test --coverage
deno coverage
```

- Generate a coverage report from a coverage profile with a custom name

```bash
deno test --coverage=custom_profile_name
deno coverage custom_profile_name
```

- Only include coverage that matches a specific pattern - in this case, only
  include tests from main.ts

```bash
deno coverage --include="main.ts"
```

- Export test coverage from the default coverage profile to an lcov file

```bash
deno test --coverage
deno coverage --lcov --output=cov.lcov
```
