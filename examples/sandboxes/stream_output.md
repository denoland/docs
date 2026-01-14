---
title: "Stream output to a local file"
description: "Learn how to stream output to a local file in a sandbox."
url: /examples/sandboxes_stream_output/
layout: sandbox-example.tsx
---

You can stream output to a local file in a sandbox.

`child.stdout` is a Web `ReadableStream`.

In Node, convert a Node `fs.WriteStream` to a Web `WritableStream` to pipe
efficiently.

```ts
import { Sandbox } from "@deno/sandbox";
import fs from "node:fs";
import { Writable } from "node:stream";

await using sandbox = await Sandbox.create();

// Create a large file in the sandbox
await sandbox.fs.writeTextFile("big.txt", "#".repeat(5_000_000));

// Stream it out to a local file
const child = await sandbox.spawn("cat", {
  args: ["big.txt"],
  stdout: "piped",
});
const file = fs.createWriteStream("./big-local-copy.txt");
await child.stdout.pipeTo(Writable.toWeb(file));

const status = await child.status;
console.log("done:", status);
```
