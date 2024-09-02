---
title: "deno upgrade"
oldUrl: /runtime/reference/cli/upgrade/
---

Upgrade deno executable to the given version.

## Command

`deno upgrade [OPTIONS]` - Upgrade the deno executable.

## Synopsis

```bash
deno upgrade [--version <version>] [--output <output>] [-q|--quiet] 
[--dry-run] [-f|--force] [--canary] [--cert <FILE>]

deno upgrade -h|--help
```

## Description

Defaults to the latest version of Deno. The version is downloaded from
[https://github.com/denoland/deno/releases](https://github.com/denoland/deno/releases)
and is used to replace the current executable.

## Arguments

There are no required arguments for this command - it should be run from within
your package or workspace directory.

## Options

- `--version <version>`

  The version to upgrade to

- `--output <output>`

  The path to output the updated version to

- `-q, --quiet`

  Suppress diagnostic output

- `--dry-run`

  Perform all checks without replacing the old executable

- `-f, --force`

  Replace current executable even if it is not out of date

- `--canary`

  Upgrade to canary builds

- `--cert <FILE>`

  Load the certificate from a
  [PEM encoded file](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)

- `-h, --help`

  Print help (see a summary with '-h')

## Examples

- Install a specific version of the Deno executable

```bash
deno upgrade --version 1.33.3
```

- Install Deno in a specific location

```bash
deno upgrade --output ./some/local/path
```
