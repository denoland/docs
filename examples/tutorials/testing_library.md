---
title: "Use Testing Library with Deno"
description: "Test DOM behavior with @testing-library/dom and happy-dom in deno test: querying by role and text, simulating events, and the permissions the setup needs."
url: /examples/testing_library_tutorial/
---

[Testing Library](https://testing-library.com/) encourages asserting on what the
user sees (roles, labels, text) instead of implementation details. It runs in
`deno test` with a simulated DOM from
[happy-dom](https://github.com/capricorn86/happy-dom).

## Install the packages

```sh
deno add npm:happy-dom npm:@testing-library/dom
```

## Query and interact with the DOM

happy-dom provides the document; Testing Library provides the queries:

```ts title="button.test.ts"
import { Window } from "happy-dom";
import { getByRole, getByText } from "@testing-library/dom";
import { assertEquals } from "jsr:@std/assert";

Deno.test("renders and clicks a button", () => {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = `<button>Count: 0</button>`;

  let count = 0;
  const button = getByRole(document.body as never, "button");
  button.addEventListener("click", () => {
    count++;
    button.textContent = `Count: ${count}`;
  });
  button.click();

  assertEquals(getByText(document.body as never, "Count: 1"), button);
});
```

Run it with environment and read access, since happy-dom's dependencies check a
few environment variables on startup:

```sh
$ deno test --allow-env --allow-read
ok | 1 passed | 0 failed (14ms)
```

:::note

The `as never` casts bridge a type mismatch: Testing Library's types expect the
browser's `HTMLElement`, while happy-dom ships its own compatible
implementation. The queries work fine at runtime.

:::

## Why queries instead of selectors

`getByRole("button")` fails the test if the element stops being a button, and
`getByText` fails if the visible text changes: the assertions track what a user
experiences rather than class names or DOM structure. The full query catalog
(`findBy`, `queryAll`, label and placeholder queries) is in the
[Testing Library documentation](https://testing-library.com/docs/queries/about).

## Where this fits

For testing DOM code without Testing Library, using `deno-dom` or parsing HTML
directly, see [Testing web applications](/examples/web_testing_tutorial/).
Framework wrappers like `@testing-library/react` layer on the same setup with a
framework renderer in between.
