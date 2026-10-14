---
tags: [recommended]
---

Disallows function parameters that are only ever used as an argument to the
function's own recursive calls.

When a parameter is passed along unchanged on every recursive call and used
nowhere else, it has no effect on the result. It adds cognitive overhead, can
hurt performance, and often points to leftover code or a genuine bug. Remove the
parameter, or use it for something.

**Invalid:**

```typescript
function test(onlyUsedInRecursion) {
  return test(onlyUsedInRecursion);
}
```

**Valid:**

```typescript
function f(a: number): number {
  if (a === 0) {
    return 1;
  }
  return f(a - 1);
}
```
