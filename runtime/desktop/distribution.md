---
title: "Distribution"
description: "Cross-compile a deno desktop app for macOS, Windows, and Linux from one machine, and produce per-platform output formats — .app, .dmg, .exe directory, AppImage."
---

`deno desktop` cross-compiles from any host. The same machine builds for macOS
Intel, macOS arm64, Windows x86_64, Linux arm64, and Linux x86_64. Backend
binaries (CEF, WebView, etc.) are downloaded as needed.

## Per-platform output

```sh
# Build for the host platform.
deno desktop main.ts

# Build for a specific target.
deno desktop --target aarch64-apple-darwin main.ts

# Build for every supported target in one go.
deno desktop --all-targets main.ts
```

Supported triples:

| Triple                      | OS      | Architecture |
| --------------------------- | ------- | ------------ |
| `aarch64-apple-darwin`      | macOS   | arm64        |
| `x86_64-apple-darwin`       | macOS   | Intel        |
| `x86_64-pc-windows-msvc`    | Windows | x86_64       |
| `aarch64-unknown-linux-gnu` | Linux   | arm64        |
| `x86_64-unknown-linux-gnu`  | Linux   | x86_64       |

The CLI fetches the matching prebuilt `denort` and the matching prebuilt WEF
backend archive from `github.com/denoland/wef/releases`. No platform-specific
toolchain is needed on the host.

## Output formats

The output extension determines the format:

### macOS

| Output       | Produced by                                  |
| ------------ | -------------------------------------------- |
| `MyApp.app/` | Default — `.app` bundle.                     |
| `MyApp.dmg`  | `hdiutil` — drag-to-Applications disk image. |

The `.app` bundle has the standard layout:

```
MyApp.app/
  Contents/
    Info.plist
    MacOS/
      MyApp                  # the launcher
    Resources/
      icon.icns
    Frameworks/
      Chromium Embedded Framework.framework/    # CEF backend
      …
```

Self-extracting mode is enabled by default: the embedded virtual filesystem
(your code, framework build outputs, static assets) extracts to disk on first
run so frameworks like Next.js find their build output relative to CWD.

### Windows

| Output   | Produced by                                         |
| -------- | --------------------------------------------------- |
| `MyApp/` | Default — directory containing `.exe` and CEF DLLs. |

The `MyApp/` directory contains:

```
MyApp/
  MyApp.exe
  *.dll                   # CEF runtime DLLs
  resources.pak           # CEF resources
  locales/                # CEF locales
  …
```

Zip the directory or feed it into an installer toolchain. Windows MSI output is
not yet implemented; for now, use a third-party installer generator such as Inno
Setup, NSIS, or WiX with the directory as input.

### Linux

| Output            | Produced by                                   |
| ----------------- | --------------------------------------------- |
| `my-app/`         | Default — app directory with launcher script. |
| `my-app.AppImage` | `appimagetool` — single-file portable bundle. |

The app directory layout:

```
my-app/
  AppRun                  # launcher script
  my-app                  # the binary
  *.so                    # CEF shared libraries
  resources.pak
  locales/
  …
```

`AppImage` is the most portable Linux format — one file, no install step, runs
on any modern distro. It is built by passing `appimagetool` (which must be on
`PATH`) the staged directory plus a `.desktop` entry and an icon.

`.deb` / `.rpm` packaging is not yet implemented. For now, use `fpm` or
`dpkg-deb` against the app directory.

## Choosing the output path

The output path can be set in three places, in priority order:

1. The `--output` CLI flag.
2. The `desktop.output` field in `deno.json` (per-platform).
3. The default — the project name, with the platform-appropriate extension.

```sh
# Override per build:
deno desktop --output ./builds/MyApp-1.4.0.dmg main.ts
```

```jsonc title="deno.json"
{
  "desktop": {
    "output": {
      "macos": "./dist/macos/MyApp.app",
      "windows": "./dist/windows/MyApp",
      "linux": "./dist/linux/my-app.AppImage"
    }
  }
}
```

## Cross-compilation details

Cross-compiling from one OS to another requires:

- The right `denort` binary for the target. Downloaded automatically from
  `github.com/denoland/deno/releases`, matching your local Deno version.
- The right WEF backend archive for the target. Downloaded automatically from
  `github.com/denoland/wef/releases`, pinned via `Cargo.lock`.

Both downloads are SHA-256 verified and cached under `<deno_dir>/`.

There is **no Rust toolchain involved** in cross-compiling a desktop app. You
are not compiling Rust on the host — you are downloading prebuilt artifacts for
the target and packaging them with your code. This is the same model as
`deno compile --target`.

The only thing the host can affect is the **icon assembly**: `.icns` generation
works on any host, `.ico` generation works on any host, but making installers
(`.dmg`, `.AppImage`) requires the matching tool — `hdiutil` for `.dmg` (macOS
only), `appimagetool` for `.AppImage`. To produce installers for a platform you
cannot run the tool on, build the bundle on a CI machine that can.

## CI

A typical GitHub Actions matrix builds platform-native installers in parallel:

```yaml title=".github/workflows/release.yml"
jobs:
  build:
    strategy:
      matrix:
        include:
          - { os: macos-14, target: aarch64-apple-darwin }
          - { os: macos-15-intel, target: x86_64-apple-darwin }
          - { os: windows-latest, target: x86_64-pc-windows-msvc }
          - { os: ubuntu-latest, target: x86_64-unknown-linux-gnu }
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2

      - run: deno desktop --target ${{ matrix.target }} main.ts

      - uses: actions/upload-artifact@v4
        with:
          name: my-app-${{ matrix.target }}
          path: dist/
```

Cross-compiling from a single host (e.g. only running on `ubuntu-latest` with
`--all-targets`) works for the bundles themselves. Producing `.dmg` /
`.AppImage` installers needs the matching native host.

## Code signing

Code-signing and notarization (a `--sign` flag) are not yet implemented. For
now, sign the produced bundle externally:

- macOS: `codesign --deep --sign "Developer ID Application: …" MyApp.app`
  followed by `xcrun notarytool submit`.
- Windows: `signtool sign /f cert.pfx /tr <timestamp> MyApp.exe`.

A unified `--sign` story (with hardened runtime, helper-process entitlements,
and `notarytool` integration) is on the roadmap. Until then, treat signing as a
post-build CI step.

## Distributing updates after release

Once your binary is in users' hands, ship updates via
[`Deno.autoUpdate()`](/runtime/desktop/auto_update/) — `bsdiff` patches shipped
from your own server, no app store required.
