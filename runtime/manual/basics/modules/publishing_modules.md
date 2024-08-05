---
title: Publishing Modules
oldUrl:
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
---

Any Deno program that defines an export can be published as a module. This
allows other developers to import and use your code in their own projects.
Modules can be published to [JSR](https://jsr.io).

## Configuring your module

To configure your module for publishing, you need to ensure you have the
following properties defined in a `deno.json` file at the root of your project:

```json title="deno.json"
{
  "name": "@my-scope/my-module",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

In order to publish, you need a
[JSR scope and a new package](https://jsr.io/docs/publishing-packages#creating-a-scope-and-package)
to identify your module. You can create your scope and package at
[jsr.io/new](https://jsr.io/new).

The `name` property in your `deno.json` file is a concatenation of your scope
and package name, separated by a `/`. The `exports` property should point to the
main entry point of your module.

## Publishing your module

Packages can be published to JSR in the CLI with the
[`deno publish` command](https://jsr.io/docs/publishing-packages#publishing-from-your-local-machine).

To publish your module, run the following command in the root of your project:

```bash
deno publish
```

Before publishing, you can use the `--dry-run` flag locally to test the
publishing process, without actually publishing your module. This will print out
a list of all of the files that will be published and can be used to verify that
your module is set up correctly:

```bash
deno publish --dry-run
```

## Authentication

You can publish your modules from the browser at
[jsr.io/new](https://jsr.io/new).

You can also publish your package with a GitHub Action. Link your repository by
following the instructions at
[jsr.io/docs/publishing-packages#publishing-from-github-actions](https://jsr.io/docs/publishing-packages#publishing-from-github-actions).
This will allow you to publish packages without needing to provide an auth token
and instead uses OIDC authentication from GitHub itself.

If you want to publish without the interactive browser window (this is not
recommended), you can use the `--token` flag to provide a JSR auth token:

```bash
deno publish --token <your-auth-token>
```

You can create a new auth token at
[jsr.io/account/tokens](https://jsr.io/account/tokens) (You will need to be
logged in to JSR to view this page).

If you're configuring a CI pipeline to publish your module, you can use the
`--token` flag to authenticate with JSR but it's important to ensure that your
token is kept secure.

## Publishing for Node

Library authors may want to make their Deno modules available to Node.js users.
This is possible by using the [dnt](https://github.com/denoland/dnt) build tool.

dnt allows you to develop your Deno module mostly as-is and use a single Deno
script to build, type check, and test an npm package in an output directory.
Once built, you only need to `npm publish` the output directory to distribute it
to Node.js users.

For more details, see
[https://github.com/denoland/dnt](https://github.com/denoland/dnt).
