---
title: "Access string and binary output"
description: "Learn how to access string and binary output from commands in a sandbox."
url: /examples/sandbox_access_output/
layout: sandbox-example.tsx
---

You can access string and binary output from commands in a sandbox. This example
shows how to capture command output in whichever form your workflow needs:

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

Piping stdout lets you retrieve both the raw binary buffer and a decoded text
view from the same command, so you can handle files that mix binary and textual
data without re-running the command.

Once you have the binary result, you can pass it directly to APIs such as
`fs.writeFileSync` to persist artifacts generated inside the sandbox, making it
easy to move data between the sandbox and your host environment

This is useful when sandbox commands produce files (images, archives, etc.) that
you need to consume programmatically rather than just printing to the console.
