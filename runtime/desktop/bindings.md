---
last_modified: 2026-06-25
title: "Bindings"
description: "Call Deno-side functions from webview JavaScript via win.bind(): type-safe RPC over in-process channels, encoded at the boundary with no cross-process round-trip."
---

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

`win.bind(name, handler)` exposes a Deno-side function to the webview. From the
webview, call it as `bindings.<name>(args)`, and the call returns a `Promise`
that resolves with the handler's return value.

```ts title="Deno side"
win.bind("readSettings", async () => {
  const text = await Deno.readTextFile("settings.json");
  return JSON.parse(text);
});

win.bind("saveSettings", async (settings) => {
  await Deno.writeTextFile("settings.json", JSON.stringify(settings, null, 2));
});
```

```ts title="Webview side"
const settings = await bindings.readSettings();
settings.theme = "dark";
await bindings.saveSettings(settings);
```

## How it works

Bindings are **not** IPC. The Deno runtime and the rendering backend run as
threads / processes inside the same address space (CEF) or coordinated process
group (WebView). Calls go through in-process channels, and the backend
dispatches them from its run loop.

This avoids the cross-process round-trip that socket-based IPC frameworks
(Electron's `ipcMain` / `ipcRenderer`, Tauri's `invoke`) impose. Arguments and
results are still encoded as they cross the realm boundary, but the transport is
in-process: no socket, no cross-process scheduling.

In practical terms: bindings are fast enough that you do not need to worry about
call frequency for typical app workloads.

## The webview proxy

`bindings` on the webview side is a `Proxy`. Any property access creates a
function on demand:

```js
bindings.foo; // function
bindings.foo("a", 1); // Promise<unknown>
```

The proxy does not validate names: typing `bindings.readSetings` instead of
`bindings.readSettings` does not throw at the property access; it throws when
you call it (the call rejects because no such binding is registered).

## Argument and return value semantics

Arguments and return values are encoded as JSON as they cross between the
webview and the Deno runtime. This means:

- Plain objects, arrays, strings, numbers, booleans, and `null`: passed through
  as-is.
- `Uint8Array`: supported, for passing binary data.
- `undefined` and optional properties: dropped during serialization.
- `Date`, `Map`, `Set`, `RegExp`, typed arrays other than `Uint8Array`,
  `ArrayBuffer`: **not** preserved. Convert them to a JSON-compatible shape (a
  `Date` becomes a string, a `Map` becomes `{}`) before sending.
- Functions, DOM nodes, prototypes, and cyclic references: not transferable.
- Errors thrown by a handler: delivered to the webview as
  `{ name, message,
  stack }` (see [Errors](#errors) below), not as an `Error`
  instance.

Stick to plain data and `Uint8Array` on both sides.

## Async handlers

Handlers can be sync or async. The webview always sees a `Promise`:

```ts
win.bind("now", () => Date.now()); // sync
win.bind("delay", async (ms) => { // async
  await new Promise((r) => setTimeout(r, ms));
});
```

```ts
const t = await bindings.now();
await bindings.delay(500);
```

## Errors

A handler that throws, synchronously or via a rejected promise, causes the
webview-side call to reject:

```ts
win.bind("readFile", async (path) => {
  return await Deno.readTextFile(path);
});
```

```ts
try {
  await bindings.readFile("/missing");
} catch (e) {
  console.error(e); // NotFound: …
}
```

The error reaches the webview as a plain `{ name, message, stack }` object. To
distinguish error types, check `error.name`.

## Unbinding

```ts
win.unbind("readSettings");
```

Removes the binding. Subsequent `bindings.readSettings()` calls reject.

## Permissions

Bindings run inside the Deno runtime, so they inherit the process's permissions.
A binding that calls [`Deno.readTextFile`](/api/deno/~/Deno.readTextFile)
requires `--allow-read` to have been granted at startup. The webview cannot
escalate the runtime's permissions through bindings.

For desktop apps you typically run with broad permissions baked into the
compiled binary (`deno desktop` does not currently enforce a separate permission
prompt at runtime). If you expose bindings that act on the filesystem or
network, validate inputs as carefully as you would in any trust-boundary code.

## Per-window bindings

Bindings are per-window. A binding registered on `winA` is not callable from
`winB`'s webview. To share, register on each window:

```ts
function bindShared(win: Deno.BrowserWindow) {
  win.bind("now", () => Date.now());
  win.bind("readSettings", readSettings);
}

const main = new Deno.BrowserWindow(); // adopts the startup window
bindShared(main);

const settings = new Deno.BrowserWindow();
bindShared(settings);
```

## Type safety

There is no built-in type bridge between the Deno side's `win.bind()` and the
webview side's `bindings.<name>()`. The two sides are separate JS realms.

A small shared declaration file gives you both ends:

```ts title="bindings.d.ts"
export interface Bindings {
  readSettings(): Promise<Settings>;
  saveSettings(s: Settings): Promise<void>;
  now(): Promise<number>;
}

declare global {
  // Make `bindings` typed in the webview.
  const bindings: Bindings;
}

export interface Settings {
  theme: "light" | "dark";
}
```

Reference it from the webview's `tsconfig` / Deno project config and use the
same `Bindings` interface to type-check your `win.bind` calls. Mismatches
between the registration and the declaration will be caught at compile time on
the Deno side.

## Migrating from Electron

If you are coming from Electron's `ipcMain.handle('channel', handler)` /
`ipcRenderer.invoke('channel', ...)`, the mental model is identical:

| Electron                                            | `deno desktop`                                |
| --------------------------------------------------- | --------------------------------------------- |
| `ipcMain.handle('channel', (e, ...args) => result)` | `win.bind('channel', (...args) => result)`    |
| `ipcRenderer.invoke('channel', ...args)`            | `bindings.channel(...args)`                   |
| `contextBridge.exposeInMainWorld('api', {...})`     | Not needed; `bindings` is exposed by default. |

The `event` object Electron passes as the first arg has no equivalent because
there is no separate process to attribute the call to. Per-window context lives
on the `win` you registered the binding on.
