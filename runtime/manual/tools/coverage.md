# deno coverage

Print coverage reports from coverage profiles.

## Command

`deno coverage [OPTIONS] <COVERAGE>`

## Synopsis

```bash
deno coverage [--ignore=<ignore>] [--include=<regex>] [-q|--quiet] [--exclude=<regex>] [--lcov] [--output=<output>] [--html] [--detailed] [-h|--help] <COVERAGE>

deno coverage -h|--help
```

## Description

Print coverage reports from coverage profiles.

By default, when you run `deno test --coverage` a coverage profile will be generated in the `/coverage` directory in the current working directory.
Subsequently you can run `deno coverage` to print a coverage report to stdout.

```bash
deno test --coverage
deno coverage
```

## Inclusions and Exclusions

By default coverage includes any of your code that exists on the local file system, and it's imports.

You can customize the inclusions and exclusions by using the `--include` and `--exclude` options.

You can expand the coverage to include files that are not on the local file system by using the `--include` option and customizing the regex pattern.

```bash
deno coverage --include="^file:|https:"
```

The default inclusion pattern should be sufficient for most use cases, but you can customize it to be more specific about which files are included in your coverage report.

Files that contain `test.js`, `test.ts`, `test.jsx`, or `test.tsx` in their name are excluded by default.

This is equivalent to:

```bash
deno coverage --exclude="test\.(js|mjs|ts|jsx|tsx)$"
```

This default setting prevents your test code from contributing to your coverage report.
For a URL to match it must match the include pattern and not match the exclude pattern.

## Output Formats

By default we support Deno's own coverage format - but you can also output coverage reports in the lcov format, or in html.

```bash
deno coverage --lcov --output=cov.lcov
```

This lcov file can be used with other tools that support the lcov format.

```bash
deno coverage --html

## Arguments

`COVERAGE`

The name of the coverage profile to use.
This coverage profile will be created as a result of running `deno test --coverage` and appears as a directory in your workspace.

## Options

- `--ignore=<ignore>`

    Ignore coverage files

- `--include=<regex>`

    Include source files in the report

    [default: ^file:]

- `-q, --quiet`

    Suppress diagnostic output

- `--exclude=<regex>`

    Exclude source files from the report

    [default: test\.(js|mjs|ts|jsx|tsx)$]

- `--lcov`

    Output coverage report in lcov format

- `--output=<output>`

    Exports the coverage report in lcov format to the given file.
    Filename should be passed along with '=' For example '--output=foo.lcov'

    If no `--output` option is specified then the report is written to stdout.

- `--html`

    Output coverage report in HTML format in the given directory

- `--detailed`

    Output coverage report in detailed format in the terminal.

- `-h, --help`

    Print help (see a summary with '-h')

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

- Only include coverage that matches a specific pattern - in this case, only include tests from main.ts

```bash
deno coverage --include="main.ts"
```

- Export test coverage from the default coverage profile to an lcov file

```bash
deno test --coverage
deno coverage --lcov --output=cov.lcov
```
