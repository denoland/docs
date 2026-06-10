---
last_modified: 2026-05-20
title: "Modules"
description: "Learn how Deno's ECMAScript module system works: importing local and third-party modules, import attributes, import maps, and supported import types such as Wasm and data URLs."
oldUrl:
  - /runtime/manual/basics/modules/
  - /runtime/manual/basics/modules/module_metadata/
  - /runtime/manual/linking_to_external_code
  - /runtime/manual/basics/import_maps/
---

Deno uses
[ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
as its default module system to align with modern JavaScript standards and to
promote a more efficient and consistent development experience. It's the
official standard for JavaScript modules, allows for better tree-shaking,
improved tooling integration, and native support across different environments.

By adopting ECMAScript modules, Deno ensures compatibility with the
ever-evolving JavaScript ecosystem. For developers, this means a streamlined and
predictable module system that avoids the complexities associated with legacy
module formats like CommonJS.

## Importing modules

In this example the `add` function is imported from a local `calc.ts` module.

```ts title="calc.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```ts title="main.ts"
// imports the `calc.ts` module next to this file
import { add } from "./calc.ts";

console.log(add(1, 2)); // 3
```

You can run this example by calling `deno run main.ts` in the directory that
contains both `main.ts` and `calc.ts`.

With ECMAScript modules, local import specifiers must always include the full
file extension. It cannot be omitted.

```ts title="example.ts"
// WRONG: missing file extension
import { add } from "./calc";

// CORRECT: includes file extension
import { add } from "./calc.ts";
```

## Import attributes

Deno supports the `with { type: "json" }` import attribute syntax for importing
JSON files:

```ts
import data from "./data.json" with { type: "json" };

console.log(data.property); // Access JSON data as an object
```

Starting with Deno 2.4 it's possible to import `text` and `bytes` modules too.

```ts
import text from "./log.txt" with { type: "text" };

console.log(typeof text === "string");
// true
console.log(text);
// Hello from a text file
```

:::info `text` imports

Stable in Deno 2.8 and no longer require a flag.

:::

```ts
import bytes from "./image.png" with { type: "bytes" };

console.log(bytes instanceof Uint8Array);
// true
console.log(bytes);
Uint8Array(12) [
//    72, 101, 108, 108, 111,
//    44,  32,  68, 101, 110,
//   111,  33
// ]
```

:::info `bytes` imports

Still experimental. Enable with the `--unstable-raw-imports` CLI flag or the
`unstable.raw-import` option in
[`deno.json`](/runtime/fundamentals/configuration/).

:::

## Deferred module evaluation

Starting in Deno 2.8, the
[TC39 Deferred Module Evaluation proposal](https://github.com/tc39/proposal-defer-import-eval)
is supported. The `import defer` syntax loads a module (including its
dependencies) but does **not** execute its top-level code until you first read a
property from the namespace:

```ts title="main.ts"
import defer * as expensive from "./expensive.ts";

console.log("startup is fast — expensive.ts has not run yet");

// Touching any property triggers synchronous evaluation
console.log(expensive.value);
```

Use it to defer the cost of modules that are only needed conditionally; for
example, error-path code in a CLI tool or feature flags whose implementation is
heavy to initialize.

The proposal is still at TC39 Stage 3, so the syntax is considered experimental
and may change. Standard `import` remains the right default.

## WebAssembly modules

Deno supports importing Wasm modules directly:

```ts
import { add } from "./add.wasm";

console.log(add(1, 2));
```

To learn more, visit
[WebAssembly section](/runtime/reference/wasm/#wasm-modules)

## Data URL imports

Deno supports importing of data URLs, which allows you to import content that
isn't in a separate file. This is useful for testing, prototyping, or when you
need to programmatically generate modules.

You can create modules on the fly using the `data:` URL scheme:

```ts
// Import a simple JavaScript module from a data URL
import * as module from "data:application/javascript;base64,ZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAiSGVsbG8gZnJvbSBkYXRhIFVSTCI7";
console.log(module.message); // Outputs: Hello from data URL

// You can also use the non-base64 format
const plainModule = await import(
  "data:application/javascript,export function greet() { return 'Hi there!'; }"
);
console.log(plainModule.greet()); // Outputs: Hi there!

// A simpler example with text content
const textModule = await import(
  "data:text/plain,export default 'This is plain text'"
);
console.log(textModule.default); // Outputs: This is plain text
```

The data URL format follows this pattern:

```sh
data:[<media type>][;base64],<data>
```

For JavaScript modules, use `application/javascript` as the media type.
TypeScript is also supported with `application/typescript`. This feature is
particularly useful for testing modules in isolation and creating mock modules
during tests.

## Importing third party modules and libraries

When working with third-party modules in Deno, use the same `import` syntax as
you do for local code. Third party modules are typically imported from a remote
registry and start with `jsr:` , `npm:` or `https://`.

```ts title="main.ts"
import { camelCase } from "jsr:@luca/cases@1.0.0";
import { say } from "npm:cowsay@1.6.0";
import { pascalCase } from "https://deno.land/x/case/mod.ts";
```

Deno recommends [JSR](https://jsr.io), the modern JavaScript registry, for third
party modules. There, you'll find plenty of well documented ES modules for your
projects, including the [Deno Standard Library](/runtime/reference/std/).

You can
[read more about Deno's support for npm packages here](/runtime/fundamentals/node/#using-npm-modules).

## Managing third party modules and libraries

Typing out the module name with the full version specifier can become tedious
when importing them in multiple files. You can centralize management of remote
modules with an `imports` field in your `deno.json` file. We call this `imports`
field the **import map**, which is based on the [Import Maps Standard].

[Import Maps Standard]: https://html.spec.whatwg.org/multipage/webappapis.html#import-maps

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0",
    "cowsay": "npm:cowsay@^1.6.0",
    "cases": "https://deno.land/x/case/mod.ts"
  }
}
```

With remapped specifiers, the code looks cleaner:

```ts title="main.ts"
import { camelCase } from "@luca/cases";
import { say } from "cowsay";
import { pascalCase } from "cases";
```

The remapped name can be any valid specifier. It's a very powerful feature in
Deno that can remap anything. Learn more in the
[configuration dependencies section](/runtime/reference/deno_json/#dependencies).

## Differentiating between `imports` or `importMap` in `deno.json` and `--import-map` option

The [Import Maps Standard] requires two entries for each module: one for the
module specifier and another for the specifier with a trailing `/`. This is
because the standard allows only one entry per module specifier, and the
trailing `/` indicates that the specifier refers to a directory. For example,
when using the `--import-map import_map.json` option, the `import_map.json` file
must include both entries for each module (note the use of `jsr:/@std/async`
instead of `jsr:@std/async`):

```json title="import_map.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0",
    "@std/async/": "jsr:/@std/async@^1.0.0/"
  }
}
```

An `import_map.json` file referenced by the `importMap` field in `deno.json`
behaves exactly the same as using the `--import-map` option, with the same
requirements for including both entries for each module as shown above.

In contrast, `deno.json` extends the import maps standard. When you use the
imports field in `deno.json`, you only need to specify the module specifier
without the trailing `/`:

```json title="deno.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0"
  }
}
```

## Managing dependencies

Now that you understand how Deno resolves and imports modules, see the
[Dependency management guide](/runtime/fundamentals/dependency_management/) for
the day-to-day tasks: adding and removing packages with `deno add` /
`deno
remove`, pinning versions, overriding and vendoring dependencies,
lockfiles and integrity checking, supply chain management, publishing your own
modules, and using private registries.
