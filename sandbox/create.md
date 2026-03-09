---
title: "Create a Deno Sandbox"
description: "Learn how to provision a sandbox with the static Sandbox.create() method and configure runtime, network, and lifecycle options."
---

The sandbox creation method is the primary entry point for provisioning an
isolated Linux microVM on the Deploy edge. It returns a connected sandbox
instance that you can use to run commands, upload files, expose HTTP endpoints,
or request SSH access.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create() as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create() as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

By default, this creates an ephemeral sandbox in the closest Deploy region with
1280 MB of RAM, no outbound network access, and a timeout bound to the current
process. You can tailor the sandbox by passing an options object.

## Available options

| Option                                                                      | Description                                                                                                                                          |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `region`                                                                    | Eg `ams` or `ord`                                                                                                                                    |
| <code class="js-only">allowNet</code><code class="py-only">allow_net</code> | Optional list of allowed outbound hosts. See [Outbound network control](./security#outbound-network-control).                                        |
| `secrets`                                                                   | Secrets to substitute on outbound requests to approved hosts. See [Secret redaction and substitution](./security#secret-redaction-and-substitution). |
| <code class="js-only">memoryMb</code><code class="py-only">memory_mb</code> | Allocate between 768 and 4096 MB of RAM for memory-heavy tasks or tighter budgets.                                                                   |
| `timeout`                                                                   | [How long the sandbox stays alive](./timeouts) in (m) or (s) such as `5m`                                                                            |
| `labels`                                                                    | Attach arbitrary key/value labels to help identify and manage sandboxes                                                                              |
| `env`                                                                       | Environment variables to start the sandbox with.                                                                                                     |

## Example configurations

### Allow outbound traffic to specific APIs

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const sandbox = await Sandbox.create({
  allowNet: ["api.openai.com", "api.stripe.com"],
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(
  allow_net=["api.openai.com", "api.stripe.com"]
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  allow_net=["api.openai.com", "api.stripe.com"]
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

### Configure secret substitution for approved hosts

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

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

</deno-tab>
<deno-tab value="python" label="Python">

```py
import os
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create(
  allow_net=["api.openai.com"],
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    }
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
import os
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  allow_net=["api.openai.com"],
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    }
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

### Run in a specific region with more memory

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const sandbox = await Sandbox.create({
  region: "ams",
  memoryMb: 2048,
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(
  region="ams",
  memory_mb=2048
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  region="ams",
  memory_mb=2048
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

### Keep the sandbox alive for later inspection

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const sandbox = await Sandbox.create({ timeout: "10m" });
const id = sandbox.id;
await sandbox.close(); // disconnect but leave VM running

// ...later...
const reconnected = await Sandbox.connect({ id });
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(timeout="10m") as sandbox:
  sandbox_id = sandbox.id
  sandbox.close()  # disconnect but leave VM running

# ...later...
with sdk.sandbox.connect(sandbox_id) as reconnected:
  print(f"Reconnected to {reconnected.id}")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(timeout="10m") as sandbox:
  sandbox_id = sandbox.id
  await sandbox.close()  # disconnect but leave VM running

# ...later...
async with sdk.sandbox.connect(sandbox_id) as reconnected:
  print(f"Reconnected to {reconnected.id}")
```

</deno-tab>
</deno-tabs>

### Provide default environment variables

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const sandbox = await Sandbox.create({
  env: {
    NODE_ENV: "development",
    FEATURE_FLAG: "agents",
  },
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(
  env={
    "NODE_ENV": "development",
    "FEATURE_FLAG": "agents",
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  env={
    "NODE_ENV": "development",
    "FEATURE_FLAG": "agents",
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

## Tips

- Keep network allowlists as narrow as possible to block exfiltration attempts.
- Use metadata keys such as `agentId` or `customerId` to trace sandboxes in the
  Deploy dashboard.
- Let context managers (Python) or automatic disposal (JavaScript) handle
  cleanup. Call `sandbox.kill()` only when you need to terminate it prior to
  that automatic cleanup.
- For long-lived services, migrate from a Deno Sandbox to a Deploy app once the
  code stabilizes.
