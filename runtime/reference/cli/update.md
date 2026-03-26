---
title: "deno update"
command: update
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno update"
description: "Update outdated dependencies with an interactive CLI"
---

## Updating dependencies

By default, the `update` subcommand will only update dependencies to
semver-compatible versions (i.e. it won't update to a breaking version).

```bash
$ deno update
Updated 1 dependency:
 - jsr:@std/fmt 1.0.0 -> 1.0.3
```

To update to the latest versions (regardless of whether it's semver compatible),
pass the `--latest` flag.

```bash
$ deno update --latest
Updated 3 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.8
 - jsr:@std/fmt   1.0.0 -> 1.0.3
 - npm:chalk      4.1.2 -> 5.3.0
```

## Selecting packages

The `update` subcommand also supports selecting which packages to operate on.

```bash
$ deno update --latest chalk
Updated 1 dependency:
 - npm:chalk 4.1.2 -> 5.3.0
```

Multiple selectors can be passed, and wildcards (`*`) or exclusions (`!`) are
also supported.

For instance, to update all packages with the `@std` scope, except for
`@std/fmt`:

```bash
$ deno update --latest "@std/*" "!@std/fmt"
Updated 1 dependency:
 - jsr:@std/async 1.0.1 -> 1.0.8
```

Note that if you use wildcards, you will probably need to surround the argument
in quotes to prevent the shell from trying to expand them.

### Updating to specific versions

In addition to selecting packages to update, the `--update` flag also supports
selecting the new _version_ specifying the version after `@`.

```bash
❯ deno update chalk@5.2 @std/async@1.0.6
Updated 2 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.6
 - npm:chalk      4.1.2 -> 5.2.0
```

## Workspaces

In a workspace setting, by default `update` will only operate on the _current_
workspace member.

For instance, given a workspace:

```json
{
  "workspace": ["./member-a", "./member-b"]
}
```

Running

```bash
deno update
```

from the `./member-a` directory will only update dependencies listed in
`./member-a/deno.json` or `./member-a/package.json`.

To include all workspace members, pass the `--recursive` flag (the `-r`
shorthand is also accepted)

```bash
deno update --recursive
deno update --latest -r
```
