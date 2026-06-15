---
last_modified: 2026-06-12
title: "Publishing packages"
description: "Publish Deno packages to JSR with deno publish, build npm-compatible tarballs with deno pack, and choose the right registry for your library."
oldUrl:
  - /runtime/manual/basics/modules/publishing_modules/
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
---

Any Deno program that defines an export can be published as a package for other
developers to import. This page covers where to publish and how.

## Choose a registry

- **[JSR](https://jsr.io)**: the recommended registry for Deno-first packages.
  It accepts TypeScript directly (no build step), generates documentation from
  your JSDoc comments, and serves packages to Deno, Node.js, and other runtimes.
- **[npm](https://www.npmjs.com/)**: publish here when your consumers are
  primarily on Node.js or need npm tooling. Use
  [`deno pack`](/runtime/reference/cli/pack/) to build an npm-compatible tarball
  from a Deno project, or [dnt](https://github.com/denoland/dnt) for a more
  configurable build pipeline.
- **[deno.land/x](https://deno.com/add_module)**: the legacy registry for HTTPS
  imports. For new packages, prefer JSR.

## Publish to JSR

Give your package a name, a version, and an entry point in `deno.json`:

```json title="deno.json"
{
  "name": "@scope/my-package",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

The name is always scoped (`@scope/name`). Create the scope on
[jsr.io](https://jsr.io) the first time you publish.

Check what will be published, then publish:

```sh
deno publish --dry-run   # verify the file list and metadata
deno publish             # opens jsr.io to authenticate, then publishes
```

`deno publish` type-checks your code and verifies that your exports don't rely
on anything outside the package before uploading. See the
[`deno publish` reference](/runtime/reference/cli/publish/) for flags, and
[Publishing packages on jsr.io](https://jsr.io/docs/publishing-packages) for
scopes, versioning, provenance, and publishing from CI.

To bump the version field between releases, you can use
[`deno bump-version`](/runtime/reference/cli/bump_version/).

## Publish to npm

[`deno pack`](/runtime/reference/cli/pack/) (Deno 2.8+) builds an npm-compatible
tarball from a Deno-first project: it transpiles TypeScript, generates type
declarations, and produces the `package.json` metadata npm expects.

```sh
deno pack                # creates the tarball
npm publish ./package.tgz
```

For older setups or builds that need fine-grained control over the output
(shims, multiple targets, test running during the build), use
[dnt](https://github.com/denoland/dnt), the Deno-to-npm build tool.

## Workspaces

In a [workspace](/runtime/fundamentals/workspaces/), `deno publish` publishes
every workspace member that has a name and version, in dependency order. See
[publishing workspace packages](/runtime/fundamentals/workspaces/#publishing-workspace-packages-to-registries)
for the details.

## Keep going

- [Dependency management](/runtime/packages/): the day-to-day workflow this page
  grew out of
- [`deno publish`](/runtime/reference/cli/publish/) and
  [`deno pack`](/runtime/reference/cli/pack/) references
- [JSR publishing docs](https://jsr.io/docs/publishing-packages)
