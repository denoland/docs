---
last_modified: 2026-06-17
title: "deno link"
command: link
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno link"
description: "Link a local JSR package into the current project for development"
---

The `deno link` command points your project at a local copy of a JSR package so
you can develop against it in place of the published version. It is the
command-line equivalent of editing the
[`links`](/runtime/reference/deno_json/#overriding-packages) array in `deno.json`
by hand, and mirrors the workflow of `npm link` or `bun link`.

## Linking a package

Pass the path to a local package directory:

```sh
deno link ../my-local-pkg
```

The target must be a directory containing a `deno.json` with a JSR-style `name`
field. Deno appends the relative path to the `links` array in the nearest
`deno.json` (creating the array if it does not exist) and then installs
dependencies. The linked package is importable by its bare name, just like a
workspace member, so no `imports` entry is added.

Linking the same path again has no additional effect. You can link several
packages in one command:

```sh
deno link ../pkg-a ../pkg-b
```

## Removing a link

Use [`deno unlink`](/runtime/reference/cli/unlink/) to stop using the local copy:

```sh
deno unlink ../my-local-pkg
```
