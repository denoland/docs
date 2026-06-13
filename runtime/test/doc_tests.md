---
title: "Documentation tests"
description: "Run the code examples in your JSDoc comments and markdown files as tests with deno test --doc, so your documentation never goes stale."
oldUrl:
  - /runtime/manual/testing/documentation/
  - /runtime/manual/basics/testing/documentation/
  - /runtime/reference/documentation/
---

Deno can evaluate the code snippets written in your JSDoc comments and markdown
files and run them as tests. This keeps the examples in your documentation
honest: when an API changes, its outdated examples fail in CI instead of
misleading readers.

## Example code blocks

````ts title="example.ts"
/**
 * # Examples
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(1, 2);
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
````

The triple backticks mark the start and end of code blocks, the language is
determined by the language identifier attribute which may be one of the
following:

- `js`
- `javascript`
- `mjs`
- `cjs`
- `jsx`
- `ts`
- `typescript`
- `mts`
- `cts`
- `tsx`

If no language identifier is specified then the language is inferred from media
type of the source document that the code block is extracted from.

```sh
deno test --doc example.ts
```

The above command will extract this example, turn it into a pseudo test case
that looks like below:

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add } from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(1, 2);
  assertEquals(sum, 3);
});
```

and then run it as a standalone module living in the same directory as the
module being documented.

:::tip Want to type-check only?

If you want to type-check your code snippets in JSDoc and markdown files without
actually running them, you can use [`deno check`](/runtime/reference/cli/check/)
command with `--doc` option (for JSDoc) or with `--doc-only` option (for
markdown) instead.

:::

## Exported items are automatically imported

Looking at the generated test code above, you will notice that it includes the
`import` statement to import the `add` function even though the original code
block does not have it. When documenting a module, any items exported from the
module are automatically included in the generated test code using the same
name.

Let's say we have the following module:

````ts title="example.ts"
/**
 * # Examples
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(ONE, getTwo());
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}

export const ONE = 1;
export default function getTwo() {
  return 2;
}
````

This will get converted to the following test case:

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add, ONE }, getTwo from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(ONE, getTwo());
  assertEquals(sum, 3);
});
```

## Skipping code blocks

You can skip the evaluation of code blocks by adding the `ignore` attribute.

````ts
/**
 * This code block will not be run.
 *
 * ```ts ignore
 * await sendEmail("deno@example.com");
 * ```
 */
export async function sendEmail(to: string) {
  // send an email to the given address...
}
````
