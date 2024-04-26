# deno eval

Evaluate JavaScript from the command line.

## Command

`deno eval [OPTIONS] <CODE_ARG>...` - Executes code provided as a string argument.

## Synopsis

```bash
deno eval [--no-check[=<NO_CHECK_TYPE]] [--import-map <FILE>] [-q|--quiet] [--no-remote] [--no-npm] 
[--node-modules-dir[=<node-modules-dir>]] [--vendor[=<vendor>]] [-c|--config <FILE>] [--no-config]
[-r|--reload[=<CACHE_BLOCKLIST>...]] [--lock [<FILE>]] [--lock-write] [--no-lock] [--cert <FILE>]
[--inspect[=<HOST_AND_PORT>]] [--inspect-brk[=<HOST_AND_PORT>]] [--inspect-wait[=<HOST_AND_PORT>]]
[--cached-only] [--location <HREF>] [--v8-flags[=<v8-flags>...]] [--seed <NUMBER>]
[--check[=<CHECK_TYPE>]] [--ext <EXT>] [-p|--print] [--env[=<FILE>]] <CODE_ARG>

deno eval -h|--help
```

## Description

Evaluate JavaScript from the command line.

```bash
deno eval "console.log('hello world')"
```

To evaluate as TypeScript:

```bash
deno eval --ext=ts "const v: string = 'hello'; console.log(v)"
```

This command has implicit access to all permissions (--allow-all).

## Arguments

`CODE_ARG` - A string-literal containing the JavaScript or TypeScript code to evaluate.

## Options

- `--no-check[=<NO_CHECK_TYPE>]`

  Skip type-checking. If the value of '--no-check=remote' is supplied,
  diagnostic errors from remote modules will be ignored.

- `--import-map <FILE>`

  Load import map file from local file or remote URL.
  Docs: [https://docs.deno.com/runtime/manual/basics/import_maps](https://docs.deno.com/runtime/manual/basics/import_maps)
  Specification: [https://wicg.github.io/import-maps/](https://wicg.github.io/import-maps/)
  Examples: [https://github.com/WICG/import-maps#the-import-map](https://github.com/WICG/import-maps#the-import-map)

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

  UNSTABLE: Enables or disables the use of a local vendor folder for remote modules and node_modules folder for npm packages

  [possible values: true, false]

- `-c, --config <FILE>`

  The configuration file can be used to configure different aspects of deno including TypeScript, linting, and code formatting. Typically the configuration file will be called `deno.json` or `deno.jsonc` and automatically detected; in that case this flag is not necessary. See [https://deno.land/manual@v1.41.3/getting_started/configuration_file](https://deno.land/manual@v1.41.3/getting_started/configuration_file)

- `--no-config`

  Disable automatic loading of the configuration file

- `-r, --reload[=<CACHE_BLOCKLIST>...]`

  Reload source code cache (recompile TypeScript).

  The `CACHE_BLOCKLIST` is a comma separated list of arguments passed to the --reload option.

  E.g. `--reload=https://deno.land/std/fs/utils.ts,https://deno.land/std/fmt/colors.ts`

- `--lock [<FILE>]`

  Check the specified lock file. If value is not provided, defaults to "deno.lock" in the current working directory.

- `--lock-write`

  Force overwriting the lock file

- `--no-lock`

  Disable auto discovery of the lock file

- `--cert <FILE>`
  
  Load the certificate from a [PEM encoded file](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)

- `--inspect[=<HOST_AND_PORT>]`

  Activate inspector on host:port (default: 127.0.0.1:9229)

- `--inspect-brk[=<HOST_AND_PORT>]`

  Activate inspector on host:port, wait for debugger to connect and break at the start of user script

- `--inspect-wait[=<HOST_AND_PORT>]`

  Activate inspector on host:port and wait for debugger to connect before running user code

- `--cached-only`

  Require that remote dependencies are already cached

- `--location <HREF>`

  Value of 'globalThis.location' used by some web APIs

- `--v8-flags[=<v8-flags>...]`

  To see a list of all available flags use --v8-flags=--help.
  Any flags set with this flag are appended after the DENO_V8_FLAGS environmental variable

- `--seed <NUMBER>`

  Set the random number generator seed

- `--check[=<CHECK_TYPE>]`

  Enable type-checking. This subcommand does not type-check by default. If the value of '--check=all' is supplied, diagnostic errors from remote modules will be included.

  Alternatively, the 'deno check' subcommand can be used.

- `--ext <EXT>`

  Set content type of the supplied file

  [possible values: ts, tsx, js, jsx]

- `-p, --print`

  print result to stdout

- `--env[=<FILE>]`

  UNSTABLE: Load environment variables from local file. Only the first environment variable with a given key is used. Existing process environment variables are not overwritten.

- `-h, --help`

  Print help (see a summary with '-h')

## Examples

- Execute JavaScript

```bash
deno eval "console.log('hello world')"
```

- Execute TypeScript

```bash
deno eval --ext=ts "const v: string = 'hello'; console.log(v)"
```
