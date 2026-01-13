---
title: "Provide a VSCode instance in a sandbox"
description: "Learn how to provide a VSCode instance in a sandbox."
url: /examples/sandboxes_vscode_instance/
layout: sandbox-example.tsx
---

The `sandbox.vscode()` method can be used to provide a VSCode instance in a
sandbox.

This example shows how to start a VSCode instance in a sandbox and print the url
of the running instance which you can then open in your browser.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Start a VSCode instance
const vscode = await sandbox.exposeVscode();

console.log(vscode.url); // print the url of the running instance
await vscode.status; // wait until it exits
```
