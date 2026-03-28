---
title: Installation
description: "A guide to installing Deno on macOS, Windows, and Linux."
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno ships as a single binary executable with no external dependencies. It works
on macOS (arm64 and x64), Windows (ARM64 and x64), and Linux (x64).

## Install

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```shell
curl -fsSL https://deno.land/install.sh | sh
```

Or using [Homebrew](https://formulae.brew.sh/formula/deno):

```shell
brew install deno
```

</deno-tab>
<deno-tab value="windows" label="Windows">

Using PowerShell:

```powershell
irm https://deno.land/install.ps1 | iex
```

Or using [Scoop](https://scoop.sh/):

```shell
scoop install deno
```

Or using [Winget](https://github.com/microsoft/winget-cli):

```shell
winget install DenoLand.Deno
```

:::note

Deno requires Windows 10 version 1709 or later.

:::

</deno-tab>
<deno-tab value="linux" label="Linux">

```shell
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

Verify the installation:

```shell
deno --version
```

:::tip

Deno can also be installed via [npm](https://npmjs.com/package/deno)
(`npm install -g deno`), though the shell install script is recommended for
better startup performance.

:::

<details>
<summary>More installation methods</summary>

**macOS:**

- [MacPorts](https://ports.macports.org/port/deno/): `sudo port install deno`
- [Nix](https://nixos.org/download.html): `nix-shell -p deno`
- [asdf](https://asdf-vm.com/): `asdf plugin add deno https://github.com/asdf-community/asdf-deno.git && asdf install deno latest && asdf set -u deno latest`
- [vfox](https://vfox.dev/): `vfox add deno && vfox install deno@latest`

**Windows:**

- [Chocolatey](https://chocolatey.org/packages/deno): `choco install deno`

**Linux:**

- [Nix](https://nixos.org/download.html): `nix-shell -p deno`
- [asdf](https://asdf-vm.com/): `asdf plugin add deno https://github.com/asdf-community/asdf-deno.git && asdf install deno latest && asdf set -u deno latest`
- [vfox](https://vfox.dev/): `vfox add deno && vfox install deno@latest`

**From source:**

```shell
cargo install deno --locked
```

**Manual download:**

Deno binaries can be downloaded directly from
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases).

</details>

## Docker

Official images are available on
[Docker Hub](https://hub.docker.com/r/denoland/deno) and
[GHCR](https://github.com/denoland/deno/pkgs/container/deno) in several
variants:

| Tag | Base |
| --- | --- |
| `denoland/deno:debian` | Debian (default) |
| `denoland/deno:ubuntu` | Ubuntu |
| `denoland/deno:alpine` | Alpine Linux |
| `denoland/deno:distroless` | Distroless |
| `denoland/deno:bin` | Binary only |

All tags are also available with a version prefix, e.g. `denoland/deno:2.3.1`.

A typical `Dockerfile`:

```dockerfile
FROM denoland/deno:debian
WORKDIR /app
COPY . .
RUN deno install
CMD ["deno", "run", "--allow-net", "main.ts"]
```

See the [deno_docker repo](https://github.com/denoland/deno_docker) for more
details.

## Updating

To update to the latest version:

```shell
deno upgrade
```

To install a specific version:

```shell
deno upgrade --version 2.3.1
```

On Windows, `winget upgrade DenoLand.Deno` also works.
