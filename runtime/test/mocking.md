---
title: "Mocking and test doubles"
description: "Isolate the code under test with spies, stubs, mocks, and fake time using the Deno Standard Library's @std/testing package."
oldUrl:
  - /runtime/manual/basics/testing/mocking/
  - /examples/mocking_tutorial/
  - /examples/stubbing_tutorial/
---

Unit tests are most useful when they test one thing at a time. Real
dependencies, such as databases, HTTP APIs, or the system clock, make tests
slow, flaky, and hard to set up. A test double is a controlled stand-in for such
a dependency. It lets you verify how your code interacts with the dependency
without paying the cost of the real thing. The Deno Standard Library ships
everything you need in
[`@std/testing/mock`](https://jsr.io/@std/testing/doc/mock) and
[`@std/testing/time`](https://jsr.io/@std/testing/doc/time).

## Spies

A spy wraps a function and records every call: how many times it ran and which
arguments it received. Spies do not change the function's behavior, so they are
the lightest-touch double available.

Here we test a `saveUser()` function that hands a user off to a database object.
Instead of a real database, we pass an object whose `save` method is a spy:

```ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "jsr:@std/testing/mock";

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

Deno.test("saveUser calls database.save", async () => {
  // A stand-in database whose save method is wrapped in a spy
  const mockDatabase = {
    save: spy((user: User) => Promise.resolve({ id: 1, ...user })),
  };

  const user: User = { name: "Test User" };
  const result = await saveUser(user, mockDatabase);

  // The save method was called exactly once
  assertSpyCalls(mockDatabase.save, 1);

  // The first call (index 0) received our user object
  assertSpyCall(mockDatabase.save, 0, { args: [user] });

  assertEquals(result, { id: 1, name: "Test User" });
});
```

`assertSpyCalls` checks the total number of calls, while `assertSpyCall`
inspects a single call by index: its arguments, and optionally what it returned.
We verified the whole interaction without setting up or tearing down any
database state.

You can also spy on an existing method of an object. Method spies are
disposable, so declare them with the `using` keyword and they restore the
original method automatically when the test ends. No `try`/`finally` cleanup is
needed:

```ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

Deno.test("using disposable spies", () => {
  const calculator = {
    add: (a: number, b: number) => a + b,
  };

  // Restored automatically when it goes out of scope
  using addSpy = spy(calculator, "add");

  const sum = calculator.add(3, 4);
  assertEquals(sum, 7);
  assertSpyCalls(addSpy, 1);
  assertEquals(addSpy.calls[0].args, [3, 4]);
});
```

If you cannot use `using`, call `addSpy.restore()` in a `finally` block instead.
Either way, restoring spies keeps state from leaking between tests.

## Stubs

A stub goes one step further than a spy: it replaces the original implementation
entirely. Use stubs to return predetermined values, simulate errors, or keep
tests from touching external services. A stub still records its calls, so all
the spy assertions work on it too.

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// Wrap dependencies in an object so they can be stubbed from tests
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
  // Replace the implementation with a controlled one
  using getUserNameStub = stub(deps, "getUserName", () => "Test User");

  assertEquals(greetUser(123), "Hello, Test User!");
  assertEquals(getUserNameStub.calls.length, 1);
});
```

Like method spies, stubs are disposable. The `using` keyword restores the
original implementation when the stub goes out of scope, and `restore()` is
available when you need manual control.

### Returning a sequence of values

When a stub should answer differently on each call, pass `returnsNext` with the
values in order. This is handy for simulating a missing record, a retry, or any
call-by-call scenario:

```ts
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { assertSpyCalls, returnsNext, stub } from "jsr:@std/testing/mock";

type User = { id: number; name: string };

const database = {
  getUserById(id: number): User | undefined {
    return { id, name: "Ada Lovelace" };
  },
};

function findOrThrow(id: number): User {
  const user = database.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

Deno.test("findOrThrow throws when the user was not found", () => {
  // The stub returns undefined on its first (and only) call
  using dbStub = stub(database, "getUserById", returnsNext([undefined]));

  assertThrows(() => findOrThrow(1), Error, "User not found");
  assertSpyCalls(dbStub, 1);
});

Deno.test("stub with multiple return values", () => {
  const dataService = { fetchData: () => "original data" };

  using fetchDataStub = stub(
    dataService,
    "fetchData",
    returnsNext(["first result", "second result"]),
  );

  assertEquals(dataService.fetchData(), "first result");
  assertEquals(dataService.fetchData(), "second result");
  assertSpyCalls(fetchDataStub, 2);
});
```

## Spy, stub, or mock?

The terms overlap, but the distinction is simple:

- A **spy** observes. It records calls while the real behavior runs.
- A **stub** replaces. It records calls and substitutes a controlled
  implementation.
- A **mock** is the umbrella term for any test double. In practice, a "mock
  object" is usually a hand-built stand-in (like `mockDatabase` above) whose
  methods are spies or stubs, asserted against after the code under test runs.

Everything you need for all three lives in `jsr:@std/testing/mock`.

## Faking time

Code that reads the clock or sets timers produces different results depending on
when it runs. `FakeTime` from `jsr:@std/testing/time` replaces `Date`,
`setTimeout`, `setInterval`, and friends with controllable versions, so you can
pin the current date and advance time instantly with `tick()` instead of waiting
for real timeouts:

```ts
import { assertEquals } from "jsr:@std/assert";
import { FakeTime } from "jsr:@std/testing/time";

// Function that depends on the current time
function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Function that works with timeouts
function delayedGreeting(callback: (message: string) => void): void {
  setTimeout(() => callback("Hello after delay"), 1000);
}

Deno.test("time-dependent tests", () => {
  // Start the fake clock on a known Monday; restored automatically
  using time = new FakeTime(new Date("2023-05-01T12:00:00Z"));

  assertEquals(isWeekend(), false);

  // Advance 5 days to Saturday
  time.tick(5 * 24 * 60 * 60 * 1000);
  assertEquals(isWeekend(), true);

  // Timers fire as soon as the fake clock passes them
  let greeting = "";
  delayedGreeting((message) => {
    greeting = message;
  });
  time.tick(1000);
  assertEquals(greeting, "Hello after delay");
});
```

Fake time shines for calendar features such as scheduling and expiration, for
timeout- or interval-based code such as polling and debouncing, and for anything
else where waiting on the real clock would make tests slow or flaky. `FakeTime`
is disposable, so `using` restores the real clock when the test ends.

## Choosing the right double

Reach for the simplest double that does the job. If you only need to verify an
interaction happened, use a spy. If the real implementation is slow,
nondeterministic, or external, replace it with a stub. If the clock is the
dependency, fake time instead of stubbing `Date` by hand. And whichever you
choose, stub at the interface boundary (the `deps` object, the database layer)
rather than deep inside implementation details, and let `using` handle
restoration so one test never bleeds into the next.

## Keep going

- [Testing in Deno](/runtime/test/): the test runner, assertions, and coverage
- [Snapshot testing](/runtime/test/snapshots/): compare output against recorded
  snapshots
- [`@std/testing` API documentation](https://jsr.io/@std/testing): every utility
  in detail
- [More examples](/examples/): runnable tutorials and samples
