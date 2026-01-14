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
1280 MB of RAM, no outbound network access, and a timeout bound to the current
process. You can tailor the sandbox by passing an options object.

## Available options

| Option     | Description                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `region`   | Eg `ams` or `ord`                                                                                                                                    |
| `allowNet` | Optional list of allowed outbound hosts. See [Outbound network control](./security#outbound-network-control).                                        |
| `secrets`  | Secrets to substitute on outbound requests to approved hosts. See [Secret redaction and substitution](./security#secret-redaction-and-substitution). |
| `memoryMb` | Allocate between 768 and 4096 MB of RAM for memory-heavy tasks or tighter budgets.                                                                   |
| `timeout`  | [How long the sandbox stays alive](./timeouts) in (m) or (s) such as `5m`                                                                            |
| `labels`   | Attach arbitrary key/value labels to help identify and manage sandboxes                                                                              |
| `env`      | Environment variables to start the sandbox with.                                                                                                     |

## Example configurations

### Allow outbound traffic to specific APIs

```tsx
const sandbox = await Sandbox.create({
  allowNet: ["api.openai.com", "api.stripe.com"],
});
```

### Configure secret substitution for approved hosts

```tsx
const sandbox = await Sandbox.create({
  allowNet: ["api.openai.com"],
  secrets: {
    OPENAI_API_KEY: {
      hosts: ["api.openai.com"],
      value: process.env.OPENAI_API_KEY,
    },
  },
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
