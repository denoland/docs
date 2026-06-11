---
title: "Configure a monorepo with workspaces"
description: "Set up a Deno workspace with multiple packages: member names and exports, glob patterns, root-only options, shared imports, and centralized dependency versions with catalogs."
url: /examples/workspaces_monorepo_tutorial/
---

A workspace is a collection of folders, each with its own `deno.json` or
`package.json`, managed from a single root. Members can import each other by
name, share dependencies, and run tools like `deno test` and `deno fmt` across
the whole repository at once.

## Create the workspace

The root `deno.json` lists the member directories:

```json title="deno.json"
{
  "workspace": ["./utils", "./app"]
}
```

Each member gets its own `deno.json` with a `name`, a `version`, and an
`exports` field pointing at its entry point:

```json title="utils/deno.json"
{
  "name": "@acme/utils",
  "version": "0.1.0",
  "exports": "./mod.ts"
}
```

```ts title="utils/mod.ts"
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```json title="app/deno.json"
{
  "name": "@acme/app",
  "version": "0.1.0",
  "exports": "./main.ts"
}
```

Other members import `@acme/utils` by its bare name — no relative paths and no
import map entry needed. Deno finds the member through the root `workspace` list
and resolves the import through its `exports`:

```ts title="app/main.ts"
import { greet } from "@acme/utils";

console.log(greet("workspace"));
```

```sh
$ deno run app/main.ts
Hello, workspace!
```

## Matching members with globs

Listing every member gets tedious in larger repositories. Each `/*` segment
matches one folder depth: `packages/*` matches `packages/foo` but not
`packages/foo/subpackage`.

```json title="deno.json"
{
  "workspace": ["packages/*", "examples/*/*"]
}
```

## Options that must live at the root

Some options control resolution for the whole workspace and are only read from
the root `deno.json`: `nodeModulesDir`, `vendor`, `minimumDependencyAge`,
`links`, `lock`, and `allowScripts`. Setting them in a member has no effect and
Deno will warn about it.

:::note

`name`, `version`, and `exports` go the other way: they belong in members, not
in the root.

:::

## Sharing dependencies from the root

Members inherit the root `imports` map, so common dependencies can be declared
once:

```json title="deno.json"
{
  "workspace": ["./utils", "./app"],
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0"
  }
}
```

A member can declare its own `imports` too; within that member's folder, its
entries override the root's.

Workspace members can also be plain npm packages with only a `package.json` —
see [the workspaces guide](/runtime/fundamentals/workspaces/) for migrating
existing npm workspaces.

## Centralized versions with `catalog:`

Since Deno 2.8, the root can declare a `catalog` of version requirements that
members reference from their `package.json` dependencies with the `catalog:`
specifier:

```json title="deno.json"
{
  "workspace": ["./utils", "./app"],
  "catalog": {
    "chalk": "^5.3.0"
  }
}
```

```json title="app/package.json"
{
  "name": "app",
  "dependencies": {
    "chalk": "catalog:"
  }
}
```

To bump every member to a new version, edit the catalog entry once.

For the full option matrix, publishing workspace packages, and `workspace:`
protocol support in `package.json`, see
[Workspaces and monorepos](/runtime/fundamentals/workspaces/).
