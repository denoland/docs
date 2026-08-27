---
tags: [recommended]
---

Disallows using a comparison operator more than once in a row.

Comparison operators are binary, so a chain like `a === b === c` does not
compare all three operands. It evaluates `a === b` first and then compares that
boolean result against `c`, which is almost never what was intended. Use `&&` to
join separate comparisons instead.

**Invalid:**

```typescript
if (a === b === c) {}
if (a < b < c) {}
```

**Valid:**

```typescript
if (a === b && b === c) {}
if (a < b && b < c) {}
```
