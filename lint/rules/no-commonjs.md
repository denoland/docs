---
tags: []
---

Disallows CommonJS export assignments through `exports` and `module.exports`.

Use ECMAScript module exports instead. For a named export, declare or export the
binding with `export`; for a default export, use `export default`.

**Invalid:**

```typescript
exports.answer = 42;
module.exports = function answer() {
  return 42;
};
module.exports.answer = 42;
```

**Valid:**

```typescript
export const answer = 42;

export default function answer() {
  return 42;
}
```
