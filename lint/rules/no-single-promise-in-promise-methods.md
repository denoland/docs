---
tags: [recommended]
---

Disallows passing a single-element array to `Promise.all()`, `Promise.any()`,
and `Promise.race()`.

Wrapping a single promise in one of these methods is pointless: the result is
just the awaited value (possibly wrapped in a one-element array for
`Promise.all`), but with added overhead and noise. Await the promise directly
instead.

**Invalid:**

```typescript
await Promise.all([promise]);
await Promise.any([promise]);
await Promise.race([promise]);
```

**Valid:**

```typescript
await promise;
await Promise.all([promise1, promise2]);
await Promise.all(promises);
await Promise.race([...promises]);
```
