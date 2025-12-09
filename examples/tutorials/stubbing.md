---
title: "Stubbing in tests"
description: "Learn how to use stubs in Deno to isolate code during testing by replacing function implementations with controlled behavior"
url: /examples/stubbing_tutorial/
---

Stubbing is a powerful technique for isolating the code you're testing by
replacing functions with controlled implementations. While
[spies](/examples/mocking_tutorial/#spying) monitor function calls without
changing behavior, stubs go a step further by completely replacing the original
implementation, allowing you to simulate specific conditions or behaviors during
testing.

## What are stubs?

Stubs are fake implementations that replace real functions during testing. They
let you:

- Control what values functions return
- Simulate errors or specific edge cases
- Prevent external services like databases or APIs from being called
- Test code paths that would be difficult to trigger with real implementations

Deno provides robust stubbing capabilities through the
[Standard Library's testing tools](https://jsr.io/@std/testing/doc/mock#stubbing).

## Basic stub usage

Here's a simple example demonstrating how to stub a function:

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// Wrap dependencies so they can be stubbed safely from tests.
const deps = {
  getUserName(_id: number): string {
    // In a real app, this might call a database
    return "Original User";
  },
};

// Function under test
function greetUser(id: number): string {
  const name = deps.getUserName(id);
  return `Hello, ${name}!`;
}

Deno.test("greetUser with stubbed getUserName", () => {
  // Create a stub that returns a controlled value
  const getUserNameStub = stub(deps, "getUserName", () => "Test User");

  try {
    // Test with the stubbed function
    const greeting = greetUser(123);
    assertEquals(greeting, "Hello, Test User!");
  } finally {
    // Always restore the original function
    getUserNameStub.restore();
  }
});
```

In this example, we:

1. Import the necessary functions from Deno's standard library
2. Create a stub for the `getUserName` function that returns "Test User" instead
   of calling the real implementation
3. Call our function under test, which will use the stubbed implementation
4. Verify the result meets our expectations
5. Restore the original function to prevent affecting other tests

## Using stubs in a testing scenario

Let's look at a more practical example with a `UserRepository` class that
interacts with a database:

```ts
import { assertSpyCalls, returnsNext, stub } from "jsr:@std/testing/mock";
import { assertThrows } from "jsr:@std/assert";

type User = {
  id: number;
  name: string;
};

// This represents our database access layer
const database = {
  getUserById(id: number): User | undefined {
    // In a real app, this would query a database
    return { id, name: "Ada Lovelace" };
  },
};

// The class we want to test
class UserRepository {
  static findOrThrow(id: number): User {
    const user = database.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

Deno.test("findOrThrow method throws when the user was not found", () => {
  // Stub the database.getUserById function to return undefined
  using dbStub = stub(database, "getUserById", returnsNext([undefined]));

  // We expect this function call to throw an error
  assertThrows(() => UserRepository.findOrThrow(1), Error, "User not found");

  // Verify the stubbed function was called once
  assertSpyCalls(dbStub, 1);
});
```

In this example:

1. We're testing the `findOrThrow` method, which should throw an error when a
   user is not found
2. We stub `database.getUserById` to return `undefined`, simulating a missing
   user
3. We verify that `findOrThrow` throws the expected error
4. We also check that the database method was called exactly once

Note that we're using the `using` keyword with `stub`, which is a convenient way
to ensure the stub is automatically restored when it goes out of scope.

## Advanced stub techniques

### Returning different values on subsequent calls

Sometimes you want a stub to return different values each time it's called:

```ts
import { returnsNext, stub } from "jsr:@std/testing/mock";
import { assertEquals } from "jsr:@std/assert";

Deno.test("stub with multiple return values", () => {
  const dataService = {
    fetchData: () => "original data",
  };

  const fetchDataStub = stub(
    dataService,
    "fetchData",
    // Return these values in sequence
    returnsNext(["first result", "second result", "third result"]),
  );

  try {
    assertEquals(dataService.fetchData(), "first result");
    assertEquals(dataService.fetchData(), "second result");
    assertEquals(dataService.fetchData(), "third result");
  } finally {
    fetchDataStub.restore();
  }
});

```

### Stubbing with implementation logic

You can also provide custom logic in your stub implementations:

```ts
import { stub } from "jsr:@std/testing/mock";
import { assertEquals } from "jsr:@std/assert";

Deno.test("stub with custom implementation", () => {
  // Create a counter to track how many times the stub is called
  let callCount = 0;

  const mathService = {
    calculate: (a: number, b: number) => a + b,
  };

  const calculateStub = stub(
    mathService,
    "calculate",
    (a: number, b: number) => {
      callCount++;
      return a + b * 2; // Custom implementation
    },
  );

  try {
    const result = mathService.calculate(5, 10);
    assertEquals(result, 25); // 5 + (10 * 2)
    assertEquals(callCount, 1);
  } finally {
    calculateStub.restore();
  }
});
```

## Stubbing API calls and external services

One of the most common uses of stubs is to replace API calls during testing:

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

const apiClient = {
  fetch: globalThis.fetch,
};

async function fetchUserData(id: string) {
  const response = await apiClient.fetch(`https://api.example.com/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

Deno.test("fetchUserData with stubbed fetch", async () => {
  const mockResponse = new Response(
    JSON.stringify({ id: "123", name: "Jane Doe" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

  // Replace apiClient.fetch with a stubbed version
  const fetchStub = stub(
    apiClient,
    "fetch",
    () => Promise.resolve(mockResponse),
  );

  try {
    const user = await fetchUserData("123");
    assertEquals(user, { id: "123", name: "Jane Doe" });
  } finally {
    fetchStub.restore();
  }
});
```

## Best practices

1. **Always restore stubs**: Use `try/finally` blocks or the `using` keyword to
   ensure stubs are restored, even if tests fail.

2. **Use stubs for external dependencies**: Stub out database calls, API
   requests, or file system operations to make tests faster and more reliable.

3. **Keep stubs simple**: Stubs should return predictable values that let you
   test specific scenarios.

4. **Combine with spies when needed**: Sometimes you need to both replace
   functionality (stub) and track calls (spy).

5. **Stub at the right level**: Stub at the interface boundary rather than deep
   within implementation details.

🦕 Stubs are a powerful tool for isolating your code during testing, allowing
you to create deterministic test environments and easily test edge cases. By
replacing real implementations with controlled behavior, you can write more
focused, reliable tests that run quickly and consistently.

For more testing resources, check out:

- [Testing in isolation with mocks](/examples/mocking_tutorial/)
- [Deno Standard Library Testing Modules](https://jsr.io/@std/testing)
- [Basic Testing in Deno](/examples/testing_tutorial/)
