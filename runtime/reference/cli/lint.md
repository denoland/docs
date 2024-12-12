---
title: "`deno lint`, linter"
oldUrl:
 - /runtime/tools/linter/
 - /runtime/fundamentals/linting_and_formatting/lint-cli-ref
 - /runtime/manual/tools/linter/
 - /runtime/reference/cli/linter/
command: lint
templateEngine: [vto, md]
---

## Available rules

For a complete list of supported rules, visit
[the deno_lint rule documentation](https://lint.deno.land).

## Ignore directives

### Files

To ignore the whole file, a `// deno-lint-ignore-file` directive should placed
at the top of the file:

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

To ignore certain diagnostics, the `// deno-lint-ignore <rules...>` directive
should be placed before the targeted line. Specifying the ignored rule name is
required:

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
