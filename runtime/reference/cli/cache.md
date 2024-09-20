---
title: "deno cache"
oldUrl: /runtime/manual/tools/cache/
---

Cache and compile remote dependencies recursively.

## Command

`deno cache [OPTIONS] <FILE>` - Caches dependencies of `FILE`.

## Synopsis

```bash
deno cache [--no-check[=<NO_CHECK_TYPE>]] [--import-map <FILE>] [-q|--quiet] 
[--no-remote] [--no-npm] [--node-modules-dir[=<node-modules-dir>]] [--vendor[=<vendor>]]
[-c|--config <FILE>] [--no-config] [-r|--reload[=<CACHE_BLOCKLIST>...]]
[--lock [<FILE>]] [--frozen] [--no-lock] [--cert <FILE>] [--check[=<CHECK_TYPE>]] <FILE>

deno cache -h|--help
```

## Description

Pre-download and compile remote dependencies along with their static imports,
storing them in the local cache.

All of the static dependencies are saved in the local cache, without running any
code. This ensures faster execution times for scripts that have already been
cached by avoiding unnecessary network requests and recompilation.

## Cache Location

Modules cached using `deno cache` are stored in `$DENO_DIR`, a centralized
directory. Its location varies by OS. For instance, on macOS, it's typically
`/Users/user/Library/Caches/deno`.

You can see the cache location by running `deno info` with no arguments.

## Cache Invalidation

Future runs of this module will trigger no downloads or compilation unless the
`--reload` option is specified.

## Arguments

`FILE` - The module entrypoint.

The module entrypoint can be a local file or a remote URL. Dependencies are
detected from it's imports.

## Options

- `--no-check[=<NO_CHECK_TYPE>]`

  Skip type-checking. If the value of '--no-check=remote' is supplied,
  diagnostic errors from remote modules will be ignored.

- `--import-map <FILE>`

  Load import map file from local file or remote URL. Docs:
  [https://docs.deno.com/runtime/manual/basics/import_maps](https://docs.deno.com/runtime/manual/basics/import_maps)
  Specification:
  [https://wicg.github.io/import-maps/](https://wicg.github.io/import-maps/)
  Examples:
  [https://github.com/WICG/import-maps#the-import-map](https://github.com/WICG/import-maps#the-import-map)

- `-q, --quiet`

  Suppress diagnostic output

- `--no-remote`

  Do not resolve remote modules

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
  --reload option.

  E.g.
  `--reload=https://deno.land/std/fs/utils.ts,https://deno.land/std/fmt/colors.ts`

- `--lock [<FILE>]`

  Check the specified lock file. If value is not provided, defaults to
  "deno.lock" in the current working directory.

- `--frozen[=<BOOLEAN>]`

  Error out if lockfile is out of date [possible values: true, false]

- `--no-lock`

  Disable auto discovery of the lock file

- `--cert <FILE>`

  Load the certificate from a
  [PEM encoded file](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)

- `--check[=<CHECK_TYPE>]`

  Enable type-checking. This subcommand does not type-check by default. If the
  value of '--check=all' is supplied, diagnostic errors from remote modules will
  be included.

  Alternatively, the 'deno check' subcommand can be used.

- `-h, --help`

  Print help (see a summary with '-h')

## Examples

- Cache the dependencies of a module

```bash
deno cache jsr:@std/http@0.225.3/file-server
```

- Force a cache update

```bash
deno cache --reload jsr:@std/http@0.225.3/file-server
```

- Cache a known npm module

```bash
deno cache npm:express
```

- Reload everything

```bash
deno cache --reload
```

- Reload only standard modules

```bash
deno cache --reload=https://deno.land/std
```

- Reloads specific modules

```bash
deno cache --reload=https://deno.land/std/fs/utils.ts,https://deno.land/std/fmt/colors.ts
```

- Reload all npm modules

```bash
deno cache --reload=npm:
```

- Reload specific npm module

```bash
deno cache --reload=npm:chalk
```
