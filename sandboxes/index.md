---
title: "Deno Sandboxes"
description: "Overview of the Sandboxes microVM platform on Deploy, including capabilities, security model, and ideal use cases."
---

Sandboxes bring instant Linux microVMs to Deno Deploy. Each sandbox boots in
under a second, is API driven from the `@deno/sandbox` SDK, and is torn down as
soon as you are done. The result is on-demand compute that feels like opening a
terminal, yet ships with production-grade isolation and observability.

## What are Sandboxes?

- Linux microVMs orchestrated by Deno Deploy
- Designed for running untrusted code
- Instantly available; boot times measured in milliseconds
- Ephemeral by default but able to persist beyond the current connection
  lifetime
- Able to access durable storage via [volumes](./volumes/)
- Fully API driven: create, run commands, and tear down from code

## Ideal use cases

Sandboxes specialize in workloads where code needs to be generated, evaluated,
or safely executed on behalf of an untrusted user. They are ideal for:

- AI agents and copilots that need to run code as they reason
- Secure plugin or extension systems
- Vibe-coding and collaborative IDE experiences
- Ephemeral CI runners and smoke tests
- Customer supplied or user generated code paths
- Instant dev servers and preview environments

This is compute built not just for developers, but for software that builds
software.

## Run real workloads

Once the sandbox exists, you get a full Linux environment with files, processes,
package managers, and background services:

```tsx
import { Sandbox } from "@deno/sandbox";
await using sandbox = await Sandbox.create();
await sandbox.sh`ls -lh /`;
```

## Security Policies (**Coming soon**)

Povision a Sandbox so that it can only talk to approved hosts:

```tsx
await Sandbox.create({
  allowNet: ["google.com"],
});
```

Environment variables marked as Secrets never enter the sandbox. Below,
`OPENAI_API_KEY` is never visibile to code inside the sandbox and only can ever
be sent to `api.openai.com`.

```tsx
await Sandbox.create({
  secrets: {
    OPENAI_API_KEY: {
      hosts: ["api.openai.com"],
      value: process.env.OPENAI_API_KEY,
    },
  },
});
```

## Built for instant, safe compute

Developers and AI systems now expect compute that is instant, safe, and globally
accessible. Sandboxes deliver:

- Instant spin-up with no warm pool to manage
- Dedicated isolation with strict network egress policies
- Full observability alongside Deploy logs and traces
- Region selection, memory sizing, and lifetime controls per sandbox
- Seamless hand-off to Deploy apps when code is production ready

Together, Deno Deploy and Sandboxes form a single workflow: code is created,
proved safe in a sandbox, and deployed globally without new infrastructure or
orchestration layers.

## Runtime support

The Sandboxes SDK is tested and supported on:

- **Deno:** Latest stable version
- **Node.js:** Version 24+

You can use Sandboxes from any environment that can import the `@deno/sandbox`
package and make outbound HTTPS requests to the Deploy API, meaning you can use
Sandboxes in your Node projects, Deno Deploy apps, or even browser-based tools.

In your Deno projects you can use either the [jsr](https://jsr.io/@deno/sandbox)
or [npm](https://www.npmjs.com/package/@deno/sandbox) package, however the jsr
package has been optimized for Deno usage and APIs and is recommended.

:::note await using support

The
[`await using`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/await_using)
syntax requires Node.js 24+. If your project uses earlier Node.js versions, use
try/finally blocks instead:

```ts
import { Sandbox } from "@deno/sandbox";

const sandbox = await Sandbox.create();
try {
  // ... use sandbox ...
} finally {
  await sandbox.close();
}
```

:::

## Limits

Sandboxes have the following limits:

- **Memory:** 768 MB to 4096 MB (1GB default) configurable per sandbox
- **CPU:** 2 vCPU
- **Lifetime:** Configurable per sandbox and bound to a session, up to 30
  minutes
- **Disk**: 10 GB of ephemeral storage
- **Concurrency**: 5 concurrent sandboxes per organization (This is the default
  concurrency limit during the pre-release phase of Sandboxes. Contact
  [deploy@deno.com](mailto:deploy@deno.com) to request a higher limit.)

Exceeding these limits may result in throttling or termination of your sandbox.

## Regions

Regions currently supported are:

- `ams` - Amsterdam, Netherlands
- `ord` - Chicago, USA

You can specify the region where the sandbox will be created when creating a new
sandbox:

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ region: "ams" });
```

If not specified, the sandbox will be created in the default region.

## Learn more

Ready to try it? Follow the [Getting started](./getting_started) guide to create
your first sandbox, obtain an access token, and run code on the Deploy edge.
