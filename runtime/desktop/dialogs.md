---
title: "Dialogs"
description: "prompt(), alert(), and confirm() show native popup dialogs in deno desktop apps instead of terminal prompts."
---

The familiar browser globals `prompt()`, `alert()`, and `confirm()` work inside
`deno desktop` apps — but instead of reading from the terminal, they show
**native popup dialogs**.

This makes desktop apps feel native without any platform-specific code, and
keeps the same API you would write for a browser-side script.

## `alert(message)`

Shows a modal dialog with an OK button. Returns `void`.

```ts
alert("Save complete.");
```

The current window is the parent — clicking outside the dialog does not dismiss
it; the user must click OK.

## `confirm(message)`

Shows a modal dialog with OK and Cancel. Returns `boolean` — `true` for OK,
`false` for Cancel.

```ts
if (confirm("Discard unsaved changes?")) {
  await closeDocument();
}
```

## `prompt(message, defaultValue?)`

Shows a modal dialog with a text input plus OK and Cancel. Returns the entered
string, or `null` if the user cancelled.

```ts
const name = prompt("New document name:", "Untitled");
if (name !== null) {
  await createDocument(name);
}
```

## When they fire

These functions block the calling code (synchronously) until the user responds.
They run **on the Deno runtime thread**, not the webview — so they do not freeze
the rendered UI, but they do pause your handler.

```ts
win.addEventListener("menuclick", (e) => {
  if (e.detail.id === "delete") {
    if (confirm("Really delete?")) {
      // … do the deletion
    }
  }
});
```

If you call them from the webview side (via JavaScript inside the rendered
page), the webview's own native dialogs are used instead — these are
`window.alert()` and friends as the browser implements them. The behavior is
similar: a native modal scoped to that webview.

## Differences from terminal Deno

In a normal `deno run` script, these functions read from / write to the terminal
— `prompt` reads a line of stdin, `confirm` accepts `y` / `n`. That terminal
behavior would be invisible inside a desktop app, so `deno desktop` swaps them
out for native dialogs without any code change on your part.

## File and folder dialogs

Native file-picker and folder-picker dialogs are not yet exposed as a
first-class API. Until they are, two workarounds exist:

1. **Use the webview's `<input type="file">`**. The webview shows the OS-native
   picker, and the resulting `File` object can be sent over a binding for the
   Deno side to handle:

   ```html
   <input id="f" type="file" accept=".json">
   <script>
     document.getElementById("f").addEventListener("change", async (e) => {
       const file = e.target.files[0];
       await bindings.handleFile(file.name, await file.arrayBuffer());
     });
   </script>
   ```

   ```ts
   win.bind("handleFile", async (name, bytes) => {
     await Deno.writeFile(name + ".bak", new Uint8Array(bytes));
   });
   ```

2. **Drag-and-drop into the webview**. Drop a file onto a `<div>`, read it with
   the File API, and pass the bytes through a binding.

A native file-picker API is on the roadmap.

## Notification API

Notifications are not yet a Deno desktop API. Use the Web `Notification` API
from the webview side — it works in the embedded webview and looks native:

```js
new Notification("Build complete", { body: "Your binary is ready." });
```

## Clipboard

Same situation as notifications: use the Web `Clipboard` API
(`navigator.clipboard.readText()`, `writeText()`) from the webview side for now.
