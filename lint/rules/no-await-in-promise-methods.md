---
tags: [recommended]
---

Disallows using `await` on elements passed to `Promise.all()`,
`Promise.allSettled()`, `Promise.any()`, and `Promise.race()`.

These methods accept an iterable of promises and await them concurrently.
Awaiting an element _inside_ the array passed to them defeats that purpose: the
awaited promise is resolved sequentially before the method ever runs, so you
lose the concurrency the method is meant to provide. It is almost always a
mistake.

**Invalid:**

```typescript
await Promise.all([await foo(), bar()]);
await Promise.allSettled([await foo()]);
await Promise.any([await foo(), bar()]);
await Promise.race([await foo(), bar()]);
```

**Valid:**

```typescript
await Promise.all([foo(), bar()]);
await Promise.allSettled([foo(), bar()]);
await Promise.any([foo(), bar()]);
await Promise.race([foo(), bar()]);
```
