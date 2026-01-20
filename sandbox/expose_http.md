---
title: "Expose HTTP"
description: "Learn how to expose HTTP endpoints from Deno Sandbox, enabling you to run web servers, APIs, and preview environments at the edge."
---

You can run dev servers, preview apps, webhook receivers, or framework CLIs on
any port and publish them instantly to a secure, random HTTPS URL.

Import the `Sandbox` class from the `@deno/sandbox` module and pass a port to
the Sandbox.create() method:

```tsx title="main.ts"
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ port: 8000 });
console.log(sandbox.id);

await sandbox.fs.writeTextFile(
  "main.ts",
  "export default { fetch: () => new Response('hello from a sandbox!') }",
);

const p = await sandbox.sh`deno serve --watch main.ts`.spawn();

console.log("deno now listening on", sandbox.url);

await p.output();
```

This can then be run by setting your Deploy token and executing:

```sh
deno run -A --watch main.ts
```

Setting the `--watch` flag allows the sandbox to restart automatically when code
changes are detected, for a low-fi hot-reload experience.

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

## exposeHttp() usage

Sandboxes also support exposing HTTP on-demand via the `exposeHttp()` method:

```ts
const previewUrl = await sandbox.exposeHttp({ port: 8000 });
console.log(`Preview ready at ${previewUrl}`);
```

This is useful when you want to start a sandbox without HTTP exposure, then
expose it later (for example, after some initialization or build steps).

:::info Security

When you call this API, the target HTTP service will be PUBLICLY EXPOSED WITHOUT
AUTHENTICATION. Anyone with knowledge of the public domain will be able to send
requests to the exposed service.

:::

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
await sandbox.fs.mkdir("pages", { recursive: true });
await sandbox.fs.writeTextFile(
  "pages/index.js",
  `export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Next.js sandbox</h1>
      <p>Edit pages/index.js to get started.</p>
    </main>
  );
}
`,
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

Using Deno Sandbox in this way allows you to spin up full-featured framework
development servers with minimal code, useful for agents or developers who need
to spin up high-fidelity previews, share them for feedback, and tear everything
down with a single `Ctrl+C`.
