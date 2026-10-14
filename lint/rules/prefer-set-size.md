---
tags: [recommended]
---

Prefers using `Set#size` over converting a `Set` to an array to read its
`length`.

Converting a `Set` to an array with the spread operator or `Array.from()` just
to read `.length` allocates an unnecessary array and is less readable. The
`Set#size` property gives the same count directly and more efficiently.

**Invalid:**

```typescript
const size = [...new Set(array)].length;
const size2 = Array.from(new Set(array)).length;

const set = new Set(array);
const size3 = [...set].length;
```

**Valid:**

```typescript
const size = new Set(array).size;

const set = new Set(array);
const size2 = set.size;
```
