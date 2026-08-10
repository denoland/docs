---
tags: [recommended]
---

Disallows redundant pairs of comparisons that can be combined into one.

Expressions such as `x === y || x < y` repeat a comparison that a single
operator already expresses (`x <= y`). The expanded form is harder to read and
can hide a mistake, so prefer the combined operator.

**Invalid:**

```typescript
x === y || x < y;
x < y || x === y;
x === y || x > y;
```

**Valid:**

```typescript
x <= y;
x >= y;
```
