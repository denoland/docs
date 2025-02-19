---
tags: [react, fresh]
---

Ensure that hooks are called correctly in React/Preact components. They must be called at the top level of a component and not inside a conditional statement or a loop.

**Invalid:**

```tsx
// WRONG: Called inside condition
function MyComponent() {
  if (condition) {
    const [count, setCount] = useState(0);
  }
}

// WRONG: Called inside for loop
function MyComponent() {
  for (const item of items) {
    const [count, setCount] = useState(0);
  }
}

// WRONG: Called inside while loop
function MyComponent() {
  while (condition) {
    const [count, setCount] = useState(0);
  }
}

// WRONG: Called after condition
function MyComponent() {
  if (condition) {
    // ...
  }

  const [count, setCount] = useState(0);
}
```

**Valid:**

```tsx
function MyComponent() {
  const [count, setCount] = useState(0);
}
```
