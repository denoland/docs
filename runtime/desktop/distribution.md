---
last_modified: 2026-06-25
title: "Distribution"
description: "Cross-compile a deno desktop app for macOS, Windows, and Linux from one machine, and produce per-platform output formats: .app, .dmg, .exe directory, AppImage."
---

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

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

The CLI fetches the matching prebuilt `denort` and the matching prebuilt backend
archive automatically. No platform-specific toolchain is needed on the host.

## Output formats

The output extension determines the format:

### macOS

| Output       | Produced by                                 |
| ------------ | ------------------------------------------- |
| `MyApp.app/` | Default; `.app` bundle.                     |
| `MyApp.dmg`  | `hdiutil`; drag-to-Applications disk image. |

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

| Output      | Produced by                                           |
| ----------- | ----------------------------------------------------- |
| `MyApp/`    | Default; directory with a launcher and support files. |
| `MyApp.msi` | Windows Installer package (per-machine install).      |

The `MyApp/` directory contains:

```
MyApp/
  MyApp.bat               # launcher
  denort.dll              # Deno runtime + your code
  *.dll                   # rendering backend and CEF libraries
  resources.pak, locales/ # CEF support files
  AppIcon.ico             # icon (optional)
```

Set a `.msi` output extension to build a Windows Installer package directly. It
installs the app per-machine under `%ProgramFiles%\<AppName>\` and registers an
uninstaller. The MSI is authored in pure Rust, so it cross-compiles from any
host (only the target must be Windows). To package the directory another way,
zip it or feed it into a third-party installer generator such as Inno Setup,
NSIS, or WiX.

### Linux

| Output            | Produced by                                  |
| ----------------- | -------------------------------------------- |
| `my-app/`         | Default; app directory with launcher script. |
| `my-app.AppImage` | Single-file portable bundle.                 |
| `my-app.deb`      | Debian/Ubuntu package.                       |
| `my-app.rpm`      | Fedora/RHEL package.                         |

The app directory layout:

```
my-app/
  my-app                  # launcher shell script
  libdenort.so            # Deno runtime + your code
  *.so                    # rendering backend and CEF libraries
  resources.pak, locales/ # CEF support files
  AppIcon.png             # icon (optional)
```

`AppImage` is the most portable Linux format: one file, no install step, runs on
any modern distro. `deno desktop` builds it directly: it packs the app directory
into a SquashFS image and prepends the AppImage Type-2 runtime, adding the
required `AppRun`, `.desktop`, and icon entries. There is no external tool to
install (no `appimagetool`), and it works from any build host, so you can
produce a Linux `.AppImage` while cross-compiling from macOS or Windows.

Set a `.deb` or `.rpm` output extension to build a Linux package directly. Both
install the app under `/usr/lib/<pkg>/`, symlink a launcher into `/usr/bin/`,
and register a `.desktop` entry and icon. Like the `.AppImage`, they are
assembled in pure Rust and cross-compile from any host (only the target must be
Linux).

## Compressing the bundle

Pass `--compress` to ship a self-extracting bundle. The heavy payload (the
runtime and UI backend) is compressed inside the distributed app and unpacked to
a per-user data directory on first launch, then reused on later runs. This
shrinks the distributed artifact substantially, a webview hello-world drops from
about 66 MB to 19 MB, in exchange for a one-time decompression on first launch.

```sh
# Self-extracting, compressed bundle
deno desktop --compress main.ts

# Choose the codec explicitly
deno desktop --compress=xz main.ts
deno desktop --compress=zstd main.ts
```

`xz` produces the smaller artifact; `zstd` trades some size for faster
first-launch decompression.

## Choosing the output path

The output path can be set in three places, in priority order:

1. The `--output` CLI flag.
2. The `desktop.output` field in `deno.json` (per-platform).
3. The default: the project name, with the platform-appropriate extension.

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
- The right backend archive for the target. Downloaded automatically, pinned to
  your Deno version.

Both downloads are SHA-256 verified and cached under `<deno_dir>/`.

There is **no Rust toolchain involved** in cross-compiling a desktop app. You
are not compiling Rust on the host; you are downloading prebuilt artifacts for
the target and packaging them with your code. This is the same model as
`deno compile --target`.

Icon assembly (`.icns`, `.ico`) and the Linux `.AppImage` are produced on any
host. The one exception is the macOS `.dmg`, which shells out to `hdiutil` and
therefore must be built on a macOS host. To produce a `.dmg` from another
platform, build it on a macOS CI machine.

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
`--all-targets`) works for the bundles and the Linux `.AppImage`. Only the macOS
`.dmg` needs a macOS host.

## Code signing

On macOS, `deno desktop` code-signs the bundle for you. By default it applies an
**ad-hoc** signature (`-`), which gives the app a stable code identity, enough
for the OS to grant [notification](/runtime/desktop/notifications/) permission,
but not enough to distribute without Gatekeeper warnings. The CEF helper
processes' bundle identifiers are harmonized with the main bundle id
automatically.

To produce a distributable, notarizable bundle, set a real signing identity in
`deno.json` (signing must run on a macOS host, since it shells out to
`codesign(1)`):

```jsonc title="deno.json"
{
  "desktop": {
    "app": { "identifier": "com.example.myapp" },
    "macos": {
      "codesignIdentity": "Developer ID Application: Acme, Inc. (TEAMID)"
    }
  }
}
```

With a real identity, the bundle is signed with Hardened Runtime and a secure
timestamp. **Notarization is still a separate step**. Submit the signed bundle
with `xcrun notarytool submit` and staple the ticket.

On Windows, sign the produced executables (the backend `.exe` and `denort.dll`
in the output directory) externally for now, e.g.
`signtool sign /f cert.pfx /tr <timestamp> <file>`.

## Distributing updates after release

Once your binary is in users' hands, ship updates via
[`Deno.autoUpdate()`](/runtime/desktop/auto_update/): `bsdiff` patches shipped
from your own server, no app store required.
