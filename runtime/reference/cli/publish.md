---
title: "deno publish"
oldUrl: /runtime/manual/tools/publish/
command: publish
---

## Package Requirements

Your package must have a `name` and `version` and an `exports` field in its
`deno.json` or `jsr.json` file.

- The `name` field must be unique and follow the `@<scope_name>/<package_name>`
  convention.
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

Before you publish your package, you must create it in the registry by visiting
[JSR - Publish a package](https://jsr.io/new).

## Examples

Publish your current workspace

```bash
deno publish
```

Publish your current workspace with a specific token, bypassing interactive
authentication

```bash
deno publish --token c00921b1-0d4f-4d18-b8c8-ac98227f9275
```

Publish and check for errors in remote modules

```bash
deno publish --check=all
```

Perform a dry run to simulate publishing.

```bash
deno publish --dry-run
```

Publish using settings from a specific configuration file

```bash
deno publish --config custom-config.json
```
