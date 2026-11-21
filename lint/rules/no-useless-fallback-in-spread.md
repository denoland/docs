---
tags: [recommended]
---

Disallows useless empty-object fallbacks when spreading into an object literal.

Spreading a nullish value (`null` or `undefined`) into an object literal is a
no-op, so guarding a spread with `|| {}` or `?? {}` accomplishes nothing. The
fallback only adds noise and can be removed.

**Invalid:**

```typescript
const merged = { ...(foo || {}) };
const merged2 = { ...(foo ?? {}) };
```

**Valid:**

```typescript
const merged = { ...foo };
const merged2 = { ...(foo || { a: 1 }) };
const arr = [...(foo || [])];
```
