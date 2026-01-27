---
title: "Deno Sandbox"
description: "Overview of the Deno Sandbox microVM platform on Deploy, including capabilities, security model, and ideal use cases."
---

Deno Sandbox brings instant Linux microVMs to Deno Deploy. Each sandbox boots in
under a second, is API driven from the `@deno/sandbox` SDK, and is torn down as
soon as you are done. The result is on-demand compute that feels like opening a
terminal, yet ships with production-grade isolation and observability.

## What is a Deno Sandbox?

- Individual Linux microVMs orchestrated by Deno Deploy
- Designed for running untrusted code
- Instantly available; boot times measured in milliseconds
- Ephemeral by default but able to persist beyond the current connection
  lifetime
- Able to access durable storage via [volumes](./volumes/)
- Fully API driven: create, run commands, and tear down from code

## Ideal use cases

Deno Sandbox specializes in workloads where code needs to be generated,
evaluated, or safely executed on behalf of an untrusted user. They are ideal
for:

- AI agents and copilots that need to run code as they reason
- Secure plugin or extension systems
- Vibe-coding and collaborative IDE experiences
- Ephemeral CI runners and smoke tests
- Customer supplied or user generated code paths
- Instant dev servers and preview environments

This is compute built not just for developers, but for software that builds
software.

## Run real workloads

Once the Deno Sandbox exists, you get a full Linux environment with files,
processes, package managers, and background services:

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";
await using sandbox = await Sandbox.create();
await sandbox.sh`ls -lh /`;
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

def main():
  sdk = DenoDeploy()

  with sdk.sandbox.create() as sandbox:
    process = sandbox.spawn("ls", args=["-lh"])
    process.wait()
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

async def main():
  sdk = AsyncDenoDeploy()

  async with sdk.sandbox.create() as sandbox:
    process = await sandbox.spawn("ls", args=["-lh"])
    await process.wait()
```

</deno-tab>
</deno-tabs>

## Security policies

Provision a sandbox so that it can only talk to approved hosts:

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await Sandbox.create({
  allowNet: ["google.com"],
});
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandboxes.create(allowNet=["google.com"]) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandboxes.create(allowNet=["google.com"]) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

Secrets never enter the sandbox environment. The real value is substituted only
when the sandbox makes outbound requests to approved hosts.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await Sandbox.create({
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
<deno-tab value="python-async" label="Python (Async)">

```python
sdk = AsyncDenoDeploy()

async with sdk.sandboxes.create(
  allowNet=["api.openai.com"],
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    }
  },
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python" label="Python">

```python
sdk = DenoDeploy()

with sdk.sandboxes.create(
  allowNet=["api.openai.com"],
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    }
  },
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

## Built for instant, safe compute

Developers and AI systems now expect compute that is instant, safe, and globally
accessible. Deno Sandbox delivers:

- Instant spin-up with no warm pool to manage
- Dedicated isolation with strict network egress policies
- Full observability alongside Deno Deploy logs and traces
- Region selection, memory sizing, and lifetime controls per sandbox
- Seamless hand-off to Deno Deploy apps when code is production ready

Together, Deno Deploy and Deno Sandbox form a single workflow: code is created,
proved safe in a sandbox, and deployed globally without new infrastructure or
orchestration layers.

## Runtime support

The Deno Sandbox SDK is tested and supported on:

- **Deno:** Latest stable version
- **Node.js:** Version 24+
- **Python:** >=3.10

You can use Deno Sandbox from any environment that can make outbound HTTPS
requests to the Deno Deploy API. The JavaScript SDK is available as
`@deno/sandbox` on both [jsr](https://jsr.io/@deno/sandbox) and
[npm](https://www.npmjs.com/package/@deno/sandbox) (the JSR package is
optimized for Deno usage). The Python SDK is available as `deno-sandbox` on
[PyPI](https://pypi.org/project/deno-sandbox/).

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

Deno Sandbox has the following limits:

- **Memory:** 768 MB to 4096 MB (1GB default) configurable per sandbox
- **CPU:** 2 vCPU
- **Lifetime:** Configurable per sandbox and bound to a session, up to 30
  minutes
- **Disk**: 10 GB of ephemeral storage
- **Concurrency**: 5 concurrent sandboxes per organization (This is the default
  concurrency limit during the pre-release phase of Deno Sandbox. Contact
  [deploy@deno.com](mailto:deploy@deno.com) to request a higher limit.)

Exceeding these limits may result in throttling or termination of your sandbox.

## Regions

Regions currently supported are:

- `ams` - Amsterdam, Netherlands
- `ord` - Chicago, USA

You can specify the region where the sandbox will be created when creating a new
sandbox:

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ region: "ams" });
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

def main():
  sdk = DenoDeploy()

  with sdk.sandboxes.create(region="ams") as sandbox:
    print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

async def main():
  sdk = AsyncDenoDeploy()

  async with sdk.sandboxes.create(region="ams") as sandbox:
    print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

If not specified, the sandbox will be created in the default region.

## Learn more

Ready to try it? Follow the [Getting started](./getting_started) guide to create
your first sandbox, obtain an access token, and run code on the Deploy edge.
