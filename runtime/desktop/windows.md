---
last_modified: 2026-06-24
title: "Windows"
description: "Create and manage native windows with Deno.BrowserWindow: lifecycle, multiple windows, sizing, navigation, keyboard / mouse / focus events, and native window handles."
---

:::info Coming in Deno 2.9

`deno desktop` ships in Deno v2.9.0 and is not in a stable release yet. To try
it now, run `deno upgrade canary` to install the
[`canary`](/runtime/reference/cli/upgrade/) build. The command, configuration
keys, and TypeScript APIs may still change before the feature is stable.

:::

The [`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) class controls native
windows. A window opens automatically when your binary starts and is navigated
to your local [HTTP server](/runtime/desktop/serving/). The **first**
`new Deno.BrowserWindow()` you construct adopts that initial window; every
construction after that opens a new one. All windows share the same Deno
runtime: there is one async runtime per process, regardless of how many windows
are open.

## Creating windows

```ts
// The first construction adopts the implicit startup window.
const win = new Deno.BrowserWindow({ title: "My App" });

// Subsequent constructions open additional windows.
const base = Deno.env.get("DENO_SERVE_ADDRESS")!; // "tcp:127.0.0.1:<port>"
const port = base.split(":").pop();

const settings = new Deno.BrowserWindow({
  title: "Settings",
  width: 420,
  height: 320,
});
settings.navigate(`http://127.0.0.1:${port}/settings`);
```

The constructor accepts a `BrowserWindowOptions` object:

| Option                | Type      | Default | Notes                                                                   |
| --------------------- | --------- | ------- | ----------------------------------------------------------------------- |
| `title`               | `string`  | none    | Window title.                                                           |
| `width`               | `number`  | `800`   | Initial width in logical pixels.                                        |
| `height`              | `number`  | `600`   | Initial height in logical pixels.                                       |
| `x`, `y`              | `number`  | none    | Initial position; centered if omitted.                                  |
| `resizable`           | `boolean` | `true`  | Whether the user can resize the window.                                 |
| `alwaysOnTop`         | `boolean` | `false` | Keep the window above others.                                           |
| `frameless`           | `boolean` | `false` | Remove the title bar and window chrome. Creation-only.                  |
| `noActivate`          | `boolean` | `false` | Floating, non-activating panel that doesn't steal focus. Creation-only. |
| `transparentTitlebar` | `boolean` | `false` | Blend the title bar into the content. Creation-only.                    |

`new Deno.BrowserWindow()` opens (or adopts) a window immediately. The window is
alive until `close()` is called or the user closes it from the OS.

`frameless`, `noActivate`, and `transparentTitlebar` can only be set at creation
time. `frameless` + `noActivate` together are the building blocks for tray /
menu-bar popovers; see [`Tray.attachPanel`](/runtime/desktop/tray_and_dock/).

Multiple windows are independent: each has its own size, position, focus state,
and webview. They can navigate to different paths or different origins, set
their own bindings, and emit their own events.

## Lifecycle

```ts
win.show();
win.hide();
win.focus();
win.close(); // sends close request, fires "close" event
win.reload(); // reload the webview's current document

if (win.isClosed()) { /* … */ }
if (win.isVisible()) { /* … */ }
```

Each window has a stable numeric id:

```ts
console.log(win.windowId);
```

Closing a window does not stop the runtime; the process keeps running until all
windows are closed (or you call [`Deno.exit()`](/api/deno/~/Deno.exit)).

## Size and position

```ts
const [w, h] = win.getSize();
win.setSize(800, 600);

const [x, y] = win.getPosition();
win.setPosition(100, 100);

if (win.isResizable()) { /* … */ }
win.setResizable(false);

if (win.isAlwaysOnTop()) { /* … */ }
win.setAlwaysOnTop(true);
```

Sizes are in logical pixels. The OS handles HiDPI scaling.

Window size and position are not persisted by Deno. Some operating systems or
window managers may remember a window's placement, but this behavior is not
portable and should not be relied on. If your app should reopen where the user
left it, store the values from `getSize()` / `getPosition()` in app-owned
configuration, then pass `width`, `height`, `x`, and `y` when constructing the
window on startup.

## Title

```ts
win.setTitle("My App: Untitled");
```

Use a stable prefix plus a document-specific suffix; this is what users see in
window switchers, the dock, and the taskbar.

## Navigation

```ts
const port = Deno.env.get("DENO_SERVE_ADDRESS")!.split(":").pop();
win.navigate(`http://127.0.0.1:${port}`);
```

Navigation works with any URL the embedded webview can load, most commonly the
local HTTP server (see [HTTP serving](/runtime/desktop/serving/)), but also
`https://` URLs, `file://` URLs, and `data:` URLs.

For multi-page apps, use the local HTTP server's routing rather than swapping
windows. For modal dialogs, prefer creating a child window over navigating away.

## Events

[`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) is an `EventTarget`.
Listen with `addEventListener` or assign to the matching `on<event>` property.

```ts
win.addEventListener("resize", (e) => {
  console.log("resized to", e.detail.width, e.detail.height);
});

win.onfocus = () => console.log("focused");
win.onblur = () => console.log("blurred");
```

| Event              | When it fires                                   |
| ------------------ | ----------------------------------------------- |
| `resize`           | The window's size changed.                      |
| `move`             | The window's position changed.                  |
| `focus`            | The window gained focus.                        |
| `blur`             | The window lost focus.                          |
| `close`            | The user requested the window close.            |
| `keydown`          | A key was pressed while the window was focused. |
| `keyup`            | A key was released.                             |
| `mousemove`        | The pointer moved over the window.              |
| `mouseenter`       | The pointer entered the window.                 |
| `mouseleave`       | The pointer left the window.                    |
| `mousedown`        | A mouse button was pressed.                     |
| `mouseup`          | A mouse button was released.                    |
| `click`            | A mouse click landed on the window.             |
| `dblclick`         | A double-click landed on the window.            |
| `wheel`            | A scroll wheel / trackpad scroll happened.      |
| `menuclick`        | An application-menu item was clicked.           |
| `contextmenuclick` | A context-menu item was clicked.                |

The pointer and keyboard events mirror their browser equivalents
(`KeyboardEvent`, `MouseEvent`, `WheelEvent`). `resize`, `move`, `menuclick`,
and `contextmenuclick` are `CustomEvent`s carrying a `detail` payload; see
[Menus](/runtime/desktop/menus/) for the menu events.

```ts
win.addEventListener("keydown", (e) => {
  if (e.key === "Escape") win.close();
});
```

## Running JavaScript in the webview

```ts
const result = await win.executeJs(
  "document.querySelectorAll('li').length",
);
console.log(result); // number of <li> on the current page
```

`executeJs` runs the code in the webview's main world and resolves with the
result. The value crosses a realm boundary, so it must be JSON-serializable; if
the script throws, the returned promise rejects with the thrown value.

For richer Deno ↔ webview communication, use
[bindings](/runtime/desktop/bindings/) instead.

## Native window handle

```ts
const surface = win.getNativeWindow();
```

`getNativeWindow()` wraps the window's native surface as a
[`Deno.UnsafeWindowSurface`](/api/deno/~/Deno.UnsafeWindowSurface) so you can
render to it with WebGPU. Request a GPU adapter first; the call throws if there
is no active WebGPU context:

```ts
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter!.requestDevice();
const surface = win.getNativeWindow();
const context = surface.getContext("webgpu");
// configure `context` with `device` and draw…
```

Once a surface has been taken, `close()` is downgraded to `hide()` so the native
handles backing the surface are not destroyed out from under WebGPU.

## DevTools

```ts
win.openDevtools(); // both isolates
win.openDevtools({ deno: false }); // renderer only
win.openDevtools({ renderer: false }); // Deno runtime only
```

See [DevTools](/runtime/desktop/devtools/).

## Closing the app

The runtime exits when no windows are open and there are no other live async
tasks (timers, pending fetches, etc.). To exit explicitly:

```ts
Deno.exit(0);
```

To prevent close (for example, to show a "Save?" dialog), listen for `close` and
call `event.preventDefault()`:

```ts
win.addEventListener("close", async (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    const ok = await win.executeJs("confirm('Discard changes?')");
    if (ok) win.close();
  }
});
```
