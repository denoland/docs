---
title: "Dynamic import"
---

Deno Deploy supports [dynamic import] but with some limitations. This page
outlines these limitations.

### Specifiers must be statically determined string literals

In the usual dynamic import, specifiers don't need to be determined at build
time. So all of the following forms are valid:

```ts title="Valid dynamic imports in Deno CLI"
// 1. Statically determined string literal
await import("jsr:@std/assert");

// 2. Statically determined, but via variable
const specifier = "jsr:@std/assert";
await import(specifier);

// 3. Statically determined, but template literal
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. Dynamically determined
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

In Deno Deploy, however, specifiers must be string literals with no string
interpolation. So among the three examples above, only the first one works in
Deno Deploy.

```ts title="Only static string literals work in Deno Deploy"
// 1. ✅ Works fine on Deno Deploy
await import("jsr:@std/assert");

// 2. ❌ Doesn't work on Deno Deploy
// because what's passed to `import` is a variable
const specifier = "jsr:@std/streams";
await import(specifier);

// 3. ❌ Doesn't work on Deno Deploy
// because this has an interpolation
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. ❌ Doesn't work on Deno Deploy
// because it's dynamic
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

### One exception - dynamic specifiers work for same project files

Specifiers that are dynamically determined are supported if target files
(modules) are included in the same project.

```ts title="Dynamic specifiers work for files in the same project"
// ✅ Works fine on Deno Deploy
await import("./my_module1.ts");

// ✅ Works fine on Deno Deploy
const rand = Math.random();
const modPath = rand < 0.5 ? "dir1/moduleA.ts" : "dir2/dir3/moduleB.ts";
await import(`./${modPath}`);
```

Note that template literals starting with `./` tell the module resolver that the
target module is in the same project. Conversely, if a specifier does not start
with `./`, the possible target modules will not be included the resulting
[eszip], causing dynamic imports to fail at runtime, even if the final evaluated
specifier starts with `./`.

```ts
// ❌ Doesn't work because the analyzer can't statically determine if the
// specifier starts with `./` or not in thie case.
// Compare this to the previous example. Only difference is whether to put
// `./` in the template literal or in the variable.
const rand = Math.random();
const modPath = rand < 0.5 ? "./dir1/moduleA.ts" : "./dir2/dir3/moduleB.ts";
await import(modPath);
```

We will consider if we can relax this constraint in the future.

:::tip What is eszip?

When you do a new deployment on Deno Deploy, the system analyzes your code,
constructs the module graph by recursively traversing it, and bundles all the
dependencies into a single file. We call this
[eszip](https://github.com/denoland/eszip). Since its creation is done
completely statically, dynamic import capabilities are limited on Deno Deploy.

:::

### Data URLs

[Data URL] can be used as a specifier passed to dynamic imports.

```ts title="Static data URL"
// ✅ Works fine on Deno Deploy
const { val } = await import(
  "data:text/javascript,export const val = 42;"
);
console.log(val); // -> 42
```

For data URLs, fully dynamic data is supported.

```ts title="Dynamic data URL"
function generateDynamicDataUrl() {
  const moduleStr = `export const val = ${Math.random()};`;
  return `data:text/javascript,${moduleStr}`;
}

// ✅ Works fine on Deno Deploy
const { val } = await import(generateDynamicDataUrl());
console.log(val); // -> Random value is printed
```

Applying this technique to JavaScript code fetched from the web, you can even
simulate a true dynamic import:

```js title="external.js"
export const name = "external.js";
```

```ts title="Dynamic data URL from fetched source"
import { assert } from "jsr:@std/assert/assert";
const res = await fetch(
  "https://gist.githubusercontent.com/magurotuna/1cacb136f9fd6b786eb8bbad92c8e6d6/raw/56a96fd0d246fd3feabbeecea6ea1155bdf5f50d/external.js",
);
assert(res.ok);
const src = await res.text();
const dataUrl = `data:application/javascript,${src}`;

// ✅ Works fine on Deno Deploy
const { name } = await import(dataUrl);
console.log(`Hello from ${name}`); // -> "Hello from external.js"
```

However, note that data URL given to `import` has to be JavaScript; TypeScript,
when passed, throws a [TypeError] at runtime.

[dynamic import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[eszip]: https://github.com/denoland/eszip
[Data URL]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
[TypeError]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
