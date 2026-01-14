---
title: "Control sandbox timeout"
description: "Learn how to control how long your sandbox stays alive using the timeout option."
url: /examples/sandboxes_timeout_control/
layout: sandbox-example.tsx
---

You can control how long your sandbox stays alive using the timeout option:

```ts
import { Sandbox } from "@deno/sandbox";

// Default: "session" - sandbox shuts down when you close/dispose the client
await using sandbox = await Sandbox.create({ timeout: "session" });
```

Supported duration suffixes: `s` (seconds), `m` (minutes).

Examples: `"30s"`, `"5m"`, `"90s"` .

```ts
import { Sandbox } from "@deno/sandbox";

// Duration-based: keep sandbox alive for a specific time period
// Useful when you want the sandbox to persist after the script exits
const sandbox = await Sandbox.create({ timeout: "5m" }); // 5 minutes
const id = sandbox.id;
// Close the *connection* to the sandbox; the sandbox keeps running
await sandbox.close();

// Later, reconnect to the same sandbox using its ID
const reconnected = await Sandbox.connect({ id });
await reconnected.sh`echo 'Still alive!'`;

// You can still forcibly terminate it before its timeout elapses
await reconnected.kill();
// At this point, the sandbox is no longer reconnectable
```

> Need other timeout modes? Contact
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>.
