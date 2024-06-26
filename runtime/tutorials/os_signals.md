---
title: "Handle OS Signals"
oldUrl:
  - /runtime/manual/examples/os_signals/
---

> ⚠️ Windows only supports listening for SIGINT and SIGBREAK as of Deno v1.23.

## Concepts

- [Deno.addSignalListener()](https://deno.land/api?s=Deno.addSignalListener) can
  be used to capture and monitor OS signals.
- [Deno.removeSignalListener()](https://deno.land/api?s=Deno.removeSignalListener)
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

```ts
/**
 * add_signal_listener.ts
 */
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

```ts
/**
 * signal_listeners.ts
 */
console.log("Press Ctrl-C to trigger a SIGINT signal");

const sigIntHandler = () => {
  console.log("interrupted!");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// Add a timeout to prevent process existing immediately.
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
