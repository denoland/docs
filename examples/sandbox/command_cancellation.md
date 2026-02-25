---
title: "Command cancellation"
description: "Learn how to cancel commands in a sandbox."
url: /examples/sandbox_command_cancellation/
layout: sandbox-example.tsx
---

Being able to cancel sandbox commands is key when tasks hang or you need to
enforce timeouts. You can cancel commands in a sandbox using the
`KillController` class.

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

`KillController` lets you attach a cancellation signal to any sandbox command,
so you can abort long-running processes if they exceed a limit or the user
cancels the operation.

After triggering `controller.kill()`, the awaiting call rejects; you can
intercept that rejection to log, clean up, or retry as needed.

This pattern keeps sandbox automation responsive and prevents orphaned processes
from consuming resources indefinitely.
