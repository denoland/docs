---
last_modified: 2026-06-27
title: "deno desktop"
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno desktop"
description: "Build self-contained desktop applications from a Deno project"
---

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

`deno desktop` compiles a Deno project into a self-contained desktop
application. The output binary bundles your code, the Deno runtime, and a
rendering backend into one redistributable executable per platform.

```sh
deno desktop main.ts
deno desktop --hmr main.ts
deno desktop --output MyApp.app main.ts
```

The entrypoint is optional. A bare `deno desktop` (or `deno desktop .`) detects
a supported framework (Next.js, Astro, Fresh, React Router, and others) in the
current directory and builds the appropriate desktop entrypoint. See
[Frameworks](/runtime/desktop/frameworks/) for supported frameworks and
per-framework requirements.

This page covers the command-line flags. For the full guide (backends,
[`Deno.desktop.BrowserWindow`](/api/deno/~/Deno.desktop.BrowserWindow),
bindings, auto-update, DevTools, and distribution) see the
[Desktop apps section](/runtime/desktop/).

## Runtime flags

`deno desktop` accepts the same runtime and permission flags as
[`deno run`](/runtime/reference/cli/run/). The permissions you grant at compile
time are baked into the compiled binary:

```sh
deno desktop --allow-read --allow-net main.ts
```

## Backend

`--backend` selects the rendering engine. It accepts `webview` (the default) or
`cef`. The `raw` backend is selected through the `desktop.backend` field in
`deno.json`. See [Backends](/runtime/desktop/backends/) for the tradeoffs.

```sh
deno desktop --backend webview main.ts
```

## Build output

`--output` (`-o`) sets the output path; its extension determines the format
(`.app`, `.dmg`, `.AppImage`, and so on):

```sh
deno desktop --output ./dist/MyApp.dmg main.ts
```

Use `--icon` to set the application icon (`.ico` on Windows, `.icns` or `.png`
on macOS), and `--include` / `--exclude` to add or remove files from the
compiled binary. These can also be configured in `deno.json`; see
[Configuration](/runtime/desktop/configuration/).

## Cross-compilation

`--target` builds for another platform, and `--all-targets` builds for every
supported platform at once. No platform-specific toolchain is needed on the
host:

```sh
deno desktop --target aarch64-apple-darwin main.ts
deno desktop --all-targets main.ts
```

See [Distribution](/runtime/desktop/distribution/) for the supported target
triples and output formats.

## Development

`--hmr` runs the app with hot module replacement during development. See
[Hot module replacement](/runtime/desktop/hmr/).

```sh
deno desktop --hmr main.ts
```

The `--inspect`, `--inspect-wait`, and `--inspect-brk` flags attach a debugger
to both the Deno runtime and the renderer. `--inspect-renderer` overrides the
CEF renderer's debugger listen address. See
[DevTools](/runtime/desktop/devtools/).

## Configuration

Most settings can live in the `desktop` block of `deno.json` instead of being
passed on every build:

```jsonc title="deno.json"
{
  "desktop": {
    "app": {
      "name": "MyApp",
      "identifier": "com.example.myapp",
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
    "release": { "baseUrl": "https://updates.example.com" },
    "errorReporting": { "url": "https://errors.example.com/report" }
  }
}
```

For the full schema, see [Configuration](/runtime/desktop/configuration/).
