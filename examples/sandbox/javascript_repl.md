---
title: "Interactive JavaScript REPL"
description: "Learn how to provide an interactive Deno REPL in a sandbox."
url: /examples/sandbox_javascript_repl/
layout: sandbox-example.tsx
---

A REPL (Read–Eval–Print Loop) is an interactive execution session where you type
code, the environment reads it, evaluates it, prints the result, and then keeps
the session alive so you can continue running more code while preserving state.

The `repl()` method can be used to provide an interactive JavaScript REPL in a
sandbox.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Start a Deno REPL
const repl = await sandbox.deno.repl();

// Execute code interactively, maintaining state
await repl.eval("const x = 42;");
await repl.eval("const y = 8;");
const result = await repl.eval("x + y");
console.log("result:", result); // 50
```
