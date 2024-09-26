---
title: "Testing"
oldUrl:
  - /runtime/manual/advanced/language_server/testing_api/
  - /runtime/manual/basics/testing/
  - /runtime/manual/basics/testing/coverage/
  - /runtime/manual/basics/testing/assertions/
  - /runtime/manual/basics/testing/mocking/
  - /runtime/manual/basics/testing/behavior_driven_development
  - /runtime/manual/testing/documentation/
  - /runtime/manual/basics/testing/sanitizers/
  - /runtime/manual/basics/testing/snapshot_testing/
  - /runtime/manual/testing
  - /runtime/manual/basics/testing/documentation/
---

Deno provides a built-in test runner for writing and running tests in both
JavaScript and TypeScript. This makes it easy to ensure your code is reliable
and functions as expected without needing to install any additional dependencies
or tools. The `deno test` runner allows you fine-grained control over
permissions for each test, ensuring that code does not do anything unexpected.

In addition to the built-in test runner, you can also use other test runners
from the JS ecosystem, such as Jest, Mocha, or AVA, with Deno. We will not cover
these in this document however.

## Writing Tests

To define a test in Deno, you use the `Deno.test()` function. Here are some
examples:

```ts title="my_test.ts"
import { assertEquals } from "jsr:@std/assert";

Deno.test("simple test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

import { delay } from "jsr:@std/async";

Deno.test("async test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test({
  name: "read file test",
  permissions: { read: true },
  fn: () => {
    const data = Deno.readTextFileSync("./somefile.txt");
    assertEquals(data, "expected content");
  },
});
```

If you prefer a "jest-like" `expect` style of assertions, the Deno standard
library provides an [`expect`](https://jsr.io/@std/expect) function that can be
used in place of `assertEquals`:

```ts title="my_test.ts"
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

Deno.test("add function adds two numbers correctly", () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});
```

## Running Tests

To run your tests, use the [`deno test`](/runtime/reference/cli/test/)
subcommand.

If run without a file name or directory name, this subcommand will automatically
find and execute all tests in the current directory (recursively) that match the
glob `{*_,*.,}test.{ts, tsx, mts, js, mjs, jsx}`.

```sh
# Run all tests in the current directory and all sub-directories
deno test

# Run all tests in the util directory
deno test util/

# Run just my_test.ts
deno test my_test.ts

# Run test modules in parallel
deno test --parallel

# Pass additional arguments to the test file that are visible in `Deno.args`
deno test my_test.ts -- -e --foo --bar

# Provide permission for deno to read from the filesystem, which is necessary
# for the final test above to pass
deno test --allow-read my_test.ts
```

## Test Steps

Deno also supports test steps, which allow you to break down tests into smaller,
manageable parts. This is useful for setup and teardown operations within a
test:

```ts
Deno.test("database operations", async (t) => {
  using db = await openDatabase();
  await t.step("insert user", async () => {
    // Insert user logic
  });
  await t.step("insert book", async () => {
    // Insert book logic
  });
});
```

## Command line filtering

Deno allows you to run specific tests or groups of tests using the `--filter`
option on the command line. This option accepts either a string or a pattern to
match test names. Filtering does not affect steps; if a test name matches the
filter, all of its steps are executed.

Consider the following tests:

```ts
Deno.test("my-test", () => {});
Deno.test("test-1", () => {});
Deno.test("test-2", () => {});
```

### Filtering by string

To run all tests that contain the word "my" in their names, use:

```sh
deno test --filter "my" tests/
```

This command will execute `my-test` because it contains the word "my".

### Filtering by Pattern

To run tests that match a specific pattern, use:

```sh
deno test --filter "/test-*\d/" tests/
```

This command will run `test-1` and `test-2` because they match the pattern
`test-*` followed by a digit.

To indicate that you are using a pattern (regular expression), wrap your filter
value with forward slashes `/`, much like JavaScript’s syntax for regular
expressions.

### Including and excluding test files in the configuration file

You can also filter tests by specifying paths to include or exclude in the
[Deno configuration file](/runtime/fundamentals/configuration).

For example, if you want to only test `src/fetch_test.ts` and
`src/signal_test.ts` and exclude everything in `out/`:

```json
{
  "test": {
    "include": [
      "src/fetch_test.ts",
      "src/signal_test.ts"
    ]
  }
}
```

Or more likely:

```json
{
  "test": {
    "exclude": ["out/"]
  }
}
```

## Test definition selection

Deno provides two options for selecting tests within the test definitions
themselves: ignoring tests and focusing on specific tests.

### Ignoring/Skipping Tests

You can ignore certain tests based on specific conditions using the `ignore`
boolean in the test definition. If `ignore` is set to `true`, the test will be
skipped. This is useful, for example, if you only want a test to run on a
specific operating system.

```ts
Deno.test({
  name: "do macOS feature",
  ignore: Deno.build.os !== "darwin", // This test will be ignored if not running on macOS
  fn() {
    // do MacOS feature here
  },
});
```

If you want to ignore a test without passing any conditions, you can use the
`ignore()` function from the `Deno.test` object:

```ts
Deno.test.ignore("my test", () => {
  // your test code
});
```

### Only Run Specific Tests

If you want to focus on a particular test and ignore the rest, you can use the
`only` option. This tells the test runner to run only the tests with `only` set
to true. Multiple tests can have this option set. However, if any test is
flagged with only, the overall test run will always fail, as this is intended to
be a temporary measure for debugging.

```ts
Deno.test.only("my test", () => {
  // some test code
});
```

or

```ts
Deno.test({
  name: "Focus on this test only",
  only: true, // Only this test will run
  fn() {
    // test complicated stuff here
  },
});
```

## Failing fast

If you have a long-running test suite and wish for it to stop on the first
failure, you can specify the `--fail-fast` flag when running the suite.

```shell
deno test --fail-fast
```

This will cause the test runner to stop execution after the first test failure.

## Reporters

Deno includes three built-in reporters to format test output:

- `pretty` (default): Provides a detailed and readable output.
- `dot`: Offers a concise output, useful for quickly seeing test results.
- `junit`: Produces output in JUnit XML format, which is useful for integrating
  with CI/CD tools.

You can specify which reporter to use with the --reporter flag:

```sh
# Use the default pretty reporter
deno test

# Use the dot reporter for concise output
deno test --reporter=dot

# Use the JUnit reporter
deno test --reporter=junit
```

Additionally, you can write the JUnit report to a file while still getting
human-readable output in the terminal by using the `--junit-path` flag:

```sh
deno test --junit-path=./report.xml
```

## Spying, mocking (test doubles), stubbing and faking time

The [Deno Standard Library](/runtime/fundamentals/standard_library/) provides a
set of functions to help you write tests that involve spying, mocking, and
stubbing. Check out the
[@std/testing documentation on JSR](https://jsr.io/@std/testing) for more
information on each of these utilities.

## Coverage

Deno will collect test coverage into a directory for your code if you specify
the `--coverage` flag when starting `deno test`. This coverage information is
acquired directly from the V8 JavaScript engine, ensuring high accuracy.

This can then be further processed from the internal format into well known
formats like `lcov` with the [`deno coverage`](/runtime/reference/cli/coverage/)
tool.

## Behavior-Driven Development

With the [@std/testing/bdd](https://jsr.io/@std/testing/doc/bdd/~) module you
can write your tests in a familiar format for grouping tests and adding
setup/teardown hooks used by other JavaScript testing frameworks like Jasmine,
Jest, and Mocha.

The `describe` function creates a block that groups together several related
tests. The `it` function registers an individual test case. For example:

```ts
import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

describe("add function", () => {
  it("adds two numbers correctly", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it("handles negative numbers", () => {
    const result = add(-2, -3);
    expect(result).toBe(-5);
  });
});
```

Check out the [documentation on JSR](https://jsr.io/@std/testing/doc/bdd/~) for
more information on these functions and hooks.

## Documentation Tests

Deno allows you to evaluate code snippets written in JSDoc or markdown files.
This ensures the examples in your documentation are up-to-date and functional.

### Example code blocks

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

### Exported items are automatically imported

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

### Skipping code blocks

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

## Sanitizers

The test runner offers several sanitizers to ensure that the test behaves in a
reasonable and expected way.

### Resource sanitizer

The resource sanitizer ensures that all I/O resources created during a test are
closed, to prevent leaks.

I/O resources are things like `Deno.FsFile` handles, network connections,
`fetch` bodies, timers, and other resources that are not automatically garbage
collected.

You should always close resources when you are done with them. For example, to
close a file:

```ts
const file = await Deno.open("hello.txt");
// Do something with the file
file.close(); // <- Always close the file when you are done with it
```

To close a network connection:

```ts
const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// Do something with the connection
conn.close(); // <- Always close the connection when you are done with it
```

To close a `fetch` body:

```ts
const response = await fetch("https://example.com");
// Do something with the response
await response.body?.cancel(); // <- Always cancel the body when you are done with it, if you didn't consume it otherwise
```

This sanitizer is enabled by default, but can be disabled in this test with
`sanitizeResources: false`:

```ts
Deno.test({
  name: "leaky resource test",
  async fn() {
    await Deno.open("hello.txt");
  },
  sanitizeResources: false,
});
```

### Async operation sanitizer

The async operation sanitizer ensures that all async operations started in a
test are completed before the test ends. This is important because if an async
operation is not awaited, the test will end before the operation is completed,
and the test will be marked as successful even if the operation may have
actually failed.

You should always await all async operations in your tests. For example:

```ts
Deno.test({
  name: "async operation test",
  async fn() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});
```

This sanitizer is enabled by default, but can be disabled with
`sanitizeOps: false`:

```ts
Deno.test({
  name: "leaky operation test",
  fn() {
    crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("a".repeat(100000000)),
    );
  },
  sanitizeOps: false,
});
```

### Exit sanitizer

The exit sanitizer ensures that tested code doesn’t call `Deno.exit()`, which
could signal a false test success.

This sanitizer is enabled by default, but can be disabled with
`sanitizeExit: false`.

```ts
Deno.test({
  name: "false success",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// This test never runs, because the process exits during "false success" test
Deno.test({
  name: "failing test",
  fn() {
    throw new Error("this test fails");
  },
});
```

## Snapshot testing

The [Deno Standard Library](/runtime/fundamentals/standard_library/) includes a
[snapshot module](https://jsr.io/@std/testing/doc/snapshot/~) that allows
developers to write tests by comparing values against reference snapshots. These
snapshots are serialized representations of the original values and are stored
alongside the test files.

Snapshot testing enables catching a wide array of bugs with very little code. It
is particularly helpful in situations where it is difficult to precisely express
what should be asserted, without requiring a prohibitive amount of code, or
where the assertions a test makes are expected to change often.
