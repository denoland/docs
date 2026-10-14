---
tags: [recommended]
---

Disallows out-of-range radix or precision arguments to `Number` formatting
methods.

Several `Number.prototype` methods accept a bounded integer argument and throw a
`RangeError` when it falls outside the allowed range:

- `toString(radix)` — radix must be between 2 and 36.
- `toFixed(digits)` and `toExponential(digits)` — digits must be between 0 and
  20 (100 in some engines, but 0–20 is the portable range).
- `toPrecision(precision)` — precision must be between 1 and 21.

Passing a literal outside these ranges is always a runtime error.

**Invalid:**

```typescript
(42).toString(64);
(42).toString(1);
(3.14159).toPrecision(0);
```

**Valid:**

```typescript
(42).toString(16);
(3.14159).toFixed(2);
```
