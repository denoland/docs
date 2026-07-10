---
tags: [recommended]
---

Disallows declaring objects, classes, and modules with a member named `then`.

The presence of a `then` method makes a value _thenable_, meaning JavaScript
treats it like a promise. This leads to surprising behavior: such an object will
be unwrapped when returned from an `async` function or passed to
`Promise.resolve()`, and the `then` method may be invoked at unexpected times.
Naming a property `then` is almost always unintentional.

**Invalid:**

```typescript
const foo = {
  then() {},
};

class Foo {
  then() {}
}

export function then() {}

Object.defineProperty(foo, "then", { value: () => {} });
```

**Valid:**

```typescript
const foo = {
  then_() {},
};

class Foo {
  isThen() {}
}

export function isThenable() {}
```
