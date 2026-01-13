---
title: "Intereactive JavaScript REPL"
description: "Learn how to provide an interactive JavaScript REPL in a sandbox."
url: /examples/sandboxes_javascript_repl/
layout: sandbox-example.tsx
---

The `sandbox.deno.repl()` method can be used to provide an interactive
JavaScript REPL in a sandbox.

This example shows how to start a JavaScript REPL in a sandbox and execute code
interactively.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Start a JavaScript REPL
const repl = await sandbox.deno.repl();

// Execute code interactively, maintaining state
await repl.eval("const x = 42;");
await repl.eval("const y = 8;");
const result = await repl.eval("x + y");
console.log("result:", result); // 50
```
