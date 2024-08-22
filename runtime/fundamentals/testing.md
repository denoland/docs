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
---

Deno provides a built-in test runner for writing and running tests in both
JavaScript and TypeScript. This makes it easy to ensure your code is reliable
and functions as expected without needing to install any additional dependencies
or tools.

The Deno test runner fully supports typescript and async tests and allows for
fine-grained control over permissions for each test, enhancing your code
security.

## Writing Tests

To define a test in Deno, you use the `Deno.test()` function. Here are some
examples:

```ts title="my_test.ts"
import { assertEquals } from "@std/assert";

// basic test
Deno.test("simple test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// a named test
Deno.test("addition test", () => {
  const sum = 2 + 3;
  assertEquals(sum, 5);
});

// async test:
import { delay } from "@std/async";

Deno.test("async test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

// test with permissions
Deno.test({
  name: "read file test",
  permissions: { read: true },
  fn: () => {
    const data = Deno.readTextFileSync("./somefile.txt");
    assertEquals(data, "expected content");
  },
});
```

If you prefer a "jest-like" `expect` style, the Deno standard library provides an
`expect` function that can be used in place of `assertEquals`:

```ts
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

Deno.test("add function adds two numbers correctly", () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});

Deno.test("add function handles negative numbers", () => {
  const result = add(-2, -3);
  expect(result).toBe(-5);
});
```

## Running Tests

To run your tests, use the [`deno test`](TODO:deno-test-link) subcommand.

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

# Pass additional arguments to the test file
deno test my_test.ts -- -e --foo --bar
```

## Test Steps

Deno also supports test steps, which allow you to break down tests into smaller,
manageable parts. This is useful for setup and teardown operations within a
test:

```ts
Deno.test("database operations", async (t) => {
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
match test names.

Consider the following tests:

```ts
Deno.test({ name: "my-test", fn: myTest });
Deno.test({ name: "test-1", fn: test1 });
Deno.test({ name: "test-2", fn: test2 });
```

### Filtering by string

To run all tests that contain the word "test" in their names, use:

```sh
deno test --filter "test" tests/
```

This command will execute `my-test`, `test-1`, and `test-2` because they all
include "test" in their names.

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

### Including and excluding paths in the configuration file

You can also filter tests by specifying paths to include or exclude in the Deno
configuration file.

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

Then running `deno test` in the same directory tree as the configuration file
will take these options into account.

## Test definition filtering

Deno provides two options for filtering tests within the test definitions
themselves: ignoring tests and focusing on specific tests.

### Filtering Out (Ignoring Tests)

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

### Filtering In (Only Running Specific Tests)

If you want to focus on a particular test and ignore the rest, you can use the
`only` option. This tells the test framework to run only the tests with only set
to true. Multiple tests can have this option set. However, if any test is
flagged with only, the overall test run will always fail, as this is intended to
be a temporary measure for debugging.

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

The [Deno standard library](./standard_library.md) provides a set of functions
to help you write tests that involve spying, mocking, and stubbing. Check out
the [documentation on JSR](https://jsr.io/@std/testing) for more information on
each of these utilities.

## Assertions

To help developers write tests, the
[Deno standard library](./standard_library.md) comes with a built-in assertions
module which can be imported from `jsr:@std/assert`. Check out the
[documentation on JSR for its usage](https://jsr.io/@std/assert).

## Coverage

Deno will collect test coverage into a directory for your code if you specify
the `--coverage` flag when starting `deno test`. This coverage information is
acquired directly from the V8 JavaScript engine, ensuring high accuracy.

This can then be further processed from the internal format into well known
formats with the [`deno coverage`](TODO:coverage-link) tool.

## Behavior-Driven Development

With the [@std/testing/bdd](https://jsr.io/@std/testing/doc/bdd/~) module you
can write your tests in a familiar format for grouping tests and adding
setup/teardown hooks used by other JavaScript testing frameworks like Jasmine,
Jest, and Mocha.

The `describe` function creates a block that groups together several related
tests. The `it` function registers an individual test case. Check out the
[documentation on JSR](https://jsr.io/@std/testing/doc/bdd/~) for more
information on these functions and hooks.

## Documentation Tests

Deno allows you to type-check the examples in your documentation to ensure they
are up-to-date and functional.

### Example code blocks

````ts title="example.ts"
/**
 * # Examples
 *
 * ```ts
 * const x = 42;
 * ```
 */
````

The triple backticks mark the start and end of code blocks, the language is
determined by the language identifier attribute which may be `js`, `jsx`, `ts`
or `tsx`. If no language identifier is specified then the language is inferred
from media type of the source document that the code block is extracted from.

```sh
deno test --doc example.ts
```

The above command will extract this example, and then type-check it as a
standalone module living in the same directory as the module being documented.

### Documenting exports

To document your exports, import the module using a relative path specifier:

````ts
/**
 * # Examples
 *
 * ```ts
 * import { foo } from "./foo.ts";
 * ```
 */
export function foo(): string {
  return "foo";
}
````

## Sanitizers

The test runner offers several sanitizers to ensure that the test behaves in a
reasonable and expected way.

### Resource sanitizer

Ensures that all resources created during a test are closed to prevent leaks.
Enabled by default, it can be disabled with `sanitizeResources: false`:

```ts
Deno.test({
  name: "leaky resource test",
  async fn() {
    await Deno.open("hello.txt");
  },
  sanitizeResources: false,
});
```

### Op sanitizer

Ensures that all async operations started in a test are completed before the
test ends. Enabled by default, it can be disabled with `sanitizeOps: false`:

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

Ensures that tested code doesn’t call `Deno.exit()`, which could signal a false
test success. Enabled by default, it can be disabled with `sanitizeExit: false`.

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

The [Deno standard library](./standard_library.md) includes a
[snapshot module](https://jsr.io/@std/testing/doc/snapshot/~) that allows
developers to write tests by comparing values against reference snapshots. These
snapshots are serialized representations of the original values and are stored
alongside the test files.

Snapshot testing enables catching a wide array of bugs with very little code. It
is particularly helpful in situations where it is difficult to precisely express
what should be asserted, without requiring a prohibitive amount of code, or
where the assertions a test makes are expected to change often.

---

## The testing API

The Deno language server supports a custom set of APIs to enable testing. These
provide information to enable
[vscode's Testing API](https://code.visualstudio.com/api/extension-guides/testing)
and can be used by other language server clients to provide a similar interface.

### Capabilities

Both the client and the server should support the experimental `testingApi`
capability:

```ts
interface ClientCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

```ts
interface ServerCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

When a version of Deno that supports the testing API encounters a client which
supports the capability, it will initialize the code which handles the test
detection and will start providing the notifications which enable it.

It should also be noted that when the testing API capabilities are enabled, the
testing code lenses will no longer be sent to the client.

### Settings

There are specific settings which change the behavior of the language server:

- `deno.testing.args` - An array of strings which will be provided as arguments
  when executing tests. This works in the same fashion as the `deno test`
  subcommand.
- `deno.testing.enable` - A binary flag that enables or disables the testing
  server

### Notifications

The server will send notifications to the client under certain conditions.

#### `deno/testModule`

When a module containing tests is discovered by the server, it will notify the
client by sending a `deno/testModule` notification along with a payload of
`TestModuleParams`.

Deno structures in this fashion:

- A module can contain _n_ tests.
- A test can contain _n_ steps.
- A step can contain _n_ steps.

When Deno does static analysis of a test module, it attempts to identify any
tests and test steps. Because of the dynamic way tests can be declared in Deno,
they cannot always be statically identified and can only be identified when the
module is executed. The notification is designed to handle both of these
situations when updating the client. When tests are discovered statically, the
notification `kind` will be `"replace"`, when tests or steps are discovered at
execution time, the notification `kind` will be `"insert"`.

As a test document is edited in the editor, and `textDocument/didChange`
notifications are received from the client, the static analysis of those changes
will be performed server side and if the tests have changed, the client will
receive a notification.

When a client receives a `"replace"` notification, it can safely "replace" a
test module representation, where when an `"insert"` it received, it should
recursively try to add to existing representations.

For test modules the `textDocument.uri` should be used as the unique ID for any
representation (as it the string URL to the unique module). `TestData` items
contain a unique `id` string. This `id` string is a SHA-256 hash of identifying
information that the server tracks for a test.

```ts
interface TestData {
  /** The unique ID for this test/step. */
  id: string;

  /** The display label for the test/step. */
  label: string;

  /** Any test steps that are associated with this test/step */
  steps?: TestData[];

  /** The range of the owning text document that applies to the test. */
  range?: Range;
}

interface TestModuleParams {
  /** The text document identifier that the tests are related to. */
  textDocument: TextDocumentIdentifier;

  /** A indication if tests described are _newly_ discovered and should be
   * _inserted_ or if the tests associated are a replacement for any existing
   * tests. */
  kind: "insert" | "replace";

  /** The text label for the test module. */
  label: string;

  /** An array of tests that are owned by this test module. */
  tests: TestData[];
}
```

#### `deno/testModuleDelete`

When a test module is deleted that the server is observing, the server will
issue a `deno/testModuleDelete` notification. When receiving the notification
the client should remove the representation of the test module and all of its
children tests and test steps.

```ts
interface TestModuleDeleteParams {
  /** The text document identifier that has been removed. */
  textDocument: TextDocumentIdentifier;
}
```

#### `deno/testRunProgress`

When a [`deno/testRun`](#denotestrun) is requested from the client, the server
will support progress of that test run via the `deno/testRunProgress`
notification.

The client should process these messages and update any UI representation.

The state change is represented in the `.message.kind` property of the
`TestRunProgressParams`. The states are:

- `"enqueued"` - A test or test step has been enqueued for testing.
- `"skipped"` - A test or test step was skipped. This occurs when the Deno test
  has the `ignore` option set to `true`.
- `"started"` - A test or test step has started.
- `"passed"` - A test or test step has passed.
- `"failed"` - A test or test step has failed. This is intended to indicate an
  error with the test harness instead of the test itself, but Deno currently
  does not support this distinction.
- `"errored"` - The test or test step has errored. Additional information about
  the error will be in the `.message.messages` property.
- `"end"` - The test run has ended.

```ts
interface TestIdentifier {
  /** The test module the message is related to. */
  textDocument: TextDocumentIdentifier;

  /** The optional ID of the test. If not present, then the message applies to
   * all tests in the test module. */
  id?: string;

  /** The optional ID of the step. If not present, then the message only applies
   * to the test. */
  stepId?: string;
}

interface TestMessage {
  /** The content of the message. */
  message: MarkupContent;

  /** An optional string which represents the expected output. */
  expectedOutput?: string;

  /** An optional string which represents the actual output. */
  actualOutput?: string;

  /** An optional location related to the message. */
  location?: Location;
}

interface TestEnqueuedStartedSkipped {
  /** The state change that has occurred to a specific test or test step.
   *
   * - `"enqueued"` - the test is now enqueued to be tested
   * - `"started"` - the test has started
   * - `"skipped"` - the test was skipped
   */
  type: "enqueued" | "started" | "skipped";

  /** The test or test step relating to the state change. */
  test: TestIdentifier;
}

interface TestFailedErrored {
  /** The state change that has occurred to a specific test or test step.
   *
   * - `"failed"` - The test failed to run properly, versus the test erroring.
   *   currently the Deno language server does not support this.
   * - `"errored"` - The test errored.
   */
  type: "failed" | "errored";

  /** The test or test step relating to the state change. */
  test: TestIdentifier;

  /** Messages related to the state change. */
  messages: TestMessage[];

  /** An optional duration, in milliseconds from the start to the current
   * state. */
  duration?: number;
}

interface TestPassed {
  /** The state change that has occurred to a specific test or test step. */
  type: "passed";

  /** The test or test step relating to the state change. */
  test: TestIdentifier;

  /** An optional duration, in milliseconds from the start to the current
   * state. */
  duration?: number;
}

interface TestOutput {
  /** The test or test step has output information / logged information. */
  type: "output";

  /** The value of the output. */
  value: string;

  /** The associated test or test step if there was one. */
  test?: TestIdentifier;

  /** An optional location associated with the output. */
  location?: Location;
}

interface TestEnd {
  /** The test run has ended. */
  type: "end";
}

type TestRunProgressMessage =
  | TestEnqueuedStartedSkipped
  | TestFailedErrored
  | TestPassed
  | TestOutput
  | TestEnd;

interface TestRunProgressParams {
  /** The test run ID that the progress message applies to. */
  id: number;

  /** The message*/
  message: TestRunProgressMessage;
}
```

### Requests

The server handles two different requests:

#### `deno/testRun`

To request the language server to perform a set of tests, the client sends a
`deno/testRun` request, which includes that ID of the test run to be used in
future responses to the client, the type of the test run, and any test modules
or tests to include or exclude.

Currently Deno only supports the `"run"` kind of test run. Both `"debug"` and
`"coverage"` are planned to be supported in the future.

When there are no test modules or tests that are included, it implies that all
discovered tests modules and tests should be executed. When a test module is
included, but not any test ids, it implies that all tests within that test
module should be included. Once all the tests are identified, any excluded tests
are removed and the resolved set of tests are returned in the response as
`"enqueued"`.

It is not possible to include or exclude test steps via this API, because of the
dynamic nature of how test steps are declared and run.

```ts
interface TestRunRequestParams {
  /** The id of the test run to be used for future messages. */
  id: number;

  /** The run kind. Currently Deno only supports `"run"` */
  kind: "run" | "coverage" | "debug";

  /** Test modules or tests to exclude from the test run. */
  exclude?: TestIdentifier[];

  /** Test modules or tests to include in the test run. */
  include?: TestIdentifier[];
}

interface EnqueuedTestModule {
  /** The test module the enqueued test IDs relate to */
  textDocument: TextDocumentIdentifier;

  /** The test IDs which are now enqueued for testing */
  ids: string[];
}

interface TestRunResponseParams {
  /** Test modules and test IDs that are now enqueued for testing. */
  enqueued: EnqueuedTestModule[];
}
```

#### `deno/testRunCancel`

If a client wishes to cancel a currently running test run, it sends a
`deno/testRunCancel` request with the test ID to cancel. The response back will
be a boolean of `true` if the test is cancelled or `false` if it was not
possible. Appropriate test progress notifications will still be sent as the test
is being cancelled.

```ts
interface TestRunCancelParams {
  /** The test id to be cancelled. */
  id: number;
}
```
