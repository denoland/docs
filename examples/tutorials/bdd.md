---
last_modified: 2026-05-13
title: "Behavior-Driven Development (BDD)"
description: "Implementing Behavior-Driven Development with Deno's Standard Library's BDD module. Create readable, well organised tests with effective assertions."
url: /examples/bdd_tutorial/
---

Behavior-Driven Development (BDD) is an approach to software development that
encourages collaboration between developers, QA, and non-technical stakeholders.
BDD focuses on defining the behavior of an application through examples written
in a natural, ubiquitous language that all stakeholders can understand.

Deno's Standard Library provides a BDD-style testing module that allows you to
structure tests in a way that's both readable for non-technical stakeholders and
practical for implementation. In this tutorial, we'll explore how to use the BDD
module to create descriptive test suites for your applications.

## Introduction to BDD

BDD extends
[Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)
(TDD) by writing tests in a natural language that is easy to read. Rather than
thinking about "tests," BDD encourages us to consider "specifications" or
"specs" that describe how software should behave from the user's perspective.
This approach helps to keep tests focused on what the code should do rather than
how it is implemented.

The basic elements of BDD include:

- **Describe** blocks that group related specifications
- **It** statements that express a single behavior
- **Before/After** hooks for setup and teardown operations

## Using Deno's BDD module

To get started with BDD testing in Deno, we'll use the `@std/testing/bdd` module
from the [Deno Standard Library](https://jsr.io/@std/testing/doc/bdd).

First, let's import the necessary functions:

```ts
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";
```

These imports provide the core BDD functions:

- `describe` creates a block that groups related tests
- `it` declares a test case that verifies a specific behavior
- `beforeEach`/`afterEach` run before or after each test case
- `beforeAll`/`afterAll` run once before or after all tests in a describe block

We'll also use assertion functions from
[`@std/assert`](https://jsr.io/@std/assert) to verify our expectations.

### Writing your first BDD test

Let's create a simple calculator module and test it using BDD:

```ts title="calculator.ts"
export class Calculator {
  private value: number = 0;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  add(number: number): Calculator {
    this.value += number;
    return this;
  }

  subtract(number: number): Calculator {
    this.value -= number;
    return this;
  }

  multiply(number: number): Calculator {
    this.value *= number;
    return this;
  }

  divide(number: number): Calculator {
    if (number === 0) {
      throw new Error("Cannot divide by zero");
    }
    this.value /= number;
    return this;
  }

  get result(): number {
    return this.value;
  }
}
```

Now, let's test this calculator using the BDD style:

```ts title="calculator_test.ts"
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { Calculator } from "./calculator.ts";

describe("Calculator", () => {
  let calculator: Calculator;

  // Before each test, create a new Calculator instance
  beforeEach(() => {
    calculator = new Calculator();
  });

  it("should initialize with zero", () => {
    assertEquals(calculator.result, 0);
  });

  it("should initialize with a provided value", () => {
    const initializedCalculator = new Calculator(10);
    assertEquals(initializedCalculator.result, 10);
  });

  describe("add method", () => {
    it("should add a positive number correctly", () => {
      calculator.add(5);
      assertEquals(calculator.result, 5);
    });

    it("should handle negative numbers", () => {
      calculator.add(-5);
      assertEquals(calculator.result, -5);
    });

    it("should be chainable", () => {
      calculator.add(5).add(10);
      assertEquals(calculator.result, 15);
    });
  });

  describe("subtract method", () => {
    it("should subtract a number correctly", () => {
      calculator.subtract(5);
      assertEquals(calculator.result, -5);
    });

    it("should be chainable", () => {
      calculator.subtract(5).subtract(10);
      assertEquals(calculator.result, -15);
    });
  });

  describe("multiply method", () => {
    beforeEach(() => {
      // For multiplication tests, start with value 10
      calculator = new Calculator(10);
    });

    it("should multiply by a number correctly", () => {
      calculator.multiply(5);
      assertEquals(calculator.result, 50);
    });

    it("should be chainable", () => {
      calculator.multiply(2).multiply(3);
      assertEquals(calculator.result, 60);
    });
  });

  describe("divide method", () => {
    beforeEach(() => {
      // For division tests, start with value 10
      calculator = new Calculator(10);
    });

    it("should divide by a number correctly", () => {
      calculator.divide(2);
      assertEquals(calculator.result, 5);
    });

    it("should throw when dividing by zero", () => {
      assertThrows(
        () => calculator.divide(0),
        Error,
        "Cannot divide by zero",
      );
    });
  });
});
```

To run this test, use the `deno test` command:

```sh
deno test calculator_test.ts
```

You'll see output similar to this:

```sh
running 1 test from file:///path/to/calculator_test.ts
Calculator
  ✓ should initialize with zero 
  ✓ should initialize with a provided value 
  add method
    ✓ should add a positive number correctly 
    ✓ should handle negative numbers 
    ✓ should be chainable 
  subtract method
    ✓ should subtract a number correctly 
    ✓ should be chainable 
  multiply method
    ✓ should multiply by a number correctly 
    ✓ should be chainable 
  divide method
    ✓ should divide by a number correctly 
    ✓ should throw when dividing by zero 

ok | 11 passed | 0 failed (234ms)
```

## Organizing tests with nested describe blocks

One of the powerful features of BDD is the ability to nest `describe` blocks,
which helps organize tests hierarchically. In the calculator example, we grouped
tests for each method within their own `describe` blocks. This not only makes
the tests more readable, but also makes it easier to locate issues when the test
fails.

You can nest `describe` blocks, but be cautious of nesting too deep as excessive
nesting can make tests harder to follow.

## Hooks

The BDD module provides four hooks:

- `beforeEach` runs before each test in the current describe block
- `afterEach` runs after each test in the current describe block
- `beforeAll` runs once before all tests in the current describe block
- `afterAll` runs once after all tests in the current describe block

### beforeEach/afterEach

These hooks are ideal for:

- Setting up a fresh test environment for each test
- Cleaning up resources after each test
- Ensuring test isolation

In the calculator example, we used `beforeEach` to create a new calculator
instance before each test, ensuring each test starts with a clean state.

### beforeAll/afterAll

These hooks are useful for:

- Expensive setup operations that can be shared across tests
- Setting up and tearing down database connections
- Creating and cleaning up shared resources

Here's a runnable example that tests a small HTTP service. Spinning a server up
and down for every single test would be wasteful — and slow, once you have a
handful of cases — so the server starts once in `beforeAll` and shuts down once
in `afterAll`:

```ts title="user_api_test.ts"
import { afterAll, beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";

describe("User API", () => {
  let server: Deno.HttpServer;
  let baseUrl: string;

  beforeAll(() => {
    // Start the test server once before any test runs. Port 0 asks the
    // OS for a free port, so parallel test files don't collide.
    server = Deno.serve({ port: 0, onListen() {} }, (req) => {
      const { pathname } = new URL(req.url);
      if (pathname === "/users/1") {
        return Response.json({ id: 1, name: "Ada" });
      }
      return new Response("Not Found", { status: 404 });
    });
    const { port } = server.addr as Deno.NetAddr;
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    // Shut the server down once, after every test has run. Without
    // this, `deno test` would report a resource leak.
    await server.shutdown();
  });

  it("returns a known user", async () => {
    const res = await fetch(`${baseUrl}/users/1`);
    assertEquals(res.status, 200);
    assertEquals(await res.json(), { id: 1, name: "Ada" });
  });

  it("returns 404 for unknown users", async () => {
    const res = await fetch(`${baseUrl}/users/999`);
    assertEquals(res.status, 404);
    await res.body?.cancel();
  });
});
```

The server binds to a local port, so the test needs network permission to reach
itself:

```sh
deno test --allow-net=0.0.0.0,localhost user_api_test.ts
```

```console
running 1 test from ./user_api_test.ts
User API ...
  returns a known user ... ok (4ms)
  returns 404 for unknown users ... ok (1ms)
User API ... ok (6ms)

ok | 1 passed (2 steps) | 0 failed (11ms)
```

:::caution

Anything you create in `beforeAll` is shared by every test in the block. If one
test mutates that shared state — adds a row, changes a field, leaves a handler
registered — the next test starts from the changed state, not the original. When
tests need a clean slate, set up the cheap, per-test state in `beforeEach` and
leave only the expensive, read-mostly setup in `beforeAll`.

:::

## Gherkin vs. JavaScript-style BDD

If you're familiar with Cucumber or other BDD frameworks, you might be expecting
Gherkin syntax with "Given-When-Then" statements.

Deno's BDD module uses a JavaScript-style syntax rather than Gherkin. This
approach is similar to other JavaScript testing frameworks like Mocha or
Jasmine. However, you can still follow BDD principles by:

1. Writing clear, behavior-focused test descriptions
2. Structuring your tests to reflect user stories
3. Following the "Arrange-Act-Assert" pattern in your test implementations

For example, you can structure your `it` blocks to mirror the Given-When-Then
format:

```ts
describe("Calculator", () => {
  it("should add numbers correctly", () => {
    // Given
    const calculator = new Calculator();

    // When
    calculator.add(5);

    // Then
    assertEquals(calculator.result, 5);
  });
});
```

If you need full Gherkin support with natural language specifications, consider
using a dedicated BDD framework that integrates with Deno, such as
[cucumber-js](https://github.com/cucumber/cucumber-js).

## Best Practices for BDD with Deno

### Write your tests for humans to read

BDD tests should read like documentation. Use clear, descriptive language in
your `describe` and `it` statements:

```ts
// Good
describe("User authentication", () => {
  it("should reject login with incorrect password", () => {
    // Test code
  });
});

// Not good
describe("auth", () => {
  it("bad pw fails", () => {
    // Test code
  });
});
```

### Keep tests focused

Each test should verify a single behavior. Avoid testing multiple behaviors in a
single `it` block:

```ts
// Good
it("should add an item to the cart", () => {
  // Test adding to cart
});

it("should calculate the correct total", () => {
  // Test total calculation
});

// Bad
it("should add an item and calculate total", () => {
  // Test adding to cart
  // Test total calculation
});
```

### Use context-specific setup

When tests within a describe block need different setup, use nested describes
with their own `beforeEach` hooks rather than conditional logic:

```ts
// Good
describe("User operations", () => {
  describe("when user is logged in", () => {
    beforeEach(() => {
      // Setup logged-in user
    });

    it("should show the dashboard", () => {
      // Test
    });
  });

  describe("when user is logged out", () => {
    beforeEach(() => {
      // Setup logged-out state
    });

    it("should redirect to login", () => {
      // Test
    });
  });
});

// Avoid
describe("User operations", () => {
  beforeEach(() => {
    // Setup base state
    if (isLoggedInTest) {
      // Setup logged-in state
    } else {
      // Setup logged-out state
    }
  });

  it("should show dashboard when logged in", () => {
    isLoggedInTest = true;
    // Test
  });

  it("should redirect to login when logged out", () => {
    isLoggedInTest = false;
    // Test
  });
});
```

### Handle asynchronous tests properly

When testing asynchronous code, remember to:

- Mark your test functions as `async`
- Use `await` for promises
- Handle errors properly

```ts
it("should fetch user data asynchronously", async () => {
  const user = await fetchUser(1);
  assertEquals(user.name, "John Doe");
});
```

🦕 By following the BDD principles and practices outlined in this tutorial, you
can build more reliable software and solidify your reasoning about the 'business
logic' of your code.

Remember that BDD is not just about the syntax or tools but about the
collaborative approach to defining and verifying application behavior. The most
successful BDD implementations combine these technical practices with regular
conversations between developers, testers, product and business stakeholders.

To continue learning about testing in Deno, explore other modules in the
Standard Library's testing suite, such as [mocking](/examples/mocking_tutorial/)
and [snapshot testing](/examples/snapshot_test_tutorial/).
