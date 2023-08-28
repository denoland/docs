# Testing API

The Deno language server supports a custom set of APIs to enable testing. These
are built around providing information to enable the
[vscode's Testing API](https://code.visualstudio.com/api/extension-guides/testing)
but can be used by other language server clients to provide a similar interface.

## Capabilities

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

## Settings

There are specific settings which change the behavior of the language server:

- `deno.testing.args` - An array of strings which will be provided as arguments
  when executing tests. This works in the same fashion as the `deno test`
  subcommand.
- `deno.testing.enable` - A binary flag that enables or disables the testing
  server

## Notifications

The server will send notifications to the client under certain conditions.

### `deno/testModule`

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

```ts, ignore
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

### `deno/testModuleDelete`

When a test module is deleted that the server is observing, the server will
issue a `deno/testModuleDelete` notification. When receiving the notification
the client should remove the representation of the test module and all of its
children tests and test steps.

```ts, ignore
interface TestModuleDeleteParams {
  /** The text document identifier that has been removed. */
  textDocument: TextDocumentIdentifier;
}
```

### `deno/testRunProgress`

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

```ts, ignore
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

## Requests

The server handles two different requests:

### `deno/testRun`

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

```ts, ignore
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

### `deno/testRunCancel`

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
