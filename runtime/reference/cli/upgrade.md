---
last_modified: 2026-03-05
title: "deno upgrade"
oldUrl: /runtime/manual/tools/upgrade/
command: upgrade
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno upgrade"
description: "Upgrade Deno to the latest, or any specific version"
---

## Examples

### Upgrade to the latest version

Use this command without any options to upgrade Deno to the latest available
version:

```sh
deno upgrade
Checking for latest version
Version has been found
Deno is upgrading to version 1.38.5
downloading https://github.com/denoland/deno/releases/download/v1.38.5/deno-x86_64-apple-darwin.zip
downloading 100%
Upgrade done successfully
```

### Upgrade to a specific version

You can specify a particular version to upgrade to:

```sh
deno upgrade --version 1.37.0
Checking for version 1.37.0
Version has been found
Deno is upgrading to version 1.37.0
downloading https://github.com/denoland/deno/releases/download/v1.37.0/deno-x86_64-apple-darwin.zip
downloading 100%
Upgrade done successfully
```

### Check available upgrade without installing

Use the `--dry-run` flag to see what would be upgraded without actually
performing the upgrade:

```sh
deno upgrade --dry-run
Checking for latest version
Version has been found
Would upgrade to version 1.38.5
```

## --quiet flag

The `--quiet` flag suppresses diagnostic output during the upgrade process. When
used with `deno upgrade`, it will hide progress indicators, download
information, and success messages.

```sh
deno upgrade --quiet
```

This is useful for scripting environments or when you want cleaner output in CI
pipelines.

## Cached downloads

Downloaded Deno binaries are cached in `$DENO_DIR/dl/`. If you reinstall the
same version later, the cached archive is reused instead of re-downloading. For
canary builds, old entries are automatically removed, keeping only the 10 most
recent versions.

## Checksum verification

Use the `--checksum` flag to verify a downloaded binary against a known SHA-256
hash. This protects against tampering in CI environments and security-sensitive
setups:

```sh
deno upgrade --checksum=<sha256-hash> 2.7.0
```

SHA-256 checksums are published as `.sha256sum` files alongside release archives
on GitHub:

```sh
curl -sL https://github.com/denoland/deno/releases/download/v2.7.0/deno-x86_64-unknown-linux-gnu.zip.sha256sum
```

## Delta updates

Starting in Deno 2.8, `deno upgrade` downloads small binary patches (deltas)
instead of the full release archive when upgrading between recent stable
versions. This typically reduces the download from tens of megabytes to a few
megabytes.

Deltas are applied automatically when available — there is nothing to opt into.
If a patch is missing or fails verification, `deno upgrade` transparently falls
back to downloading the full archive, so the upgrade always succeeds.

To force a full download — for example, in environments that cache release
archives — pass `--no-delta`:

```sh
deno upgrade --no-delta
```

Each delta patch and the resulting binary are verified against the SHA-256
checksums published with the release before being installed.

## Canary build

By default, Deno will upgrade from the official GitHub releases. You can specify
the `--canary` build flag for the latest canary build:

```sh
# Upgrade to the latest canary build
deno upgrade --canary
```
