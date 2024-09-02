---
title: "Import Maps"
oldUrl:
 - /runtime/manual/basics/modules/import_maps/
 - /runtime/basics/import_maps/
 - /runtime/manual/linking_to_external_code/import_maps
---

In order for Deno to resolve a _bare specifier_ like `"react"` or `"lodash"`, it
needs to be told where to look for it. Does `"lodash"` refer to an module in our
project or does it refer to a third party dependency? Deno needs to know where
to resolve the import specifier `lodash` to.

```ts
import lodash from "lodash";
```

We can point Deno to the `lodash` package on npm, for example, by adding it to
the `"imports"` section in `deno.json`.

```json
{
  "imports": {
    "lodash": "npm:lodash@^4.17"
  }
}
```

The `"imports"` section in `deno.json` is often referred to as an `import map`
that is based on the
[Import Maps Standard](https://github.com/WICG/import-maps).

You may have seen Node and npm use `package.json` and the `node_modules` folder
to do similar package resolution.

The `deno.json` file is auto-discovered and acts (among other things) as an
import map.
[Read more about `deno.json` here](../getting_started/configuration_file.md).

Using third party modules is explained further in
[ECMAScript Modules](./modules/).

## Custom path mappings

The import map in `deno.json` can be used for more general path mapping of
specifiers. You can map an exact specifiers to a third party module or a file
directly, or you can map a part of an import specifier to a directory.

```jsonc title="deno.jsonc"
{
  "imports": {
    // Map to an exact file
    "foo": "./some/long/path/foo.ts",
    // Map to a directory, usage: "bar/file.ts"
    "bar/": "./some/folder/bar/"
  }
}
```

Usage:

```ts
import * as foo from "foo";
import * as bar from "bar/file.ts";
```

Path mapping of import specifies is commonly used in larger code bases for
brevity.

To use your project root for absolute imports:

```json title="deno.json"
{
  "imports": {
    "/": "./",
    "./": "./"
  }
}
```

```ts title="main.ts"
import { MyUtil } from "/util.ts";
```

This causes import specifiers starting with `/` to be resolved relative to the
import map's URL or file path.
