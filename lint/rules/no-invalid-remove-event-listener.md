---
tags: [recommended]
---

Disallows passing inline or bound functions to `removeEventListener()`.

`removeEventListener()` removes a listener only if it receives a reference to
the _same_ function that was passed to `addEventListener()`. An inline function
expression, an arrow function, or a `.bind()` call each create a brand-new
function every time they are evaluated, so they can never match a
previously-added listener and the call silently does nothing.

To remove a listener, keep a reference to the exact function that was added and
pass that.

**Invalid:**

```typescript
el.removeEventListener("click", () => {});
el.removeEventListener("click", function () {});
el.removeEventListener("click", handler.bind(this));
```

**Valid:**

```typescript
el.removeEventListener("click", handler);

const bound = handler.bind(this);
el.addEventListener("click", bound);
el.removeEventListener("click", bound);
```
