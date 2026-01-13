---
title: "Evaluating JavaScript"
description: "Learn how to evaluate JavaScript code in a sandbox."
url: /examples/sandboxes_evaluating_javascript/
layout: sandbox-example.tsx
---

You can evaluate JavaScript code in a sandbox using the `eval` function.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const result = await sandbox.deno.eval(`
  const a = 1;
  const b = 2;
  a + b;
`);
console.log("result:", result);
```
