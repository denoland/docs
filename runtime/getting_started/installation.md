---
title: Installation
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno works on macOS, Linux, and Windows. Deno is a single binary executable. It
has no external dependencies. On macOS, both M1 (arm64) and Intel (x64)
executables are provided. On Linux and Windows, only x64 is supported.

## Download and install

[deno_install](https://github.com/denoland/deno_install) provides convenience
scripts to download and install the binary.

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

Using Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

Using [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

> <small>The startup time of the Deno command gets affected if it's installed
> via npm. We recommend the shell install script for better performance.</small>

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

Using [asdf](https://asdf-vm.com/):

```shell
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git

# Download and install the latest version of Deno
asdf install deno latest

# To set as the default version of Deno globally
asdf global deno latest

# To set as the default version of Deno locally (current project only)
asdf local deno latest
```

Using [vfox](https://vfox.lhan.me/):

```shell
vfox add deno

# Download and install the latest version of Deno
vfox install deno@latest

# To set the version of Deno globally
vfox use --global deno
```

</deno-tab>
<deno-tab value="windows" label="Windows">

Using PowerShell (Windows):

```powershell
irm https://deno.land/install.ps1 | iex
```

Using [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

> <small>The startup time of Deno command gets affected if it's installed via
> npm. We recommend the PowerShell install script for the better
> performance.</small>

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

Using [vfox](https://vfox.lhan.me/):

```shell
vfox add deno

# Download and install the latest version of Deno
vfox install deno@latest

# To set the version of Deno globally
vfox use --global deno
```

</deno-tab>
<deno-tab value="linux" label="Linux">

Using Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

Using [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

> <small>The startup time of Deno command gets affected if it's installed via
> npm. We recommend the shell install script for the better performance.</small>

Using [Nix](https://nixos.org/download.html):

```shell
nix-shell -p deno
```

Using [asdf](https://asdf-vm.com/):

```shell
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git

# Download and install the latest version of Deno
asdf install deno latest

# To set as the default version of Deno globally
asdf global deno latest

# To set as the default version of Deno locally (current project only)
asdf local deno latest
```

Using [vfox](https://vfox.lhan.me/):

```shell
vfox add deno

# Download and install the latest version of Deno
vfox install deno@latest

# To set the version of Deno globally
vfox use --global deno
```

</deno-tab>
</deno-tabs>

You can also build and install from source using
[Cargo](https://crates.io/crates/deno):

```shell
cargo install deno --locked
```

Deno binaries can also be installed manually, by downloading a zip file at
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases).
These packages contain just a single executable file. You will have to set the
executable bit on macOS and Linux.

## Docker

For more information and instructions on the official Docker images:
[https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

## Testing your installation

To test your installation, run `deno --version`. If this prints the Deno version
to the console the installation was successful.

Use `deno help` to see help text documenting Deno's flags and usage. Get a
detailed guide on the CLI
[here](/runtime/getting_started/command_line_interface/).

## Updating

To update a previously installed version of Deno, you can run:

```shell
deno upgrade
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
deno upgrade --version 1.0.1
```

## Building from source

Information about how to build from source can be found in the
[`Contributing`](/runtime/contributing/building_from_source/) chapter.
