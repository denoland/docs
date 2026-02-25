---
title: "SSH"
description: "How to open secure SSH access into a sandbox for interactive debugging, editor sessions, or long-running processes."
---

Deno Sandbox can hand out SSH credentials so you can inspect the filesystem,
tail logs, run editors, or forward ports. SSH access is available both in your
terminal as a command and in the Deno Deploy Sandbox UI.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const { hostname, username } = await sandbox.exposeSsh();
console.log(`ssh ${username}@${hostname}`);

// keep process alive or interact via SSH until done...
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
import time
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create() as sandbox:
  ssh = sandbox.expose_ssh()
  print(f"ssh {ssh['username']}@{ssh['hostname']}")

  # keep process alive or interact via SSH until done...
  time.sleep(10 * 60)
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
import asyncio
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create() as sandbox:
  ssh = await sandbox.expose_ssh()
  print(f"ssh {ssh['username']}@{ssh['hostname']}")

  # keep process alive or interact via SSH until done...
  await asyncio.sleep(10 * 60)
```

</deno-tab>
</deno-tabs>

The sandbox remains reachable until the configured timeout expires. Once your
script releases its references (for example, the `await using` block ends) the
sandbox shuts down and the SSH endpoint disappears; you can also call
`sandbox.kill()` if you need to tear it down immediately.

## Connecting from your machine

### exposeSsh method

1. Request credentials via `sandbox.exposeSsh()`.
2. Connect using the provided username and hostname:

```bash
ssh ${username}@${hostname}
```

3. Use regular terminal workflows: copy files, run top, tail logs, or attach to
   running processes.

## In the terminal

You can SSH into your sandbox from the terminal using the `--ssh` flag when
running your script:

```bash
deno sandbox create -ssh
```

## In the Deno Deploy console

After creating a sandbox, you can SSH into it in the Deno Deploy web app.

1. Log in to [console.deno.com](https://console.deno.com/) and navigate to the
   **Sandboxes** section.
2. Either create a new sandbox or select an existing one from the list.
3. Click **Start SSH terminal** to open an interactive terminal session in your
   browser.

## When to use SSH access

- Debugging agent-generated code that only fails in the sandbox
- Editing files with a full-screen terminal editor or remote VS Code
- Streaming logs in real time without instrumenting application code
- Running profiling or inspection tools that are easier to use manually

Because each sandbox is already isolated, opening SSH does not compromise other
projects or organizations.

## Security considerations

- Credentials are single-use and bound to the sandbox lifetime.
- You control how long the sandbox runs; destroy it to revoke access instantly.

## Keeping the sandbox alive

The SSH tunnel closes if the sandbox shuts down. Keep it running by:

- Setting `timeout: "session"` (default) and keeping your managing script active
- Passing `timeout: "5m"` (or another duration) when creating the sandbox so it
  persists after the script exits, then reconnecting later with
  `Sandbox.connect({ id })`

Cleanup is automatic when your code stops referencing the sandbox, but you can
run `sandbox.kill()` (or simply `exit` inside the SSH session) if you want to
end it on demand.

## Example workflow

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ timeout: "10m" });

// Prepare the app
await sandbox.fs.upload("./app", ".");
await sandbox.sh`deno task dev`
  .noThrow(); // start server; leave running for inspection

// Get SSH details
const ssh = await sandbox.exposeSsh();
console.log(`Connect with: ssh ${ssh.username}@${ssh.hostname}`);

// Block until you're done debugging manually
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
import time
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create(timeout="10m") as sandbox:
  # Prepare the app
  sandbox.fs.upload("./app", ".")
  proc = sandbox.spawn("deno", args=["task", "dev"])
  # start server; leave running for inspection

  # Get SSH details
  ssh = sandbox.expose_ssh()
  print(f"Connect with: ssh {ssh['username']}@{ssh['hostname']}")

  # Block until you're done debugging manually
  time.sleep(10 * 60)
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
import asyncio
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(timeout="10m") as sandbox:
  # Prepare the app
  await sandbox.fs.upload("./app", ".")
  proc = await sandbox.spawn("deno", args=["task", "dev"])
  # start server; leave running for inspection

  # Get SSH details
  ssh = await sandbox.expose_ssh()
  print(f"Connect with: ssh {ssh['username']}@{ssh['hostname']}")

  # Block until you're done debugging manually
  await asyncio.sleep(10 * 60)
```

</deno-tab>
</deno-tabs>

Use this pattern to investigate flaky builds, run interactive REPLs, or pair
with teammates without promoting the code to a full Deploy app.
