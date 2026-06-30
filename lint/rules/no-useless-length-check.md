---
tags: [recommended]
---

Disallows redundant array length checks combined with `Array#every()` or
`Array#some()`.

`Array#every()` returns `true` for an empty array, and `Array#some()` returns
`false` for an empty array. Because of this:

- `array.length === 0 || array.every(...)` is equivalent to just `array.every(...)`.
- `array.length !== 0 && array.some(...)` is equivalent to just `array.some(...)`.

The explicit length check is redundant and can be removed.

**Invalid:**

```typescript
if (array.length === 0 || array.every((x) => x > 0)) {
}

if (array.length !== 0 && array.some((x) => x > 0)) {
}
```

**Valid:**

```typescript
if (array.every((x) => x > 0)) {
}

if (array.some((x) => x > 0)) {
}

// A length check combined with a different condition is fine.
if (array.length === 0 || other) {
}
```
