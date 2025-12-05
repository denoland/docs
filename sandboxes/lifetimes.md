---
title: "Sandbox Lifetimes"
description: "Understand how long sandboxes stay alive, how to extend or reconnect to them, and when to promote work to a Deploy app."
---

Sandboxes are intentionally ephemeral. They boot in milliseconds, serve their
purpose, and disappear—reducing the blast radius of untrusted code and removing
infrastructure chores. Still, you can control exactly how long a sandbox stays
alive and even reconnect later when debugging is required.

## Default lifetime: `"session"`

```tsx
await using sandbox = await Sandbox.create();
```

With no options set, the sandbox lives for the duration of your script. Once the
`Sandbox` instance is closed, the microVM shuts down and frees all resources.
This keeps costs predictable and prevents orphaned infrastructure.

## Duration-based lifetimes

Provide a duration string to keep a sandbox alive after the client disconnects:

```tsx
const sandbox = await Sandbox.create({ lifetime: "5m" });
const id = sandbox.id;
await sandbox.close(); // process can exit now

// later
const reconnected = await Sandbox.connect({ id });
```

Supported suffixes: `s` (seconds) and `m` (minutes). Examples: `"30s"`, `"5m"`,
`"90s"`. Use this mode for manual inspection, SSH debugging, or when a bot needs
to resume work mid-way.

If you require a longer lifetime, it is possible to promote a duration-based
sandbox to a Deno Deploy app using [`sandbox.deploy()`](./promote.md).

## Forcefully ending a sandbox

- `await sandbox.kill()` immediately stops the VM and releases the lifetime if
  you need to tear it down before it would naturally expire.
- Killing a sandbox invalidates exposed HTTP URLs, SSH sessions, and any
  attached volumes, but this also happens automatically when your code drops the
  last reference to the sandbox or the configured duration elapses.

## Extending the lifetime of a sandbox

Coming soon.

## Related APIs

- [`Sandbox.create()`](./create.md) – pass the `lifetime` option when
  provisioning.
- `Sandbox.connect({ id })` – resume control of a duration-based sandbox.
- `Sandbox.kill()` – terminate early.
- [`Expose HTTP`](./expose_http.md) and [`Expose SSH`](./expose_ssh.md) – note
  that their URLs/credentials die with the sandbox lifetime.
