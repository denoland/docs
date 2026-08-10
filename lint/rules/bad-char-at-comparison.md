---
tags: [recommended]
---

Disallows comparing the result of `String.prototype.charAt()` against a string
whose length is not 1.

`charAt` always returns a string of length 1 (a single UTF-16 code unit), or an
empty string when the index is out of range. Comparing it against a string of
length 2 or more can therefore never be true, which is almost always a bug.
Escape sequences such as `'\n'` are a single character and are fine.

**Invalid:**

```typescript
a.charAt(4) === "a2";
a.charAt(4) === "/n";
```

**Valid:**

```typescript
a.charAt(4) === "a";
a.charAt(4) === "\n";
```
