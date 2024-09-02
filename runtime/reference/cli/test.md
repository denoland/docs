---
title: "deno test"
oldUrl: /runtime/reference/cli/test/
---

Run tests using Deno's built-in test runner.

## Command

`deno test [OPTIONS] [files]... [-- [SCRIPT_ARG]...]`

## Synopsis

```bash
deno test [--no-check[=<NO_CHECK_TYPE>]] [--import-map <FILE>] [-q|--quiet] 
[--no-remote] [--no-npm] [--node-modules-dir[=<node-modules-dir>]]
[--vendor[=<vendor>]][-c|--config <FILE>] [--no-config] 
[-r|--reload[=<CACHE_BLOCKLIST>...]] [--lock [<FILE>]] [--lock-write] 
[--no-lock] [--cert <FILE>] [--allow-read[=<PATH>...]] [--deny-read[=<PATH>...]]
[--allow-write[=<PATH>...]] [--deny-write[=<PATH>...]] 
[--allow-net[=<IP_OR_HOSTNAME>...]] [--deny-net[=<IP_OR_HOSTNAME>...]] 
[--allow-env[=<VARIABLE_NAME>...]] [--deny-env[=<VARIABLE_NAME>...]] 
[--allow-run[=<PROGRAM_NAME>...]] [--deny-run[=<PROGRAM_NAME>...]] 
[--allow-ffi[=<PATH>...]] [--deny-ffi[=<PATH>...]] [--allow-hrtime] [--deny-hrtime] [--allow-all] [--no-prompt] [--inspect[=<HOST_AND_PORT>]] 
[--inspect-brk[=<HOST_AND_PORT>]] [--inspect-wait[=<HOST_AND_PORT>]] 
[--cached-only] [--location <HREF>] [--v8-flags[=<v8-flags>...]]
[--seed <NUMBER>] [--check[=<CHECK_TYPE>]] [--ignore=<ignore>...]
[--no-run] [--trace-leaks] [--doc] [--fail-fast[=<N>]] [--allow-none]
[--filter <filter>] [--shuffle[=<NUMBER>]] [--coverage[=<DIR>] [--parallel]
[--watch] [--watch-exclude[=<FILES>...]] [--no-clear-screen] [--junit-path <PATH>] [--reporter <reporter>] [--env[=<FILE>]] <FILES>... [-- [SCRIPT_ARG]...]

deno test -h|--help
```

## Description

Evaluate the given modules, run all tests declared with 'Deno.test()' and report
results to standard output:

```bash
deno test
```

Directory arguments are expanded to all contained files matching the glob
`{__,_.,}test.{js,mjs,ts,mts,jsx,tsx}`

The test runner is rich in functionality and supports a number of options.

It can be executed in watch mode (`--watch`), supports parallel execution
(`--parallel`), and can be configured to run tests in a random order with
(`--shuffle`). Additionally, there is built in support for code coverage
(`--coverage`) and leak detection (`--trace-leaks`).

## Arguments

`FILES`

List of file names to run

`SCRIPT_ARG`

Arguments passed to script files

## Options

- `--no-check[=<NO_CHECK_TYPE>]`\
  Skip type-checking. If the value of '--no-check=remote' is supplied,
  diagnostic errors from remote modules will be ignored.

- `--import-map <FILE>`\
  Load [import map](https://docs.deno.com/runtime/manual/basics/import_maps)
  file from local file or remote URL.

- `-q, --quiet` Suppress diagnostic output

- `--no-remote`\
  Do not resolve remote modules

- `--no-npm`\
  Do not resolve npm modules

- `--node-modules-dir[=<node-modules-dir>]`\
  Enables or disables the use of a local node_modules folder for npm packages.
  [possible values: true, false]

- `--vendor[=<vendor>]`\
  UNSTABLE: Enables or disables the use of a local vendor folder for remote
  modules and node_modules folder for npm packages. [possible values: true,
  false]

- `-c, --config <FILE>` The
  [configuration file](https://deno.land/manual/getting_started/configuration_file)
  can be used to configure different aspects of deno including TypeScript,
  linting, and code formatting. Typically the configuration file will be called
  `deno.json` or `deno.jsonc` and automatically detected; in that case this flag
  is not necessary.

- `--no-config`\
  Disable automatic loading of the configuration file.

- `-r, --reload[=<CACHE_BLOCKLIST>...]` Reload source code cache (recompile
  TypeScript)

  `--reload` Reload everything `--reload=jsr:@std/http/file-server` Reload only
  standard modules
  `--reload=jsr:@std/http/file-server,jsr:@std/assert/assert-equals` Reloads
  specific modules `--reload=npm:` Reload all npm modules `--reload=npm:chalk`
  Reload specific npm module

- `--lock [<FILE>]`\
  Check the specified lock file. If value is not provided, defaults to
  "deno.lock" in the current working directory.

- `--lock-write`\
  Force overwriting the lock file.

- `--no-lock`\
  Disable auto discovery of the lock file.

- `--cert <FILE>`\
  Load certificate authority from PEM encoded file

- `--no-prompt`\
  Always throw if required permission wasn't passed

- `--inspect[=<HOST_AND_PORT>]`\
  Activate inspector on host:port (default: 127.0.0.1:9229)

- `--inspect-brk[=<HOST_AND_PORT>]`\
  Activate inspector on host:port, wait for debugger to connect and break at the
  start of user script

- `--inspect-wait[=<HOST_AND_PORT>]`\
  Activate inspector on host:port and wait for debugger to connect before
  running user code

- `--cached-only`\
  Require that remote dependencies are already cached

- `--location <HREF>`\
  Value of `globalThis.location` used by some web APIs

- `--v8-flags[=<v8-flags>...]`\
  To see a list of all available flags use `--v8-flags=--help`. Any flags set
  with this flag are appended after the `DENO_V8_FLAGS` environmental variable

- `--seed <NUMBER>`\
  Set the random number generator seed

- `--check[=<CHECK_TYPE>]`\
  Set type-checking behavior. This subcommand type-checks local modules by
  default, so adding `--check` is redundant. If the value of '--check=all' is
  supplied, diagnostic errors from remote modules will be included.
  Alternatively, the 'deno check' subcommand can be used.

- `--ignore=<ignore>...`\
  Ignore files

- `--no-run`\
  Cache test modules, but don't run tests

- `--trace-leaks`\
  Enable tracing of leaks. Useful when debugging leaking ops in test, but
  impacts test execution time.

- `--doc`\
  Type-check code blocks in JSDoc and Markdown

- `--fail-fast[=<N>]`\
  Stop after N errors. Defaults to stopping after first failure.

- `--allow-none`\
  Don't return error code if no test files are found

- `--filter <filter>`\
  Run tests with this string or pattern in the test name

- `--shuffle[=<NUMBER>]`\
  Shuffle the order in which the tests are run

- `--coverage[=<DIR>]`\
  Collect coverage profile data into DIR. If DIR is not specified, it uses
  `coverage/`.

- `--parallel`\
  Run test modules in parallel. Parallelism defaults to the number of available
  CPUs or the value in the DENO_JOBS environment variable.

- `--watch`\
  Watch for file changes and restart process automatically. Only local files
  from entry point module graph are watched.

- `--watch-exclude[=<FILES>...]`\
  Exclude provided files/patterns from watch mode

- `--no-clear-screen`\
  Do not clear terminal screen when under watch mode

- `--junit-path <PATH>`\
  Write a JUnit XML test report to PATH. Use `-` to write to stdout which is the
  default when PATH is not provided.

- `--reporter <reporter>`\
  Select reporter to use. Default to 'pretty'. [possible values: pretty, dot,
  junit, tap]

- `--env[=<FILE>]`\
  UNSTABLE: Load environment variables from local file. Only the first
  environment variable with a given key is used. Existing process environment
  variables are not overwritten.

- `-h, --help`\
  Prints help information

<details>
    <summary>Permissions Options</summary>
    - `--allow-read[=<PATH>...]`\
    Allow [file system read access](https://deno.land/manual/basics/permissions). Optionally specify allowed paths.
    Examples: `--allow-read`, `--allow-read="/etc,/var/log.txt"`

    - `--deny-read[=<PATH>...]`\
        Deny [file system read access](https://deno.land/manual/basics/permissions). Optionally specify denied paths.
        Examples: `--deny-read`, `--deny-read="/etc,/var/log.txt"`

    - `--allow-write[=<PATH>...]`\
        Allow [file system write access](https://deno.land/manual/basics/permissions). Optionally specify allowed paths.
        Examples: `--allow-write`, `--allow-write="/etc,/var/log.txt"`

    - `--deny-write[=<PATH>...]`\
        Deny [file system write access](https://deno.land/manual/basics/permissions). Optionally specify denied paths.
        Examples: `--deny-write`, `--deny-write="/etc,/var/log.txt"`

    - `--allow-net[=<IP_OR_HOSTNAME>...]` \
        Allow [network access](https://deno.land/manual/basics/permissions). Optionally specify allowed IP addresses and host names, with ports as necessary.
        Examples: `--allow-net`, `--allow-net="localhost:8080,deno.land"`

    - `--deny-net[=<IP_OR_HOSTNAME>...]`\
        Deny [network access](https://deno.land/manual/basics/permissions). Optionally specify denied IP addresses and host names, with ports as necessary.
        Examples: `--deny-net`, `--deny-net="localhost:8080,deno.land"`

    - `--unsafely-ignore-certificate-errors[=<HOSTNAMES>...]`\
        DANGER: Disables verification of TLS certificates

    - `--allow-env[=<VARIABLE_NAME>...]`\
        Allow [access to system environment information](https://deno.land/manual/basics/permissions). Optionally specify accessible environment variables.
        Examples: `--allow-env`, `--allow-env="PORT,HOME,PATH"`

    - `--deny-env[=<VARIABLE_NAME>...]`\
        Deny [access to system environment information](https://deno.land/manual/basics/permissions). Optionally specify accessible environment variables.
        Examples: `--deny-env`, `--deny-env="PORT,HOME,PATH"`

    - `--allow-sys[=<API_NAME>...]`\
        Allow [access to OS information](https://deno.land/manual/basics/permissions). Optionally allow
        specific APIs by function name.
        Examples: `--allow-sys`, `--allow-sys="systemMemoryInfo,osRelease"`

    - `--deny-sys[=<API_NAME>...]`\
        Deny [access to OS information](https://deno.land/manual/basics/permissions). Optionally deny
        specific APIs by function name.
        Examples: `--deny-sys`, `--deny-sys="systemMemoryInfo,osRelease"`

    - `--allow-run[=<PROGRAM_NAME>...]`\
        Allow [running subprocesses](https://deno.land/manual/basics/permissions). Optionally
        specify allowed runnable program names.
        Examples: `--allow-run`, `--allow-run="whoami,ps"`

    - `--deny-run[=<PROGRAM_NAME>...]`\
        Deny [running subprocesses](https://deno.land/manual/basics/permissions). Optionally specify denied runnable program names.
        Examples: `--deny-run`, `--deny-run="whoami,ps"`

    - `--allow-ffi[=<PATH>...]`\
        (Unstable) Allow loading dynamic libraries. Optionally specify [allowed directories or files](https://deno.land/manual/basics/permissions).
        Examples: `--allow-ffi`, `--allow-ffi="./libfoo.so"`

    - `--deny-ffi[=<PATH>...]`\
        (Unstable) Deny [loading dynamic libraries](https://deno.land/manual/basics/permissions). Optionally specify denied directories or files.
        Examples: `--deny-ffi`, `--deny-ffi="./libfoo.so"`

    - `--allow-hrtime`\
        Allow [high-resolution time measurement](https://deno.land/manual/basics/permissions). Note: this can enable timing attacks and fingerprinting.

    - `--deny-hrtime`\
        Deny [high-resolution time measurement](https://deno.land/manual/basics/permissions). Note: this can prevent
    timing attacks and fingerprinting.

    - `-A, --allow-all`\
        Allow [all permissions](https://deno.land/manual/basics/permissions).

</details>

## Examples

- Run tests

```bash
deno test
```

- Run tests in specific files

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

- Run tests where glob matches

```bash
deno test src/*.test.ts
```

- Run tests and skip type-checking

```bash
deno test --no-check
```

- Run tests, re-running on file change

```bash
deno test --watch
```

- Reload everything

```bash
--reload
```

- Reload only standard modules

```bash
--reload=jsr:@std/http/file-server
```

- Reloads specific modules

```bash
--reload=jsr:@std/http/file-server,jsr:@std/assert/assert-equals
```

- Reload all npm modules

```bash
--reload=npm:
```

- Reload specific npm module

```bash
--reload=npm:chalk
```
