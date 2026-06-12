---
title: "Re-map import paths"
description: "Use the imports field in deno.json as an import map: path aliases like @/ for src/, bare names for local modules, and scoped overrides for transitive imports."
url: /examples/import_maps_tutorial/
---

The `imports` field in `deno.json` is an import map: any specifier prefix can be
re-mapped to any location. Besides naming packages, it replaces the `paths`
section of `tsconfig.json` for path aliases like `@/`.

## Alias a directory

A key ending in `/` maps a whole prefix. The common convention aliases the
source root:

```json title="deno.json"
{
  "imports": {
    "@/": "./src/"
  }
}
```

Imports anywhere in the project can now address files from the root instead of
counting `../` segments:

```ts title="src/pages/about.ts"
import { greet } from "@/greet.ts";
```

## Alias a single module

A key without a trailing slash maps one bare name to one file, which reads
nicely for modules used everywhere:

```json title="deno.json"
{
  "imports": {
    "@/": "./src/",
    "logger": "./src/utils/logger.ts"
  }
}
```

```ts title="main.ts"
import { greet } from "@/greet.ts";
import { log } from "logger";

log(greet("import maps"));
```

```sh
$ deno run main.ts
[log] Hello, import maps!
```

## Editor support

The Deno language server reads the same file, so completions and
go-to-definition follow the aliases with no extra `tsconfig.json` configuration.
If you migrate a project that has `compilerOptions.paths`, move those entries
into `imports`.

## Scoped overrides

The standard import map `scopes` field also works, remapping a specifier only
for imports that originate under a given path prefix:

```json title="deno.json"
{
  "imports": {
    "logger": "./src/utils/logger.ts"
  },
  "scopes": {
    "./vendor/": {
      "logger": "./vendor/legacy_logger.ts"
    }
  }
}
```

Modules under `vendor/` get the legacy logger; everything else gets the default.

## Overriding versions in package.json projects

The import map redirects specifiers in your own code. To force a version of a
package deeper in the dependency tree, projects with a `package.json` use its
`overrides` field, which Deno honors the same way npm does:

```json title="package.json"
{
  "dependencies": {
    "debug": "4.4.3"
  },
  "overrides": {
    "ms": "2.1.2"
  }
}
```

`deno install` resolves `ms` to 2.1.2 everywhere it appears in the tree. See
[Overriding transitive dependencies](/examples/add_remove_dependencies_tutorial/#overriding-transitive-dependencies)
for the longer treatment.

For how packages themselves are named and versioned in the import map, see
[Add and remove dependencies](/examples/add_remove_dependencies_tutorial/) and
the [modules documentation](/runtime/fundamentals/modules/).
