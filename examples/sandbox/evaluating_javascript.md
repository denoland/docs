---
title: "Evaluating JavaScript"
description: "Learn how to evaluate JavaScript code in a sandbox."
url: /examples/sandbox_evaluating_javascript/
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

Calling `sandbox.deno.eval()` lets you run arbitrary JavaScript snippets
directly inside the sandbox’s Deno runtime without writing files or shelling
out. This is useful when you want to prototype logic, run small computations, or
inspect the sandbox environment itself quickly. Use it for dynamic scripts or
exploratory debugging where creating a full module would be overkill.
