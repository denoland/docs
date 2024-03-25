---
sidebar_position: 2
---

# Testing in Deno

Deno has a built-in test runner that you can use for testing JavaScript or
TypeScript code.

## Quickstart

Firstly, let's create a file `url_test.ts` and register a test case using
`Deno.test()` function.

```ts
// url_test.ts
import { assertEquals } from "jsr:std/assert@^0";

Deno.test("url test", () => {
  const url = new URL("./foo.js", "https://deno.land/");
  assertEquals(url.href, "https://deno.land/foo.js");
});
```

Secondly, run the test using `deno test` subcommand.

```sh
$ deno test url_test.ts
running 1 test from file:///dev/url_test.js
test url test ... ok (2ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (9ms)
```

## Writing tests

To define a test you need to register it with a call to `Deno.test` API. There
are multiple overloads of this API to allow for greatest flexibility and easy
switching between the forms (eg. when you need to quickly focus a single test
for debugging, using `only: true` option):

```ts
import { assertEquals } from "jsr:std/assert@^0";

// Compact form: name and function
Deno.test("hello world #1", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// Compact form: named function.
Deno.test(function helloWorld3() {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// Longer form: test definition.
Deno.test({
  name: "hello world #2",
  fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
});

// Similar to compact form, with additional configuration as a second argument.
Deno.test("hello world #4", { permissions: { read: true } }, () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

// Similar to longer form, with test function as a second argument.
Deno.test(
  { name: "hello world #5", permissions: { read: true } },
  () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
);

// Similar to longer form, with a named test function as a second argument.
Deno.test({ permissions: { read: true } }, function helloWorld6() {
  const x = 1 + 2;
  assertEquals(x, 3);
});
```

### Async functions

You can also test asynchronous code by passing a test function that returns a
promise. For this you can use the `async` keyword when defining a function:

```ts
import { delay } from "jsr:@std/async@^0/delay.ts";

Deno.test("async hello world", async () => {
  const x = 1 + 2;

  // await some async task
  await delay(100);

  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});
```

### Test steps

The test steps API provides a way to report distinct steps within a test and do
setup and teardown code within that test.

```ts
import { assertEquals } from "jsr:std/assert@^0";
import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";

interface User {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
}

Deno.test("database", async (t) => {
  const client = new Client({
    user: "user",
    database: "test",
    hostname: "localhost",
    port: 5432,
  });
  await client.connect();

  // provide a step name and function
  await t.step("insert user", async () => {
    const users = await client.queryObject<User>(
      "INSERT INTO users (name) VALUES ('Deno') RETURNING *",
    );
    assertEquals(users.rows.length, 1);
    assertEquals(users.rows[0].name, "Deno");
  });

  // or provide a test definition
  await t.step({
    name: "insert book",
    fn: async () => {
      const books = await client.queryObject<Book>(
        "INSERT INTO books (name) VALUES ('The Deno Manual') RETURNING *",
      );
      assertEquals(books.rows.length, 1);
      assertEquals(books.rows[0].title, "The Deno Manual");
    },
    ignore: false,
    // these default to the parent test or step's value
    sanitizeOps: true,
    sanitizeResources: true,
    sanitizeExit: true,
  });

  // nested steps are also supported
  await t.step("update and delete", async (t) => {
    await t.step("update", () => {
      // even though this test throws, the outer promise does not reject
      // and the next test step will run
      throw new Error("Fail.");
    });

    await t.step("delete", () => {
      // ...etc...
    });
  });

  // steps return a value saying if they ran or not
  const testRan = await t.step({
    name: "copy books",
    fn: () => {
      // ...etc...
    },
    ignore: true, // was ignored, so will return `false`
  });

  // steps can be run concurrently if sanitizers are disabled on sibling steps
  const testCases = [1, 2, 3];
  await Promise.all(testCases.map((testCase) =>
    t.step({
      name: `case ${testCase}`,
      fn: async () => {
        // ...etc...
      },
      sanitizeOps: false,
      sanitizeResources: false,
      sanitizeExit: false,
    })
  ));

  client.end();
});
```

Outputs:

```console
test database ...
  test insert user ... ok (2ms)
  test insert book ... ok (14ms)
  test update and delete ...
    test update ... FAILED (17ms)
      Error: Fail.
          at <stack trace omitted>
    test delete ... ok (19ms)
  FAILED (46ms)
  test copy books ... ignored (0ms)
  test case 1 ... ok (14ms)
  test case 2 ... ok (14ms)
  test case 3 ... ok (14ms)
FAILED (111ms)
```

Notes:

1. Test steps **must be awaited** before the parent test/step function resolves
   or you will get a runtime error.
2. Test steps cannot be run concurrently unless sanitizers on a sibling step or
   parent test are disabled.
3. If nesting steps, ensure you specify a parameter for the parent step.
   ```ts
   Deno.test("my test", async (t) => {
     await t.step("step", async (t) => {
       // note the `t` used here is for the parent step and not the outer `Deno.test`
       await t.step("sub-step", () => {
       });
     });
   });
   ```

## Running tests

To run the test, call `deno test` with the file that contains your test
function. You can also omit the file name, in which case all tests in the
current directory (recursively) that match the glob
`{*_,*.,}test.{ts, tsx, mts, js, mjs, jsx}` will be run. If you pass a
directory, all files in the directory that match this glob will be run.

The glob expands to:

- files named `test.{ts, tsx, mts, js, mjs, jsx}`,
- or files ending with `.test.{ts, tsx, mts, js, mjs, jsx}`,
- or files ending with `_test.{ts, tsx, mts, js, mjs, jsx}`

```shell
# Run all tests in the current directory and all sub-directories
deno test

# Run all tests in the util directory
deno test util/

# Run just my_test.ts
deno test my_test.ts

# Run test modules in parallel
deno test --parallel
```

Note that starting in Deno v1.24, some test options can be configured via
[a configuration file](../../getting_started/configuration_file.md).

> ⚠️ If you want to pass additional CLI arguments to the test files use `--` to
> inform Deno that remaining arguments are scripts arguments.

```shell
# Pass additional arguments to the test file
deno test my_test.ts -- -e --foo --bar
```

`deno test` uses the same permission model as `deno run` and therefore will
require, for example, `--allow-write` to write to the file system during
testing.

To see all runtime options with `deno test`, you can reference the command line
help:

```shell
deno help test
```

## Filtering

There are a number of options to filter the tests you are running.

### Command line filtering

Tests can be run individually or in groups using the command line `--filter`
option.

The filter flags accept a string or a pattern as value.

Assuming the following tests:

```ts
Deno.test({ name: "my-test", fn: myTest });
Deno.test({ name: "test-1", fn: test1 });
Deno.test({ name: "test-2", fn: test2 });
```

This command will run all of these tests because they all contain the word
"test".

```shell
deno test --filter "test" tests/
```

On the flip side, the following command uses a pattern and will run the second
and third tests.

```shell
deno test --filter "/test-*\d/" tests/
```

_To let Deno know that you want to use a pattern, wrap your filter with
forward-slashes like the JavaScript syntactic sugar for a REGEX._

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

### Test definition filtering

Within the tests themselves, you have two options for filtering.

#### Filtering out (Ignoring these tests)

Sometimes you want to ignore tests based on some sort of condition (for example
you only want a test to run on Windows). For this you can use the `ignore`
boolean in the test definition. If it is set to true the test will be skipped.

```ts
Deno.test({
  name: "do macOS feature",
  ignore: Deno.build.os !== "darwin",
  fn() {
    // do MacOS feature here
  },
});
```

#### Filtering in (Only run these tests)

Sometimes you may be in the middle of a problem within a large test class and
you would like to focus on just that test and ignore the rest for now. For this
you can use the `only` option to tell the test framework to only run tests with
this set to true. Multiple tests can set this option. While the test run will
report on the success or failure of each test, the overall test run will always
fail if any test is flagged with `only`, as this is a temporary measure only
which disables nearly all of your tests.

```ts
Deno.test({
  name: "Focus on this test only",
  only: true,
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

Deno ships with three built-in reporters:

- `pretty` (default)
- `dot`
- `junit`

You can specify the reporter to use with the `--reporter` flag.

```shell
# use default pretty reporter
$ deno test

# use dot reporter with concise output
$ deno test --reporter=dot

# use JUnit reporter
$ deno test --reporter=junit
```

You can also write the output of machine-readable JUnit report to a file, while
still enjoying human-readable output in the terminal. In such situations specify
`--junit-path` flag:

```shell
$ deno test --junit-path=./report.xml
```

## Integration with testing libraries

Deno's test runner works with popular testing libraries like
[Chai](https://www.chaijs.com/), [Sinon.JS](https://sinonjs.org/) or
[fast-check](https://fast-check.dev/).

For example integration see:

- https://deno.land/std/testing/chai_example.ts
- https://deno.land/std/testing/sinon_example.ts
- https://deno.land/std/testing/fast_check_example.ts

### Example: spying on a function with Sinon

Test spies are function stand-ins that are used to assert if a function's
internal behavior matches expectations. Sinon is a widely used testing library
that provides test spies and can be used in Deno by importing it from NPM:

```js
import sinon from "npm:sinon";
```

Say we have two functions, `foo` and `bar` and want to assert that `bar` is
called during execution of `foo`. There are a few ways to achieve this with
Sinon, one is to have function `foo` take another function as a parameter:

```js
// my_file.js
export function bar() {/*...*/}

export function foo(fn) {
  fn();
}
```

This way, we can call `foo(bar)` in the application code or wrap a spy function
around `bar` and call `foo(spy)` in the testing code:

```js
import sinon from "npm:sinon";
import { assertEquals } from "jsr:std/assert@^0";
import { bar, foo } from "./my_file.js";

Deno.test("calls bar during execution of foo", () => {
  // create a test spy that wraps 'bar'
  const spy = sinon.spy(bar);

  // call function 'foo' and pass the spy as an argument
  foo(spy);

  assertEquals(spy.called, true);
  assertEquals(spy.getCalls().length, 1);
});
```

If you prefer not to add additional parameters for testing purposes only, you
can also use `sinon` to wrap a method on an object instead. In other JavaScript
environments `bar` might have been accessible via a global such as `window` and
callable via `sinon.spy(window, "bar")`, but in Deno this will not work and
instead you can `export` an object with the functions to be tested. This means
rewriting `my_file.js` to something like this:

```js
// my_file.js
function bar() {/*...*/}

export const funcs = {
  bar,
};

// 'foo' no longer takes a parameter, but calls 'bar' from an object
export function foo() {
  funcs.bar();
}
```

And then `import` in a test file:

```js
import sinon from "npm:sinon";
import { assertEquals } from "jsr:std/assert@^0";
import { foo, funcs } from "./my_file.js";

Deno.test("calls bar during execution of foo", () => {
  // create a test spy that wraps 'bar' on the 'funcs' object
  const spy = sinon.spy(funcs, "bar");

  // call function 'foo' without an argument
  foo();

  assertEquals(spy.called, true);
  assertEquals(spy.getCalls().length, 1);
});
```
