---
title: "DevTools"
description: "Attach Chrome DevTools to a deno desktop app — single session shows both the Deno runtime V8 and the renderer V8 as inspectable targets."
---

`deno desktop` exposes **unified DevTools**: a single Chrome DevTools session
that attaches to both V8 isolates inside your app — the **Deno runtime** (your
handlers, bindings, top-level code) and the **renderer** (webview-side
JavaScript). One Console dropdown, one Sources panel with both threads, one
debugging session.

## Starting an inspector session

```sh
deno desktop --inspect main.ts
```

Then open `chrome://inspect` (or `edge://inspect`). The app appears as a target.
Click "inspect" — DevTools opens with both isolates attached.

Three flags control startup behavior:

| Flag             | Behavior                                                          |
| ---------------- | ----------------------------------------------------------------- |
| `--inspect`      | Listen for a debugger; the app starts running immediately.        |
| `--inspect-wait` | Wait for a debugger to attach before running any user code.       |
| `--inspect-brk`  | Wait for a debugger and break on the first line in both isolates. |

Default listen address is `127.0.0.1:9229`; pass `--inspect=host:port` to
override.

```sh
deno desktop --inspect=127.0.0.1:9230 main.ts
deno desktop --inspect-brk main.ts
deno desktop --inspect-wait main.ts
```

## What you see in DevTools

After attaching, the DevTools UI shows:

- **Sources** — both isolates appear in the **Threads** sidebar. Set
  breakpoints, step through, inspect the call stack on either side.
- **Console** — a **target dropdown** at the top of the panel switches between
  **Renderer** (the webview) and **Deno** (the runtime). Console output from
  each isolate is labelled.
- **Network** — requests originating from the webview (the webview's `fetch`,
  `XMLHttpRequest`, image loads). Requests made from the Deno side via `fetch`
  are not currently surfaced here.
- **Performance / Memory** — profile each isolate separately; switch via the
  same target dropdown.

Source maps are honored on both sides. TypeScript files in the Deno runtime show
up with their original line numbers; bundled webview JS maps back to its
original source if the bundler emits maps.

## Renderer-only or Deno-only sessions

If you only want to debug one side, use the per-target endpoints in the DevTools
target list, or use `Deno.BrowserWindow.openDevtools()` from your own code:

```ts
win.openDevtools(); // both isolates (default)
win.openDevtools({ deno: false }); // renderer only
win.openDevtools({ renderer: false }); // Deno runtime only
```

`openDevtools()` shows a DevTools window inside the app — useful for shipping a
debug build with built-in inspection without needing `chrome://inspect`.

## How it works

`deno desktop` runs a CDP (Chrome DevTools Protocol) **multiplexer** that fronts
both V8 inspectors:

```
             ┌──────────────────────────────────┐
DevTools     │  CDP Multiplexer (Deno CLI)      │
(one ws)  ◄─►│  /json/version  /json/list       │
             │  /unified  /deno  /cef           │
             └─────┬─────────────────┬──────────┘
                   │                 │
           Deno V8 inspector   Renderer V8 inspector
           (deno_core CDP)     (CEF remote-debugging)
```

The mux presents itself as one CDP "browser target" with two children: a "page"
target for the renderer and a "worker" target for the Deno runtime. DevTools'
built-in multi-target support handles the rest — the same mechanism it uses for
`iframe` and `worker` debugging on the open web.

No CDP protocol changes, no DevTools fork, no frontend modifications.

## Backend support

Unified DevTools is implemented for the **CEF** backend. On other backends:

| Backend   | DevTools status                                 |
| --------- | ----------------------------------------------- |
| `cef`     | Full unified DevTools.                          |
| `webview` | Not currently supported — system webviews speak |
|           | a different inspector protocol.                 |
| `raw`     | Deno-side `--inspect` only — there is no        |
|           | renderer to inspect.                            |
| `servo`   | Not currently supported.                        |

If `--inspect` is passed with a backend that does not support unified DevTools,
the Deno side still runs an inspector and you can attach to it the same way as a
normal `deno run --inspect` session.

## Debugging across the binding boundary

When a webview-side `bindings.foo()` call enters a Deno-side handler, the two
sides currently appear as separate stack traces. Cross-realm correlation —
automatically stitching a renderer call into the Deno handler stack — is on the
roadmap. Today, you can switch threads in the Sources panel to follow execution
manually.

A practical approach: tag both sides of a binding with matching console output
during development:

```ts
win.bind("readSettings", async () => {
  console.log("[bindings:readSettings] enter");
  const data = await readSettings();
  console.log("[bindings:readSettings] exit");
  return data;
});
```

In the unified Console, you see both lines under the "Deno" target, matched
against the renderer's `bindings.readSettings()` invocation visible under
"Renderer".

## Known limitations

- WebView and Servo backends have no DevTools integration.
- The renderer Network panel does not show Deno-side `fetch` calls.
- Cross-realm step-through (clicking a `bindings.foo()` call and stepping into
  the Deno handler) is not yet implemented — switch threads manually.
- `--inspect-brk` pauses both isolates before navigation. Resuming each one is
  independent — you may need to click "Resume" on each thread.
