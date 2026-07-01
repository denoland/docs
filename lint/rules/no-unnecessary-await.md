---
tags: [recommended]
---

Disallows awaiting a value that is not a thenable.

The `await` keyword is only meaningful when applied to a `Promise` (or another
thenable). Awaiting a value that can never be a thenable — such as a literal, an
array, an object, or a newly created class instance — has no effect other than
delaying execution by a microtask, and usually indicates a misunderstanding or a
leftover from refactoring.

**Invalid:**

```typescript
async function foo() {
  await 5;
  await "string";
  await [];
  await {};
}
```

**Valid:**

```typescript
async function foo() {
  await bar();
  await Promise.resolve(5);
}
```
