---
tags: [recommended]
---

Disallows calling array methods directly on the `arguments` object.

`arguments` is array-like but is not an `Array`, so methods such as `reduce`,
`map`, or `filter` do not exist on it and calling them throws a `TypeError`.
Convert it to a real array first with `Array.from(arguments)`, or — preferably —
use rest parameters such as `function sum(...args)`.

**Invalid:**

```typescript
function sum() {
  return arguments.reduce((a, b) => a + b, 0);
}
```

**Valid:**

```typescript
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}
```
