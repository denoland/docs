---
title: Security
description: "Understand the defense-in-depth model behind Deno Sandboxes: isolation, secrets, network controls, and auditing."
---

Sandboxes are designed for untrusted or AI-generated workloads. Every VM is
ephemeral, isolated at the hypervisor level, and governed by strict outbound
policies. This lets you run arbitrary code while keeping organization data and
infrastructure safe.

## Secret redaction and substitution

Secrets never enter the sandbox environment variables. Instead, Deploy
substitutes them only when the sandbox makes outbound requests to an approved
host. A command such as:

```bash
echo $ANTHROPIC_API_KEY
# <placeholder>
```

confirms that user code cannot read the real secret. This blocks the most common
AI attack path of prompt injection followed by secret exfiltration while
allowing your automation to call third-party APIs securely.

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

## Network access

The `allowNet` option is optionally available for use with `Sandbox.create()`.
It allows users to control which external hosts a sandbox can communicate with.
When specified, only requests to the listed destinations are permitted; all
other outbound network requests return a 403 Forbidden response.

This applies to all outbound HTTP(S) requests, including ones made by Deno,
curl, and so on.

```ts
await using sandbox = await Sandbox.create({
  allowNet: [
    "example.com",
    "*.example.net",
    "203.0.113.110",
    "[2001:db8::1]:80",
  ],
});
```

### Supported formats:

- Hostnames: `example.com`
- Wildcards: `*.example.com`
- IPv4 addresses: `203.0.113.110`
- IPv6 addresses: `[2001:db8::1]`
- Port numbers are also supported

When `allowNet` is not specified, no network restrictions are applied (default
behavior).
