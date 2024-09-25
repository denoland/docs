---
title: "deno uninstall"
oldUrl: /runtime/manual/tools/uninstall/
---

// TODO: update to align with new `deno install` behavior.

Uninstalls an executable script in the installation root's bin directory.

## Command

`deno uninstall [OPTIONS] <NAME>` - Uninstalls `name`.

## Synopsis

```bash
deno uninstall [--root <root>] [-g|--global] [-q|--quiet] <NAME>

deno uninstall -h|--help
```

## Description

When uninstalling, the installation root is determined in the following order:

- --root option
- DENO_INSTALL_ROOT environment variable
- $HOME/.deno

## Arguments

`NAME`

The name of the script to uninstall.

## Options

- `--root <root>` Installation root

- `-g, --global` Remove globally installed package or module

- `-q, --quiet` Suppress diagnostic output

- `-h, --help`

  Prints help information

## Examples

- Uninstall `serve`

```bash
deno uninstall serve
```

- Uninstall `serve` from a specific installation root

```bash
deno uninstall --root /usr/local serve
```
