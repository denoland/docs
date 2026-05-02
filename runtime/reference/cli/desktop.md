---
last_modified: 2026-04-24
title: "deno desktop"
description: "Build self-contained desktop applications from a Deno project"
---

Build a self-contained desktop application from a Deno project. The compiled
binary bundles your code, the Deno runtime, and a rendering backend (Chromium,
the OS webview, or a raw windowing system) into one redistributable executable.

For an in-depth guide — backends, framework auto-detection, the
[`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) API, auto-update,
DevTools, distribution, and more — see the
[Desktop apps section](/runtime/desktop/).

```sh
deno desktop main.ts
deno desktop --hmr main.ts
deno desktop --output MyApp.app main.ts
```

## Synopsis

```
Usage: deno desktop [OPTIONS] [SCRIPT_ARG]...
```

## Options

| Flag                             | Description                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `--all-targets`                  | Build for all supported target platforms.                                                   |
| `--backend <backend>`            | WEF backend: `cef` (default), `webview`, `servo`, `raw`.                                    |
| `--exclude <path>`               | Exclude a file or directory from the compiled binary.                                       |
| `--hmr`                          | Run the desktop app with hot module replacement.                                            |
| `--icon <path>`                  | Application icon (`.ico` on Windows, `.icns` or `.png` on macOS).                           |
| `--include <path>`               | Include an additional file, directory, or module in the compiled binary.                    |
| `-o`, `--output <path>`          | Output path. Extension determines format (`.app`, `.dmg`, `.AppImage`, …).                  |
| `--target <triple>`              | Target triple — see [Distribution](/runtime/desktop/distribution/).                         |
| `--inspect[=host:port]`          | Listen for a DevTools session on both isolates. See [DevTools](/runtime/desktop/devtools/). |
| `--inspect-brk[=host:port]`      | Listen and break on first line in both isolates.                                            |
| `--inspect-wait[=host:port]`     | Listen and wait for a debugger before running.                                              |
| `--inspect-renderer[=host:port]` | Override the CEF renderer's debugger listen address.                                        |

Permission flags from `deno run` apply too — the compiled binary inherits the
permissions you grant at compile time.

## Configuration

Most settings live in the `desktop` block of `deno.json`:

```jsonc title="deno.json"
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
    "release": { "baseUrl": "https://updates.example.com" },
    "errorReporting": { "url": "https://errors.example.com/report" }
  }
}
```

Full schema and examples: [Configuration](/runtime/desktop/configuration/).
