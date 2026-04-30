---
title: "Bindings"
description: "Call Deno-side functions from webview JavaScript via win.bind() — type-safe RPC over in-process channels, no IPC, no serialization tax beyond the call boundary."
---

`win.bind(name, handler)` exposes a Deno-side function to the webview. From the
webview, call it as `bindings.<name>(args)` — the call returns a `Promise` that
resolves with the handler's return value.

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
group (WebView). Calls go through `tokio::sync::mpsc` channels and `oneshot`
channels for responses; the WEF capi layer dispatches via a notify / poll
pattern in `wef::run()`.

This avoids the serialization round-trip that socket-based IPC frameworks
(Electron's `ipcMain` / `ipcRenderer`, Tauri's `invoke`) impose. Argument
encoding still happens — values cross a JS realm boundary, so they go through
the V8 serializer — but no socket, no JSON-over-pipe, no cross-process
scheduling.

In practical terms: bindings are fast enough that you do not need to worry about
call frequency for typical app workloads.

## The webview proxy

`bindings` on the webview side is a `Proxy`. Any property access creates a
function on demand:

```js
bindings.foo; // function
bindings.foo("a", 1); // Promise<unknown>
```

The proxy does not validate names — typing `bindings.readSetings` instead of
`bindings.readSettings` does not throw at the property access; it throws when
you call it (the call rejects with a "binding not registered" error).

## Argument and return value semantics

Arguments are serialized with the V8 structured-clone algorithm, the same one
used by `postMessage`. This means:

- Plain objects, arrays, strings, numbers, booleans, `null`, `undefined`: fine.
- Typed arrays, `ArrayBuffer`, `Date`, `Map`, `Set`, `RegExp`: fine.
- Functions, DOM nodes, prototypes: not transferable — clone them as data before
  sending.
- Cyclic references: fine.
- Errors: serialized as `{ name, message, stack }`. The Deno side receives a
  plain object, not an `Error` instance.

Return values follow the same rules.

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

A handler that throws — synchronously or via a rejected promise — causes the
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

The error reaches the webview as a structured-cloned `{ name, message,
stack }`.
To distinguish error types, check `error.name`.

## Unbinding

```ts
win.unbind("readSettings");
```

Removes the binding. Subsequent `bindings.readSettings()` calls reject.

## Permissions

Bindings run inside the Deno runtime, so they inherit the process's permissions.
A binding that calls `Deno.readTextFile` requires `--allow-read` to have been
granted at startup. The webview cannot escalate the runtime's permissions
through bindings.

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

const main = Deno.BrowserWindow.main;
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

| Electron                                            | `deno desktop`                                 |
| --------------------------------------------------- | ---------------------------------------------- |
| `ipcMain.handle('channel', (e, ...args) => result)` | `win.bind('channel', (...args) => result)`     |
| `ipcRenderer.invoke('channel', ...args)`            | `bindings.channel(...args)`                    |
| `contextBridge.exposeInMainWorld('api', {...})`     | Not needed — `bindings` is exposed by default. |

The `event` object Electron passes as the first arg has no equivalent because
there is no separate process to attribute the call to. Per-window context lives
on the `win` you registered the binding on.
