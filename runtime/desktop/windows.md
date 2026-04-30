---
title: "Windows"
description: "Create and manage native windows with Deno.BrowserWindow — lifecycle, multiple windows, sizing, navigation, keyboard / mouse / focus events, and native window handles."
---

The `Deno.BrowserWindow` class controls native windows. The first window opens
automatically when your binary starts; create more by constructing
`new Deno.BrowserWindow()`. All windows share the same Deno runtime — there is
one tokio runtime per process, regardless of how many windows are open.

## Creating windows

```ts
const main = Deno.BrowserWindow.main; // the implicit main window

const settings = new Deno.BrowserWindow();
settings.setTitle("Settings");
settings.setSize(420, 320);
settings.navigate(
  "http://127.0.0.1:" + Deno.env.get("DENO_SERVE_ADDRESS") + "/settings",
);
```

`new Deno.BrowserWindow()` opens a window immediately. The window is alive until
`close()` is called or the user closes it from the OS.

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

if (win.isClosed) { /* … */ }
if (win.isVisible) { /* … */ }
```

Closing a window does not stop the runtime — the process keeps running until all
windows are closed (or you call `Deno.exit()`).

## Size and position

```ts
const [w, h] = win.getSize();
win.setSize(800, 600);

const [x, y] = win.getPosition();
win.setPosition(100, 100);

if (win.isResizable) { /* … */ }
win.setResizable(false);

if (win.isAlwaysOnTop) { /* … */ }
win.setAlwaysOnTop(true);
```

Sizes are in logical pixels. The OS handles HiDPI scaling.

## Title

```ts
win.setTitle("My App — Untitled");
```

Use a stable prefix plus a document-specific suffix; this is what users see in
window switchers, the dock, and the taskbar.

## Navigation

```ts
win.navigate("http://127.0.0.1:" + port);
```

Navigation works with any URL the embedded webview can load — most commonly the
local HTTP server (see [HTTP serving](/runtime/desktop/serving/)), but also
`https://` URLs, `file://` URLs, and `data:` URLs.

For multi-page apps, use the local HTTP server's routing rather than swapping
windows. For modal dialogs, prefer creating a child window over navigating away.

## Events

`Deno.BrowserWindow` is an `EventTarget`. Listen with `addEventListener` or
assign to the matching `on<event>` property.

```ts
win.addEventListener("resize", (e) => {
  console.log("resized to", e.width, e.height);
});

win.onfocus = () => console.log("focused");
win.onblur = () => console.log("blurred");
```

| Event       | When it fires                                   |
| ----------- | ----------------------------------------------- |
| `resize`    | The window's size changed.                      |
| `move`      | The window's position changed.                  |
| `focus`     | The window gained focus.                        |
| `blur`      | The window lost focus.                          |
| `close`     | The user requested the window close.            |
| `keydown`   | A key was pressed while the window was focused. |
| `keyup`     | A key was released.                             |
| `mousemove` | The pointer moved over the window.              |
| `mousedown` | A mouse button was pressed.                     |
| `mouseup`   | A mouse button was released.                    |
| `click`     | A mouse click landed on the window chrome.      |
| `wheel`     | A scroll wheel / trackpad scroll happened.      |

The event objects mirror the browser equivalents (`KeyboardEvent`, `MouseEvent`,
`WheelEvent`) where applicable.

```ts
win.addEventListener("keydown", (e) => {
  if (e.key === "Escape") win.close();
});
```

## Running JavaScript in the webview

```ts
const result = await win.executeJs<number>(
  "document.querySelectorAll('li').length",
);
console.log(result); // number of <li> on the current page
```

`executeJs` runs the code in the webview's main world and returns the result.
The result must be JSON-serializable.

For richer Deno ↔ webview communication, use
[bindings](/runtime/desktop/bindings/) instead.

## Native window handle

```ts
const handle = win.getNativeWindow();
```

Returns the platform-native handle (`NSWindow*` on macOS, `HWND` on Windows, the
X11 / Wayland handle on Linux). Use this to integrate with platform APIs that
need a window handle — for example, native graphics overlays, drag sources, or
accessibility APIs.

`getNativeWindow()` returns a `Deno.UnsafePointer`. You are responsible for
calling the right platform APIs and not retaining the handle past the window's
lifetime.

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

To prevent close — for example, to show a "Save?" dialog — listen for `close`
and call `event.preventDefault()`:

```ts
win.addEventListener("close", async (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    const ok = await win.executeJs<boolean>("confirm('Discard changes?')");
    if (ok) win.close();
  }
});
```
