---
tags: []
---

Enforces the use of type-safe equality operators `===` and `!==` instead of the
more error prone `==` and `!=` operators.

`===` and `!==` ensure the comparators are of the same type as well as the same
value. On the other hand `==` and `!=` do type coercion before value checking
which can lead to unexpected results. For example `5 == "5"` is `true`, while
`5 === "5"` is `false`.

**Invalid:**

```typescript
if (a == 5) {}
if ("hello world" != input) {}
```

**Valid:**

```typescript
if (a === 5) {}
if ("hello world" !== input) {}
```

This rule has no configuration options. If you intentionally want to use `==` or
`!=` for a specific comparison (for example `value != null` to match both `null`
and `undefined`), suppress the rule on that line with an ignore directive:

```typescript
// deno-lint-ignore eqeqeq
if (value != null) {}
```
