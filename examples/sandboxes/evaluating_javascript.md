---
title: "Evaluating JavaScript"
description: "Learn how to evaluate JavaScript code in a sandbox."
url: /examples/sandboxes_evaluating_javascript/
layout: sandbox-example.tsx
---

To evaluate JavaScript code in a sandbox, you can use the `eval` function.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const result = await sandbox.eval(`
  const a = 1;
  const b = 2;
  a + b;
`);
console.log("result:", result);
```
