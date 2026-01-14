---
title: "Command cancellation"
description: "Learn how to cancel commands in a sandbox."
url: /examples/sandbox_command_cancellation/
layout: sandbox-example.tsx
---

You can cancel commands in a sandbox using the `KillController` class.

```ts
import { KillController, Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Start a long-running command
const controller = new KillController();
const cmd = sandbox.sh`sleep 30`.signal(controller.signal);
const promise = cmd.text();

// Cancel after 2 seconds
setTimeout(() => {
  controller.kill(); // Kill the process
}, 2000);

try {
  await promise;
} catch (error) {
  console.log("Command was cancelled:", error);
}
```
