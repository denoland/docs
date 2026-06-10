---
last_modified: 2026-06-10
title: "Backends"
description: "Pick a rendering engine for your desktop app — bundled Chromium, the OS webview, or raw windowing. Tradeoffs and how to switch."
---

`deno desktop` runs your app on top of one of several web rendering engines.
`--backend` (or the `desktop.backend` field in `deno.json`) selects which engine
your app embeds.

## Available backends

### CEF (default)

```sh
deno desktop --backend cef main.ts
```

**Bundled Chromium Embedded Framework.** The same engine that powers Chrome,
Electron, and Slack. The framework ships inside your `.app` / app directory
under `Contents/Frameworks/`.

- Identical rendering on macOS, Windows, and Linux.
- Full web platform support, including modern CSS, ES modules, WebGPU, and
  WebRTC.
- Largest binary size (~150 MB for the framework alone).
- All Deno desktop features supported (DevTools, autoUpdate, tray, dock).

Choose CEF when consistent rendering across platforms matters, or when you need
a feature only Chromium ships (e.g. WebGPU on Linux).

### WebView

```sh
deno desktop --backend webview main.ts
```

**The operating system's own webview** — WKWebView on macOS, WebView2 on
Windows, WebKitGTK on Linux.

- Smaller app size (just your code + the backend shim).
- Rendering and feature support varies per platform and OS version.
- Some web features may be missing or behave differently (Web Audio variants,
  WebGPU availability, etc.).
- DevTools not available (the unified DevTools mux supports CEF only at this
  time).

Choose WebView when binary size is the primary concern and your UI sticks to
broadly-supported web features.

### Raw

```jsonc title="deno.json"
{ "desktop": { "backend": "raw" } }
```

**No web engine.** Provides window management, input events, clipboard, and the
native API surface, but no webview, no [`Deno.serve()`](/api/deno/~/Deno.serve)
auto-binding, and no `bindings.<name>()` proxy.

Useful for apps that draw their own UI (WebGPU, Skia, custom rendering) or as a
foundation for non-web desktop programs. The `raw` backend is selected through
the `desktop.backend` field in `deno.json`; the `--backend` flag accepts only
`cef` and `webview`.

## Picking a backend

| Need                                              | Best fit  |
| ------------------------------------------------- | --------- |
| Identical rendering everywhere                    | `cef`     |
| Smallest possible binary                          | `webview` |
| WebGPU / cutting-edge web APIs on all platforms   | `cef`     |
| Custom 2D/3D rendering, no HTML                   | `raw`     |
| Internal app on macOS, you control the OS version | `webview` |

## Switching backends

Backends are interchangeable for anything except the `raw` backend: the same app
code (windows, bindings, events, navigation, JS execution) works on CEF and
WebView without changes.

To switch, change the config or pass the flag:

```jsonc title="deno.json"
{ "desktop": { "backend": "webview" } }
```

```sh
deno desktop --backend webview main.ts
```

The `raw` backend has no webview, so any APIs that interact with web content
(navigation, bindings, `executeJs`, etc.) are unavailable when using it.

## How backends are obtained

You do not build the rendering backend yourself. The Deno CLI downloads prebuilt
backend binaries automatically. Downloads are checksum-verified and cached under
`<deno_dir>/`.

The first build for a new backend / target downloads the archive (a few hundred
megabytes for CEF). Subsequent builds use the cache.

## Cross-compilation

`--target` and `--all-targets` work with any backend. The CLI downloads the
prebuilt backend archive matching the target triple — no local engine toolchain
needed. See [Distribution](/runtime/desktop/distribution/).
