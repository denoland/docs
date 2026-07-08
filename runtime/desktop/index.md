---
last_modified: 2026-07-08
title: "Desktop apps"
description: "Build self-contained desktop applications from a Deno project, with framework auto-detection, hot reload, native windowing, auto-update, and cross-platform distribution."
---

`deno desktop` turns a Deno project (anything from a single TypeScript file to a
Next.js app) into a self-contained desktop application. The output is a
redistributable binary that bundles your code, the Deno runtime, and a web
rendering engine into one bundle per platform.

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

## Why `deno desktop`

Web technology is the most widely-known UI toolkit in the world. Desktop apps
built on web stacks (Electron, Tauri, Electrobun) take advantage of that, but
each has tradeoffs you have to live with: huge binaries, missing platform
support, no JavaScript ecosystem, no built-in update story, no framework
integration.

`deno desktop` is opinionated about those tradeoffs:

- **Small by default, full Node compatibility.** The default WebView backend
  uses the operating system's own webview for small binaries, and you still have
  the entire npm ecosystem available through Deno's Node compat layer. Opt into
  the bundled Chromium (CEF) backend when you need identical rendering across
  macOS, Windows, and Linux.
- **Framework auto-detection.** Point `deno desktop` at a Next.js, Astro, Fresh,
  Remix, Nuxt, SvelteKit, SolidStart, TanStack Start, or Vite SSR project and it
  runs: the production server in release mode, the dev server with hot reload
  under `--hmr`. No code changes are required to take an existing web project to
  the desktop.
- **In-process bindings instead of IPC.** Backend and UI communication goes
  through in-process channels, not socket-based IPC. Values are still encoded as
  they cross the call boundary, but there is no cross-process round-trip between
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
[`Deno.serve()`](/api/deno/~/Deno.serve) handler. Run it directly:

```sh
./main      # macOS / Linux
.\main.exe  # Windows
```

[`Deno.serve()`](/api/deno/~/Deno.serve) automatically binds to the address the
webview navigates to, so you do not need to pass a port or hostname. See
[HTTP serving](/runtime/desktop/serving/) for details.

## What's in this section

- [Configuration](/runtime/desktop/configuration/): the `desktop` block in
  `deno.json`.
- [Backends](/runtime/desktop/backends/): CEF, webview, raw; how to choose.
- [HTTP serving](/runtime/desktop/serving/):
  [`Deno.serve()`](/api/deno/~/Deno.serve) integration and the serving model.
- [Frameworks](/runtime/desktop/frameworks/): Next.js, Astro, Fresh, Remix,
  Nuxt, SvelteKit, and others.
- [Windows](/runtime/desktop/windows/):
  [`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) lifecycle, multiple
  windows, events.
- [WebGPU rendering](/runtime/desktop/webgpu/): draw to a native window with
  WebGPU on the raw backend.
- [Bindings](/runtime/desktop/bindings/): calling Deno code from the webview via
  `bindings.<name>()`.
- [Menus](/runtime/desktop/menus/): application and context menus.
- [Tray and dock](/runtime/desktop/tray_and_dock/): system status icons and the
  macOS dock.
- [Dialogs](/runtime/desktop/dialogs/): `prompt()`, `alert()`, `confirm()` as
  native popups.
- [Notifications](/runtime/desktop/notifications/): native OS notifications via
  the Web `Notification` API.
- [Hot module replacement](/runtime/desktop/hmr/): `--hmr` for framework and
  non-framework apps.
- [DevTools](/runtime/desktop/devtools/): unified DevTools attached to both the
  Deno runtime and the webview.
- [Auto-update](/runtime/desktop/auto_update/):
  [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate), manifests, bsdiff,
  rollback.
- [Error reporting](/runtime/desktop/error_reporting/): capturing uncaught
  exceptions and panics.
- [Distribution](/runtime/desktop/distribution/): cross-compilation, output
  formats, installers.
- [Comparison](/runtime/desktop/comparison/): how `deno desktop` relates to
  Electron, Tauri, Electrobun, Dioxus.
- [`deno desktop` CLI reference](/runtime/reference/cli/desktop/): the command,
  its flags, and the `deno.json` `desktop` schema.
