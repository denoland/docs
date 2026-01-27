---
title: "Control sandbox timeout"
description: "Learn how to control how long your sandbox stays alive using the timeout option."
url: /examples/sandbox_timeout_control/
layout: sandbox-example.tsx
---

You can control how long your sandbox stays alive using the timeout option.
Controlling timeout lets you decide whether sandboxes vanish immediately when
your script finishes or keep running for a set duration:

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

The default "session" mode is fine for short-lived automation—resource cleanup
happens as soon as the client disposes.

Duration-based timeouts ("30s", "5m", etc.) let you close the client connection
while the sandbox keeps state alive, so you can reconnect later (e.g., to
inspect logs, rerun commands, or share the sandbox ID with another process)
before the timeout expires.

## Extend the timeout whenever you need

You are not locked into the original duration. As long as you still hold a
`Sandbox` instance (either the original handle or one reconnected via
`Sandbox.connect()`), call `sandbox.extendTimeout()` with another duration
string to push the expiry further out. Each call can add up to 30 minutes and
returns a `Date` indicating the new shutdown time.

```ts
import { Sandbox } from "@deno/sandbox";

const sandbox = await Sandbox.create({ timeout: "5m" });

// Need more time later on? Extend in-place without disrupting running work.
const newExpiry = await sandbox.extendTimeout("30m");
console.log(`Sandbox now lives until ${newExpiry.toISOString()}`);
```

You still control lifecycle explicitly with a call to `kill()` to end the
sandbox early if you no longer need it, useful if your job finishes sooner than
expected.

> Need other timeout modes? Contact
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>.
