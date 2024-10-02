---
title: "Module metadata"
oldUrl:
  - /runtime/manual/examples/module_metadata/
---

## Concepts

- [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)
  can provide information on the context of the module.
- The boolean
  [import.meta.main](https://docs.deno.com/api/web/~/ImportMeta#property_main)
  will let you know if the current module is the program entry point.
- The string
  [import.meta.url](https://docs.deno.com/api/web/~/ImportMeta#property_url)
  will give you the URL of the current module.
- The string
  [import.meta.filename](https://docs.deno.com/api/web/~/ImportMeta#property_filename)
  will give you the fully resolved path to the current module. _For local
  modules only_.
- The string
  [import.meta.dirname](https://docs.deno.com/api/web/~/ImportMeta#property_dirname)
  will give you the fully resolved path to the directory containing the current
  module. _For local modules only_.
- The
  [import.meta.resolve](https://docs.deno.com/api/web/~/ImportMeta#property_resolve)
  allows you to resolve specifier relative to the current module. This function
  takes into account an import map (if one was provided on startup).
- The string [Deno.mainModule](https://docs.deno.com/api/deno/~/Deno.mainModule)
  will give you the URL of the main module entry point, i.e. the module invoked
  by the deno runtime.

## Example

The example below uses two modules to show the difference between
`import.meta.url`, `import.meta.main` and `Deno.mainModule`. In this example,
`module_a.ts` is the main module entry point:

```ts title="module_b.ts"
export function outputB() {
  console.log("Module B's import.meta.url", import.meta.url);
  console.log("Module B's mainModule url", Deno.mainModule);
  console.log(
    "Is module B the main module via import.meta.main?",
    import.meta.main,
  );
}
```

```ts title="module_a.ts"
import { outputB } from "./module_b.ts";

function outputA() {
  console.log("Module A's import.meta.url", import.meta.url);
  console.log("Module A's mainModule url", Deno.mainModule);
  console.log(
    "Is module A the main module via import.meta.main?",
    import.meta.main,
  );
  console.log(
    "Resolved specifier for ./module_b.ts",
    import.meta.resolve("./module_b.ts"),
  );
}

outputA();
console.log("");
outputB();
```

If `module_a.ts` is located in `/home/alice/deno` then the output of
`deno run --allow-read module_a.ts` is:

```console
Module A's import.meta.url file:///home/alice/deno/module_a.ts
Module A's mainModule url file:///home/alice/deno/module_a.ts
Is module A the main module via import.meta.main? true
Resolved specifier for ./module_b.ts file:///home/alice/deno/module_b.ts

Module B's import.meta.url file:///home/alice/deno/module_b.ts
Module B's mainModule url file:///home/alice/deno/module_a.ts
Is module B the main module via import.meta.main? false
```
