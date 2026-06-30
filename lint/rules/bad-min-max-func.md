---
tags: [recommended]
---

Disallows `Math.min`/`Math.max` clamp expressions whose arguments force a
constant result.

`Math.min(Math.max(x, low), high)` is the usual way to clamp a value between two
bounds. When the bounds are swapped — for example
`Math.min(Math.max(100, x), 0)` — the expression collapses to a constant
regardless of `x`, so the clamp does nothing useful and is almost certainly a
mistake.

**Invalid:**

```typescript
Math.min(Math.max(100, x), 0);
Math.max(1000, Math.min(0, z));
```

**Valid:**

```typescript
Math.max(0, Math.min(100, x));
Math.min(1000, Math.max(0, z));
```
