---
tags: [recommended]
---

Disallows redundant or logically impossible comparisons.

Combining two comparisons of the same variable against constants can produce a
condition that is always true, always false, or one where only a single
comparison actually affects the result. This usually signals a mistake — a
flipped operator, the wrong variable, or `&&` where `||` was meant. Comparing a
variable with itself (`a < a`, `a >= a`) is likewise always false or always
true.

**Invalid:**

```typescript
status_code <= 400 && status_code > 500;
status_code < 200 && status_code <= 299;
a < a;
a >= a;
```

**Valid:**

```typescript
status_code >= 400 && status_code < 500;
500 <= status_code && status_code <= 600;
a < b;
```
