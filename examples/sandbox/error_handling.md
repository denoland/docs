---
title: "Error handling"
description: "Learn how to handle errors in a sandbox."
url: /examples/sandbox_error_handling/
layout: sandbox-example.tsx
---

Handling sandbox command failures explicitly gives you predictable recovery
paths:

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Commands throw by default on non-zero exit
try {
  await sandbox.sh`exit 1`;
} catch (error) {
  console.log("Command failed:", error);
}

// Use noThrow() to handle errors manually
const result = await sandbox.sh`exit 1`.noThrow();
console.log("Exit code:", result.status.code); // → 1
console.log("Success:", result.status.success); // → false
```

Deno Sandbox commands throw on any non-zero exit, so wrapping them in try/catch
lets you surface clean error messages or trigger fallback logic instead of
crashing the entire workflow.

When you want to inspect failures without throwing, `.noThrow()` returns the
full status object, so you can branch on `status.code` or `status.success`, log
diagnostics, or retry specific commands without losing context. This pattern is
essential for robust automation where commands might fail due to user input,
transient network issues, or missing dependencies.
