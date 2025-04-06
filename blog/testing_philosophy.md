---
title: "The Philosophy of Testing in JavaScript and TypeScript"
subtitle: "Why, how, and when to test your Deno applications"
publish_date: 2023-09-15
---

# The Philosophy of Testing in JavaScript and TypeScript

Writing code that works is one thing; writing code that you *know* works is another matter entirely. Testing is the cornerstone of reliable software development, but many developers either avoid it or approach it with reluctance. This post explores why testing matters, the different approaches to testing, and how Deno makes the testing process both straightforward and powerful.

## Why Testing Matters

### The Cost of Bugs

Let's start with the most obvious reason: bugs are expensive. Research consistently shows that fixing bugs becomes exponentially more costly the later they're discovered in the development lifecycle. A bug caught during development might take minutes to fix, but the same bug discovered in production could cost hours or days of work, impact users, damage your reputation, and potentially lead to security vulnerabilities.

Consider these statistics:
- The average cost to fix a bug discovered during implementation is about 6x less than one found in production
- Bugs that escape to production take on average 24x longer to identify and fix
- Each severe production bug can cost a company between $5,000 and $100,000

Testing is your first line of defense against these costs.

### Building Confidence

Well-written tests give you the confidence to:

- Refactor aggressively without fear of breaking existing functionality
- Integrate new features without causing regression issues
- Understand how existing code works through its test specifications
- Update dependencies with certainty that your application still functions

Every test you write is like an insurance policy against future problems.

### Documentation Through Examples

Tests serve as executable documentation. They demonstrate exactly how a piece of code should work and provide concrete examples of usage. This is especially valuable in open-source projects or teams where different developers may work on the same codebase over time.

A well-maintained test suite answers the question "how do I use this?" before it's even asked.

## Testing Philosophies and Approaches

Testing isn't one-size-fits-all. Various philosophies and methodologies have evolved over time, each with its own strengths and ideal use cases.

### Test-Driven Development (TDD)

The TDD approach follows a simple rhythm:

1. Write a failing test for a piece of functionality that doesn't exist yet
2. Implement just enough code to make the test pass
3. Refactor to improve the code while keeping tests passing
4. Repeat

This "red-green-refactor" cycle promotes simple designs, comprehensive test coverage, and confidence in your code. TDD advocates argue it leads to better architecture because you're forced to think about how your code will be used before you write it.

```ts
// Step 1: Write a failing test
Deno.test("capitalize should uppercase the first letter", () => {
  assertEquals(capitalize("hello"), "Hello");
});

// Step 2: Implement just enough to make it pass
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### Behavior-Driven Development (BDD)

BDD extends TDD by focusing on the behavior of an application from the end user's perspective. It uses natural language to describe tests, making them accessible to non-developers:

```ts
import { describe, it } from "jsr:@std/testing/bdd";

describe("User authentication", () => {
  it("should allow a user with valid credentials to log in", () => {
    // Test implementation
  });

  it("should reject a user with invalid credentials", () => {
    // Test implementation
  });
});
```

BDD bridges the communication gap between technical and non-technical team members, ensuring everyone shares a common understanding of what the software should do.

### The Testing Pyramid

The testing pyramid conceptualizes how to balance different types of tests:

```
     /\
    /  \
   /    \
  / E2E  \
 /--------\
/Integration\
/------------\
/    Unit     \
/--------------\
```

- **Unit tests** form the foundation: small, fast tests that verify individual functions or components in isolation.
- **Integration tests** occupy the middle: they test how components work together.
- **End-to-end tests** sit at the top: they verify entire workflows from a user's perspective.

The pyramid shape suggests having many unit tests, fewer integration tests, and even fewer E2E tests. This balances thoroughness with the speed and maintenance cost of your test suite.

### The Testing Trophy

Kent C. Dodds proposed an alternative model called the "testing trophy":

```
    🏆
   / \
  /   \
 /E2E  \
/-------\
\ Integration /
 \---------/
  \Static/
   \---/
```

This approach emphasizes integration tests that verify how components work together in a more realistic environment, while still maintaining some unit tests for complex logic and E2E tests for critical paths.

## Practical Testing Strategies

Regardless of your preferred philosophy, here are practical strategies to make testing more effective:

### Test Behavior, Not Implementation

Focus on what your code does, not how it does it. Tests tied too closely to implementation details become brittle and break whenever you refactor.

```ts
// Poor: Testing implementation details
Deno.test("addToCart calls database.save", () => {
  const dbSpy = spy(database, "save");
  cart.addToCart(product);
  assertSpyCalls(dbSpy, 1);
});

// Better: Testing behavior
Deno.test("adding a product increases cart item count", () => {
  const initialCount = cart.itemCount;
  cart.addToCart(product);
  assertEquals(cart.itemCount, initialCount + 1);
});
```

### Arrange-Act-Assert Pattern

Structure your tests with clear separation between setup, execution, and verification:

```ts
Deno.test("user authentication", () => {
  // Arrange: Set up the test data
  const user = { username: "test", password: "correct" };
  const auth = new AuthService();

  // Act: Perform the action being tested
  const result = auth.authenticate(user.username, user.password);

  // Assert: Verify the results match expectations
  assertEquals(result.success, true);
  assertEquals(result.token.length > 0, true);
});
```

This pattern makes tests easier to read and reason about.

### Testing Pure Functions

Pure functions (those without side effects that always return the same output for a given input) are the easiest to test. Whenever possible, extract pure functions from your codebase and test them thoroughly:

```ts
// A pure function
function calculateDiscount(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}

// Easy to test with multiple cases
Deno.test("calculateDiscount", () => {
  assertEquals(calculateDiscount(100, 20), 80);
  assertEquals(calculateDiscount(50, 10), 45);
  assertEquals(calculateDiscount(200, 0), 200);
});
```

### Test Isolation

Each test should be independent and not rely on the state from previous tests. This makes tests more reliable and easier to debug:

```ts
// Don't do this - tests depend on each other
let counter = 0;

Deno.test("first test increments counter", () => {
  counter++;
  assertEquals(counter, 1);
});

Deno.test("second test increments counter again", () => {
  counter++;
  assertEquals(counter, 2); // Will fail if tests run in a different order
});

// Do this instead - each test is isolated
Deno.test("test incrementing from zero", () => {
  const counter = 0;
  const newCounter = increment(counter);
  assertEquals(newCounter, 1);
});

Deno.test("test incrementing from one", () => {
  const counter = 1;
  const newCounter = increment(counter);
  assertEquals(newCounter, 2);
});
```

## Testing in Deno

Deno's built-in testing capabilities make it exceptionally easy to get started with testing. Let's explore what makes testing in Deno both powerful and developer-friendly.

### Built-in Test Runner

Unlike Node.js, where you need to install and configure a testing framework like Jest, Mocha, or Jasmine, Deno has a test runner built directly into the runtime:

```ts
// Just create a file with _test.ts suffix
// hello_test.ts
import { assertEquals } from "jsr:@std/assert";

Deno.test("hello world", () => {
  assertEquals("hello", "hello");
});

// Run it with a simple command
// $ deno test
```

This reduces setup overhead and makes the barrier to entry for testing much lower – a crucial factor in encouraging developers to write tests.

### Permissions Model for Safer Tests

Deno's security model extends to testing, allowing you to specify exactly what permissions your tests need:

```ts
Deno.test({
  name: "test that needs network access",
  permissions: {
    net: true,
  },
  fn: async () => {
    const response = await fetch("https://deno.land");
    assertEquals(response.status, 200);
  },
});
```

This makes it explicit when tests require access to sensitive resources like the network, filesystem, or environment variables, and prevents tests from accidentally performing unwanted operations.

### First-Class TypeScript Support

TypeScript's static type checking catches many potential bugs before tests even run, forming a complementary layer of verification:

```ts
// The type system prevents this function from being called incorrectly
function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

// Tests can focus on logic and edge cases
Deno.test("divide handles zero divisor", () => {
  assertThrows(() => divide(10, 0), Error, "Cannot divide by zero");
});
```

### Snapshot Testing

For testing complex objects or UI components, snapshot testing can be incredibly valuable:

```ts
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("complex object matches snapshot", async (t) => {
  const result = generateComplexReport();

  await assertSnapshot(t, result);
});
```

This creates a snapshot file the first time the test runs, then compares future test runs against it, alerting you to any changes.

## Advanced Testing Techniques

For those already comfortable with basic testing, here are some advanced techniques to elevate your testing game.

### Property-Based Testing

Rather than manually specifying test cases, property-based testing generates random inputs and verifies that certain properties or invariants hold true:

```ts
import { fc } from "https://cdn.skypack.dev/fast-check";

Deno.test("string reversal", () => {
  fc.assert(
    fc.property(fc.string(), (str) => {
      // For any string, reversing it twice should return the original
      const reversed = reverseString(str);
      const doubleReversed = reverseString(reversed);
      assertEquals(doubleReversed, str);
    })
  );
});
```

This approach can uncover edge cases you might never think to test manually.

### Mutation Testing

Mutation testing evaluates the quality of your tests by introducing "mutations" (small changes) to your code and checking if your tests catch these changes:

```ts
// Original code
function isEven(num: number): boolean {
  return num % 2 === 0;
}

// Mutation: the !== operator might be changed to ===
function isEven(num: number): boolean {
  return num % 2 !== 0; // Mutated!
}
```

If your tests still pass after a mutation, it suggests they might not be thorough enough. Tools like [Stryker Mutator](https://stryker-mutator.io/) can automate this process.

### Visual Regression Testing

For UI components, visual regression testing captures screenshots of components and compares them against baseline images to detect unintended visual changes:

```ts
Deno.test("component rendering", async () => {
  const component = renderComponent();
  const screenshot = await captureScreenshot(component);
  
  await assertScreenshotMatch(screenshot, "baseline.png");
});
```

### Contract Testing

For microservices or distributed systems, contract testing verifies that services adhere to agreed-upon interfaces:

```ts
Deno.test("API conforms to contract", async () => {
  const contract = await loadContract("user-service-contract.json");
  const api = new UserServiceApi();
  
  for (const endpoint of contract.endpoints) {
    const response = await api.call(endpoint.path, endpoint.method, endpoint.sampleRequest);
    assertContractFulfilled(response, endpoint.expectedResponse);
  }
});
```

## Common Testing Pitfalls

Even with the best intentions, testing can go wrong. Here are some common pitfalls to avoid:

### Testing the Wrong Things

Not all code is equally worthy of testing effort. Focus on:
- Complex business logic
- Code that handles user input
- Critical user flows
- Edge cases and error handling

Don't waste time testing:
- Third-party libraries (they should have their own tests)
- Simple getters/setters
- Implementation details that are likely to change

### Brittle Tests

Tests that break whenever you refactor code (even without changing behavior) are brittle and a maintenance burden:

```ts
// Brittle test tied to implementation
Deno.test("user save calls specific methods", () => {
  const validateSpy = spy(userManager, "validateUser");
  const dbSpy = spy(database, "saveRecord");
  
  userManager.saveUser({ name: "Test" });
  
  assertSpyCalls(validateSpy, 1);
  assertSpyCalls(dbSpy, 1);
});

// Robust test focused on outcomes
Deno.test("valid user is saved to database", async () => {
  const user = { name: "Test" };
  await userManager.saveUser(user);
  
  const savedUser = await database.findUserByName("Test");
  assertEquals(savedUser.name, "Test");
});
```

### Slow Tests

Slow test suites are less likely to be run frequently, reducing their value. Common causes include:
- Excessive use of E2E tests instead of unit tests
- Not mocking external dependencies
- Testing too many combinations of inputs

Strive for a test suite that runs in seconds, not minutes.

### Ignoring Flaky Tests

A flaky test is one that sometimes passes and sometimes fails without any code changes. These should never be ignored:

```ts
// Don't do this!
Deno.test({
  name: "sometimes fails - ignoring for now",
  ignore: true,
  fn: () => {
    // Flaky test that occasionally fails
  }
});
```

Instead, diagnose and fix the root cause, which might be:
- Race conditions
- Timing issues
- Order dependencies between tests
- External service dependencies

## Testing Legacy Code

Approaching an untested legacy codebase can be daunting, but here are strategies to make it manageable:

### The Characterization Testing Approach

Instead of trying to write perfect tests for imperfect code, start by documenting the current behavior:

```ts
Deno.test("document current behavior of legacy function", () => {
  // Don't worry if this behavior is correct yet, just document what it does
  assertEquals(legacyFunction(1, 2), 3);
  assertEquals(legacyFunction(0, 0), 0);
  assertEquals(legacyFunction(-1, 5), 4);
  
  // Even document the bugs!
  assertEquals(legacyFunction(null, 5), "5null");
});
```

These tests protect against unintended changes while you gradually improve the code.

### The Seam Strategy

Identify "seams" in the code where you can insert tests without changing behavior:

```ts
// Original code
function processData(data) {
  const validated = validateData(data);
  const transformed = transformData(validated);
  return storeData(transformed);
}

// Create a seam to make it testable
function processData(data, options = {}) {
  const { 
    validator = validateData,
    transformer = transformData,
    storage = storeData
  } = options;
  
  const validated = validator(data);
  const transformed = transformer(validated);
  return storage(transformed);
}

// Now you can test parts in isolation
Deno.test("data transformation", () => {
  const mockData = { value: 10 };
  const mockValidated = { value: 10, valid: true };
  
  const result = processData(mockData, {
    validator: () => mockValidated,
    storage: (data) => data
  });
  
  // Test just the transformation logic
  assertEquals(result.transformed, true);
});
```

### The Strangler Fig Pattern

Named after a vine that gradually envelops and replaces a tree, this approach involves:
1. Building a new, well-tested system alongside the old one
2. Gradually routing traffic from the old system to the new one
3. Eventually decommissioning the old system

This incremental approach manages risk while improving test coverage.

## Conclusion

Testing is both an art and a science. It requires technical skill to write effective tests, but also judgment to know what to test, when to test it, and how much testing is enough.

Remember that the goal of testing isn't to achieve arbitrary metrics like 100% code coverage, but to build reliable software that meets user needs and can evolve confidently over time.

Deno's built-in testing capabilities make this process as frictionless as possible, removing the traditional excuses for skipping tests. Whether you're writing a small utility library or a large-scale application, investing in testing will pay dividends in code quality, development speed, and peace of mind.

Start small, be consistent, and remember that even a few well-written tests are better than none at all. Your future self (and your teammates) will thank you.

---

## Additional Resources

- [Deno's official testing documentation](/runtime/fundamentals/testing/)
- [Testing web applications in Deno](/examples/web_testing_tutorial/)
- [Mocking in Deno](/examples/mocking_tutorial/)
- [Behavior-Driven Development with Deno](/examples/bdd_tutorial/)
- [Test Double," by Martin Fowler](https://martinfowler.com/bliki/TestDouble.html)
- [Working Effectively with Legacy Code," by Michael Feathers](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052)
