---
title: "Spawn a subprocess, and get buffered output"
description: "Learn how to spawn a subprocess, and get buffered output in a sandbox."
url: /examples/sandbox_spawn_subprocess/
layout: sandbox-example.tsx
---

You can spawn subprocesses in a sandbox and get buffered output as seen below.

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const text = await sandbox.sh`pwd`.text();
console.log("result:", text); // → "/home/sandbox\n"
```

For long‑running processes or large output, stream the stdout/stderr.
