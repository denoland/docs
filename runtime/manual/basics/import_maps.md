# Import Maps

In order for Deno to resolve a _bare specifier_ like `"react"` or `"lodash"`, it
needs to be told where to look for it. Does `"lodash"` refer to an npm module or
does it map to an https URL?

```ts
import lodash from "lodash";
```

Node and npm use `package.json` and the `node_modules` folder to do this
resolution. Deno, on the other hand, uses the
[import map](https://github.com/WICG/import-maps) standard.

To make the above `import lodash from "lodash"` work, add the following to the
[`deno.json` configuration file](../getting_started/configuration_file.md).

```json
{
  "imports": {
    "lodash": "https://esm.sh/lodash@4.17.21"
  }
}
```

The `deno.json` file is auto-discovered and acts (among other things) as an
import map.
[Read more about `deno.json` here](../getting_started/configuration_file.md).

This also works with npm specifiers. Instead of the above, we could have also
written something similar in our `deno.json` configuration file:

```json
{
  "imports": {
    "lodash": "npm:lodash@^4.17"
  }
}
```

## Example - Using deno_std's fmt module via `fmt/`

```json title="deno.json"
{
  "imports": {
    "fmt/": "jsr:std/fmt@^0/"
  }
}
```

```ts title="color.ts"
import { red } from "fmt/colors.ts";

console.log(red("hello world"));
```

## Example - Using project root for absolute imports

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

## Overriding imports

The other situation where import maps can be very useful is to override imports
in specific modules.

Let's say you want to override std's assert package import from 0.177.0 to the
latest in all of your imported modules, but for the
`https://deno.land/x/example/` module you want to use files in a local `patched`
directory. You can do this by using a scope in the import map that looks
something like this:

```json
{
  "imports": {
    "jsr:@std/assert@0.177.0": "jsr:@std/assert@^0"
  },
  "scopes": {
    "https://deno.land/x/example/": {
      "https://deno.land/std@0.177.0/": "./patched/"
    }
  }
}
```

## Import Maps are for Applications

It is important to note that import map configuration files are
[only applied for Deno applications][scope], not in the various libraries that
your application code may import. This lets you, the application author, have
final say about what versions of libraries get included in your project.

If you are developing a library, you should instead prefer to use the `deps.ts`
pattern discussed in [Managing Dependencies].

[scope]: https://github.com/WICG/import-maps#scope
[Managing Dependencies]: ../../tutorials/manage_dependencies.md
