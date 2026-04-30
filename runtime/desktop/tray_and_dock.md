---
title: "Tray and dock"
description: "Add icons to the OS status area and the macOS dock — tooltips, dark-mode variants, click events, and right-click context menus."
---

`Deno.Tray` puts an icon in the system status area (macOS menu bar extras,
Windows system tray, Linux AppIndicator). `Deno.dock` controls the macOS dock
icon — badge, bounce, hide, and show.

## `Deno.Tray`

```ts
const icon = await Deno.readFile("./icons/tray.png");

const tray = new Deno.Tray();
tray.setIcon(icon);
tray.setTooltip("My App");

tray.setMenu([
  { id: "open", label: "Open" },
  { id: "quit", label: "Quit" },
]);

tray.addEventListener("menuclick", (e) => {
  if (e.detail.id === "open") Deno.BrowserWindow.main.show();
  if (e.detail.id === "quit") Deno.exit(0);
});
```

### Lifecycle

The icon stays in the status area until you call `tray.destroy()` (or the
process exits). Multiple trays can coexist — useful for app indicators that need
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
transparent elsewhere) at a small size — 22×22 logical pixels for macOS, 16×16
for Windows.

### Tooltip

```ts
tray.setTooltip("My App — 3 unread");
tray.setTooltip(null); // remove tooltip
```

### Context menu

Right-click on the tray icon opens the menu set by `setMenu`. The shape is the
same `MenuItem[]` used by
[application and context menus](/runtime/desktop/menus/):

```ts
tray.setMenu([
  { id: "open", label: "Open" },
  { type: "separator", label: "" },
  { id: "settings", label: "Settings…", accelerator: "CmdOrCtrl+," },
  { type: "separator", label: "" },
  { id: "quit", label: "Quit", accelerator: "CmdOrCtrl+Q" },
]);

tray.addEventListener("menuclick", (e) => {
  switch (e.detail.id) {
    case "open":
      showMain();
      break;
    case "settings":
      showSettings();
      break;
    case "quit":
      Deno.exit(0);
      break;
  }
});

tray.clearMenu(); // remove the menu without destroying the tray
```

Submenus and checkboxes work the same as in the application menu.

### Click events

```ts
tray.addEventListener("click", () => Deno.BrowserWindow.main.show());
tray.addEventListener("dblclick", () => openSettings());
```

`click` fires on a primary-button click. `dblclick` fires on a double-click. On
platforms where right-click is reserved for the context menu (everywhere), only
left-click produces these events.

### Platform support

Tray icons rely on the OS providing a status area. The relevant backends support
tray on:

- **macOS**: status menu items (NSStatusItem).
- **Windows**: system tray (NotifyIcon).
- **Linux**: AppIndicator / KStatusNotifierItem. Requires a desktop environment
  that surfaces them — most do, but some minimal i3 setups need extras like
  `swaync` or `polybar` configuration.

If the backend cannot create a tray icon, the constructor's underlying `trayId`
is `0` and subsequent calls are no-ops (silently). Check `tray.trayId !== 0` if
you need to fall back gracefully.

## `Deno.dock` (macOS)

`Deno.dock` is a single object exposing macOS dock controls. On Windows and
Linux, the same APIs exist but most are no-ops — they fail gracefully rather
than throwing.

### Badge

```ts
Deno.dock.setBadge("3"); // small label on the dock icon
Deno.dock.setBadge(null); // clear
```

Badges are short strings — typically a count. The OS truncates long strings.

### Bounce

```ts
Deno.dock.bounce("informational"); // gentle bounce
Deno.dock.bounce("critical"); // bounces until the app gains focus

Deno.dock.cancelBounce();
```

`"informational"` bounces once. `"critical"` bounces until cancelled or the app
gains focus.

### Visibility

```ts
Deno.dock.hide(); // remove the icon from the dock
Deno.dock.show(); // restore it
```

A hidden dock icon does not show the app in the dock or the Cmd-Tab switcher.
Use this for menu-bar-only apps that should not appear in the dock.

When hidden, the application still runs and can show windows; users can reach it
via Spotlight or the tray icon.

### Setting the dock image

```ts
const png = await Deno.readFile("./icons/dock.png");
Deno.dock.setIcon(png);

Deno.dock.setIcon(null); // restore the bundled icon
```

## Pattern: tray-only background app

To run as a status-bar-only background process (no dock, no main window):

```ts
Deno.dock.hide(); // macOS: hide the dock icon
Deno.BrowserWindow.main.hide(); // hide the implicit main window

const tray = new Deno.Tray();
tray.setIcon(await Deno.readFile("./icons/tray.png"));
tray.setTooltip("My App");
tray.setMenu([
  { id: "show", label: "Show window" },
  { id: "quit", label: "Quit" },
]);

tray.addEventListener("menuclick", (e) => {
  if (e.detail.id === "show") Deno.BrowserWindow.main.show();
  if (e.detail.id === "quit") Deno.exit(0);
});
```

The implicit main window is created when your binary starts; hiding it keeps it
ready to be shown without a startup delay later.
