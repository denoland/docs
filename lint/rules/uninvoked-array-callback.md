---
tags: [recommended]
---

Disallows passing a callback to an array method called directly on
`new Array(n)`.

`new Array(5)` creates an array with five _empty slots_ (holes), not five
`undefined` elements. Iteration methods such as `map`, `forEach`, and `filter`
skip holes, so the callback is never invoked and the result is another array of
empty slots. Fill the array first so it has real elements to iterate over.

**Invalid:**

```typescript
const list = new Array(5).map((_, i) => createElement(i));
```

**Valid:**

```typescript
const list = new Array(5).fill(undefined).map((_, i) => createElement(i));
const list2 = Array.from({ length: 5 }, (_, i) => createElement(i));
```
