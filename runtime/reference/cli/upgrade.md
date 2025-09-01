---
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

```shell
$ deno upgrade
Checking for latest version
Version has been found
Deno is upgrading to version 1.38.5
downloading https://github.com/denoland/deno/releases/download/v1.38.5/deno-x86_64-apple-darwin.zip
downloading 100%
Upgrade done successfully
```

### Upgrade to a specific version

You can specify a particular version to upgrade to:

```shell
$ deno upgrade --version 1.37.0
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

```shell
$ deno upgrade --dry-run
Checking for latest version
Version has been found
Would upgrade to version 1.38.5
```

## --quiet flag

The `--quiet` flag suppresses diagnostic output during the upgrade process. When
used with `deno upgrade`, it will hide progress indicators, download
information, and success messages.

```shell
$ deno upgrade --quiet
```

This is useful for scripting environments or when you want cleaner output in CI
pipelines.

## Canary build

By default, Deno will upgrade from the official GitHub releases. You can specify
the `--canary` build flag for the latest canary build:

```shell
# Upgrade to the latest canary build
$ deno upgrade --canary
```
