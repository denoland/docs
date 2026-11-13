---
tags: [recommended]
---

Disallows comparing a value against an object or array literal.

Each object or array literal creates a brand-new reference, and references are
only ever equal to themselves. Comparisons like `x === {}` are therefore always
false and `x !== []` always true, regardless of `x`. To check whether an object
or array is empty, inspect its keys or length instead.

**Invalid:**

```typescript
if (x === {}) {}
if (arr !== []) {}
```

**Valid:**

```typescript
if (typeof x === "object" && Object.keys(x).length === 0) {}
if (Array.isArray(arr) && arr.length === 0) {}
```
