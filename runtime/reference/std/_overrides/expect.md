<!-- Extra examples for @std/expect -->

# Additional @std/expect Examples

## Example: mixing expect and assert

```ts
import { expect } from "jsr:@std/expect";
import { assertEquals } from "jsr:@std/assert";

deno.test("mix styles", () => {
  const value = { a: 1 };
  expect(value).toHaveProperty("a");
  assertEquals(value.a, 1);
});
```

## Example: extending expect

```ts
import { expect } from "jsr:@std/expect";
import type { Matcher } from "jsr:@std/expect";

// simple custom matcher
const toBeWithin: Matcher<[min: number, max: number]> = {
  name: "toBeWithin",
  test(actual, min, max) {
    const pass = typeof actual === "number" && actual >= min && actual <= max;
    return { pass, expected: `${min}..${max}` };
  },
};

expect.extend({ toBeWithin });

Deno.test("within range", () => {
  expect(5).toBeWithin(1, 10);
});
```
