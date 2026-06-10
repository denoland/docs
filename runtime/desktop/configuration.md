---
last_modified: 2026-06-10
title: "Configuration"
description: "Configure deno desktop in deno.json — app metadata, icons, backend selection, output paths, error reporting, and the auto-update server."
---

All configuration for `deno desktop` lives in the `desktop` block in
`deno.json`. Most fields are optional — a project with no `desktop` block at all
still compiles, using sensible defaults.

## Full example

```jsonc title="deno.json"
{
  "name": "my-app",
  "version": "1.4.0",
  "desktop": {
    "app": {
      "name": "My App",
      "identifier": "com.example.myapp",
      "icons": {
        "macos": "./icons/app.icns",
        "windows": "./icons/app.ico",
        "linux": "./icons/app.png"
      }
    },
    "backend": "cef",
    "output": {
      "macos": "./dist/MyApp.app",
      "windows": "./dist/MyApp",
      "linux": "./dist/my-app"
    },
    "macos": {
      "codesignIdentity": "Developer ID Application: Acme, Inc. (TEAMID)"
    },
    "release": {
      "baseUrl": "https://releases.example.com/my-app"
    },
    "errorReporting": {
      "url": "https://errors.example.com/report"
    }
  }
}
```

## `app`

Metadata baked into the compiled binary.

### `app.name`

Display name of the application. Used as the window title default, the macOS
menu bar app name, the Windows taskbar tooltip, and the Linux `.desktop` entry
name. Falls back to the `name` field at the root of `deno.json`.

### `app.identifier`

Reverse-DNS bundle / application identifier (e.g. `com.example.myapp`). Used for
the macOS `CFBundleIdentifier`, the Linux `.desktop` file identifier, and the
Windows AppUserModelID. When unset, a synthetic `com.deno.desktop.<app-slug>` is
generated. macOS needs a stable identifier to grant notification permission, so
set a real one for any app that uses
[notifications](/runtime/desktop/notifications/).

### `app.icons`

Per-platform icon paths, relative to `deno.json`.

```jsonc
"icons": {
  "macos":   "./icons/app.icns",
  "windows": "./icons/app.ico",
  "linux":   "./icons/app.png"
}
```

For macOS and Linux you may also pass an array of PNGs to be assembled into a
multi-resolution icon at build time:

```jsonc
"icons": {
  "macos": [
    { "path": "./icons/16.png",  "size": 16  },
    { "path": "./icons/32.png",  "size": 32  },
    { "path": "./icons/128.png", "size": 128 },
    { "path": "./icons/256.png", "size": 256 },
    { "path": "./icons/512.png", "size": 512 }
  ]
}
```

`.icns` (macOS) and `.ico` (Windows) inputs are passed through unchanged. PNGs
are assembled into the right container per platform.

If no `icons` entry is set for a platform, the default Deno icon is used.

## `backend`

Which web rendering engine to embed. One of `"cef"`, `"webview"`, or `"raw"`.
Default: `"webview"`.

```jsonc
"backend": "webview"
```

The CLI flag `--backend` overrides this for one build, but accepts only `cef`
and `webview`; select `raw` here in `deno.json`. See
[Backends](/runtime/desktop/backends/) for tradeoffs and supported targets.

## `output`

Per-platform output paths.

```jsonc
"output": {
  "macos":   "./dist/MyApp.app",
  "windows": "./dist/MyApp",
  "linux":   "./dist/my-app"
}
```

The path's extension determines what is produced:

| Extension on macOS | Output                               |
| ------------------ | ------------------------------------ |
| `.app`             | macOS application bundle             |
| `.dmg`             | DMG disk image (built via `hdiutil`) |

| Extension on Windows | Output                                        |
| -------------------- | --------------------------------------------- |
| (none) / directory   | App directory with a `.bat` launcher and DLLs |

| Extension on Linux | Output                             |
| ------------------ | ---------------------------------- |
| (none) / directory | App directory with launcher script |
| `.AppImage`        | `.AppImage` single-file bundle     |

The CLI flag `--output` overrides this for one build.

## `macos`

macOS-specific build options.

### `macos.codesignIdentity`

The code-signing identity used to sign the macOS bundle, e.g.
`"Developer ID Application: Acme, Inc. (TEAMID)"`, or `"-"` for an explicit
ad-hoc signature. When unset, `deno desktop` still ad-hoc-signs the bundle so it
has a stable code identity (required for notification permission), but the
result is not distributable without further signing. Set a real Developer ID
identity to produce a notarizable bundle. See
[Distribution](/runtime/desktop/distribution/#code-signing).

## `release`

Configuration for the auto-update system.

### `release.baseUrl`

Base URL of the release server. The runtime fetches `<baseUrl>/latest.json` and
downloads patch files relative to this URL. See
[Auto-update](/runtime/desktop/auto_update/) for the full manifest format and
patch flow.

```jsonc
"release": {
  "baseUrl": "https://releases.example.com/my-app"
}
```

This is the **only** server URL the runtime polls automatically.
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) defaults to this URL, but can
override it per call.

## `errorReporting`

Capture uncaught exceptions, unhandled rejections, and panics, show a native
alert, and optionally `POST` a JSON report to a server.

### `errorReporting.url`

```jsonc
"errorReporting": {
  "url": "https://errors.example.com/report"
}
```

If unset, error reporting is in "alert only" mode — uncaught errors still show a
native alert, but no report is sent.

See [Error reporting](/runtime/desktop/error_reporting/) for the report schema.

## Working directory & assets

The compiled binary runs with the current working directory set to the user's
`cwd`, not the directory containing the binary. If your app needs to find files
relative to itself — framework build outputs, static assets — use `import.meta`
or the framework's own resolution; do not assume
[`Deno.cwd()`](/api/deno/~/Deno.cwd).

For framework projects this is handled automatically: detected build outputs
(`.next/`, `dist/`, `_fresh/`, `.output/`, etc.) are embedded in the binary's
virtual filesystem and self-extracted at runtime so framework code finds them
relative to its own working directory.

## Validation

Configuration is validated at the start of `deno desktop`:

- `backend` must be one of the listed values.
- Icon paths must resolve to existing files.
- Output paths must be writable.
- `release.baseUrl` must parse as a URL.

Errors are reported with the offending `deno.json` location.
