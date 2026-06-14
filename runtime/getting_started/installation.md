---
last_modified: 2026-06-01
title: Installation
description: "A Guide to installing Deno on different operating systems. Includes instructions for Windows, macOS, and Linux using various package managers, manual installation methods, and Docker containers."
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno is a single binary executable with no external dependencies. It runs on
macOS, Linux, and Windows, on both x64 and arm64 architectures.

## Download and install

[deno_install](https://github.com/denoland/deno_install) provides convenience
scripts to download and install the binary.

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux">

Using Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

Using [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

Using [Nix](https://nixos.org/download.html):

```shell
nix-shell -p deno
```

</deno-tab>
<deno-tab value="mac" label="macOS" default>

Using Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

Using [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

Using [Homebrew](https://formulae.brew.sh/formula/deno):

```shell
brew install deno
```

Using [MacPorts](https://ports.macports.org/port/deno/):

```shell
sudo port install deno
```

Using [Nix](https://nixos.org/download.html):

```shell
nix-shell -p deno
```

</deno-tab>
<deno-tab value="windows" label="Windows">

**NOTE:** Deno requires Windows 10 version 1709, or Windows Server 2016 version
1709 and up, due to requiring
[IsWow64Process2](https://learn.microsoft.com/en-us/windows/win32/api/wow64apiset/nf-wow64apiset-iswow64process2).

Using PowerShell (Windows):

```powershell
irm https://deno.land/install.ps1 | iex
```

Using [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

Using [Scoop](https://scoop.sh/):

```shell
scoop install deno
```

Using [Chocolatey](https://chocolatey.org/packages/deno):

```shell
choco install deno
```

Using [Winget](https://github.com/microsoft/winget-cli):

```shell
winget install DenoLand.Deno
```

</deno-tab>
</deno-tabs>

> <small>The startup time of the Deno command gets affected if it's installed
> via npm. We recommend the official install script (shell or PowerShell) for
> better performance.</small>

Deno does not publish an official apt repository. On Debian or Ubuntu, use the
shell installer above for the recommended installation path.

### Cross-platform package managers

These version managers work on macOS, Linux, and Windows.

Using [asdf](https://asdf-vm.com/):

```shell
asdf plugin add deno https://github.com/asdf-community/asdf-deno.git

# Download and install the latest version of Deno
asdf install deno latest

# To set as the default version of Deno globally
asdf set -u deno latest

# To set as the default version of Deno locally (current project only)
asdf set deno latest
```

Using [vfox](https://vfox.dev/):

```shell
vfox add deno

# Download and install the latest version of Deno
vfox install deno@latest

# To set the version of Deno globally
vfox use --global deno
```

You can also build and install from source using
[Cargo](https://crates.io/crates/deno):

```shell
cargo install deno --locked
```

## Manual download

Deno binaries can also be installed manually, by downloading a zip file at
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases).
Each release ships one archive per platform, containing a single executable:

| Platform                    | Asset                                |
| --------------------------- | ------------------------------------ |
| Windows x86_64              | `deno-x86_64-pc-windows-msvc.zip`    |
| Windows ARM64               | `deno-aarch64-pc-windows-msvc.zip`   |
| macOS ARM64 (Apple Silicon) | `deno-aarch64-apple-darwin.zip`      |
| macOS x86_64 (Intel)        | `deno-x86_64-apple-darwin.zip`       |
| Linux x86_64                | `deno-x86_64-unknown-linux-gnu.zip`  |
| Linux ARM64                 | `deno-aarch64-unknown-linux-gnu.zip` |

Unzip the archive and place the `deno` executable somewhere on your `PATH`. You
will have to set the executable bit on macOS and Linux. Each asset has a
matching `.sha256sum` file for verifying the download.

## Docker

Official images are published to both
[Docker Hub](https://hub.docker.com/r/denoland/deno) and the
[GitHub Container Registry](https://github.com/denoland/deno/pkgs/container/deno)
in several variants:

| Tag                        | Base             |
| -------------------------- | ---------------- |
| `denoland/deno:debian`     | Debian (default) |
| `denoland/deno:ubuntu`     | Ubuntu           |
| `denoland/deno:alpine`     | Alpine Linux     |
| `denoland/deno:distroless` | Distroless       |
| `denoland/deno:bin`        | Binary only      |

Each tag is also published with a version, for example `denoland/deno:2.3.1`,
and pinning to a version is recommended for reproducible builds.

A typical `Dockerfile` caches dependencies as a separate layer and runs as the
non-root `deno` user:

```dockerfile
FROM denoland/deno:debian

WORKDIR /app

# Cache dependencies as their own layer
COPY deno.* ./
RUN deno install

# Copy the rest of the source and cache the entrypoint
COPY . .
RUN deno cache main.ts

USER deno
EXPOSE 8000

CMD ["run", "--allow-net", "main.ts"]
```

Build and run it:

```shell
docker build -t my-app .
docker run -it -p 8000:8000 my-app
```

See the [deno_docker repository](https://github.com/denoland/deno_docker) for
the full set of examples and configuration options.

## Installation location

### Binary location

When installed via the shell or PowerShell script, the `deno` binary is placed
in the following default location:

| Platform      | Default path                       |
| ------------- | ---------------------------------- |
| macOS / Linux | `$HOME/.deno/bin/deno`             |
| Windows       | `%USERPROFILE%\.deno\bin\deno.exe` |

Override the install directory by setting the `DENO_INSTALL` environment
variable before running the install script.

When installed via a package manager (Homebrew, Scoop, etc.), the binary
location is managed by that package manager.

### Cache location

Downloaded dependencies and compiled artefacts are stored in Deno's cache
directory. It defaults to a platform-specific path:

| Platform | Default path                |
| -------- | --------------------------- |
| Linux    | `$HOME/.cache/deno`         |
| macOS    | `$HOME/Library/Caches/deno` |
| Windows  | `%LOCALAPPDATA%\deno`       |

Override it by setting the `DENO_DIR` environment variable (see
[Environment variables](/runtime/reference/env_variables/)). Run `deno info` to
print the directory currently in use.

## Testing your installation

To test your installation, run `deno --version`. If this prints the Deno version
to the console the installation was successful.

Use `deno help` to see help text documenting Deno's flags and usage. Get a
detailed guide on the CLI
[here](/runtime/getting_started/command_line_interface/).

### If you see "command not found"

If `deno --version` reports `command not found`, the install directory isn't on
your `PATH` yet. To fix this:

- Open a new terminal window or restart your shell so the updated `PATH` is
  picked up. This is the most common cause — the install script updates your
  shell rc file, but existing shell sessions don't see the change until they
  reload.
- Confirm the install directory is on your `PATH`. The shell install script
  defaults to `~/.deno/bin` on macOS and Linux; for npm-based installs, run
  `npm config get prefix` to find the directory containing the global `bin`.
- If you customised the install location, the shell install script's install
  root can be overridden with the `DENO_INSTALL` environment variable, in which
  case the binary lives at `$DENO_INSTALL/bin/deno`.

## Updating

To update a previously installed version of Deno, you can run:

```shell
deno upgrade
```

Or using [Homebrew](https://formulae.brew.sh/formula/deno) (macOS):

```shell
brew upgrade deno
```

Or using [Scoop](https://scoop.sh/) (Windows):

```shell
scoop update deno
```

Or using [Chocolatey](https://chocolatey.org/packages/deno) (Windows):

```shell
choco upgrade deno
```

Or using [Winget](https://github.com/microsoft/winget-cli) (Windows):

```shell
winget upgrade DenoLand.Deno
```

This will fetch the latest release from
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases),
unzip it, and replace your current executable with it.

You can also use this utility to install a specific version of Deno:

```shell
deno upgrade --version 2.7.0
```

## Uninstalling

If you installed Deno using the shell or PowerShell install script, first clear
the Deno cache directory (`$DENO_DIR`):

```shell
deno clean
```

Then remove the Deno installation directory:

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS / Linux" default>

```shell
rm -rf ~/.deno
```

Finally, remove the line that sources Deno's env file from your shell config
(`~/.bashrc`, `~/.zshrc`, `~/.profile`, etc.). The shell install script appends
a line like `. "$HOME/.deno/env"` — delete that line. Fish users should
additionally remove `~/.config/fish/conf.d/deno.fish`.

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.deno"
```

Then remove the Deno `bin` directory from your `PATH` environment variable via
System Settings.

</deno-tab>
</deno-tabs>

If you installed Deno via a package manager (Homebrew, Scoop, Chocolatey, etc.),
use that package manager's uninstall command instead (e.g.
`brew uninstall deno`, `scoop uninstall deno`).

## Building from source

Information about how to build from source can be found in the
[`Building from source`](https://github.com/denoland/deno/blob/main/.github/CONTRIBUTING.md#building-from-source)
guide.
