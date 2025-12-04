---
title: "Sandbox Lifetimes"
description: "Understand how long sandboxes stay alive, how to extend or reconnect to them, and when to promote work to a Deploy app."
---

Sandboxes are intentionally ephemeral. They boot in milliseconds, serve their
purpose, and disappear—reducing the blast radius of untrusted code and removing
infrastructure chores. Still, you can control exactly how long a sandbox stays
alive and even reconnect later when debugging is required.

## Default lifetime: `"session"`

```tsx
await using sandbox = await Sandbox.create();
```

With no options set, the sandbox lives for the duration of your script. Once the
`Sandbox` instance is closed, the microVM shuts down and frees all resources.
This keeps costs predictable and prevents orphaned infrastructure.

## Duration-based lifetimes

Provide a duration string to keep a sandbox alive after the client disconnects:

```tsx
const sandbox = await Sandbox.create({ lifetime: "5m" });
const id = sandbox.id;
await sandbox.close(); // process can exit now

// later
const reconnected = await Sandbox.connect({ id });
```

Supported suffixes: `s` (seconds) and `m` (minutes). Examples: `"30s"`, `"5m"`,
`"90s"`. Use this mode for manual inspection, SSH debugging, or when a bot needs
to resume work mid-way.

## Forcefully ending a sandbox

- `await sandbox.kill()` immediately stops the VM and releases the lifetime.
- Killing a sandbox invalidates exposed HTTP URLs, SSH sessions, and any
  attached volumes.

## Ephemeral compute vs Deploy apps

| Aspect        | Sandboxes                                | Deploy Apps                            |
| ------------- | ---------------------------------------- | -------------------------------------- |
| Lifetime      | Seconds to minutes                       | Always-on, managed rollouts            |
| Control plane | Programmatic via SDK                     | Dashboard + CI/CD                      |
| Use cases     | Agents, previews, untrusted code         | Production APIs, long-lived services   |
| State         | Ephemeral (use volumes when needed)      | Durable deployments with KV, databases |
| Exposure      | `exposeHttp()`/`exposeSsh()` per sandbox | Custom domains, TLS, routing built-in  |

Start in a sandbox to iterate quickly. Once the codebase stabilizes and needs
24/7 availability, promote it to a Deploy app where builds, rollouts, and
observability are managed for you.

## Promote with `sandbox.deploy()`

When a sandbox proves the concept, you can turn it into an always-on Deploy app
without rebuilding elsewhere. `sandbox.deploy()` snapshots the current file
system, carries over `allowNet`, and provisions an app with a durable URL,
observability, and team access.

```tsx
await using sandbox = await Sandbox.create({ lifetime: "10m" });
// ...build or scaffold your service...

const app = await sandbox.deploy({
  name: "ai-preview",
  entrypoint: "server.ts",
});
console.log(`Promoted to Deploy app ${app.slug}`);
```

Reasons to promote:

- Keep a sandbox experiment running for customer traffic with production SLAs.
- Get TLS, custom domains, rollbacks, and traffic splitting handled for you.
- Share observability (logs/traces/metrics) across the team via the Deploy UI.
- Replace brittle hand-offs; the exact sandbox state becomes the deployed
  revision.

Use sandboxes for rapid, ephemeral work, then call `sandbox.deploy()` when the
code should live as a managed service.

## Lifetime best practices

- Keep lifetimes short for untrusted or user-supplied code. Smaller windows
  reduce attack surface.
- Use metadata (e.g., `metadata: { owner: "agent-42" }`) to track who owns a
  sandbox that outlives its creator.
- Pair longer lifetimes with explicit `allowNet` rules and rate limits if
  running internet-facing workloads.
- Clean up proactively: scripts should call `kill()` once the workload ends,
  rather than waiting for the duration to expire.

## Related APIs

- [`Sandbox.create()`](./create.md) – pass the `lifetime` option when
  provisioning.
- `Sandbox.connect({ id })` – resume control of a duration-based sandbox.
- `Sandbox.kill()` – terminate early.
- [`Expose HTTP`](./expose_http.md) and [`Expose SSH`](./expose_ssh.md) – note
  that their URLs/credentials die with the sandbox lifetime.
