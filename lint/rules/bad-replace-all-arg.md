---
tags: [recommended]
---

Disallows calling `String.prototype.replaceAll()` with a regular expression that
lacks the global (`g`) flag.

`replaceAll` requires its pattern to be either a plain string or a global
regular expression. Passing a non-global regular expression throws a `TypeError`
at runtime, so this is always a bug rather than a style preference. Add the `g`
flag (or use a string pattern).

**Invalid:**

```typescript
withSpaces.replaceAll(/\s+/, ",");
```

**Valid:**

```typescript
withSpaces.replaceAll(/\s+/g, ",");
withSpaces.replaceAll(" ", ",");
```
