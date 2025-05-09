---
title: "Writing tests"
description: "Learn key concepts like test setup and structure, assertions, async testing, mocking, test fixtures, and code coverage"
url: /examples/testing_tutorial/
---

Testing is critical in software development to ensure your code works as
expected, and continues to work as you make changes. Tests verify that your
functions, modules, and applications behave correctly, handle edge cases
appropriately, and maintain expected performance characteristics.

## Why testing matters

Testing your code allows you to catch bugs, issues or regressions before they
reach production, saving time and resources. Tests are also useful to help plan
out the logic of your application, they can serve as a human readable
description of how your code is meant to be used.

Deno provides [built-in testing capabilities](/runtime/fundamentals/testing/),
making it straightforward to implement robust testing practices in your
projects.

## Writing tests with `Deno.test`

Defining a test in Deno is straightforward - use the `Deno.test()` function to
register your test with the test runner. This function accepts either a test
name and function, or a configuration object with more detailed options. All
test functions in files that match patterns like `*_test.{ts,js,mjs,jsx,tsx}` or
`*.test.{ts,js,mjs,jsx,tsx}` are automatically discovered and executed when you
run the `deno test` command.

Here are the basic ways to define tests:

```ts
// Basic test with a name and function
Deno.test("my first test", () => {
  // Your test code here
});

// Test with configuration options
Deno.test({
  name: "my configured test",
  fn: () => {
    // Your test code here
  },
  ignore: false, // Optional: set to true to skip this test
  only: false, // Optional: set to true to only run this test
  permissions: { // Optional: specify required permissions
    read: true,
    write: false,
  },
});
```

### A simple example test

Let's start with a simple test. Create a file called `main_test.ts`, in it we
will test a basic addition operation using Deno's testing API and the
`assertEquals` function from the [Deno Standard Library](https://jsr.io/@std).

We use `Deno.test` and provide a name that describes what the test will do:

```ts title="main_test.ts"
// hello_test.ts
import { assertEquals } from "jsr:@std/assert";

// Function we want to test
function add(a: number, b: number): number {
  return a + b;
}

Deno.test("basic addition test", () => {
  // Arrange - set up the test data
  const a = 1;
  const b = 2;

  // Act - call the function being tested
  const result = add(a, b);

  // Assert - verify the result is what we expect
  assertEquals(result, 3);
});
```

To run this test, use the `deno test` command:

```sh
deno test hello_test.ts
```

You should see output indicating that your test has passed:

```
running 1 test from ./hello_test.ts
basic addition test ... ok (2ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (2ms)
```

Try changing the function implementation to make the test fail:

```ts
function add(a: number, b: number): number {
  return a - b; // Changed from addition to subtraction
}
```

You'll see an error message that clearly shows what went wrong:

```sh
running 1 test from ./hello_test.ts
basic addition test ... FAILED (3ms)

failures:

basic addition test => ./hello_test.ts:12:3
error: AssertionError: Values are not equal:
    
    [Diff] Actual / Expected
    
    -   -1
    +   3

  at assertEquals (https://jsr.io/@std/assert@0.218.2/assert_equals.ts:31:9)
  at Object.fn (file:///path/to/hello_test.ts:12:3)
  at asyncOpSanitizer (ext:core/01_core.js:199:13)
  at Object.sanitizeOps (ext:core/01_core.js:219:15)
  at runTest (ext:test/06_test_runner.js:319:29)
  at test (ext:test/06_test_runner.js:593:7)

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out (3ms)
```

This clear feedback helps you quickly identify and fix issues in your code.

## Test structure and organization

Deno will automatically find and run tests that match naming patterns like
`*_test.{ts,js,mjs,jsx,tsx}` or `*.test.{ts,js,mjs,jsx,tsx}`. There are plenty
of ways to organize your test files, we recommend co-locating your unit tests
with the code they are testing, and keeping integration tests and configuration
in a `tests` directory. This allows for immediate discovery of unit tests and
simplified imports, while keeping a separation between different types of tests.

Here's an example of how you might structure your project with tests:

```sh
my-deno-project/
├── src/
│   ├── models/
│   │   ├── user.ts
│   │   ├── user_test.ts          // Unit tests for user model
│   │   ├── product.ts
│   │   └── product_test.ts       // Unit tests for product model
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── auth-service_test.ts  // Unit tests for auth service
│   │   ├── data-service.ts
│   │   └── data-service_test.ts  // Unit tests for data service
│   └── utils/
│       ├── helpers.ts
│       └── helpers_test.ts       // Unit tests for helpers
├── tests/
│   ├── integration/              // Integration tests directory
│   │   ├── api_test.ts           // Tests API endpoints
│   │   └── db_test.ts            // Tests database interactions
│   ├── e2e/                      // End-to-end tests
│   │   └── user_flow_test.ts     // Tests complete user workflows
│   └── fixtures/                 // Shared test data and utilities
│       ├── test_data.ts          // Test data used across tests
│       └── setup.ts              // Common setup functions
├── main.ts
└── deno.json                     // Project configuration
```

This kind of structure offers a centralized place for test configuration while
maintaining the benefits of co-locating unit tests with their relevant files.
With this structure, you can:

```sh
# Run all tests
deno test

# Run only unit tests
deno test src/

# Run only integration tests
deno test tests/integration/

# Run specific module tests
deno test src/models/

# Run a specific test file
deno test src/models/user_test.ts
```

## Assertions

Assertions are the building blocks of effective tests, allowing you to verify
that your code behaves as expected. They check if a specific condition is true
and throw an error if it's not, causing the test to fail. Good assertions are
clear, specific, and help identify exactly what went wrong when a test fails.

Deno doesn't include assertions in its core library, but you can import them
from the [Deno standard library](https://jsr.io/@std/assert):

```ts
import {
  assertArrayIncludes, // Check that array contains value
  assertEquals, // Check that values are equal
  assertExists, // Check that value is not null or undefined
  assertMatch, // Check that string matches regex pattern
  assertNotEquals, // Check that values are not equal
  assertObjectMatch, // Check that object has expected properties
  assertRejects, // Check that Promise rejects
  assertStrictEquals, // Check that values are strictly equal (===)
  assertStringIncludes, // Check that string contains substring
  assertThrows, // Check that function throws an error
} from "jsr:@std/assert";

Deno.test("assertion examples", () => {
  // Basic assertions
  assertEquals(1 + 1, 2);
  assertNotEquals("hello", "world");
  assertExists("Hello");

  // String assertions
  assertStringIncludes("Hello, world!", "world");
  assertMatch("deno@1.0.0", /^deno@\d+\.\d+\.\d+$/);

  // Object assertions
  assertObjectMatch(
    { name: "Jane", age: 25, city: "Tokyo" },
    { name: "Jane" }, // Only checks specified properties
  );

  // Strict equality (type + value)
  assertStrictEquals("deno", "deno");

  // Error assertions
  assertThrows(
    () => {
      throw new Error("Something went wrong");
    },
    Error,
    "Something went wrong",
  );
});
```

For those that prefer fluent assertions (familiar to users of Jest), you can use
the `expect` module:

```ts
import { expect } from "jsr:@std/expect";

Deno.test("expect style assertions", () => {
  // Basic matchers
  expect(5).toBe(5);
  expect({ name: "deno" }).toEqual({ name: "deno" });

  // Collection matchers
  expect([1, 2, 3]).toContain(2);

  // Truthiness matchers
  expect(true).toBeTruthy();
  expect(0).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();

  // Number matchers
  expect(100).toBeGreaterThan(99);
  expect(1).toBeLessThan(2);

  // String matchers
  expect("Hello world").toMatch(/world/);

  // Function/error matchers
  expect(() => {
    throw new Error("fail");
  }).toThrow();
});
```

### Real-world Example

Here's a more realistic example testing a function that processes user data:

```ts
// user_processor.ts
export function validateUser(user: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!user.name || typeof user.name !== "string") {
    errors.push("Name is required and must be a string");
  }

  if (!user.email || !user.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (
    user.age !== undefined && (typeof user.age !== "number" || user.age < 18)
  ) {
    errors.push("Age must be a number and at least 18");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// user_processor_test.ts
import { assertEquals } from "jsr:@std/assert";
import { validateUser } from "./user_processor.ts";

Deno.test("validateUser", async (t) => {
  await t.step("should validate a correct user object", () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    const result = validateUser(user);
    assertEquals(result.valid, true);
    assertEquals(result.errors.length, 0);
  });

  await t.step("should return errors for invalid user", () => {
    const user = {
      name: "",
      email: "invalid-email",
      age: 16,
    };

    const result = validateUser(user);
    assertEquals(result.valid, false);
    assertEquals(result.errors.length, 3);
    assertEquals(result.errors[0], "Name is required and must be a string");
    assertEquals(result.errors[1], "Valid email is required");
    assertEquals(result.errors[2], "Age must be a number and at least 18");
  });

  await t.step("should handle missing properties", () => {
    const user = {
      name: "Jane Doe",
      // email and age missing
    };

    const result = validateUser(user);
    assertEquals(result.valid, false);
    assertEquals(result.errors.length, 1);
    assertEquals(result.errors[0], "Valid email is required");
  });
});
```

## Async testing

Deno handles async tests naturally. Just make your test function async and use
await:

```ts
import { assertEquals } from "jsr:@std/assert";

Deno.test("async test example", async () => {
  const response = await fetch("https://deno.land");
  const status = response.status;
  assertEquals(status, 200);
});
```

### Testing async functions

When testing functions that return promises, you should always await the result:

```ts
// async-function.ts
export async function fetchUserData(userId: string) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

// async-function_test.ts
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { fetchUserData } from "./async-function.ts";

Deno.test("fetchUserData success", async () => {
  // Mock the fetch function for testing
  globalThis.fetch = async (url: string) => {
    const data = JSON.stringify({ id: "123", name: "Test User" });
    return new Response(data, { status: 200 });
  };

  const userData = await fetchUserData("123");
  assertEquals(userData.id, "123");
  assertEquals(userData.name, "Test User");
});

Deno.test("fetchUserData failure", async () => {
  // Mock the fetch function to simulate an error
  globalThis.fetch = async (url: string) => {
    return new Response("Not Found", { status: 404 });
  };

  await assertRejects(
    async () => await fetchUserData("nonexistent"),
    Error,
    "Failed to fetch user: 404",
  );
});
```

## Mocking in tests

Mocking is an essential technique for isolating the code being tested from its
dependencies. Deno provides built-in utilities and third-party libraries for
creating mocks.

### Basic Mocking

You can create simple mocks by
[replacing functions or objects with your own
implementations](/examples/mocking_tutorial/). This allows you to control the
behavior of dependencies and test how your code interacts with them.

```ts
// Example of a module with a function we want to mock
const api = {
  fetchData: async () => {
    const response = await fetch("https://api.example.com/data");
    return response.json();
  },
};

// In your test file
Deno.test("basic mocking example", async () => {
  // Store the original function
  const originalFetchData = api.fetchData;

  // Replace with mock implementation
  api.fetchData = async () => {
    return { id: 1, name: "Test Data" };
  };

  try {
    // Test using the mock
    const result = await api.fetchData();
    assertEquals(result, { id: 1, name: "Test Data" });
  } finally {
    // Restore the original function
    api.fetchData = originalFetchData;
  }
});
```

### Using Spy Functions

Spies allow you to track function calls without changing their behavior:

```ts
import { spy } from "jsr:@std/testing/mock";

Deno.test("spy example", () => {
  // Create a spy on console.log
  const consoleSpy = spy(console, "log");

  // Call the function we're spying on
  console.log("Hello");
  console.log("World");

  // Verify the function was called correctly
  assertEquals(consoleSpy.calls.length, 2);
  assertEquals(consoleSpy.calls[0].args, ["Hello"]);
  assertEquals(consoleSpy.calls[1].args, ["World"]);

  // Restore the original function
  consoleSpy.restore();
});
```

For more advanced mocking techniques, check our
[dedicated guide on mocking in Deno](/examples/mocking_tutorial/).

## Coverage

Code coverage is a metric that helps you understand how much of your code is
being tested. It measures which lines, functions, and branches of your code are
executed during your tests, giving you insight into areas that might lack proper
testing.

Coverage analysis helps you to:

- Identify untested parts of your codebase
- Ensure critical paths have tests
- Prevent regressions when making changes
- Measure testing progress over time

:::note

High coverage doesn't guarantee high-quality tests. It simply shows what code
was executed, not whether your assertions are meaningful or if edge cases are
handled correctly.

:::

Deno provides built-in coverage tools to help you analyze your test coverage. To
collect coverage information:

```bash
deno test --coverage=coverage_dir
```

This generates coverage data in a specified directory (here, `coverage_dir`). To
view a human-readable report:

```bash
deno coverage coverage_dir
```

You'll see output like:

```sh
file:///projects/my-project/src/utils.ts 85.7% (6/7)
file:///projects/my-project/src/models/user.ts 100.0% (15/15)
file:///projects/my-project/src/services/auth.ts 78.3% (18/23)

total: 87.5% (39/45)
```

For more detailed insights, you can also generate an HTML report:

```bash
deno coverage --html coverage_dir
```

This creates an interactive HTML report in the specified directory that shows
exactly which lines are covered and which are not.

By default, the coverage tool automatically excludes:

- Test files (matching patterns like `test.ts` or `test.js`)
- Remote files (those not starting with `file:`)

This ensures your coverage reports focus on your application code rather than
test files or external dependencies.

### Coverage Configuration

You can exclude files from coverage reports by using the `--exclude` flag:

```bash
deno coverage --exclude="test_,vendor/,_build/,node_modules/" coverage_dir
```

### Integrating with CI

For continuous integration environments, you might want to enforce a minimum
coverage threshold:

```yaml
# In your GitHub Actions workflow
- name: Run tests with coverage
  run: deno test --coverage=coverage_dir

- name: Check coverage meets threshold
  run: |
    COVERAGE=$(deno coverage coverage_dir | grep "total:" | grep -o '[0-9]\+\.[0-9]\+')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Test coverage is below 80%: $COVERAGE%"
      exit 1
    fi
```

When working on your test coverage, remember to set realistic goals, aim for
meaningful coverage with high quality tests over 100% coverage.

## Comparison with other testing frameworks

If you're coming from other JavaScript testing frameworks, here's how Deno's
testing capabilities compare:

| Feature       | Deno             | Jest                   | Mocha                      | Jasmine               |
| ------------- | ---------------- | ---------------------- | -------------------------- | --------------------- |
| Setup         | Built-in         | Requires installation  | Requires installation      | Requires installation |
| Syntax        | `Deno.test()`    | `test()`, `describe()` | `it()`, `describe()`       | `it()`, `describe()`  |
| Assertions    | From std library | Built-in expect        | Requires assertion library | Built-in expect       |
| Mocking       | From std library | Built-in jest.mock()   | Requires sinon or similar  | Built-in spies        |
| Async support | Native           | Needs special handling | Supports promises          | Supports promises     |
| File watching | `--watch` flag   | watch mode             | Requires nodemon           | Requires extra tools  |
| Code coverage | Built-in         | Built-in               | Requires istanbul          | Requires istanbul     |

### Testing Style Comparison

**Deno:**

```ts
import { assertEquals } from "jsr:@std/assert";

Deno.test("add function", () => {
  assertEquals(1 + 2, 3);
});
```

**Jest:**

```ts
test("add function", () => {
  expect(1 + 2).toBe(3);
});
```

**Mocha:**

```ts
import { assert } from "chai";

describe("math", () => {
  it("should add numbers", () => {
    assert.equal(1 + 2, 3);
  });
});
```

**Jasmine:**

```ts
describe("math", () => {
  it("should add numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

## Next steps

🦕 Deno's built-in testing capabilities make it easy to write and run tests
without needing to install extra testing frameworks or tools. By following the
patterns and practices outlined in this tutorial, you can ensure your Deno
applications are well-tested and reliable.

For more information about testing in Deno, check out:

- [Testing documentation](/runtime/fundamentals/testing)
- [Mocking data for tests](/examples/mocking_tutorial/)
- [Writing benchmark tests](/examples/benchmarking/)
