---
title: "Menus"
description: "Build native application menu bars and right-click context menus, with submenus, accelerators, separators, checkboxes, and click events."
---

`deno desktop` exposes two kinds of native menus: the **application menu**
(macOS menu bar, Windows / Linux window menu) and **context menus** (right-click
popups).

Both use the same `MenuItem` shape.

## `MenuItem` shape

```ts
interface MenuItem {
  id?: string; // returned in the click event
  label: string;
  type?: "normal" | "separator" | "checkbox" | "submenu";
  enabled?: boolean;
  checked?: boolean; // for type: "checkbox"
  accelerator?: string; // e.g. "CmdOrCtrl+S", "F11"
  submenu?: MenuItem[]; // for type: "submenu"
}
```

Set `type: "separator"` for a divider; the `label` is ignored.

Set `type: "submenu"` and `submenu: [...]` for nested menus.

## Application menu

Set the menu shown in the macOS menu bar (or the Windows / Linux window menu)
for a window:

```ts
win.setApplicationMenu([
  {
    label: "File",
    type: "submenu",
    submenu: [
      { id: "new", label: "New", accelerator: "CmdOrCtrl+N" },
      { id: "open", label: "Open…", accelerator: "CmdOrCtrl+O" },
      { type: "separator", label: "" },
      { id: "save", label: "Save", accelerator: "CmdOrCtrl+S" },
      { id: "quit", label: "Quit", accelerator: "CmdOrCtrl+Q" },
    ],
  },
  {
    label: "View",
    type: "submenu",
    submenu: [
      {
        id: "fullscreen",
        label: "Full Screen",
        accelerator: "F11",
        type: "checkbox",
        checked: false,
      },
    ],
  },
]);
```

Listen for clicks via the `menuclick` event:

```ts
win.addEventListener("menuclick", (e) => {
  switch (e.detail.id) {
    case "new":
      newDocument();
      break;
    case "open":
      openDocument();
      break;
    case "save":
      saveDocument();
      break;
    case "quit":
      Deno.exit(0);
      break;
  }
});
```

`e.detail.id` is the `id` field you set on the item. Items without an `id` do
not produce events.

### Accelerators

Accelerators are global within the focused window. The string format is
`Modifier+Modifier+Key`:

| Modifier    | Notes                                       |
| ----------- | ------------------------------------------- |
| `Cmd`       | macOS only                                  |
| `Ctrl`      | All platforms                               |
| `CmdOrCtrl` | `Cmd` on macOS, `Ctrl` elsewhere            |
| `Alt`       | All platforms (`Option` on macOS keyboards) |
| `Shift`     | All platforms                               |
| `Super`     | The "Windows" / `Meta` key                  |

Keys are letters (`A`-`Z`), numbers (`0`-`9`), function keys (`F1`-`F24`), or
named keys (`Enter`, `Esc`, `Up`, `Down`, `Left`, `Right`, `Tab`, `Space`,
`Backspace`, `Delete`).

Use `CmdOrCtrl` rather than `Cmd` or `Ctrl` directly so you do not need to
branch on platform for the most common shortcuts.

### macOS menu bar peculiarities

On macOS, the **first** top-level menu item is the application menu (the one
with your app's name). If you do not provide one, it is generated automatically
with sensible defaults: About, Hide, Show All, Quit.

The "Edit" menu's standard items (Cut, Copy, Paste, Select All, Undo, Redo) are
wired automatically when you include an item with the matching `role`. (Roles
are not yet exposed in the API; users get default Cut / Copy / Paste behavior in
editable webview content for free, but native menu items pointing at them
require manual `executeJs` for now.)

## Context menus

Show a context menu on right-click:

```ts
win.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  win.showContextMenu([
    { id: "copy", label: "Copy" },
    { id: "paste", label: "Paste" },
    { type: "separator", label: "" },
    { id: "props", label: "Properties…" },
  ]);
});

win.addEventListener("menuclick", (e) => {
  if (e.detail.id === "copy") { /* ... */ }
  if (e.detail.id === "paste") { /* ... */ }
});
```

`showContextMenu` opens at the current pointer position. To open at a specific
point, pass coordinates:

```ts
win.showContextMenu(items, { x: 100, y: 200 });
```

The same `menuclick` event handles both application and context menu clicks. If
you need to distinguish them, namespace the IDs (e.g. `"file:save"` vs
`"ctx:copy"`) or set state before opening the context menu.

## Dynamic menus

The application menu can be replaced at any time by calling `setApplicationMenu`
again — the OS replaces the menu in place. There is no "update single item" API;
rebuild the array and call `setApplicationMenu` when state changes:

```ts
function rebuildEditMenu(canUndo: boolean) {
  win.setApplicationMenu([
    {
      label: "Edit",
      type: "submenu",
      submenu: [
        {
          id: "undo",
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          enabled: canUndo,
        },
      ],
    },
  ]);
}
```

For frequently-updated menus (every keystroke), batch updates rather than
calling on every change.

## Disabled and hidden items

```ts
{ id: "save", label: "Save", enabled: false }
```

There is no `visible: false` flag. To hide an item, exclude it from the array.

## Checkbox items

```ts
{ id: "fullscreen", type: "checkbox", label: "Full Screen", checked: true }
```

The check state is **not** toggled automatically when the user clicks. You must
update `checked` and call `setApplicationMenu` again, or manage your own state
and rebuild on the next click.
