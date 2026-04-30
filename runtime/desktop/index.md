---
title: "Desktop apps"
description: "Build self-contained desktop applications from a Deno project, with framework auto-detection, hot reload, native windowing, auto-update, and cross-platform distribution."
---

`deno desktop` turns a Deno project — anything from a single TypeScript file to
a Next.js app — into a self-contained desktop application. The output is a
redistributable binary that bundles your code, the Deno runtime, and a web
rendering engine into one bundle per platform.

:::info Experimental

`deno desktop` is new in Deno 2.8. The command, configuration keys, and
TypeScript APIs described in this section may change before the feature is
considered stable.

:::

## Why `deno desktop`

Web technology is the most widely-known UI toolkit in the world. Desktop apps
built on web stacks (Electron, Tauri, Electrobun) take advantage of that, but
each has tradeoffs you have to live with: huge binaries, missing platform
support, no JavaScript ecosystem, no built-in update story, no framework
integration.

`deno desktop` is opinionated about those tradeoffs:

- **Bundled engine, full Node compatibility.** The default backend is Chromium
  (CEF). Rendering is consistent across macOS, Windows, and Linux, and you still
  have the entire npm ecosystem available through Deno's Node compat layer.
- **Framework auto-detection.** Point `deno desktop` at a Next.js, Astro, Fresh,
  Remix, Nuxt, SvelteKit, SolidStart, TanStack Start, or Vite SSR project and it
  just works — production server in release mode, dev server with hot reload
  under `--hmr`. No code changes required to take an existing web project to the
  desktop.
- **In-process bindings instead of IPC.** Backend / UI communication goes
  through tokio channels, not socket-based IPC. No serialization tax between
  your Deno code and the webview.
- **Cross-compile from one machine.** The same machine can build for macOS,
  Windows, and Linux. Backends are downloaded as needed, not built locally.
- **Built-in binary-diff auto-update.** Ship a single `latest.json` manifest and
  bsdiff patches; the runtime polls, applies, and rolls back automatically on
  failed launches.

## Hello, desktop

Create a one-file desktop app:

```ts title="main.ts"
Deno.serve(() =>
  new Response("<h1>Hello, desktop</h1>", {
    headers: { "content-type": "text/html" },
  })
);
```

```sh
deno desktop main.ts
```

The compiled binary opens a window pointed at a local HTTP server bound to your
`Deno.serve()` handler. Run it directly:

```sh
./main      # macOS / Linux
.\main.exe  # Windows
```

`Deno.serve()` automatically binds to the address the webview navigates to — you
do not need to pass a port or hostname. See
[HTTP serving](/runtime/desktop/serving/) for details.

## What's in this section

- [Configuration](/runtime/desktop/configuration/) — the `desktop` block in
  `deno.json`.
- [Backends](/runtime/desktop/backends/) — CEF, webview, raw; how to choose.
- [HTTP serving](/runtime/desktop/serving/) — `Deno.serve()` integration and the
  serving model.
- [Frameworks](/runtime/desktop/frameworks/) — Next.js, Astro, Fresh, Remix,
  Nuxt, SvelteKit, and friends.
- [Windows](/runtime/desktop/windows/) — `Deno.BrowserWindow` lifecycle,
  multiple windows, events.
- [Bindings](/runtime/desktop/bindings/) — calling Deno code from the webview
  via `bindings.<name>()`.
- [Menus](/runtime/desktop/menus/) — application and context menus.
- [Tray and dock](/runtime/desktop/tray_and_dock/) — system status icons and the
  macOS dock.
- [Dialogs](/runtime/desktop/dialogs/) — `prompt()`, `alert()`, `confirm()` as
  native popups.
- [Hot module replacement](/runtime/desktop/hmr/) — `--hmr` for framework and
  non-framework apps.
- [DevTools](/runtime/desktop/devtools/) — unified DevTools attached to both the
  Deno runtime and the webview.
- [Auto-update](/runtime/desktop/auto_update/) — `Deno.autoUpdate()`, manifests,
  bsdiff, rollback.
- [Error reporting](/runtime/desktop/error_reporting/) — capturing uncaught
  exceptions and panics.
- [Distribution](/runtime/desktop/distribution/) — cross-compilation, output
  formats, installers.
- [Comparison](/runtime/desktop/comparison/) — how `deno desktop` relates to
  Electron, Tauri, Electrobun, Dioxus.
