---
last_modified: 2026-05-20
title: "Testing"
description: "A guide to Deno's testing capabilities. Learn about the built-in test runner, assertions, mocking, coverage reporting, snapshot testing, and how to write effective tests for your Deno applications."
oldUrl:
  - /runtime/fundamentals/testing/
  - /runtime/manual/basics/testing/
  - /runtime/manual/basics/testing/assertions/
  - /runtime/manual/basics/testing/behavior_driven_development
  - /runtime/manual/testing
---

Deno provides a built-in test runner for writing and running tests in both
JavaScript and TypeScript. This makes it easy to ensure your code is reliable
and functions as expected without needing to install any additional dependencies
or tools. The `deno test` runner allows you fine-grained control over
permissions for each test, ensuring that code does not do anything unexpected.

In addition to the built-in test runner, you can also use other test runners
from the JS ecosystem, such as Jest, Mocha, or AVA, with Deno. Moving an
existing Jest suite over? See
[Migrating from Jest](/runtime/test/migrate_from_jest/).

## Writing Tests

To define a test in Deno, you use the [`Deno.test()`](/api/deno/~/Deno.test)
function. Here are some examples:

```ts title="my_test.ts"
import { assertEquals } from "jsr:@std/assert";
import { delay } from "jsr:@std/async";

Deno.test("simple test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

Deno.test("async test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test({
  name: "read file test",
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
deno test --allow-read=. my_test.ts
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

## Timeouts

You can set a maximum duration for individual tests using the `timeout` option.
If a test exceeds its deadline it is marked as failed. Both asynchronous hangs
(a promise that never resolves) and synchronous hot loops (`while (true) {}`)
are caught.

```ts
Deno.test({
  name: "completes within deadline",
  timeout: 5000, // 5 seconds
  async fn() {
    const response = await fetch("https://example.com");
    await response.body?.cancel();
  },
});
```

If a test times out the next test in the same file still runs normally.

Setting `timeout` to `0` or omitting it means the test runs without a deadline.

## Test Hooks

Deno provides test hooks that allow you to run setup and teardown code before
and after tests. These hooks are useful for initializing resources, cleaning up
after tests, and ensuring consistent test environments.

### Available Hooks

- `Deno.test.beforeAll(fn)` - Runs once before all tests in the current scope
- `Deno.test.beforeEach(fn)` - Runs before each individual test
- `Deno.test.afterEach(fn)` - Runs after each individual test
- `Deno.test.afterAll(fn)` - Runs once after all tests in the current scope

### Hook Execution Order

- **beforeAll/beforeEach**: Execute in FIFO (first in, first out) order
- **afterEach/afterAll**: Execute in LIFO (last in, first out) order

If an exception is raised in any hook, remaining hooks of the same type will not
run, and the current test will be marked as failed.

### Examples

```ts
import { DatabaseSync } from "node:sqlite";
import { assertEquals } from "jsr:@std/assert";

let db: DatabaseSync;

Deno.test.beforeAll(() => {
  console.log("Setting up test database...");
  db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    ) STRICT
  `);
});

Deno.test.beforeEach(() => {
  console.log("Clearing database for clean test state...");
  db.exec("DELETE FROM users");
});

Deno.test.afterEach(() => {
  console.log("Test completed, cleaning up resources...");
  // Any additional cleanup after each test
});

Deno.test.afterAll(() => {
  console.log("Tearing down test database...");
  db.close();
});

Deno.test("user creation", () => {
  const stmt = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
  );
  const user = stmt.get("alice", "alice@example.com");
  assertEquals(user!.name, "alice");
});

Deno.test("user deletion", () => {
  const insertStmt = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
  );
  const user = insertStmt.get("bob", "bob@example.com");

  const deleteStmt = db.prepare("DELETE FROM users WHERE id = ?");
  deleteStmt.run(user!.id);

  const selectStmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const deletedUser = selectStmt.get(user!.id);
  assertEquals(deletedUser, undefined);
});
```

### Multiple Hooks

You can register multiple hooks of the same type, and they will execute in the
order specified above:

```ts
Deno.test.beforeEach(() => {
  console.log("First beforeEach hook");
});

Deno.test.beforeEach(() => {
  console.log("Second beforeEach hook");
});

// Output:
// First beforeEach hook
// Second beforeEach hook
// (test runs)
```

## Filtering tests

Run a subset of tests with the `--filter` flag. It accepts a string, or a
regular expression wrapped in forward slashes:

```sh
# Run tests whose name contains the word "my"
deno test --filter "my" tests/

# Run tests whose name matches a pattern
deno test --filter "/test-*\d/" tests/
```

To control which test files are collected in the first place, set `test.include`
and `test.exclude` in your
[configuration file](/runtime/reference/deno_json/#include-and-exclude). See the
[`deno test` reference](/runtime/reference/cli/test/#filtering) for the full
filtering semantics.

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
`ignore()` function from the [`Deno.test`](/api/deno/~/Deno.test) object:

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

Test output defaults to the detailed `pretty` reporter. Switch formats with the
`--reporter` flag (`dot`, `junit`, `tap`), or write a JUnit XML report to a file
with `--junit-path` while keeping readable output in the terminal:

```sh
deno test --reporter=dot
deno test --junit-path=./report.xml
```

See the [`deno test` reference](/runtime/reference/cli/test/#reporters) for the
full list of reporters.

## Mocking and test doubles

Isolate the code under test by replacing its collaborators with spies, stubs,
and mocks from `@std/testing`, and control the clock with `FakeTime`. See
[Mocking and test doubles](/runtime/test/mocking/) for the full guide with
runnable examples.

## Coverage

Collect coverage while testing with `deno test --coverage`, then turn it into
terminal, HTML, or lcov reports with `deno coverage`. The data comes straight
from V8. See [Test coverage](/runtime/test/coverage/) for the workflow,
including CI integration.

## Behavior-Driven Development

With the [`@std/testing/bdd`](/runtime/reference/std/testing/) module you can
write your tests in a familiar format for grouping tests and adding
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

Check out the [`@std/testing` documentation](/runtime/reference/std/testing/)
for more information on these functions and hooks.

- [BDD testing tutorial](/examples/bdd_tutorial/)

## Documentation tests

`deno test --doc` runs the code examples inside your JSDoc comments and markdown
files as tests, so documentation can't silently go stale. See
[Documentation tests](/runtime/test/doc_tests/) for how snippets are extracted,
typed, and skipped.

## Sanitizers

The test runner can catch misbehavior that assertions don't see: leaked async
operations, unclosed resources, and unexpected
[`Deno.exit()`](/api/deno/~/Deno.exit) calls. The exit sanitizer is on by
default; the op and resource sanitizers are opt-in since Deno 2.8. See
[Test sanitizers](/runtime/test/sanitizers/) for each sanitizer and the global
enablement options.

## Snapshot testing

Compare a value against a serialized reference stored next to your test, and
update the references with a single flag when behavior intentionally changes.
See [Snapshot testing](/runtime/test/snapshots/) for the workflow, including
updating and reviewing snapshots.

## Tests and Permissions

The `permissions` property in the [`Deno.test`](/api/deno/~/Deno.test)
configuration allows you to specifically deny permissions, but does not grant
them. Permissions must be provided when running the test command. When building
robust applications, you often need to handle cases where permissions are
denied, (for example you may want to write tests to check whether fallbacks have
been set up correctly).

Consider a situation where you are reading from a file, you may want to offer a
fallback value in the case that the function does not have read permission:

```ts
import { assertEquals } from "jsr:@std/assert";
import getFileText from "./main.ts";

Deno.test({
  name: "File reader gets text with permission",
  // no `permissions` means "inherit"
  fn: async () => {
    const result = await getFileText();
    console.log(result);
    assertEquals(result, "the content of the file");
  },
});

Deno.test({
  name: "File reader falls back to error message without permission",
  permissions: { read: false },
  fn: async () => {
    const result = await getFileText();
    console.log(result);
    assertEquals(result, "oops don't have permission");
  },
});
```

```sh
# Run the tests with read permission
deno test --allow-read
```

The permissions object supports detailed configuration:

```ts
Deno.test({
  name: "permission configuration example",
  // permissions: { read: true } // Grant all read permissions and deny all others
  // OR
  permissions: {
    read: ["./data", "./config"], // Grant read to specific paths only
    write: false, // Explicitly deny write permissions
    net: ["example.com:443"], // Allow specific host:port combinations
    env: ["API_KEY"], // Allow access to specific env variables
    run: false, // Deny subprocess execution
    ffi: false, // Deny loading dynamic libraries
    hrtime: false, // Deny high-resolution time
  },
  fn() {
    // Test code that respects these permission boundaries
  },
});
```

Remember that any permission not explicitly granted at the command line will be
denied, regardless of what's specified in the test configuration.

## Related tutorials

For more hands-on testing guides, check out:

- [Basic testing tutorial](/examples/testing_tutorial/)
- [Mocking and test doubles](/runtime/test/mocking/)
- [Snapshot testing](/runtime/test/snapshots/)
- [Migrating from Jest](/runtime/test/migrate_from_jest/)
- [Testing web applications tutorial](/examples/web_testing_tutorial/)
