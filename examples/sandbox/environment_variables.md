---
title: "Set and get environment variables"
description: "Learn how to set and get environment variables in a sandbox."
url: /examples/sandbox_environment_variables/
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

Setting environment variables through `sandbox.env.set()` keeps configuration
and secrets inside the sandbox, so scripts run with the expected context without
hardcoding values in source files. That’s helpful when you need per-run
configuration (API keys, modes like NODE_ENV) or want to propagate credentials
to multiple commands securely. The variables stay scoped to the sandbox session
and are available to any command you execute there.
