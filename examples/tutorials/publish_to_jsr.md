---
title: "Publish a package to JSR"
description: "Walk through publishing a Deno package to JSR step by step: package metadata in deno.json, documentation comments, a dry run, publishing from the CLI, and automated publishing from GitHub Actions."
url: /examples/publish_to_jsr_tutorial/
---

[JSR](https://jsr.io) is the open source package registry built for TypeScript.
You publish TypeScript source directly: no build step, no generated type
declarations, and JSR renders documentation straight from your doc comments.
This tutorial publishes a small package from scratch.

## Set up the package

A JSR package is a directory with a `deno.json` that declares a name, version,
and exports. The name is always scoped: `@<scope>/<package>`.

```json title="deno.json"
{
  "name": "@scope/greet",
  "version": "0.1.0",
  "license": "MIT",
  "exports": "./mod.ts"
}
```

`exports` maps entrypoints to files. A string is shorthand for the single
default entrypoint; an object publishes several:

```json
{
  "exports": {
    ".": "./mod.ts",
    "./cli": "./cli.ts"
  }
}
```

## Write the module

JSR generates the package documentation from JSDoc comments on your exported
symbols, so the comment you write here is what users see on the package page:

````ts title="mod.ts"
/** Greet someone by name.
 *
 * @example
 * ```ts
 * import { greet } from "@scope/greet";
 * greet("world"); // "Hello, world!"
 * ```
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
````

JSR requires the public API to have no "slow types": exported functions need
explicit return types rather than inferred ones, so that JSR can generate
documentation and type declarations without running the TypeScript compiler over
your whole dependency graph. The return type on `greet` above is there for that
reason.

## Dry run

`deno publish --dry-run` performs every check publishing would, including type
checking, slow type analysis, and listing exactly which files would be uploaded,
without contacting the registry:

```sh
$ deno publish --dry-run
Check file:///tmp/greet/mod.ts
Checking for slow types in the public API...
Simulating publish of @scope/greet@0.1.0 with files:
   file:///tmp/greet/deno.json (96B)
   file:///tmp/greet/mod.ts (217B)
Success Dry run complete
```

By default every file in the directory is included. Control this with the
`publish` field in `deno.json`:

```json
{
  "publish": {
    "include": ["mod.ts", "src/", "README.md"],
    "exclude": ["**/*_test.ts"]
  }
}
```

## Create the scope and publish

Scopes are created once on [jsr.io](https://jsr.io): sign in with GitHub, create
the scope, and optionally create the package (publishing can also create it on
the fly). Then:

```sh
deno publish
```

The CLI opens your browser for a one-time authorization of this publish, then
uploads the files from the dry-run list. The new version is live immediately,
and consumers can add it with:

```sh
deno add jsr:@scope/greet
```

Versions on JSR are immutable: to ship a fix, bump `version` in `deno.json` and
publish again.

## Publish from GitHub Actions

For releases driven by CI, link the package to its GitHub repository in the
package settings on jsr.io. JSR then accepts publishes from that repository's
GitHub Actions with no tokens to manage, using OIDC, and marks the version with
a provenance attestation:

```yaml title=".github/workflows/publish.yml"
name: Publish
on:
  push:
    tags: ["v*"]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # required for OIDC auth with JSR
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
      - run: deno publish
```

Pushing a `v0.1.1` tag now runs the same checks as the dry run and publishes the
new version.
