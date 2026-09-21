---
tags: [recommended]
---

Disallows a `new` expression whose result is immediately discarded, which
usually indicates a missing `throw`.

Writing `new Error("...")` as a statement on its own constructs the error and
throws it away without ever using it. This is almost always a forgotten `throw`
(or a missing assignment), so the intended error never propagates.

**Invalid:**

```typescript
function foo() {
  new Error("something went wrong");
}
```

**Valid:**

```typescript
function foo() {
  throw new Error("something went wrong");
}
```
