---
last_modified: 2025-03-10
title: "Handle OS signals"
description: "Tutorial on handling operating system signals in Deno. Learn how to capture SIGINT and SIGBREAK events, manage signal listeners, and implement graceful shutdown handlers in your applications."
url: /examples/os_signals_tutorial/
oldUrl:
  - /runtime/manual/examples/os_signals/
  - /runtime/tutorials/os_signals/
---

> ⚠️ Windows supports listening for `SIGINT`, `SIGBREAK`, `SIGTERM`, and
> `SIGQUIT` (the latter two via libuv's Windows signal emulation).

## Concepts

- [Deno.addSignalListener()](https://docs.deno.com/api/deno/~/Deno.addSignalListener)
  can be used to capture and monitor OS signals.
- [Deno.removeSignalListener()](https://docs.deno.com/api/deno/~/Deno.removeSignalListener)
  can be used to stop watching the signal.

## Set up an OS signal listener

APIs for handling OS signals are modelled after already familiar
[`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
and
[`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
APIs.

> ⚠️ Note that listening for OS signals doesn't prevent event loop from
> finishing, ie. if there are no more pending async operations the process will
> exit.

You can use `Deno.addSignalListener()` function for handling OS signals:

```ts title="add_signal_listener.ts"
console.log("Press Ctrl-C to trigger a SIGINT signal");

Deno.addSignalListener("SIGINT", () => {
  console.log("interrupted!");
  Deno.exit();
});

// Add a timeout to prevent process exiting immediately.
setTimeout(() => {}, 5000);
```

Run with:

```shell
deno run add_signal_listener.ts
```

You can use `Deno.removeSignalListener()` function to unregister previously
added signal handler.

```ts title="signal_listeners.ts"
console.log("Press Ctrl-C to trigger a SIGINT signal");

const sigIntHandler = () => {
  console.log("interrupted!");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// Add a timeout to prevent process exiting immediately.
setTimeout(() => {}, 5000);

// Stop listening for a signal after 1s.
setTimeout(() => {
  Deno.removeSignalListener("SIGINT", sigIntHandler);
}, 1000);
```

Run with:

```shell
deno run signal_listeners.ts
```

## Windows support

The supported signal set differs between platforms. The Windows-specific
behavior is:

| Use case                         | Supported signals on Windows                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Deno.addSignalListener(sig, …)` | `SIGINT`, `SIGBREAK`, `SIGTERM`, `SIGQUIT`                                                                   |
| `Deno.kill(pid, sig)`            | `SIGINT`, `SIGBREAK`, `SIGTERM`, `SIGQUIT`, `SIGKILL`, `SIGABRT`, plus signal `0` for a process-health check |

`SIGKILL` and `SIGABRT` are deliberately **not** registerable via
`addSignalListener` — they're uncatchable / fatal, matching Unix semantics. On
Windows the catchable signals all forward to libuv's emulation layer; signals
sent via `Deno.kill` ultimately invoke `TerminateProcess`.
