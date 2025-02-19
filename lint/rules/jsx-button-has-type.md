---
tags: [recommended, react, jsx, fresh]
---

Enforce `<button>` elements to have a `type` attribute. If a `<button>` is placed inside a `<form>` element it will act as a submit button by default which can be unexpected.

**Invalid:**

```tsx
const btn = <button>click me</button>;
const btn = <button type="2">click me</button>;
```

**Valid:**

```tsx
const btn = <button type="button">click me</button>;
const btn = <button type="submit">click me</button>;
const btn = <button type={btnType}>click me</button>;
const btn = <button type={condition ? "button" : "submit"}>click me</button>;
```
