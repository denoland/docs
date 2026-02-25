---
title: Security
description: "Understand the defense-in-depth model behind Deno Sandbox: isolation, secrets, network controls, and auditing."
---

Deno Sandbox is designed for untrusted or AI-generated workloads. Every VM is
ephemeral, isolated at the hypervisor level, and governed by strict outbound
policies. This lets you run arbitrary code while keeping organization data and
infrastructure safe.

## Secret redaction and substitution

Secrets never enter the sandbox environment variables. Instead, Deno Deploy
substitutes them only when the sandbox makes outbound requests to an approved
host. Configure secrets when creating a sandbox:

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```ts
await using sandbox = await Sandbox.create({
  secrets: {
    OPENAI_API_KEY: {
      hosts: ["api.openai.com"],
      value: process.env.OPENAI_API_KEY,
    },
    ANTHROPIC_API_KEY: {
      hosts: ["api.anthropic.com"],
      value: process.env.ANTHROPIC_API_KEY,
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
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    },
    "ANTHROPIC_API_KEY": {
      "hosts": ["api.anthropic.com"],
      "value": os.environ.get("ANTHROPIC_API_KEY"),
    },
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
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    },
    "ANTHROPIC_API_KEY": {
      "hosts": ["api.anthropic.com"],
      "value": os.environ.get("ANTHROPIC_API_KEY"),
    },
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

Inside the sandbox, the environment variable holds a placeholder:

```bash
echo $ANTHROPIC_API_KEY
# <placeholder>
```

This confirms that user code cannot read the real secret. This blocks the most
common AI attack path of prompt injection followed by secret exfiltration while
allowing your automation to call third-party APIs securely.

## Outbound network control

By default, Deno Sandbox has unrestricted outbound network access. Use the
network allowlist option to restrict traffic to specific hosts:

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```ts
await using sandbox = await Sandbox.create({
  allowNet: ["api.openai.com", "*.anthropic.com"],
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(
  allow_net=["api.openai.com", "*.anthropic.com"]
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  allow_net=["api.openai.com", "*.anthropic.com"]
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

Supported patterns include:

| Pattern           | Matches                         |
| ----------------- | ------------------------------- |
| `example.com`     | Exact hostname, any port        |
| `example.com:443` | Exact hostname on port 443 only |
| `*.example.com`   | Any subdomain of example.com    |
| `192.0.2.1`       | Exact IPv4 address              |
| `[2001:db8::1]`   | Exact IPv6 address              |

Any outbound request to a host not in the allow list will be blocked when
`allowNet` is provided. When `allowNet` is omitted, all outbound requests are
allowed. Combine this with
[the `secrets` option](#secret-redaction-and-substitution) to ensure that even
if code is tricked into calling an unexpected endpoint, credentials are never
sent.

## Filesystem isolation and cleanup

- MicroVMs boot from a clean disk image. Any files you upload exist only for the
  sandbox lifetime unless you explicitly mount a volume.
- Once the last reference to a sandbox is dropped (or `sandbox.kill()` is
  called), the VM is destroyed and the disk wiped, preventing lingering state.
- Volumes provide shared storage, but access is explicit per sandbox and can be
  mounted read-only when needed.

## Auditing and observability

- Every command, HTTP request, and SSH session can be traced in the Deno Deploy
  dashboard, giving you a paper trail for agent behavior.
- Attach metadata when creating sandboxes (e.g., `metadata: { owner: "agent" }`)
  so logs and traces clearly show who initiated activity.
