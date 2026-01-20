---
title: "Error handling"
description: "Learn how to handle errors in a sandbox."
url: /examples/sandbox_error_handling/
layout: sandbox-example.tsx
---

Commands in a sandbox throw by default on non-zero exit. You can use the
`noThrow()` method to handle errors manually.

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
