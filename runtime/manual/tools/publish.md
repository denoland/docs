# deno publish

*This applies to `deno` v.1.17.0. and above.* **Unstable preview feature**.

Publish a package or workspace to [JSR](https://jsr.io/).

## Command

`deno publish [OPTIONS]` - Publish the current working directory's package or workspace.

## Synopsis

```bash
deno publish [--token <token>] [-c|--config <FILE>] [-q|--quiet]
[--no-config] [--dry-run] [--allow-slow-types] [--allow-dirty]
[--no-provenance] [--check[=<CHECK_TYPE>]] [--no-check[=<NO_CHECK_TYPE>]]

deno publish -h|--help
```

## Description

The `deno publish` command is used to publish a package or workspace to [JSR](https://jsr.io/).

The command will upload the package to the registry and make it available for others to use.

## Package Requirements

Your package must have a `name` and `version` and an `exports` field in its `deno.json` file.

- The `name` field must be unique and follow the `@<scope_name>/<package_name>` convention.
- The `version` field must be a valid semver version.
- The `exports` field must point to the main entry point of the package.

Example:

```json title="deno.json"
{
  "name": "@scope_name/package_name",
  "version": "1.0.0",
  "exports": "./main.ts"
}
```

Before you publish your package, you must create it in the registry by visiting [JSR - Publish a package](https://jsr.io/new).

## Arguments

There are no required arguments for this command - it should be run from within your package or workspace directory.

## Options

- `--token <token>`

    The API token to use when publishing. If unset, interactive authentication will be used

- `-c, --config <FILE>`

    The configuration file can be used to configure different aspects of
    deno including TypeScript, linting, and code formatting. Typically the
    configuration file will be called `deno.json` or `deno.jsonc` and
    automatically detected; in that case this flag is not necessary.
    See [https://deno.land/manual@v1.41.3/getting_started/configuration_file](https://deno.land/manual@v1.41.3/getting_started/configuration_file)

- `-q, --quiet`

    Suppress diagnostic output

- `--no-config`

    Disable automatic loading of the configuration file.

- `--dry-run`

    Prepare the package for publishing performing all checks and validations without uploading

- `--allow-slow-types`

    Allow publishing with slow types

- `--allow-dirty`

    Allow publishing if the repository has uncommitted changed

- `--no-provenance`

    Disable provenance attestation. Enabled by default on Github actions, publicly links the package to where it was built and published from.

- `--check[=<CHECK_TYPE>]`

    Set type-checking behavior. This subcommand type-checks local modules by
    default, so adding --check is redundant.
    If the value of '--check=all' is supplied, diagnostic errors from remote modules
    will be included.

    Alternatively, the 'deno check' subcommand can be used.

- `--no-check[=<NO_CHECK_TYPE>]`

    Skip type-checking. If the value of '--no-check=remote' is supplied,
    diagnostic errors from remote modules will be ignored

- `-h, --help`

    Print help (see a summary with '-h')

## Examples

- Publish your current workspace

```bash
deno publish
```

- Publish your current workspace with a specific token, bypassing interactive authentication

```bash
deno publish --token c00921b1-0d4f-4d18-b8c8-ac98227f9275
```

- Publish and check for errors in remote modules

```bash
deno publish --check=all
```

- Publish using settings from a specific configuration file

```bash
deno publish --config custom-config.json
```
