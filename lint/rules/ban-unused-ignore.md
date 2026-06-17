---
tags: [recommended]
---

Warns unused ignore directives.

We sometimes have to suppress and ignore lint errors for some reasons and we can
do so using [ignore directives](/go/lint-ignore/).

In some cases, however, like after refactoring, we may end up having ignore
directives that are no longer necessary. Such superfluous ignore directives are
likely to confuse future code readers, and to make matters worse, might hide
future lint errors unintentionally. To prevent such situations, this rule
detects unused, superfluous ignore directives.

**Invalid:**

```typescript
// `export` counts as a use, so `foo` is not actually unused and the
// directive below suppresses nothing. This rule flags it as superfluous.
// deno-lint-ignore no-unused-vars
export const foo = 42;
```

**Valid:**

```typescript
// The directive is unnecessary here, so it is simply removed.
export const foo = 42;

// Here the directive is doing real work: `bar` is genuinely unused, so the
// no-unused-vars directive is necessary and ban-unused-ignore leaves it alone.
// deno-lint-ignore no-unused-vars
const bar = 42;
```
