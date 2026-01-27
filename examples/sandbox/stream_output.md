---
title: "Stream output to a local file"
description: "Learn how to stream output to a local file in a sandbox."
url: /examples/sandbox_stream_output/
layout: sandbox-example.tsx
---

You can stream output to a local file in a sandbox. This avoids buffering entire
large artifacts in memory.

If you generate something sizable inside the sandbox (like `big.txt` below), you
can pipe it out chunk-by-chunk over a `ReadableStream`, converting Node’s
`fs.WriteStream` to a Web `WritableStream` for efficient transfer.

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

This pattern keeps memory usage flat, works well for logs or big binaries, and
lets you persist sandbox results on the host without temporary files or stdout
truncation.
