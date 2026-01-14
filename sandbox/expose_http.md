---
title: "Expose HTTP"
description: "Learn how to expose HTTP endpoints from Deno Sandbox, enabling you to run web servers, APIs, and preview environments at the edge."
---

You can run dev servers, preview apps, webhook receivers, or framework CLIs on
any port and publish them instantly to a secure, random HTTPS URL.

```tsx
await sandbox.fs.writeTextFile(
  "server.js",
  "Deno.serve(() => new Response('Hello from Deno Sandbox'));",
);
const runtime = await sandbox.deno.run({ entrypoint: "server.js" });
const publicUrl = await sandbox.exposeHttp({ port: 8000 });
console.log(publicUrl); // https://<random>.sandbox.deno.net
```

The URL stays live for the sandbox lifetime, making it perfect for short-lived
QA links or agent generated previews.

## When to expose HTTP

Expose HTTP whenever you need to share the sandbox with teammates, bots, or
external services:

- Preview links for AI-generated web apps or instant demos
- Webhook receivers that must be reachable from Stripe, GitHub, etc.
- Framework dev servers (`next dev`, `astro dev`, `deno task dev`) that should
  be inspected from a browser
- Temporary APIs, health checks, or observability probes

Because sandboxes are ephemeral, you do not need to manage DNS or certificates.
Each call to `exposeHttp()` returns a unique hostname under `*.sandbox.deno.net`
with TLS automatically configured.

All requests to a sandbox's URL will send HTTP traffic to the sandbox.

## Step-by-step

1. **Start a server inside the sandbox.** Listen on any unprivileged port (e.g.,
   `3000`, `8080`).
2. **Expose the port:** `const url = await sandbox.exposeHttp({ port: 3000 });`
3. **Share or fetch from the URL.** Requests enter through Deploy’s global edge
   and are tunneled directly to your sandbox.

Multiple ports can be exposed simultaneously by calling `exposeHttp()` for each
port. You can also re-use the same exposed URL after restarting your server, as
long as the sandbox itself remains alive.

## Observing traffic

Requests routed through the exposed URL show up alongside your Deploy logs and
traces. Use the dashboard to:

- Filter logs by sandbox ID or time range
- Inspect request traces to track latency between the edge and your VM
- Cancel or restart the sandbox if a preview misbehaves

## Security and networking

- Exposed URLs are long, random subdomains that are hard to guess.
- TLS termination happens at the Deploy edge; traffic is encrypted end-to-end.

## Cleanup and limits

- An exposed URL stops accepting traffic when the sandbox lifetime ends. You can
  call `sandbox.kill()` to terminate the sandbox (and URL) ahead of schedule if
  needed.
- For persistent services, graduate the code into a Deploy app rather than
  relying on a long-running sandbox.

## Full example with a framework

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Install dependencies
await sandbox.fs.writeTextFile(
  "package.json",
  JSON.stringify(
    {
      private: true,
      scripts: { dev: "next dev" },
      dependencies: {
        next: "^15.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
    },
    null,
    2,
  ),
);
await sandbox.sh`npm install`;

// Start the dev server
const server = await sandbox.spawn("npm", {
  args: ["run", "dev"],
  stdout: "inherit",
  stderr: "inherit",
});

// Publish it
const previewUrl = await sandbox.exposeHttp({ port: 3000 });
console.log(`Preview ready at ${previewUrl}`);

await server.status; // keep running until the process exits
```

This pattern lets agents or developers spin up high-fidelity previews, share
them for feedback, and tear everything down with a single `Ctrl+C`.
