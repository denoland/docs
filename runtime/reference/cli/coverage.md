---
title: "deno coverage"
oldUrl: /runtime/manual/tools/coverage/
command: coverage
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno coverage"
description: "Generate a coverage report for your code"
---

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

## Ignoring Code

Code can be ignored in generated coverage reports by adding coverage ignore
comments. Branches and lines in ignored code will be excluded from the report.
Ignored branches and lines do not count as covered lines. Instead, ignored lines
of code are treated as empty lines.

To ignore an entire file, add a `// deno-coverage-ignore-file` comment at the
top of the file.

```ts
// deno-coverage-ignore-file

// all code in this file is ignored
```

Ignored files will not appear in the coverage report.

To ignore a single line, add a `// deno-coverage-ignore` comment on the line
above the code you want to ignore.

```ts
// deno-coverage-ignore
console.log("this line is ignored");
```

To ignore multiple lines, add a `// deno-coverage-ignore-start` comment above
the code you want to ignore and a `// deno-coverage-ignore-stop` comment below.

```ts
// deno-coverage-ignore-start
if (condition) {
  console.log("both the branch and lines are ignored");
}
// deno-coverage-ignore-stop
```

All code after a `// deno-coverage-ignore-start` comment is ignored until a
`// deno-coverage-ignore-stop` is reached.

Each `// deno-coverage-ignore-start` comment must be terminated by a
`// deno-coverage-ignore-stop` comment, and ignored ranges may not be nested.
When these requirements are not met, some lines may be unintentionally included
in the coverage report. The `deno coverage` command will log warnings for any
invalid comments.

```ts
// deno-coverage-ignore-start
if (condition) {
  // deno-coverage-ignore-start - A warning will be logged because the previous
  //                              coverage range is unterminated.
  console.log("this code is ignored");
  // deno-coverage-ignore-stop
}
// deno-coverage-ignore-stop

// ...

// deno-coverage-ignore-start - This comment will be ignored and a warning will
//                              be logged, because this range is unterminated.
console.log("this code is not ignored");
```

Only white space may precede the coverage directive in a coverage comment.
However, any text may trail the directive.

```ts
// deno-coverage-ignore Trailing text is allowed.
console.log("This line is ignored");

// But leading text isn't. deno-coverage-ignore
console.log("This line is not ignored");
```

Coverage comments must start with `//`. Comments starting with `/*` are not
valid coverage comments.

```ts
// deno-coverage-ignore
console.log("This line is ignored");

/* deno-coverage-ignore */
console.log("This line is not ignored");
```

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

Generate a coverage report from the default coverage profile in your workspace

```bash
deno test --coverage
deno coverage
```

Generate a coverage report from a coverage profile with a custom name

```bash
deno test --coverage=custom_profile_name
deno coverage custom_profile_name
```

> Note: You can alternatively set coverage directory by `DENO_COVERAGE_DIR` env
> var.
>
> ```
> DENO_COVERAGE_DIR=custom_profile_name deno test
> deno coverage custom_profile_name
> ```

Only include coverage that matches a specific pattern - in this case, only
include tests from main.ts

```bash
deno coverage --include="main.ts"
```

Export test coverage from the default coverage profile to an lcov file

```bash
deno test --coverage
deno coverage --lcov --output=cov.lcov
```
