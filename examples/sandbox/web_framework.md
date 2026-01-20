---
title: "Serve a web framework"
description: "Create a package.json, install deps, run a web framework (Express), and expose it publicly from a sandbox"
url: /examples/sandbox_web_framework/
layout: sandbox-example.tsx
---

With Deno Sandbox you can create a `package.json`, install dependencies, run a
web framework (Express), and expose it publicly over HTTP.

This example shows how to create a minimal Express app inside the sandbox, runs
it on port 3000, and exposes it publicly using `sandbox.exposeHttp()`.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 1) Write package.json and server.js in the sandbox
const PACKAGE_JSON = {
  name: "sandbox-express-demo",
  private: true,
  type: "module",
  dependencies: { express: "^4.19.2" },
};
await sandbox.fs.writeTextFile(
  "package.json",
  JSON.stringify(PACKAGE_JSON, null, 2),
);

await sandbox.fs.writeTextFile(
  "server.js",
  `import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Hello from Express in @deno/sandbox!'));
app.get('/time', (req, res) => res.json({ now: new Date().toISOString() }));
app.listen(3000, () => console.log('listening on :3000'));
`,
);

// 2) Install dependencies
await sandbox.sh`deno install`;

// 3) Start the server
const server = await sandbox.deno.run({ entrypoint: "server.js" });

// 4) Publish to the internet
const publicUrl = await sandbox.exposeHttp({ port: 3000 });
console.log("Public URL:", publicUrl); // e.g. https://<random>.sandbox.deno.net

// Fetch from your local machine to verify
const resp = await fetch(`${publicUrl}/time`);
console.log(await resp.json());

// Keep the process alive as long as you need; when done, closing the sandbox
// will tear it down.
```
