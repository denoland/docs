---
title: "Error handling with custom error classes"
description: "Learn how to handle errors with custom error classes in a sandbox."
url: /examples/sandbox_custom_error_classes/
layout: sandbox-example.tsx
---

You can handle errors with custom error classes in a sandbox.

Catching `SandboxCommandError` lets you differentiate sandbox command failures
from other exceptions. When the error is the `SandboxCommandError` class, you
can read structured fields such as `error.code` or format `error.message` to
decide whether to retry, escalate, or map exit codes to your own domain-specific
errors:

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

This makes it easier to build higher-level automation that reacts intelligently
to known failure modes instead of treating every thrown error the same.
