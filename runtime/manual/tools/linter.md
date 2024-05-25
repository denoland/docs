# `deno lint`, linter

Deno ships with a built-in code linter for JavaScript and TypeScript.

```shell
# lint all JS/TS files in the current directory and subdirectories
deno lint
# lint specific files
deno lint myfile1.ts myfile2.ts
# lint all JS/TS files in specified directory and subdirectories
deno lint src/
# print result as JSON
deno lint --json
# read from stdin
cat file.ts | deno lint -
```

For more detail, run `deno lint --help`.

## Available rules

For a complete list of supported rules, visit
[the deno_lint rule documentation](https://lint.deno.land).

## Ignore directives

### Files

To ignore the whole file, a `// deno-lint-ignore-file` directive should placed at the
top of the file:

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

or

```ts
// deno-lint-ignore-file -- reason for ignoring

function foo(): any {
  // ...
}
```

The ignore directive must be placed before the first statement or declaration:

```ts
// Copyright 2020 the Deno authors. All rights reserved. MIT license.

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

### Diagnostics

To ignore certain diagnostics, the `// deno-lint-ignore <rules...>` directive should
be placed before the targeted line. Specifying the ignored rule name is required:

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

You can also specify the reason for ignoring the diagnostic:

```ts
// deno-lint-ignore no-explicit-any -- reason for ignoring
function foo(): any {
  // ...
}
```

## Configuration

Starting with Deno v1.14, the linter can be customized using either
[a configuration file](../getting_started/configuration_file.md) or the following
CLI flags:

- `--rules-tags` - List of rule names that will be run. Empty list disables all
  rules and will only use rules from `rules-include`. Defaults to "recommended".

- `--rules-exclude` - List of rule names that will be excluded from configured
  rule sets. Even if the same rule is in `include`, it will be excluded; in other
  words, `--rules-exclude` has higher precedence over `--rules-include`.

- `--rules-include` - List of rule names that will be run. If the same rule is
  in `rules-exclude`, it will be excluded.
