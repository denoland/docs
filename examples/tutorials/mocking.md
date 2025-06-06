---
title: "Testing in isolation with mocks"
description: "Master the art of mocking in your unit tests. Learn how spies, stubs, fake time, and other Deno tools let you improve your code and confidence"
url: /examples/mocking_tutorial/
---

This guide builds on the
[basics of testing in Deno](/examples/testing_tutorial/) to focus specifically
on mocking techniques that help you isolate your code during testing.

For effective unit testing, you'll often need to "mock" the data that your code
interacts with. Mocking is a technique used in testing where you replace real
data with simulated versions that you can control. This is particularly useful
when testing components that interact with external services, such as APIs or
databases.

Deno provides [helpful mocking utilities](https://jsr.io/@std/testing/doc/mock)
through the Deno Standard Library, making your tests easier to write, more
reliable and faster.

### Spying

In Deno, you can [`spy`](https://jsr.io/@std/testing/doc/mock#spying) on a
function to track how it's called during test execution. Spies don't change how
a function behaves, but they record important details like how many times the
function was called and what arguments were passed to it.

By using spies, you can verify that your code interacts correctly with its
dependencies without setting up complex infrastructure.

In the following example we will test a function called `saveUser()`, which
takes a user object and a database object and calls the database's `save`
method:

```ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

// Define types for better code quality
interface User {
  name: string;
}

interface Database {
  save: (user: User) => Promise<User & { id: number }>;
}

// Function to test
function saveUser(
  user: User,
  database: Database,
): Promise<User & { id: number }> {
  return database.save(user);
}

// Test with a mock
Deno.test("saveUser calls database.save", async () => {
  // Create a mock database with a spy on the save method
  const mockDatabase = {
    save: spy((user: User) => Promise.resolve({ id: 1, ...user })),
  };

  const user: User = { name: "Test User" };
  const result = await saveUser(user, mockDatabase);

  // Verify the mock was called correctly
  assertSpyCalls(mockDatabase.save, 1);
  assertEquals(mockDatabase.save.calls[0].args[0], user);
  assertEquals(result, { id: 1, name: "Test User" });
});
```

We import the necessary functions from the Deno Standard Library to assert
equality and to create and verify spy functions.

The mock database is a stand-in for a real database object, with a `save` method
that is wrapped in a `spy`. The spy function tracks calls to the method, records
arguments passed to it and executes the underlying implementation (in this case
returning a promise with the `user` and an `id`).

The test calls `saveUser()` with the mock data and we use assertions to verify
that:

1. The save method was called exactly once
2. The first argument of the call was the `user` object we passed in
3. The result contains both the original user data and the added ID

We were able to test the `saveUser` operation without setting up or tearing down
any complex database state.

### Stubbing

While spies track method calls without changing behavior, stubs replace the
original implementation entirely.
[Stubbing](https://jsr.io/@std/testing/doc/mock#stubbing) is a form of mocking
where you temporarily replace a function or method with a controlled
implementation. This allows you to simulate specific conditions or behaviors and
return predetermined values. It can also be used when you need to override
environment-dependent functionality.

In Deno, you can create stubs using the `stub` function from the standard
testing library:

```ts
import { assertEquals } from "jsr:@std/assert";
import { Stub, stub } from "jsr:@std/testing/mock";

// Define types for better code quality
interface User {
  name: string;
  role: string;
}

// Original function
function getCurrentUser(userId: string): User {
  // Implementation that might involve database calls
  return { name: "Real User", role: "admin" };
}

// Function we want to test
function hasAdminAccess(userId: string): boolean {
  const user = getCurrentUser(userId);
  return user.role === "admin";
}

Deno.test("hasAdminAccess with stubbed user", () => {
  // Create a stub that replaces getCurrentUser
  const getUserStub: Stub<typeof getCurrentUser> = stub(
    globalThis,
    "getCurrentUser",
    // Return a test user with non-admin role
    () => ({ name: "Test User", role: "guest" }),
  );

  try {
    // Test with the stubbed function
    const result = hasAdminAccess("user123");
    assertEquals(result, false);

    // You can also change the stub's behavior during the test
    getUserStub.restore(); // Remove first stub

    const adminStub = stub(
      globalThis,
      "getCurrentUser",
      () => ({ name: "Admin User", role: "admin" }),
    );

    try {
      const adminResult = hasAdminAccess("admin456");
      assertEquals(adminResult, true);
    } finally {
      adminStub.restore();
    }
  } finally {
    // Always restore the original function
    getUserStub.restore();
  }
});
```

Here we import the necessary functions from the Deno Standard Library, then we
set up the function we're going to stub. In a real application this might
connect to a database, make an API call, or perform other operations that we may
want to avoid during testing.

We set up the function under test, in this case the `hasAdminAccess()` function.
We want to test whether it:

- Calls the `getCurrentUser()` function to get a user object
- Checks if the user's role is "admin"
- Returns a boolean indicating whether the user has admin access

Next we create a test named `hasAdminAccess with a stubbed user` and set up a
stub for the `getCurrentUser` function. This will replace the real
implementation with one that returns a user with a `guest` role.

We run the test with the stubbed function, it will call `hasAdminAccess` with a
user ID. Even though the real function would return a user with `admin` role,
our stub returns `guest`, so we can assert that `hasAdminAccess` returns `false`
(since our stub returns a non-admin user).

We can change the stub behavior to return `admin` instead and assert that the
function now returns `true`.

At the end we use a `finally` block to ensure the original function is restored
so that we don't accidentally affect other tests.

### Stubbing environment variables

For deterministic testing, you often need to control environment variables.
Deno's Standard Library provides utilities to achieve this:

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// Function that depends on environment variables and time
function generateReport() {
  const environment = Deno.env.get("ENVIRONMENT") || "development";
  const timestamp = new Date().toISOString();

  return {
    environment,
    generatedAt: timestamp,
    data: {/* report data */},
  };
}

Deno.test("report generation with controlled environment", () => {
  // Stub environment
  const originalEnv = Deno.env.get;
  const envStub = stub(Deno.env, "get", (key: string) => {
    if (key === "ENVIRONMENT") return "production";
    return originalEnv.call(Deno.env, key);
  });

  // Stub time
  const dateStub = stub(
    Date.prototype,
    "toISOString",
    () => "2023-06-15T12:00:00Z",
  );

  try {
    const report = generateReport();

    // Verify results with controlled values
    assertEquals(report.environment, "production");
    assertEquals(report.generatedAt, "2023-06-15T12:00:00Z");
  } finally {
    // Always restore stubs to prevent affecting other tests
    envStub.restore();
    dateStub.restore();
  }
});
```

### Faking time

Time-dependent code can be challenging to test because it may produce different
results based on when the test runs. Deno provides a
[`FakeTime`](https://jsr.io/@std/testing/doc/time) utility that allows you to
simulate the passage of time and control date-related functions during tests.

The example below demonstrates how to test time-dependent functions:
`isWeekend()`, which returns true if the current day is Saturday or Sunday, and
`delayedGreeting()` which calls a callback after a 1-second delay:

```ts
import { assertEquals } from "jsr:@std/assert";
import { FakeTime } from "jsr:@std/testing/time";

// Function that depends on the current time
function isWeekend(): boolean {
  const date = new Date();
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Function that works with timeouts
function delayedGreeting(callback: (message: string) => void): void {
  setTimeout(() => {
    callback("Hello after delay");
  }, 1000); // 1 second delay
}

Deno.test("time-dependent tests", () => {
  using fakeTime = new FakeTime();

  // Create a fake time starting at a specific date (a Monday)
  const mockedTime: FakeTime = fakeTime(new Date("2023-05-01T12:00:00Z"));

  try {
    // Test with the mocked Monday
    assertEquals(isWeekend(), false);

    // Move time forward to Saturday
    mockedTime.tick(5 * 24 * 60 * 60 * 1000); // Advance 5 days
    assertEquals(isWeekend(), true);

    // Test async operations with timers
    let greeting = "";
    delayedGreeting((message) => {
      greeting = message;
    });

    // Advance time to trigger the timeout immediately
    mockedTime.tick(1000);
    assertEquals(greeting, "Hello after delay");
  } finally {
    // Always restore the real time
    mockedTime.restore();
  }
});
```

Here we set up a test which creates a controlled time environment with
`fakeTime` which sets the starting date to May 1, 2023, (which was a Monday). It
returns a `FakeTime` controller object that lets us manipulate time.

We run tests with the mocked Monday and will see that the `isWeekend` function
returns `false`. Then we can advance time to Saturday and run the test again to
verify that `isWeekend` returns `true`.

The `fakeTime` function replaces JavaScript's timing functions (`Date`,
`setTimeout`, `setInterval`, etc.) with versions you can control. This allows
you to test code with specific dates or times regardless of when the test runs.
This powerful technique means you will avoid flaky tests that depend on the
system clock and can speed up tests by advancing time instantly instead of
waiting for real timeouts.

Fake time is particularly useful for testing:

- Calendar or date-based features, such as scheduling, appointments or
  expiration dates
- Code with timeouts or intervals, such as polling, delayed operations or
  debouncing
- Animations or transitions such as testing the completion of timed visual
  effects

Like with stubs, always restore the real time functions after your tests using
the `restore()` method to avoid affecting other tests.

## Advanced mocking patterns

### Partial mocking

Sometimes you only want to mock certain methods of an object while keeping
others intact:

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

class UserService {
  async getUser(id: string) {
    // Complex database query
    return { id, name: "Database User" };
  }

  async formatUser(user: { id: string; name: string }) {
    return {
      ...user,
      displayName: user.name.toUpperCase(),
    };
  }

  async getUserFormatted(id: string) {
    const user = await this.getUser(id);
    return this.formatUser(user);
  }
}

Deno.test("partial mocking with stubs", async () => {
  const service = new UserService();

  // Only mock the getUser method
  const getUserMock = stub(
    service,
    "getUser",
    () => Promise.resolve({ id: "test-id", name: "Mocked User" }),
  );

  try {
    // The formatUser method will still use the real implementation
    const result = await service.getUserFormatted("test-id");

    assertEquals(result, {
      id: "test-id",
      name: "Mocked User",
      displayName: "MOCKED USER",
    });

    // Verify getUser was called with the right arguments
    assertEquals(getUserMock.calls.length, 1);
    assertEquals(getUserMock.calls[0].args[0], "test-id");
  } finally {
    getUserMock.restore();
  }
});
```

### Mocking fetch requests

Testing code that makes HTTP requests often requires mocking the `fetch` API:

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// Function that uses fetch
async function fetchUserData(userId: string) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

Deno.test("mocking fetch API", async () => {
  const originalFetch = globalThis.fetch;

  // Create a response that the mock fetch will return
  const mockResponse = new Response(
    JSON.stringify({ id: "123", name: "John Doe" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

  // Replace fetch with a stubbed version
  globalThis.fetch = stub(
    globalThis,
    "fetch",
    (_input: string | URL | Request, _init?: RequestInit) =>
      Promise.resolve(mockResponse),
  );

  try {
    const result = await fetchUserData("123");
    assertEquals(result, { id: "123", name: "John Doe" });
  } finally {
    // Restore original fetch
    globalThis.fetch = originalFetch;
  }
});
```

## Real-world example

Let's put everything together in a more comprehensive example. We'll test a user
authentication service that:

1. Validates user credentials
2. Calls an API to authenticate
3. Stores tokens with expiration times

In the example below, we'll create a full `AuthService` class that handles user
login, token management, and authentication. We'll test it thoroughly using
various mocking techniques covered earlier: stubbing fetch requests, spying on
methods, and manipulating time to test token expiration - all within organized
test steps.

Deno's testing API provides a useful `t.step()` function that allows you to
organize your tests into logical steps or sub-tests. This makes complex tests
more readable and helps pinpoint exactly which part of a test is failing. Each
step can have its own assertions and will be reported separately in the test
output.

```ts
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { spy, stub } from "jsr:@std/testing/mock";
import { FakeTime } from "jsr:@std/testing/time";

// The service we want to test
class AuthService {
  private token: string | null = null;
  private expiresAt: Date | null = null;

  async login(username: string, password: string): Promise<string> {
    // Validate inputs
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Call authentication API
    const response = await fetch("https://api.example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();

    // Store token with expiration (1 hour)
    this.token = data.token;
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return this.token;
  }

  getToken(): string {
    if (!this.token || !this.expiresAt) {
      throw new Error("Not authenticated");
    }

    if (new Date() > this.expiresAt) {
      this.token = null;
      this.expiresAt = null;
      throw new Error("Token expired");
    }

    return this.token;
  }

  logout(): void {
    this.token = null;
    this.expiresAt = null;
  }
}

Deno.test("AuthService comprehensive test", async (t) => {
  await t.step("login should validate credentials", async () => {
    const authService = new AuthService();
    await assertRejects(
      () => authService.login("", "password"),
      Error,
      "Username and password are required",
    );
  });

  await t.step("login should handle API calls", async () => {
    const authService = new AuthService();

    // Mock successful response
    const mockResponse = new Response(
      JSON.stringify({ token: "fake-jwt-token" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

    const fetchStub = stub(
      globalThis,
      "fetch",
      (_url: string | URL | Request, options?: RequestInit) => {
        // Verify correct data is being sent
        const body = options?.body as string;
        const parsedBody = JSON.parse(body);
        assertEquals(parsedBody.username, "testuser");
        assertEquals(parsedBody.password, "password123");

        return Promise.resolve(mockResponse);
      },
    );

    try {
      const token = await authService.login("testuser", "password123");
      assertEquals(token, "fake-jwt-token");
    } finally {
      fetchStub.restore();
    }
  });

  await t.step("token expiration should work correctly", () => {
    using fakeTime = new FakeTime();

    const authService = new AuthService();
    const time = fakeTime(new Date("2023-01-01T12:00:00Z"));

    try {
      // Mock the login process to set token directly
      authService.login = spy(
        authService,
        "login",
        async () => {
          (authService as any).token = "fake-token";
          (authService as any).expiresAt = new Date(
            Date.now() + 60 * 60 * 1000,
          );
          return "fake-token";
        },
      );

      // Login and verify token
      authService.login("user", "pass").then(() => {
        const token = authService.getToken();
        assertEquals(token, "fake-token");

        // Advance time past expiration
        time.tick(61 * 60 * 1000);

        // Token should now be expired
        assertRejects(
          () => {
            authService.getToken();
          },
          Error,
          "Token expired",
        );
      });
    } finally {
      time.restore();
      (authService.login as any).restore();
    }
  });
});
```

This code defines `AuthService` class with three main functionalities:

- Login - Validates credentials, calls an API, and stores a token with an
  expiration time
- GetToken - Returns the token if valid and not expired
- Logout - Clears the token and expiration

The testing structure is organized as a single main test with three logical
**steps**, each testing a different aspect of the service; credential
validation, API call handling and token expiration.

🦕 Effective mocking is essential for writing reliable, maintainable unit tests.
Deno provides several powerful tools to help you isolate your code during
testing. By mastering these mocking techniques, you'll be able to write more
reliable tests that run faster and don't depend on external services.

For more testing resources, check out:

- [Deno Testing API Documentation](/api/deno/testing)
- [Deno Standard Library Testing Modules](https://jsr.io/@std/testing)
- [Basic Testing in Deno](/examples/testing_tutorial/)
