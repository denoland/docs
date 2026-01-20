---
title: "Promote Deno Sandbox to Deploy Apps"
description: "Learn how to promote a sandbox to a full Deno Deploy app for production use."
---

There may be times when a Deno Sandbox proves a concept or prototype that should
live on as a first-class Deno Deploy app. Instead of rebuilding the codebase
elsewhere, you can promote the sandbox directly using `sandbox.deno.deploy()`.

## Ephemeral compute vs Deploy apps

| Aspect        | Deno Sandbox                             | Deno Deploy Apps                       |
| ------------- | ---------------------------------------- | -------------------------------------- |
| Lifetime      | Seconds to minutes                       | Always-on, managed rollouts            |
| Control plane | Programmatic via SDK                     | Dashboard + CI/CD                      |
| Use cases     | Agents, previews, untrusted code         | Production APIs, long-lived services   |
| State         | Ephemeral (use volumes when needed)      | Durable deployments with KV, databases |
| Exposure      | `exposeHttp()`/`exposeSsh()` per sandbox | Custom domains, TLS, routing built-in  |

Start in a sandbox to iterate quickly. Once the codebase stabilizes and needs
24/7 availability, promote it to a Deploy app where builds, rollouts, and
observability are managed for you.

## Promote with `sandbox.deno.deploy()`

When a sandbox proves the concept, you can turn it into an always-on Deploy app
without rebuilding elsewhere. `sandbox.deno.deploy()` snapshots the current file
system, carries over `allowNet`, and provisions an app with a durable URL,
observability, and team access.

```tsx
await using sandbox = await Sandbox.create({ timeout: "10m" });
// ...build or scaffold your service...

const app = await sandbox.deno.deploy("ai-preview", {
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

Use sandboxes for rapid, ephemeral work, then call `sandbox.deno.deploy()` when
the code should live as a managed service.
