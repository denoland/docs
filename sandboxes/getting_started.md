---
title: "Getting started"
description: "Step-by-step walkthrough for enabling Sandboxes, creating your first microVM, running commands, exposing services, and managing secrets."
---

To use Sandboxes, you need a Deno Deploy account. If you do not have one yet you
can sign up for a free account at [console.deno.com](https://console.deno.com).

## Access the Sandboxes dashboard

1. Visit [console.deno.com](https://console.deno.com/) and sign in with your
   Deploy account.
2. Choose or create the organization where you want to run sandboxes.
3. Open the **Sandboxes** tab to view existing sandboxes, lifetime usage, and
   access tokens.

Sandboxes and Deploy apps share the same organization boundary, so you can reuse
members, tokens, and observability settings across both products.

## Create an organization token

The `@deno/sandbox` SDK authenticates using the `DENO_DEPLOY_TOKEN` environment
variable. Generate it from **Settings → Organization tokens**, copy the value,
and store it securely. Then export it in your local shell or CI job:

```bash
export DENO_DEPLOY_TOKEN=<your-token>
```

![The Deno Deploy organization tokens screen.](/sandboxes/images/org-tokens.webp)

:::tip Token security

Treat this token like any other production secret. Rotate it from the dashboard
if it is ever exposed.

:::

## Install the SDK

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

## Create your first sandbox

```tsx title="main.ts"
import { Sandbox } from "@deno/sandbox";
await using sandbox = await Sandbox.create();
await sandbox.sh`ls -lh /`;
```

## Run your sandbox code

This code will require access to the network to reach the Deploy edge where the
sandbox will be created, and also access to the environment variables to
authenticate with the Deploy API, so we'll pass in the `--allow-net` and
`--allow-env` flags to the `deno run` command (or use the shorthand `-EN`).

```bash
deno -EN main.ts
```

Any sandbox you create will be listed in the **Sandboxes** tab of your Deno
Deploy organization.

![The list of sandboxes created in the Deno Deploy console.](/sandboxes/images/sandbox-list.webp)

Details about the sandbox will be shown in its **Event log**.

![The sandbox event log details in the Deno Deploy console.](/sandboxes/images/sandbox-event-log.webp)

## Configuring your sandbox

When creating a sandbox witb `Sandbox.create()`, you can configure it with the
following options:

- `region`: Deploy region where the sandbox will be created.
- `memoryMb`: Amount of memory allocated to the sandbox.
- `lifetime`: Lifetime of the sandbox.
- `labels`: Arbitrary key/value tags to help identify and manage sandboxes

```tsx
await using sandbox = await Sandbox.create({
  region: "sjc", // optional: choose the Deploy region
  memoryMb: 1024, // optional: pick the RAM size (768-4096)
});
```

## Running commands and scripts

Sandboxes expose familiar filesystem and process APIs to run commands, upload
files, and spawn long-running services.

You can for example list files in the root directory:

```ts
await sandbox.sh`ls -lh /`;
```

Or upload a script from the local filesystem and run it:

```ts
// Upload a file to a specific path in the sandbox
await sandbox.upload("./local-hello.ts", "./hello.ts");
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

## Deploying from a sandbox

The snippet below walks through an end-to-end workflow: it creates a Deploy app
via the `Client`, boots a high-memory sandbox for heavier builds, scaffolds and
builds a Next.js project inside that VM, then calls `sandbox.deploy()` to push
the compiled artifacts while streaming build logs back to your terminal.

```tsx
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();
const app = await client.apps.create();

await using sandbox = await Sandbox.create({ memoryMb: 4096 });
console.log("Created sandbox", sandbox);

await sandbox
  .sh`deno -A npm:create-next-app@latest --yes --skip-install my-app`;
await sandbox.sh`cd my-app && deno install`;
await sandbox.sh`cd my-app && deno task build`;
await sandbox.sh`cd my-app && du -sh .`;
const build = await sandbox.deploy(app.slug, {
  path: "my-app",
  production: true,
  build: {
    entrypoint: "node_modules/.bin/next",
    args: ["start"],
  },
});

for await (const log of build.logs()) {
  console.log(log.message);
}
```

## Tuning lifetime, cleanup, and reconnect

- `lifetime: "session"` (default) destroys the VM once your script finishes.
- Provide durations such as `"5m"` to keep the sandbox alive even after the
  client disconnects. You can later `Sandbox.connect({ id })` to resume work.
- Cleanup happens automatically when your code drops the last reference (or the
  `await using` block ends). Call `sandbox.kill()` only if you need to tear the
  VM down ahead of that schedule.

Observability is shared with Deploy: every sandbox logs, trace, and metric is
visible in the Deno Deploy dashboard so you can debug agent runs the same way
you debug production apps.
