---
title: "Provide a VSCode instance in a sandbox"
description: "Learn how to provide a VSCode instance in a sandbox."
url: /examples/sandbox_vscode_instance/
layout: sandbox-example.tsx
---

Running `sandbox.exposeVscode()` spins up a full VS Code instance inside an
isolated sandboxed environment and exposes its URL so you can open it in a
browser. This is handy when you need a lightweight, disposable editor for demos,
workshops, or remote debugging: you can provision VS Code on demand without
installing anything locally, safely experiment with code inside a contained
workspace, and tear it down automatically once you’re done.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Start a VSCode instance
const vscode = await sandbox.exposeVscode();

console.log(vscode.url); // print the url of the running instance
await vscode.status; // wait until it exits
```
