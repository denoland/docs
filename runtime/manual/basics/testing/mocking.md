# Mocking

Test spies are function stand-ins that are used to assert if a function's
internal behavior matches expectations. Test spies on methods keep the original
behavior but allow you to test how the method is called and what it returns.
Test stubs are an extension of test spies that also replaces the original
method's behavior.

## Spying

Say we have two functions, `square` and `multiply`, if we want to assert that
the `multiply` function is called during execution of the `square` function we
need a way to spy on the `multiply` function. There are a few ways to achieve
this with Spies, one is to have the `square` function take the `multiply` as a
parameter.

```ts
// https://deno.land/std/testing/mock_examples/parameter_injection.ts
export function multiply(a: number, b: number): number {
  return a * b;
}

export function square(
  multiplyFn: (a: number, b: number) => number,
  value: number,
): number {
  return multiplyFn(value, value);
}
```

This way, we can call `square(multiply, value)` in the application code or wrap
a spy function around the `multiply` function and call
`square(multiplySpy, value)` in the testing code.

```ts
// https://deno.land/std/testing/mock_examples/parameter_injection_test.ts
import { assertSpyCall, assertSpyCalls, spy } from "jsr:std/testing@^0/mock.ts";
import { assertEquals } from "jsr:std/assert@^0";
import {
  multiply,
  square,
} from "jsr:std/testing@^0/mock_examples/parameter_injection.ts";

Deno.test("square calls multiply and returns results", () => {
  const multiplySpy = spy(multiply);

  assertEquals(square(multiplySpy, 5), 25);

  // asserts that multiplySpy was called at least once and details about the first call.
  assertSpyCall(multiplySpy, 0, {
    args: [5, 5],
    returned: 25,
  });

  // asserts that multiplySpy was only called once.
  assertSpyCalls(multiplySpy, 1);
});
```

If you prefer not adding additional parameters for testing purposes only, you
can use spy to wrap a method on an object instead. In the following example, the
exported `_internals` object has the `multiply` function we want to call as a
method and the `square` function calls `_internals.multiply` instead of
`multiply`.

```ts
// https://deno.land/std/testing/mock_examples/internals_injection.ts
export function multiply(a: number, b: number): number {
  return a * b;
}

export function square(value: number): number {
  return _internals.multiply(value, value);
}

export const _internals = { multiply };
```

This way, we can call `square(value)` in both the application code and testing
code. Then spy on the `multiply` method on the `_internals` object in the
testing code to be able to spy on how the `square` function calls the `multiply`
function.

```ts
// https://deno.land/std/testing/mock_examples/internals_injection_test.ts
import { assertSpyCall, assertSpyCalls, spy } from "jsr:std/testing@^0/mock.ts";
import { assertEquals } from "jsr:std/assert@^0";
import {
  _internals,
  square,
} from "jsr:std/testing@^0/mock_examples/internals_injection.ts";

Deno.test("square calls multiply and returns results", () => {
  const multiplySpy = spy(_internals, "multiply");

  try {
    assertEquals(square(5), 25);
  } finally {
    // unwraps the multiply method on the _internals object
    multiplySpy.restore();
  }

  // asserts that multiplySpy was called at least once and details about the first call.
  assertSpyCall(multiplySpy, 0, {
    args: [5, 5],
    returned: 25,
  });

  // asserts that multiplySpy was only called once.
  assertSpyCalls(multiplySpy, 1);
});
```

One difference you may have noticed between these two examples is that in the
second we call the `restore` method on `multiplySpy` function. That is needed to
remove the spy wrapper from the `_internals` object's `multiply` method. The
`restore` method is called in a finally block to ensure that it is restored
whether or not the assertion in the try block is successful. The `restore`
method didn't need to be called in the first example because the `multiply`
function was not modified in any way like the `_internals` object was in the
second example.

## Stubbing

Say we have two functions, `randomMultiple` and `randomInt`, if we want to
assert that `randomInt` is called during execution of `randomMultiple` we need a
way to spy on the `randomInt` function. That could be done with either of the
spying techniques previously mentioned. To be able to verify that the
`randomMultiple` function returns the value we expect it to for what `randomInt`
returns, the easiest way would be to replace the `randomInt` function's behavior
with more predictable behavior.

You could use the first spying technique to do that but that would require
adding a `randomInt` parameter to the `randomMultiple` function.

You could also use the second spying technique to do that, but your assertions
would not be as predictable due to the `randomInt` function returning random
values.

Say we want to verify it returns correct values for both negative and positive
random integers. We could easily do that with stubbing. The below example is
similar to the second spying technique example but instead of passing the call
through to the original `randomInt` function, we are going to replace
`randomInt` with a function that returns pre-defined values.

```ts
// https://deno.land/std/testing/mock_examples/random.ts
export function randomInt(lowerBound: number, upperBound: number): number {
  return lowerBound + Math.floor(Math.random() * (upperBound - lowerBound));
}

export function randomMultiple(value: number): number {
  return value * _internals.randomInt(-10, 10);
}

export const _internals = { randomInt };
```

The mock module includes some helper functions to make creating common stubs
easy. The `returnsNext` function takes an array of values we want it to return
on consecutive calls.

```ts
// https://deno.land/std/testing/mock_examples/random_test.ts
import {
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
} from "jsr:std/testing@^0/mock.ts";
import { assertEquals } from "jsr:std/assert@^0";
import {
  _internals,
  randomMultiple,
} from "jsr:std/testing@^0/mock_examples/random.ts";

Deno.test("randomMultiple uses randomInt to generate random multiples between -10 and 10 times the value", () => {
  const randomIntStub = stub(_internals, "randomInt", returnsNext([-3, 3]));

  try {
    assertEquals(randomMultiple(5), -15);
    assertEquals(randomMultiple(5), 15);
  } finally {
    // unwraps the randomInt method on the _internals object
    randomIntStub.restore();
  }

  // asserts that randomIntStub was called at least once and details about the first call.
  assertSpyCall(randomIntStub, 0, {
    args: [-10, 10],
    returned: -3,
  });
  // asserts that randomIntStub was called at least twice and details about the second call.
  assertSpyCall(randomIntStub, 1, {
    args: [-10, 10],
    returned: 3,
  });

  // asserts that randomIntStub was only called twice.
  assertSpyCalls(randomIntStub, 2);
});
```

## Faking time

Say we have a function that has time based behavior that we would like to test.
With real time, that could cause tests to take much longer than they should. If
you fake time, you could simulate how your function would behave over time
starting from any point in time. Below is an example where we want to test that
the callback is called every second.

```ts
// https://deno.land/std/testing/mock_examples/interval.ts
export function secondInterval(cb: () => void): number {
  return setInterval(cb, 1000);
}
```

With `FakeTime` we can do that. When the `FakeTime` instance is created, it
splits from real time. The `Date`, `setTimeout`, `clearTimeout`, `setInterval`
and `clearInterval` globals are replaced with versions that use the fake time
until real time is restored. You can control how time ticks forward with the
`tick` method on the `FakeTime` instance.

```ts
// https://deno.land/std/testing/mock_examples/interval_test.ts
import { assertSpyCalls, spy } from "jsr:std/testing@^0/mock.ts";
import { FakeTime } from "jsr:std/testing@^0/time.ts";
import { secondInterval } from "jsr:std/testing@^0/mock_examples/interval.ts";

Deno.test("secondInterval calls callback every second and stops after being cleared", () => {
  const time = new FakeTime();

  try {
    const cb = spy();
    const intervalId = secondInterval(cb);
    assertSpyCalls(cb, 0);
    time.tick(500);
    assertSpyCalls(cb, 0);
    time.tick(500);
    assertSpyCalls(cb, 1);
    time.tick(3500);
    assertSpyCalls(cb, 4);

    clearInterval(intervalId);
    time.tick(1000);
    assertSpyCalls(cb, 4);
  } finally {
    time.restore();
  }
});
```
