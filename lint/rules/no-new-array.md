---
tags: [recommended]
---

Disallows the use of the `Array` constructor with a single argument.

`new Array(n)` and `Array(n)` are ambiguous and error-prone. With a single
numeric argument the constructor creates a sparse array of that _length_, while
with any other single argument it creates an array containing that one
_element_. This makes the intent unclear to readers and is a common source of
bugs.

Use an array literal when you want a list of elements, or `Array.from({ length:
n })` when you want an array of a given length.

**Invalid:**

```typescript
const a = new Array(1);
const b = new Array(foo);
const c = new Array(...bar);
```

**Valid:**

```typescript
const a = [1];
const b = Array.from({ length: 10 });
const c = new Array();
const d = new Array(1, 2, 3);
```
