---
title: "deno upgrade"
oldUrl: /runtime/manual/tools/upgrade/
command: upgrade
---

## Description

Defaults to the latest version of Deno. The version is downloaded from
[https://github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)
and is used to replace the current executable.

## Examples

- Install a specific version of the Deno executable

```bash
deno upgrade --version 1.33.3
```

- Install Deno in a specific location

```bash
deno upgrade --output ./some/local/path
```
