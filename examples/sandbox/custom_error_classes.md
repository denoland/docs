---
title: "Error handling with custom error classes"
description: "Learn how to handle errors with custom error classes in a sandbox."
url: /examples/sandbox_custom_error_classes/
layout: sandbox-example.tsx
---

You can handle errors with custom error classes in a sandbox.

```ts
import { Sandbox, SandboxCommandError } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

try {
  await sandbox.sh`exit 42`;
} catch (error) {
  if (error instanceof SandboxCommandError) {
    console.log("Exit code:", error.code); // → 42
    console.log("Error message:", error.message);
  }
}
```
