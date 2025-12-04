---
title: "Provide SSH access to a sandbox"
description: "Learn how to provide SSH access to a sandbox."
url: /examples/sandboxes_ssh_access/
layout: sandbox-example.tsx
---

The `sandbox.exposeSsh()` method can be used to provide SSH access to a sandbox.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Get SSH credentials
const { hostname, username } = await sandbox.exposeSsh();
console.log(`ssh ${username}@${hostname}`);

// Keep the process alive by sleeping, otherwise the sandbox will be destroyed
// when the script exits.
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000)); // 10 minutes
```
