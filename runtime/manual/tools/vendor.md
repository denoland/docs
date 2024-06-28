# deno vendor

Download and locally store dependencies specified in a Deno project.

## Command

`deno vendor <script>`

## Synopsis

```bash
deno vendor [--output <output>] [-f|--force] [-q|--quiet] [--no-config]
[-c|--config <FILE>] [--import-map <FILE>] [--lock [<FILE>]]
[--node-modules-dir[=<node-modules-dir>]] [--vendor[=<vendor>]]
[-r|--reload[=<CACHE_BLOCKLIST>...]
[--cert <FILE>]

deno foo -h|--help
```

## Description

The `deno vendor` command will download and locally store external modules that
the Deno script depends on. Dependencies are stored in a specified directory, or
default to a `vendor` directory in the root of your project. This allows the
project to run without needing to fetch its dependencies from the network again,
facilitating offline development and ensuring dependency versions are locked for
consistency.

Example file system tree:

```bash
$ tree
.
├── main.ts
└── vendor
    ├── deno.land
    ├── import_map.json
    └── raw.githubusercontent.com
```

## Arguments

`script` The Deno script to download dependencies for.

## Options

`--output <output>` The directory to output the vendored modules to

`-f, --force` Forcefully overwrite conflicting files in existing output
directory

`-q, --quiet` Suppress diagnostic output

`--no-config` Disable automatic loading of the configuration file.

`-c, --config <FILE>` The configuration file can be used to configure different
aspects of deno including TypeScript, linting, and code formatting. Typically
the configuration file will be called `deno.json` or `deno.jsonc` and
automatically detected; in that case this flag is not necessary. See
https://deno.land/manual@v1.43.6/getting_started/configuration_file

`--import-map <FILE>` Load import map file from local file or remote URL. Docs:
https://docs.deno.com/runtime/manual/basics/import_maps Specification:
https://wicg.github.io/import-maps/ Examples:
https://github.com/WICG/import-maps#the-import-map

`--lock [<FILE>]` Check the specified lock file.

If value is not provided, defaults to "deno.lock" in the current working
directory.

`--node-modules-dir[=<node-modules-dir>]` Enables or disables the use of a local
node_modules folder for npm packages

[possible values: true, false]

`--vendor[=<vendor>]` UNSTABLE: Enables or disables the use of a local vendor
folder for remote modules and node_modules folder for npm packages [possible
values: true, false]

`-r, --reload[=<CACHE_BLOCKLIST>...]` Reload source code cache (recompile
TypeScript) `--reload` Reload everything `--reload=jsr:@std/http/file-server`
Reload only standard modules
`--reload=jsr:@std/http/file-server,jsr:@std/assert/assert-equals` Reloads
specific modules `--reload=npm:` Reload all npm modules `--reload=npm:chalk`
Reload specific npm module

`--cert <FILE>` Load certificate authority from PEM encoded file

`-h, --help` Print help (see a summary with `-h`)

`--unstable` Enable unstable features and APIs

`--unstable-bare-node-builtins` Enable unstable bare node builtins feature

`--unstable-byonm` Enable unstable `bring your own node_modules` feature

`--unstable-sloppy-imports` Enable unstable resolving of specifiers by extension
probing, .js to .ts, and directory probing.

`--unstable-broadcast-channel` Enable unstable `BroadcastChannel` API

`--unstable-cron` Enable unstable Deno.cron API

`--unstable-ffi` Enable unstable FFI APIs

`--unstable-fs` Enable unstable file system APIs

`--unstable-http` Enable unstable HTTP APIs

`--unstable-kv` Enable unstable Key-Value store APIs

`--unstable-net` Enable unstable net APIs

`--unstable-temporal` Enable unstable Temporal API

`--unstable-unsafe-proto` Enable unsafe **proto** support. This is a security
risk.

`--unstable-webgpu` Enable unstable `WebGPU` API

`--unstable-worker-options` Enable unstable Web Worker APIs

## Examples

### Run the command

Suppose you have a Deno script named my_app.ts that imports modules from the
internet. You want to vendor these dependencies into a local directory. The
command would look like this:

`deno vendor main.ts`

The external modules imported in `main.ts` are downloaded and stored in the
`vendor` directory.

```bash
deno vendor main.ts
```

Note that you may specify multiple modules and remote modules when vendoring.

```shell
deno vendor main.ts test.deps.ts https://deno.land/std/path/mod.ts
```

### Running the Vendored Application

After vendoring, you can run `main.ts` without internet access by using the
`--no-remote` flag or the `--cached-only` flag, which forces Deno to use only
locally available modules:

Update your deno.json configuration file to use the local modules:

```json
{
  "vendor": true
}
```

Then run the vendored application with the `--no-remote` flag

or run:

```bash
deno run --no-remote --import-map=vendor/import_map.json main.ts
```

### Define a directory to store the vendored modules

```bash
deno vendor main.ts --output ./my_modules
```

Modules will be stored in the `my_modules` directory.

Run `deno vendor --help` for more details.
