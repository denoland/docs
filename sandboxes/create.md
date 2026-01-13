---
title: "Create a Sandbox"
description: "Learn how to provision a sandbox with the static Sandbox.create() method and configure runtime, network, and lifecycle options."
---

The `Sandbox.create()` static method is the primary entry point for provisioning
an isolated Linux microVM on the Deploy edge. It returns a connected `Sandbox`
instance that you can use to run commands, upload files, expose HTTP endpoints,
or request SSH access.

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();
```

By default, this creates an ephemeral sandbox in the closest Deploy region with
1280 MB of RAM, no outbound network access, and a timeout bound to the current
process. You can tailor the sandbox by passing an options object.

## Available options

| Option     | Description                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `region`   | Eg `ams` or `ord`                                                                                                       |
| `allowNet` | Array of hosts that can receive requests from the sandbox. If specified, any hosts not listed are unreachable.          |
| `memoryMb` | Allocate between 768 and 4096 MB of RAM for memory-heavy tasks or tighter budgets.                                      |
| `timeout`  | [How long the sandbox stays alive](./timeouts) in (m) or (s) such as `5m`                                               |
| `labels`   | Attach arbitrary key/value labels to help identify and manage sandboxes                                                 |
| `env`      | Set initial environment variables inside the sandbox. Secrets should still be managed via Deploy’s secret substitution. |

## Example configurations

### Allow outbound traffic to specific APIs

```tsx
const sandbox = await Sandbox.create({
  allowNet: ["api.openai.com", "api.stripe.com"],
});
```

### Run in a specific region with more memory

```tsx
const sandbox = await Sandbox.create({
  region: "ams",
  memoryMb: 2048,
});
```

### Keep the sandbox alive for later inspection

```tsx
const sandbox = await Sandbox.create({ timeout: "10m" });
const id = sandbox.id;
await sandbox.close(); // disconnect but leave VM running

// ...later...
const reconnected = await Sandbox.connect({ id });
```

### Provide default environment variables

```tsx
const sandbox = await Sandbox.create({
  env: {
    NODE_ENV: "development",
    FEATURE_FLAG: "agents",
  },
});
```

## Tips

- Keep `allowNet` as narrow as possible to block exfiltration attempts.
- Use metadata keys such as `agentId` or `customerId` to trace sandboxes in the
  Deploy dashboard.
- Let `await using` (or dropping the last reference) dispose of the sandbox
  automatically. Call `sandbox.kill()` only when you need to terminate it prior
  to that automatic cleanup.
- For long-lived services, migrate from sandboxes to a Deploy app once the code
  stabilizes.
