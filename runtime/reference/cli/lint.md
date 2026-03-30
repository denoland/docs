---
last_modified: 2026-03-12
title: "deno lint"
oldUrl:
  - /runtime/tools/linter/
  - /runtime/fundamentals/linting_and_formatting/lint-cli-ref
  - /runtime/manual/tools/lint/
  - /runtime/manual/tools/linter/
  - /runtime/reference/cli/linter/
command: lint
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno lint"
description: "Run the Deno linter to check your code for errors and apply automated fixes"
---

Deno ships with a built-in linter that analyzes your code for potential errors,
bugs, and stylistic issues. For a broader overview, see
[Linting and Formatting](/runtime/fundamentals/linting_and_formatting/).

## Basic usage

Lint all TypeScript and JavaScript files in the current directory:

```sh
deno lint
```

Lint specific files or directories:

```sh
deno lint src/ main.ts
```

## Watch mode

Automatically re-lint files when they change:

```sh
deno lint --watch
```

## Using in CI

`deno lint` exits with a non-zero status code when it finds violations, making
it suitable for CI pipelines:

```sh
deno lint
deno fmt --check
deno test
```

## Available rules

Deno's linter includes over 100 rules. View all available rules:

```sh
deno lint --rules
```

For a full list with documentation, visit the [lint rules](/lint/) reference.

## Configuring rules in `deno.json`

Customize which rules are active in your `deno.json`:

```json title="deno.json"
{
  "lint": {
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

- **`tags`** — rule sets to enable. Available tags: `recommended`, `fresh`
- **`include`** — additional individual rules to enable
- **`exclude`** — rules to disable even if included by a tag

See the [Configuration](/runtime/fundamentals/configuration/#linting) page for
all available options.

## Including and excluding files

Specify which files to lint in `deno.json`:

```json title="deno.json"
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/generated/**/*.ts"]
  }
}
```

You can also exclude files from the command line:

```sh
deno lint --ignore=dist/,build/
```

## Lint plugins

You can extend the linter with custom rules using
[lint plugins](/runtime/reference/lint_plugins/).

## Ignore directives

### File level

To ignore a whole file use `// deno-lint-ignore-file` at the top of the file:

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

You can also specify the reason for ignoring the file:

```ts
// deno-lint-ignore-file -- reason for ignoring

function foo(): any {
  // ...
}
```

The ignore directive must be placed before the first statement or declaration:

```ts
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

/**
 * Some JS doc
 */

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

You can also ignore certain diagnostics in the whole file:

```ts
// deno-lint-ignore-file no-explicit-any no-empty

function foo(): any {
  // ...
}
```

If there are multiple `// deno-lint-ignore-file` directives, all but the first
one are ignored:

```ts
// This is effective
// deno-lint-ignore-file no-explicit-any no-empty

// But this is NOT effective
// deno-lint-ignore-file no-debugger

function foo(): any {
  debugger; // not ignored!
}
```

### Line level

To ignore specific diagnostics use `// deno-lint-ignore <codes...>` on the
preceding line of the offending line.

```ts
// deno-lint-ignore no-explicit-any
function foo(): any {
  // ...
}

// deno-lint-ignore no-explicit-any explicit-function-return-type
function bar(a: any) {
  // ...
}
```

You must specify the names of the rules to be ignored.

You can also specify the reason for ignoring the diagnostic:

```ts
// deno-lint-ignore no-explicit-any -- reason for ignoring
function foo(): any {
  // ...
}
```

## Ignore `ban-unused-ignore` itself

`deno lint` provides [`ban-unused-ignore` rule](/lint/rules/ban-unused-ignore/),
which will detect ignore directives that don't ever suppress certain
diagnostics. This is useful when you want to discover ignore directives that are
no longer necessary after refactoring the code.

In a few cases, however, you might want to ignore `ban-unused-ignore` rule
itself. One of the typical cases would be when working with auto-generated
files; it makes sense to add file-level ignore directives for some rules, and
there's almost no need for detecting unused directives via `ban-unused-ignore`
in this case.

You can use `// deno-lint-ignore-file ban-unused-ignore` as always if you want
to suppress the rule for a whole file:

```ts
// deno-lint-ignore-file ban-unused-ignore no-explicit-any

// `no-explicit-any` isn't used but you'll get no diagnostics because of ignoring
// `ban-unused-ignore`
console.log(42);
```

Do note that ignoring `ban-unused-ignore` itself only works via file-level
ignore directives. This means that per line directives, like
`// deno-lint-ignore ban-unused-ignore`, don't work at all. If you want to
ignore `ban-unused-ignore` for some special reasons, make sure to add it as a
file-level ignore directive.
