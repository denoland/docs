---
title: "Provide SSH access to a sandbox"
description: "Learn how to provide SSH access to a sandbox."
url: /examples/sandbox_ssh_access/
layout: sandbox-example.tsx
---

SSH access allows you to connect to a sandboxed environment securely over the
SSH protocol. The `sandbox.create({ ssh: true })` method can be used to provide
SSH access to a sandbox.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ ssh: true });

// Wait for Deploy to provision SSH access information.
const creds = sandbox.ssh ?? await sandbox.exposeSsh();
if (!creds) {
  throw new Error("SSH credentials were not provisioned for this sandbox");
}

const { hostname, username } = creds;
console.log(`ssh ${username}@${hostname}`);

// Keep the process alive by sleeping, otherwise the sandbox will be destroyed
// when the script exits.
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000)); // 10 minutes
```
