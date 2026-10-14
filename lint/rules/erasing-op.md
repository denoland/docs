---
tags: [recommended]
---

Disallows binary operations that always evaluate to zero.

Multiplying a value by zero (`x * 0`), taking its bitwise AND with zero
(`x & 0`), or dividing zero by a value (`0 / x`) always produces `0`, no matter
what the other operand is. Such an expression is almost always a mistake — a
leftover from refactoring or a typo — because the rest of the expression has no
effect on the result. If a zero is genuinely intended, assign `0` directly.

Division is only reported when the dividend is zero (`0 / x`). `0 / 0` evaluates
to `NaN` and `x / 0` evaluates to `Infinity` (or `NaN`), so neither is reported.

**Invalid:**

```typescript
const a = x * 0;
const b = 0 * x;
const c = x & 0;
const d = 0 & x;
const e = 0 / x;
```

**Valid:**

```typescript
const a = x * 1;
const b = x / 1;
const c = 0; // assign zero directly if that is what you mean
const d = 0 / 0; // NaN, not zero
const e = x / 0; // Infinity or NaN, not zero
```
