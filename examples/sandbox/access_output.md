---
title: "Access string and binary output"
description: "Learn how to access string and binary output from commands in a sandbox."
url: /examples/sandbox_access_output/
layout: sandbox-example.tsx
---

You can access string and binary output from commands in a sandbox.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Get both string and binary data
const result = await sandbox.sh`cat binary-file.png`
  .stdout("piped");
console.log("Binary length:", result.stdout!.length);
console.log("Text length:", result.stdoutText!.length);

// Use the binary data
import fs from "node:fs";
fs.writeFileSync("output.png", result.stdout!);
```
