---
tags: [recommended, react, jsx, fresh]
---

JavaScript comments inside text nodes are rendered as plain text in JSX. This is often unexpected.

**Invalid:**

```tsx
<div>// comment</div>
<div>/* comment */</div>
```

**Valid:**

```tsx
<div>{/* comment */}</div>
```
