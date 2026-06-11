---
title: "Migrating from Jest"
description: "Move a Jest test suite to deno test: describe/it via node:test, expect mappings, mock function equivalents, snapshot testing, fake timers, and translating Jest configuration."
---

Most Jest suites translate to `deno test` without rewriting test logic: the
`node:test` module provides the same `describe`/`it` structure, and the standard
library ships an `expect` with the matchers you already use. What changes is a
handful of imports and how the runner is configured.

## The same test, in Deno

A typical Jest test needs only new imports:

```ts title="cart.test.ts"
import { beforeEach, describe, it } from "node:test";
import { expect, fn } from "jsr:@std/expect";

describe("shopping cart", () => {
  let cart: string[];

  beforeEach(() => {
    cart = [];
  });

  it("starts empty", () => {
    expect(cart).toHaveLength(0);
  });

  it("notifies a listener", () => {
    const onAdd = fn();
    cart.push("apple");
    onAdd(cart.length);
    expect(onAdd).toHaveBeenCalledWith(1);
  });
});
```

```sh
$ deno test cart.test.ts
ok | 1 passed (2 steps) | 0 failed (13ms)
```

Unlike Jest, nothing is injected as a global: `describe`, `it`, `expect`, and
the hooks are explicit imports, so each file states what it uses. Tests written
against `node:test` also keep working in Node.js itself.

## What maps to what

| Jest                              | Deno                                                            |
| --------------------------------- | --------------------------------------------------------------- |
| `describe`, `it`, `beforeEach`, … | `node:test` (or [`@std/testing/bdd`](/examples/bdd_tutorial/))  |
| `expect(...)` matchers            | `jsr:@std/expect`                                               |
| `jest.fn()`                       | `fn()` from `jsr:@std/expect`                                   |
| `jest.spyOn(obj, "m")`            | [`spy`/`stub` from `@std/testing/mock`](/runtime/test/mocking/) |
| `toMatchSnapshot()`               | [`assertSnapshot`](/examples/snapshot_test_tutorial/)           |
| `jest.useFakeTimers()`            | [`FakeTime`](/runtime/test/mocking/#faking-time)                |
| `npx jest`                        | `deno test`                                                     |
| `npx jest --watch`                | `deno test --watch`                                             |
| `npx jest -t "name"`              | `deno test --filter "name"`                                     |

## Translate the configuration

Jest configuration mostly disappears: TypeScript, JSX, and ES modules work
without transforms, so `ts-jest`, `babel-jest`, and `transform` entries have no
equivalent to migrate. File selection moves into `deno.json`:

```json title="deno.json"
{
  "test": {
    "include": ["src/**/*.test.ts"],
    "exclude": ["src/fixtures/"]
  }
}
```

## Module mocks

There is no equivalent of `jest.mock("./module")`, because module records are
immutable in Deno. Tests that rely on it migrate to one of:

- dependency injection: pass the collaborator in, and hand the test a
  [spy or stub](/runtime/test/mocking/),
- stubbing the object the module exposes, with `stub` from `@std/testing/mock`.

This is usually the only part of a migration that requires touching the code
under test.

## Keep npm packages where it helps

Test helpers from npm keep working through `npm:` specifiers, for example
`npm:@testing-library/dom` for DOM assertions. The test runner itself is the
part you migrate.

For runner flags, reporters, and coverage, see the
[`deno test` reference](/runtime/reference/cli/test/).
