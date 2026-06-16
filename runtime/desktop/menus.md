---
last_modified: 2026-06-16
title: "Menus"
description: "Build native application menu bars and right-click context menus, with submenus, accelerators, separators, checkboxes, and click events."
---

:::info Coming in Deno 2.9

`deno desktop` ships in Deno v2.9.0 and is not in a stable release yet. To try
it now, run `deno upgrade canary` to install the
[`canary`](/runtime/reference/cli/upgrade/) build. The command, configuration
keys, and TypeScript APIs may still change before the feature is stable.

:::

`deno desktop` exposes two kinds of native menus: the **application menu**
(macOS menu bar, Windows / Linux window menu) and **context menus** (right-click
popups).

Both use the same [`Deno.MenuItem`](/api/deno/~/Deno.MenuItem) type.

## `MenuItem` shape

`MenuItem` is a tagged union: each entry is one of four shapes:

```ts
type MenuItem =
  // A clickable item.
  | {
    item: {
      label: string;
      id?: string; // returned in the click event
      accelerator?: string; // e.g. "CmdOrCtrl+S", "F11"
      enabled: boolean;
    };
  }
  // A nested submenu.
  | {
    submenu: {
      label: string;
      items: MenuItem[];
    };
  }
  // A divider line.
  | "separator"
  // A standard OS role (see below).
  | { role: { role: string } };
```

A top-level menu is an array of these. Items nest by putting more `MenuItem`s
inside a `submenu`'s `items`.

## Application menu

Set the menu shown in the macOS menu bar (or the Windows / Linux window menu)
for a window:

```ts
win.setApplicationMenu([
  {
    submenu: {
      label: "File",
      items: [
        {
          item: {
            label: "New",
            id: "new",
            accelerator: "CmdOrCtrl+N",
            enabled: true,
          },
        },
        {
          item: {
            label: "Open…",
            id: "open",
            accelerator: "CmdOrCtrl+O",
            enabled: true,
          },
        },
        "separator",
        {
          item: {
            label: "Save",
            id: "save",
            accelerator: "CmdOrCtrl+S",
            enabled: true,
          },
        },
        { role: { role: "quit" } },
      ],
    },
  },
  {
    submenu: {
      label: "Edit",
      items: [
        { role: { role: "undo" } },
        { role: { role: "redo" } },
        "separator",
        { role: { role: "cut" } },
        { role: { role: "copy" } },
        { role: { role: "paste" } },
      ],
    },
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
  }
});
```

`e.detail.id` is the `id` you set on an `item`. Items without an `id`, and
`role` items (which the OS handles directly), do not produce `menuclick` events.

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

### Roles

A `{ role: { role } }` item maps to a standard OS menu command: the platform
provides the label, accelerator, and behavior. Use roles for the conventional
commands so they behave natively (and so macOS wires up the standard Edit-menu
keyboard shortcuts):

```ts
const quit: Deno.MenuItem = { role: { role: "quit" } };
const copy: Deno.MenuItem = { role: { role: "copy" } };
const paste: Deno.MenuItem = { role: { role: "paste" } };
```

Common roles include `quit`, `undo`, `redo`, `cut`, `copy`, `paste`,
`selectAll`, `minimize`, and `close`. A role item needs no `id` and never fires
a `menuclick` event; the OS handles it directly.

### macOS menu bar peculiarities

On macOS, the **first** top-level submenu is the application menu (the one with
your app's name), and its label is replaced with the app name. Put the standard
app roles (such as `quit`) there. If you do not provide one, a default is
generated.

The Edit menu's standard items (Cut, Copy, Paste, Select All, Undo, Redo) work
natively when you include them as `role` items.

## Context menus

Show a context menu at a screen position with `showContextMenu(x, y, menu)`:

```ts
const contextMenu: Deno.MenuItem[] = [
  { item: { label: "Copy", id: "copy", enabled: true } },
  { item: { label: "Paste", id: "paste", enabled: true } },
  "separator",
  { item: { label: "Properties…", id: "props", enabled: true } },
];

// Trigger from a right-click. The webview may not forward the browser
// `contextmenu` event, so handle the secondary mouse button on the window.
win.addEventListener("mousedown", (e) => {
  if (e.button === 2) {
    win.showContextMenu(e.clientX, e.clientY, contextMenu);
  }
});

win.addEventListener("contextmenuclick", (e) => {
  if (e.detail.id === "copy") { /* ... */ }
  if (e.detail.id === "paste") { /* ... */ }
});
```

Context-menu clicks arrive as `contextmenuclick` events, while application-menu
clicks arrive as `menuclick`, so you don't need to namespace ids to tell them
apart.

## Dynamic menus

The application menu can be replaced at any time by calling `setApplicationMenu`
again, and the OS replaces the menu in place. There is no "update single item"
API; rebuild the array and call `setApplicationMenu` when state changes:

```ts
function rebuildEditMenu(canUndo: boolean) {
  win.setApplicationMenu([
    {
      submenu: {
        label: "Edit",
        items: [
          {
            item: {
              label: "Undo",
              id: "undo",
              accelerator: "CmdOrCtrl+Z",
              enabled: canUndo,
            },
          },
        ],
      },
    },
  ]);
}
```

For frequently-updated menus (every keystroke), batch updates rather than
calling on every change.

## Disabled and hidden items

Set `enabled: false` to gray out an item:

```ts
const save: Deno.MenuItem = {
  item: { label: "Save", id: "save", enabled: false },
};
```

There is no `visible` flag. To hide an item, exclude it from the array and call
`setApplicationMenu` again.
