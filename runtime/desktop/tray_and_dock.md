---
last_modified: 2026-06-16
title: "Tray and dock"
description: "Add icons to the OS status area and the macOS dock: tooltips, dark-mode variants, click events, and right-click context menus."
---

:::info Coming in Deno 2.9

`deno desktop` ships in Deno v2.9.0 and is not in a stable release yet. To try
it now, run `deno upgrade canary` to install the
[`canary`](/runtime/reference/cli/upgrade/) build. The command, configuration
keys, and TypeScript APIs may still change before the feature is stable.

:::

[`Deno.Tray`](/api/deno/~/Deno.Tray) puts an icon in the system status area
(macOS menu bar extras, Windows system tray, Linux AppIndicator).
[`Deno.dock`](/api/deno/~/Deno.dock) is a singleton that controls the app's dock
/ taskbar presence: badge, bounce, visibility, and a custom menu.

Menus on both use the [`Deno.MenuItem`](/runtime/desktop/menus/) type.

## [`Deno.Tray`](/api/deno/~/Deno.Tray)

```ts
const icon = await Deno.readFile("./icons/tray.png");

const tray = new Deno.Tray();
tray.setIcon(icon);
tray.setTooltip("My App");

tray.setMenu([
  { item: { label: "Open", id: "open", enabled: true } },
  { item: { label: "Quit", id: "quit", enabled: true } },
]);

tray.addEventListener("menuclick", (e) => {
  if (e.detail.id === "open") win.show();
  if (e.detail.id === "quit") Deno.exit(0);
});
```

### Lifecycle

The icon stays in the status area until you call `tray.destroy()` (or the
process exits). Multiple trays can coexist, useful for app indicators that need
separate control surfaces.

```ts
tray.destroy();
```

`Tray` is also a `Disposable`, so it works with `using`:

```ts
{
  using tray = new Deno.Tray();
  // ...
} // automatically destroyed at scope exit
```

### Setting the icon

```ts
tray.setIcon(pngBytes); // bytes, not a path
tray.setIconDark(darkPngBytes); // optional dark-mode variant
tray.setIconDark(null); // clear the dark icon
```

Pass PNG-encoded bytes, not a file path. Read the file yourself:

```ts
const png = await Deno.readFile("./icons/tray.png");
tray.setIcon(png);
```

Provide a separate dark-mode icon via `setIconDark` if you want different
contrast for dark menu bars (macOS 10.14+, modern Linux). Without one, the same
icon is used in both modes.

For best results, use a **template image** style (mostly opaque silhouette,
transparent elsewhere) at a small size: 22×22 logical pixels for macOS, 16×16
for Windows.

### Tooltip

```ts
tray.setTooltip("My App: 3 unread");
tray.setTooltip(null); // remove tooltip
```

### Context menu

Right-click on the tray icon opens the menu set by `setMenu`. The items are the
same [`Deno.MenuItem`](/runtime/desktop/menus/) shape used by application and
context menus:

```ts
tray.setMenu([
  { item: { label: "Open", id: "open", enabled: true } },
  "separator",
  {
    item: {
      label: "Settings…",
      id: "settings",
      accelerator: "CmdOrCtrl+,",
      enabled: true,
    },
  },
  "separator",
  {
    item: {
      label: "Quit",
      id: "quit",
      accelerator: "CmdOrCtrl+Q",
      enabled: true,
    },
  },
]);

tray.addEventListener("menuclick", (e) => {
  switch (e.detail.id) {
    case "open":
      win.show();
      break;
    case "settings":
      showSettings();
      break;
    case "quit":
      Deno.exit(0);
      break;
  }
});

tray.setMenu(null); // remove the menu without destroying the tray
```

Submenus work the same as in the application menu.

### Click events

```ts
tray.addEventListener("click", () => win.show());
tray.addEventListener("dblclick", () => openSettings());
```

`click` fires on a primary-button click. `dblclick` fires on a double-click. On
platforms where right-click is reserved for the context menu (everywhere), only
left-click produces these events.

### Popover panels

For the classic menu-bar-app pattern, click the tray icon to toggle a small
floating window anchored under it, then use `attachPanel()`:

```ts
const tray = new Deno.Tray();
tray.setIcon(await Deno.readFile("./icons/tray.png"));

const panel = tray.attachPanel({
  url: `http://127.0.0.1:${port}/panel`,
  width: 360,
  height: 480,
});

panel.window.bind("doThing", async () => {/* … */});
```

The returned [`Deno.TrayPanel`](/api/deno/~/Deno.TrayPanel) toggles on tray
click, is positioned under the icon, and hides when it loses focus. Pass a
string as shorthand for `{ url }`. `TrayPanelOptions` also accepts `hideOnBlur`
(default `true`) and a `position` callback to override placement (e.g. for a
bottom-edge taskbar).

```ts
panel.show();
panel.hide();
panel.toggle();
console.log(panel.visible);
panel.destroy(); // detach and close the panel window
panel.window; // the underlying BrowserWindow: bind(), executeJs(), etc.
```

The panel is a convenience built on the primitives. For full control, create a
`frameless` + `noActivate` [`BrowserWindow`](/runtime/desktop/windows/) yourself
and position it with `Tray.getBounds()`:

```ts
const bounds = tray.getBounds(); // { x, y, width, height } | null
if (bounds) {
  popover.setPosition(bounds.x, bounds.y + bounds.height);
  popover.show();
}
```

`getBounds()` returns the icon's screen rectangle, or `null` when the platform
can't report it. On Linux the icon position can't be queried, so an attached
panel shows at its last position rather than anchored to the icon.

### Platform support

Tray icons rely on the OS providing a status area. The relevant backends support
tray on:

- **macOS**: status menu items (NSStatusItem).
- **Windows**: system tray (NotifyIcon).
- **Linux**: AppIndicator / KStatusNotifierItem. Requires a desktop environment
  that surfaces them. Most do, but some minimal i3 setups need extras like
  `swaync` or `polybar` configuration.

If the backend cannot create a tray icon, the constructor's underlying `trayId`
is `0` and subsequent calls are no-ops (silently). Check `tray.trayId !== 0` if
you need to fall back gracefully.

## [`Deno.dock`](/api/deno/~/Deno.dock)

[`Deno.dock`](/api/deno/~/Deno.dock) is a singleton exposing the app's dock /
taskbar controls. The methods are cross-platform but their effect varies:
macOS-only operations are no-ops on Windows and Linux (they fail gracefully
rather than throwing).

### Badge

```ts
Deno.dock.setBadge("3"); // short text on the dock / taskbar icon
Deno.dock.setBadge(null); // clear (null or empty string)
```

Sets a text badge on the dock icon (macOS) or taskbar icon (Windows); on Linux
it prefixes the focused window's title. Badges are short, typically a count; the
OS truncates long strings.

### Bounce

```ts
Deno.dock.bounce(); // single bounce / flash
Deno.dock.bounce(true); // bounce continuously until the app is focused
```

Bounces the dock icon (macOS), flashes the taskbar button (Windows), or sets the
urgency hint on the focused window (Linux). The optional `critical` argument
(default `false`) controls whether it bounces once or continuously.

### Visibility

```ts
Deno.dock.setVisible(false); // remove the app from the dock
Deno.dock.setVisible(true); // restore it
```

macOS only; controls the app's activation policy. A hidden app does not appear
in the dock or the Cmd-Tab switcher, which is what you want for a menu-bar-only
app. The application keeps running and can still show windows; users reach it
via Spotlight or the tray icon. No-op on Windows and Linux.

### Menu

```ts
Deno.dock.setMenu([
  { item: { label: "New Window", id: "new", enabled: true } },
  { item: { label: "Quit", id: "quit", enabled: true } },
]);
Deno.dock.setMenu(null); // remove the menu

Deno.dock.addEventListener("menuclick", (e) => {
  if (e.detail.id === "quit") Deno.exit(0);
});
```

macOS only; a custom right-click menu on the dock icon. Clicks are delivered as
`menuclick` events on [`Deno.dock`](/api/deno/~/Deno.dock).

### Reopen event

On macOS, clicking the dock icon while the app has no visible windows fires a
`reopen` event. The default "show the last hidden window" behavior is swallowed,
so you decide what to do:

```ts
Deno.dock.addEventListener("reopen", (e) => {
  if (!e.detail.hasVisibleWindows) win.show();
});
```

## Pattern: tray-only background app

To run as a status-bar-only background process (no dock, no main window):

```ts
Deno.dock.setVisible(false); // macOS: hide the app from the dock
win.hide(); // hide the implicit startup window

const tray = new Deno.Tray();
tray.setIcon(await Deno.readFile("./icons/tray.png"));
tray.setTooltip("My App");
tray.setMenu([
  { item: { label: "Show window", id: "show", enabled: true } },
  { item: { label: "Quit", id: "quit", enabled: true } },
]);

tray.addEventListener("menuclick", (e) => {
  if (e.detail.id === "show") win.show();
  if (e.detail.id === "quit") Deno.exit(0);
});
```

The startup window is created when your binary launches; hiding it keeps it
ready to be shown without a startup delay later.
