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
768 MB of RAM, no outbound network access, and a lifetime bound to the current
process. You can tailor the sandbox by passing an options object.

## Available options

| Option     | Type                     | Description                                                                                                             |
| ---------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `allowNet` | `string[]`               | Outbound allow list enforced at the hypervisor level. Hosts not listed are unreachable, blocking data exfiltration.     |
| `region`   | `"sjc"                   | "ams"                                                                                                                   |
| `memoryMb` | `number`                 | Allocate between 768 and 4096 MB of RAM for memory-heavy tasks or tighter budgets.                                      |
| `lifetime` | `"session"               | "5m"                                                                                                                    |
| `id`       | `string`                 | Reconnect to an existing sandbox instead of creating a new one (used with `Sandbox.connect`).                           |
| `metadata` | `Record<string, string>` | Attach arbitrary key/value tags to help identify sandboxes in logs or telemetry.                                        |
| `env`      | `Record<string, string>` | Set initial environment variables inside the sandbox. Secrets should still be managed via Deploy’s secret substitution. |

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
const sandbox = await Sandbox.create({ lifetime: "10m" });
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
