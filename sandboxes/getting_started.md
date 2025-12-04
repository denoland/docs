---
title: "Getting started"
description: "Step-by-step walkthrough for enabling Sandboxes, creating your first microVM, running commands, exposing services, and managing secrets."
---

To use Sandboxes, you need a Deno Deploy account. If you do not have one yet you
can sign up for a free account at [console.deno.com](https://console.deno.com).

## 1. Access the Sandboxes dashboard

1. Visit [console.deno.com](https://console.deno.com/) and sign in with your
   Deploy account.
2. Choose or create the organization where you want to run sandboxes.
3. Open the **Sandboxes** tab to view existing sandboxes, lifetime usage, and
   access tokens.

Sandboxes and Deploy apps share the same organization boundary, so you can reuse
members, tokens, and observability settings across both products.

## 2. Create an organization token

The `@deno/sandbox` SDK authenticates using the `DENO_DEPLOY_TOKEN` environment
variable. Generate it from **Settings → Organization tokens**, copy the value,
and store it securely. Then export it in your local shell or CI job:

```bash
export DENO_DEPLOY_TOKEN=<your-token>
```

:::tip Token security

Treat this token like any other production secret. Rotate it from the dashboard
if it is ever exposed.

:::

## 3. Install the SDK

The SDK works in both Deno and Node.js environments.

```bash
# Using Deno
deno add jsr:@deno/sandbox

# Using npm
npm install @deno/sandbox

# Using pnpm
pnpm install jsr:@deno/sandbox

# Using yarn
yarn add jsr:@deno/sandbox
```

## 4. Create your first sandbox

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({
  allowNet: ["api.stripe.com", "api.openai.com"],
  region: "sjc", // optional: choose the Deploy region
  memoryMb: 1024, // optional: pick the RAM size (768-4096)
});
```

This call provisions an isolated Linux microVM on the Deploy edge. By providing
an `allowNet` list, you define the only hosts that can receive outbound traffic
from that VM.

## 5. Run commands and scripts

Sandboxes expose familiar filesystem and process APIs to run commands, upload
files, and spawn long-running services.

You can for example list files in the root directory:

```ts
await sandbox.sh`ls -lh /`;
```

Or upload a script and run it:

```ts
await sandbox.writeTextFile("hello.ts", "console.log('Hello from a sandbox')");
const proc = await sandbox.spawn("deno", {
  args: ["run", "hello.ts"],
  stdout: "piped",
});
for await (const chunk of proc.stdout) {
  console.log(new TextDecoder().decode(chunk));
}
await proc.status;
```

You can keep state between commands, stream stdout and stderr, or open an
interactive REPL with `sandbox.repl()` for agent-style workflows.

## 7. Keep secrets and policies tight

Secrets never appear inside `/proc` or the sandbox environment variables.
Instead, Deploy injects them only when the sandbox makes an outbound request to
an allowed host. A check like:

```bash
echo $ANTHROPIC_API_KEY
# <placeholder>
```

confirms that user code cannot read your real credentials. Combine this with
narrow `allowNet` rules, per-command timeouts, or `KillController` cancellation
for a defense-in-depth posture.

## 8. Tune lifetime, cleanup, and reconnect

- `lifetime: "session"` (default) destroys the VM once your script finishes.
- Provide durations such as `"5m"` to keep the sandbox alive even after the
  client disconnects. You can later `Sandbox.connect({ id })` to resume work.
- Call `await sandbox.kill()` when you are finished to free resources
  immediately.

Observability is shared with Deploy: every sandbox logs, trace, and metric is
visible in the dashboard so you can debug agent runs the same way you debug
production apps.

## Next steps

- Browse the [JSR docs for `@deno/sandbox`](https://jsr.io/@deno/sandbox) to see
  the full API surface, including SSH access and file uploads.
- Explore the [Deploy reference](../deploy/index.md) to understand how sandboxes
  graduate into always-on apps.
- Invite teammates to your organization so they can create their own sandboxes
  with role-based access.
