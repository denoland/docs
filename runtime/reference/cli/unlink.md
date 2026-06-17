---
last_modified: 2026-06-17
title: "deno unlink"
command: unlink
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno unlink"
description: "Unlink a local JSR package from the current project"
---

The `deno unlink` command removes a local package link created with
[`deno link`](/runtime/reference/cli/link/), so imports resolve to the published
registry version again. It edits the
[`links`](/runtime/reference/deno_json/#overriding-packages) array in the nearest
`deno.json` for you.

## Removing a link

You can remove an entry by its path or by the linked package's JSR name:

```sh
# By the path you linked
deno unlink ../my-local-pkg

# By the package's JSR name
deno unlink @scope/name
```

Path arguments resolve relative to the current working directory, the same way
[`deno link`](/runtime/reference/cli/link/) resolves them, so `deno unlink
../pkg` matches an entry created by `deno link ../pkg` from the same directory.
When the `links` array becomes empty it is removed entirely.

If no argument matches a linked entry, `deno unlink` exits with a non-zero status
rather than reporting success, so a mistyped path or name is detectable in
scripts and CI. It never creates a `deno.json`: if there is none, there are no
linked packages to remove.
