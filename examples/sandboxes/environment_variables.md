---
title: "Set and get environment variables"
description: "Learn how to set and get environment variables in a sandbox."
url: /examples/sandboxes_environment_variables/
layout: sandbox-example.tsx
---

You can use the `sandbox.env.set()` method to set environment variables in a
sandbox.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Set environment variables
await sandbox.env.set("API_KEY", "secret-key-123");
await sandbox.env.set("NODE_ENV", "production");

// Use them in a script
const apiKey = await sandbox.sh`echo $API_KEY`.text();
console.log("API_KEY:", apiKey.trim());
```
