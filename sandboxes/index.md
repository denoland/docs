---
title: "About Sandboxes"
description: "Overview of the Sandboxes microVM platform on Deploy, including capabilities, security model, and ideal use cases."
---

<a href="https://app.deno.com/" class="docs-cta deploy-cta">Launch the Sandboxes
dashboard</a>

Sandboxes bring real Linux microVMs directly to the Deploy global edge. Each
sandbox boots in under a second, is API driven from the `@deno/sandbox` SDK, and
is torn down as soon as you are done. The result is on-demand compute that feels
like opening a terminal, yet ships with production-grade isolation and
observability.

## What are Sandboxes?

- Real Linux microVMs orchestrated by Deno Deploy
- Boot times measured in milliseconds, so sandboxes feel instant
- Ephemeral by default, removing the need to patch, drain, or recycle hosts
- Fully API driven: create, run commands, and tear down from code
- Available in Deploy regions worldwide for low-latency edge execution

## Ideal use cases

Sandboxes specialize in workloads where code needs to be generated, evaluated,
or safely executed on behalf of a user or another service. They are ideal for:

- AI agents and copilots that need to run code as they reason
- Secure plugin or extension systems
- Vibe-coding and collaborative IDE experiences
- Ephemeral CI runners and smoke tests
- Customer supplied or user generated code paths
- Instant dev servers and preview environments

This is compute built not just for developers, but for software that builds
software.

## Create a sandbox in code

```tsx
import { Sandbox } from "@deno/sandbox";

const sb = await Sandbox.create({
  allowNet: ["api.stripe.com", "api.openai.com"],
});
```

Every sandbox launches with a strict outbound allow list. `allowNet` constrains
the VM at the hypervisor boundary, so even if user code attempts to exfiltrate
data it can only talk to the hosts you approve.

## Run real workloads inside

Once the sandbox exists, you get a full Linux environment with files, processes,
package managers, and background services:

```tsx
await sb.sh`ls -lh /`;
```

Need more than shell commands? Upload source files, spawn `deno` or `node`,
start framework dev servers, or expose HTTPS endpoints with
`sandbox.exposeHttp()`. Sandboxes stay alive as long as your session or
configured lifetime requires, then disappear automatically.

## Secrets stay secret

Secrets never enter the sandbox environment variables. Instead, Deno Deploy
substitutes them only when the sandbox makes outbound requests to an approved
host. A command such as:

```bash
echo $ANTHROPIC_API_KEY
# <placeholder>
```

confirms that user code cannot read the real secret. This blocks the most common
AI attack path of prompt injection followed by secret exfiltration while
allowing your automation to freely call third-party APIs.

## Built for instant, safe compute

Developers and AI systems now expect compute that is instant, safe, and globally
accessible. Sandboxes deliver:

- Instant spin-up with no warm pool to manage
- Dedicated isolation with strict network egress policies
- Full observability alongside Deploy logs and traces
- Region selection, memory sizing, and lifetime controls per sandbox
- Seamless hand-off to Deploy apps when code is production ready

Together, Deploy plus Sandboxes form a single workflow: code is created, proved
safe in a sandbox, and deployed globally without new infrastructure or
orchestration layers.

## Learn more

Ready to try it? Follow the [`Getting started` guide](./getting_started.md) to
create your first sandbox, obtain an access token, and run code on the Deploy
edge.
