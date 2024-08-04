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
// 1. ✅ Works fine
await import("jsr:@std/assert");

// 2. ❌ Doesn't work because what's passed to `import` is a variable
const specifier = "jsr:@std/streams";
await import(specifier);

// 3. ❌ Doesn't work because this has an interpolation
const stdModuleName = "path";
await import(`jsr:@std/${stdModuleName}`);

// 4. ❌ Doesn't work because it's dynamic
const rand = Math.random();
const mod = rand < 0.5 ? "npm:cowsay" : "npm:node-emoji";
await import(mod);
```

### One exception - dynamic specifiers work for same project files

Specifiers that are dynamically determined are supported if target files
(modules) are included in the same project.

```ts title="Dynamic specifiers work for files in the same project"
// ✅ Works fine
await import("./my_module1.ts");

// ✅ Works fine
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

[dynamic import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[eszip]: https://github.com/denoland/eszip
