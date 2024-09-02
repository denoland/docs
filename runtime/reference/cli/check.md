---
title: "deno check"
oldUrl: /runtime/reference/cli/check/
---

Type-check a program without execution.

## Command

`deno check [OPTIONS] <FILE>` - Download and type-check `FILE`

## Synopsis

```bash
deno check [--import-map <FILE>] [--no-remote] [-q|--quiet] [--no-npm] 
[--node-modules-dir[=<node-modules-dir>]] [--vendor[=<vendor>]]
[-c|--config <FILE>] [--no-config] [-r|--reload[=<CACHE_BLOCKLIST>...]]
[--lock [<FILE>]] [--lock-write] [--no-lock] [--cert <FILE>] [--all] <FILE>

deno check -h|--help
```

## Description

Type-check without execution.

```ts name="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```

## Arguments

`FILE` - The module entrypoint.

The module entrypoint can be a local file or a remote URL.

## Options

- `--import-map <FILE>`

  Load import map file from local file or remote URL. Docs:
  [https://docs.deno.com/runtime/manual/basics/import_maps](https://docs.deno.com/runtime/manual/basics/import_maps)
  Specification:
  [https://wicg.github.io/import-maps/](https://wicg.github.io/import-maps/)
  Examples:
  [https://github.com/WICG/import-maps#the-import-map](https://github.com/WICG/import-maps#the-import-map)

- `--no-remote`

  Do not resolve remote modules

- `-q, --quiet`

  Suppress diagnostic output

- `--no-npm`

  Do not resolve npm modules

- `--node-modules-dir[=<node-modules-dir>]`

  Enables or disables the use of a local node_modules folder for npm packages

  [possible values: true, false]

- `--vendor[=<vendor>]`

  UNSTABLE: Enables or disables the use of a local vendor folder for remote
  modules and node_modules folder for npm packages

  [possible values: true, false]

- `-c, --config <FILE>`

  The configuration file can be used to configure different aspects of deno
  including TypeScript, linting, and code formatting. Typically the
  configuration file will be called `deno.json` or `deno.jsonc` and
  automatically detected; in that case this flag is not necessary. See
  [https://deno.land/manual@v1.41.3/getting_started/configuration_file](https://deno.land/manual@v1.41.3/getting_started/configuration_file)

- `--no-config`

  Disable automatic loading of the configuration file

- `-r, --reload[=<CACHE_BLOCKLIST>...]`

  Reload source code cache (recompile TypeScript).

  The `CACHE_BLOCKLIST` is a comma separated list of arguments passed to the
  --reload option. E.g.
  `--reload=https://deno.land/std/fs/utils.ts,https://deno.land/std/fmt/colors.ts`

- `--lock [<FILE>]`

  Check the specified lock file. If value is not provided, defaults to
  "deno.lock" in the current working directory.

- `--lock-write`

  Force overwriting the lock file

- `--no-lock`

  Disable auto discovery of the lock file

- `--cert <FILE>`

  Load the certificate from a
  [PEM encoded file](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)

- `--all` Type-check all code, including remote modules and npm packages

  If the value of '--check=all' is supplied, diagnostic errors from remote
  modules will be included.

- `-h, --help`

  Print help (see a summary with '-h')

## Examples

- Type check a local file

  ```bash
  deno check example.ts
  ```
