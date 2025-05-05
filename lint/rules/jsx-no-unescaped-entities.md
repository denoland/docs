---
tags: [recommended, react, jsx, fresh]
---

Leaving the `>` or `}` character in JSX is often undesired and difficult to
spot. Enforce that these characters must be passed as strings.

**Invalid:**

```tsx
<div>></div>
<div>}</div>
```

**Valid:**

```tsx
<div>&gt;</div>,
<div>{">"}</div>,
<div>{"}"}</div>,
```
