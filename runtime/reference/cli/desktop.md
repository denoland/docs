---
last_modified: 2026-04-29
title: "deno desktop"
command: desktop
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno desktop"
description: "Build self-contained desktop applications from a Deno project"
---

The `deno desktop` subcommand builds a self-contained desktop application from
a Deno project. The compiled binary bundles the Deno runtime, your code, and a
rendering backend (Chromium, the OS webview, or a raw windowing system) into
one redistributable executable.

:::info Experimental

`deno desktop` is new in Deno 2.8 and the API surface is still evolving. The
exact flag names, configuration keys, and TypeScript types described here may
change before the feature is considered stable.

:::

## Quick start

```sh
# Compile the current project into a desktop app
deno desktop main.ts

# Or detect a framework and compile from a directory
deno desktop .
```

The output is a redistributable bundle for the host OS — `.app` on macOS,
`.exe` (with a sibling DLL directory) on Windows, an app directory or
`AppImage` on Linux.

## Backends

`deno desktop` ships three rendering backends. Pick one in `deno.json` under
`desktop.backend`:

| Backend   | Engine                       | When to use it                                            |
| --------- | ---------------------------- | --------------------------------------------------------- |
| `cef`     | Bundled Chromium (default)   | Predictable rendering across platforms                    |
| `webview` | Operating-system webview     | Smaller binaries; uses the OS-provided web engine         |
| `raw`     | `winit`, no web engine       | Custom windowing only — your app draws everything itself  |

Backend binaries are downloaded once from
[`github.com/denoland/wef/releases`](https://github.com/denoland/wef), pinned
via `Cargo.lock`, SHA-256 verified, and cached under `<deno_dir>/wef/<version>/`.
For local development against a wef checkout, set `WEF_DEV_DIR`.

## Framework auto-detection

Pointing `deno desktop` at a directory triggers the same framework detection
used by [`deno compile`](/runtime/reference/cli/compile/). Supported
frameworks: Next.js, Astro, Fresh, Remix, Nuxt, SvelteKit, SolidStart,
TanStack Start, and Vite (SSR mode). Production builds run by default; dev
builds run under `--hmr`. `Deno.serve()` in your entry point auto-binds to the
port the webview navigates to via the `DENO_SERVE_ADDRESS` env var.

## HMR

```sh
deno desktop --hmr .
```

For framework projects, `--hmr` runs the framework's own dev server. For
non-framework apps, Deno watches the file tree and uses
`Debugger.setScriptSource` to hot-swap modules — keeping the runtime and the
rendering backend alive across reloads.

## `Deno.BrowserWindow` API

A new `Deno.BrowserWindow` API exposes window lifecycle and webview
integration. Highlights:

- Show / hide / focus / close / reload, size and position, always-on-top.
- Navigation control.
- `bind(name, handler)` / `unbind(name)` to expose RPC functions to the webview
  JavaScript at `bindings.<name>()`.
- `executeJs(code)` to run code in the webview context.
- App and context menus, keyboard / mouse / wheel / resize / focus events.
- Native window handle for platform-specific integration.

Built-in browser dialogs are wired up too: `prompt()`, `alert()`, and
`confirm()` show native popups, and uncaught errors surface as native alerts —
optionally `POST`ing to the URL configured at `desktop.errorReporting.url`.

`Deno.dock` (macOS) and `Deno.Tray` (cross-platform) provide system-tray /
status-area icons with tooltips, dark-mode variants, and context menus.

## DevTools

Pass `--inspect`, `--inspect-brk`, or `--inspect-wait` to attach DevTools.
Unlike standard `deno run`, `deno desktop` exposes a single DevTools session
with **both** isolates as targets — the Deno runtime V8 and the renderer V8 —
so you get one Console dropdown (Renderer / Deno) and one Sources panel.
`--inspect-brk` pauses both isolates before navigation.

## Auto-update

Apps built with `deno desktop` can update themselves in the background:

```ts
console.log(Deno.desktopVersion);

await Deno.autoUpdate({
  url: "https://updates.example.com",
  interval: "1h",
  onUpdateReady() {/* show user a "restart" prompt */},
  onRollback() {/* the previous launch failed; we rolled back */},
});
```

The runtime polls `<url>/latest.json`, applies bsdiff patches to the runtime
dylib, stages the update for the next launch, and rolls back automatically if
the new version fails to start.

## Cross-compile and distribution

Pass `--target <triple>` (or `--all-targets`) to build for another platform.
The command downloads the matching prebuilt `denort` and WEF backends.

| Platform | Outputs                                                    |
| -------- | ---------------------------------------------------------- |
| macOS    | `.app` bundle (framework under `Contents/Frameworks/`), `.dmg` via `hdiutil` |
| Windows  | `.exe` plus a sibling DLL directory                        |
| Linux    | App directory, `.AppImage` via `appimagetool`              |

Code-signing / notarization (`--sign`), Windows MSI, Linux `.deb` / `.rpm`,
and a few other niceties (`Deno.notifications`, `Deno.clipboard`,
`Deno.secureStorage`) are not yet implemented at the time of this writing.

## Configuration in `deno.json`

```jsonc
{
  "desktop": {
    "app": {
      "name": "MyApp",
      "icons": {
        "macos": "./icons/icon.icns",
        "windows": "./icons/icon.ico",
        "linux": "./icons/icon.png"
      }
    },
    "backend": "cef",
    "output": {
      "macos": "./dist/macos",
      "windows": "./dist/windows",
      "linux": "./dist/linux"
    },
    "release": {
      "baseUrl": "https://updates.example.com"
    },
    "errorReporting": {
      "url": "https://errors.example.com/report"
    }
  }
}
```
