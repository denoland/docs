---
last_modified: 2026-02-25
title: "Configuring TypeScript"
description: "A guide to TypeScript configuration in Deno. Learn about compiler options, type checking JavaScript, JSDoc support, type declarations, and configuring TypeScript for cross-platform compatibility."
oldUrl:
  - /runtime/manual/advanced/typescript/faqs/
  - /runtime/manual/advanced/typescript/migration/
  - /runtime/manual/advanced/typescript/configuration/
  - /runtime/manual/advanced/typescript/types/
  - /runtime/manual/typescript/types/
  - /runtime/manual/advanced/faqs/
  - /runtime/advanced/typescript/configuration/
  - /runtime/manual/typescript/typescript/faqs/
  - /runtime/fundamentals/types/
---

This page covers advanced TypeScript configuration in Deno, including compiler
options, `tsconfig.json` compatibility, and library targeting. For an
introduction to using TypeScript with Deno, see
[TypeScript support](/runtime/fundamentals/typescript/).

## Configuring TypeScript in Deno

Deno aims to simplify TypeScript configuration based on the following design
choices:

- Strict and modern defaults for type-checking rules.
- Allowing the omission of settings relating to the target runtime or
  compatibility, leveraging direct integration with the execution environment.
- Project references using `deno.json` directory scopes.

The last point presents a simpler format than `tsconfig.json`'s
[`references`](https://www.typescriptlang.org/tsconfig/#references) and
[`extends`](https://www.typescriptlang.org/tsconfig/#extends) fields, replacing
them with `deno.json` workspaces and root-member inheritance. See the section on
[type checking in workspaces](/runtime/fundamentals/workspaces/#type-checking).

## `tsconfig.json` compatibility

While using [`tsconfig.json`](https://www.typescriptlang.org/tsconfig/) files is
not recommended for Deno-first projects, existing Node.js + TypeScript
workspaces using them will work out-of-the-box under Deno's type checker and
LSP.

Each workspace directory containing a `deno.json` or `package.json` is probed
for a `tsconfig.json`. If it exists, it is added as a 'root' project reference
and contained references are included recursively.

As with `tsc`, the scope of a TSConfig is determined by its
[root fields](https://www.typescriptlang.org/tsconfig/#root-fields). In case of
overlap:

- A reference takes precedence over its referrer.
- For root references, `foo/bar/tsconfig.json` takes precedence over
  `foo/tsconfig.json`.
- If a parent `deno.json` contains `compilerOptions`, that will take precedence
  over any TSConfig.

The following fields are supported:

```json title="tsconfig.json"
{
  "extends": "...",
  "files": ["..."],
  "include": ["..."],
  "exclude": ["..."],
  "references": [
    { "path": "..." }
  ],
  "compilerOptions": {
    "...": "..."
  }
}
```

Except for `compilerOptions`, these fields cannot be specified in `deno.json`.

You may be forced to use a `tsconfig.json` file when, for example, the required
granularity for [`include`](https://www.typescriptlang.org/tsconfig/#include)
cannot be represented with `deno.json` workspaces and directory scopes.

## TS Compiler Options

Here is a table of compiler options that can be changed, their default in Deno
and any other notes about that option:

| Option                           | Default                 | Notes                                                                                                                                     |
| -------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowUnreachableCode`           | `false`                 |                                                                                                                                           |
| `allowUnusedLabels`              | `false`                 |                                                                                                                                           |
| `baseUrl`                        | `"./"`                  | This is used for resolving bare specifier entries in `paths` and `rootDirs`, but never for bare specifiers in module imports.             |
| `checkJs`                        | `false`                 |                                                                                                                                           |
| `jsx`                            | `"react"`               |                                                                                                                                           |
| `jsxFactory`                     | `"React.createElement"` |                                                                                                                                           |
| `jsxFragmentFactory`             | `"React.Fragment"`      |                                                                                                                                           |
| `keyofStringsOnly`               | `false`                 |                                                                                                                                           |
| `lib`                            | `[ "deno.window" ]`     | The default for this varies based on other settings in Deno. If it is supplied, it overrides the default. See below for more information. |
| `module`                         | `"nodenext"`            | Supported values: `["nodenext", "esnext", "preserve"]`.                                                                                   |
| `moduleResolution`               | `"nodenext"`            | Supported values: `["nodenext", "bundler"]`.                                                                                              |
| `noErrorTruncation`              | `false`                 |                                                                                                                                           |
| `noFallthroughCasesInSwitch`     | `false`                 |                                                                                                                                           |
| `noImplicitAny`                  | `true`                  |                                                                                                                                           |
| `noImplicitOverride`             | `true`                  |                                                                                                                                           |
| `noImplicitReturns`              | `false`                 |                                                                                                                                           |
| `noImplicitThis`                 | `true`                  |                                                                                                                                           |
| `noImplicitUseStrict`            | `true`                  |                                                                                                                                           |
| `noStrictGenericChecks`          | `false`                 |                                                                                                                                           |
| `noUncheckedIndexedAccess`       | `false`                 |                                                                                                                                           |
| `noUnusedLocals`                 | `false`                 |                                                                                                                                           |
| `noUnusedParameters`             | `false`                 |                                                                                                                                           |
| `paths`                          | `{}`                    |                                                                                                                                           |
| `rootDirs`                       | `null`                  |                                                                                                                                           |
| `strict`                         | `true`                  |                                                                                                                                           |
| `strictBindCallApply`            | `true`                  |                                                                                                                                           |
| `strictFunctionTypes`            | `true`                  |                                                                                                                                           |
| `strictNullChecks`               | `true`                  |                                                                                                                                           |
| `strictPropertyInitialization`   | `true`                  |                                                                                                                                           |
| `suppressExcessPropertyErrors`   | `false`                 |                                                                                                                                           |
| `suppressImplicitAnyIndexErrors` | `false`                 |                                                                                                                                           |
| `useUnknownInCatchVariables`     | `true`                  |                                                                                                                                           |

For a full list of compiler options and how they affect TypeScript, please refer
to the
[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Using the "lib" property

If you're working on a project that ships code to multiple runtimes, like
browsers for example, you can tweak the default types via the "lib" property
within the `compilerOptions`.

The built-in libraries that are of interest to users:

- `"deno.ns"` - This includes all the custom `Deno` global namespace APIs plus
  the Deno additions to `import.meta`. This should generally not conflict with
  other libraries or global types.
- `"deno.window"` - This is the "default" library used when checking Deno main
  runtime scripts. It includes the `"deno.ns"` as well as other type libraries
  for the extensions that are built into Deno. This library will conflict with
  libraries like `"dom"` and `"dom.iterable"` that are standard TypeScript
  libraries.
- `"deno.worker"` - This is the library used when checking a Deno web worker
  script. For more information about web workers, check out
  [Type Checking Web Workers](/runtime/reference/ts_config_migration/#type-checking-web-workers).
- `"dom.asynciterable"` - TypeScript currently does not include the DOM async
  iterables that Deno implements (plus several browsers), so we have implemented
  it ourselves until it becomes available in TypeScript.

These are common libraries that are not enabled by default, but are useful when
writing code that is intended to also work in another runtime:

- `"dom"` - The main browser global library that ships with TypeScript. The type
  definitions conflict in many ways with `"deno.window"` and so if `"dom"` is
  used, then consider using just `"deno.ns"` to expose the Deno specific APIs.
- `"dom.iterable"` - The iterable extensions to the browser global library.
- `"scripthost"` - The library for the Microsoft Windows Script Host.
- `"webworker"` - The main library for web workers in the browser. Like `"dom"`
  this will conflict with `"deno.window"` or `"deno.worker"`, so consider using
  just `"deno.ns"` to expose the Deno specific APIs.
- `"webworker.importscripts"` - The library that exposes the `importScripts()`
  API in the web worker.
- `"webworker.iterable"` - The library that adds iterables to objects within a
  web worker. Modern browsers support this.

## Targeting Deno and the Browser

You may want to write code that seamlessly runs in both Deno and the browser. In
this case you'll need to conditionally check the execution environment before
using any APIs exclusive to one or the other. In such cases, a typical
`compilerOptions` configuration might look like this:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

This should allow most code to be type checked properly by Deno.

If you expect to run the code in Deno with the `--unstable` flag, then you
should add that library to the mix as well:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns",
      "deno.unstable"
    ]
  }
}
```

Typically, when you use the `"lib"` option in TypeScript, you need to include an
"es" library as well. In the case of `"deno.ns"` and `"deno.unstable"`, they
automatically include `"esnext"` when you bring them in.

:::note

If you get type errors like **cannot find `document` or `HTMLElement`**, it is
likely that the library you are using has dependencies on the DOM. This is
common for packages that are designed to run in a browser as well as
server-side. By default, Deno only includes the libraries that are directly
supported. Assuming the package properly identifies what environment it is
running in at runtime it is "safe" to use the DOM libraries to type check the
code.

:::

## Types and Type Declarations

For information on providing type declarations for JavaScript modules (using
`@ts-types`, `@ts-self-types`, `X-TypeScript-Types` headers, and `.d.ts` files),
see
[Providing declaration files](/runtime/fundamentals/typescript/#providing-declaration-files)
in the TypeScript fundamentals guide.

For information on augmenting global types using `declare global` or `.d.ts`
files, see
[Augmenting global types](/runtime/fundamentals/typescript/#augmenting-global-types).

## Type Checking Web Workers

When Deno loads a TypeScript module in a web worker, it will automatically type
check the module and its dependencies against the Deno web worker library. This
can present a challenge in other contexts like `deno check` or in editors. There
are a couple of ways to instruct Deno to use the worker libraries instead of the
standard Deno libraries.

### Triple-slash directives

This option couples the library settings with the code itself. By adding the
following triple-slash directives near the top of the entry point file for the
worker script, Deno will now type check it as a Deno worker script, irrespective
of how the module is analyzed:

```ts
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

The first directive ensures that no other default libraries are used. If this is
omitted, you will get some conflicting type definitions, because Deno will try
to apply the standard Deno library as well. The second instructs Deno to apply
the built-in Deno worker type definitions plus dependent libraries (like
`"esnext"`).

The one disadvantage of this, is that it makes the code less portable to other
non-Deno platforms like `tsc`, as it is only Deno which has the `"deno.worker"`
library built into it.

### Providing "lib" setting in deno.json

You can provide a "lib" option in your `deno.json` file to instruct Deno to use
library files. For example:

```json title="deno.json"
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

If you also have non-worker scripts, consider using
[workspaces](/runtime/fundamentals/workspaces/) so each workspace member can
have its own `compilerOptions`.

## Important points

### Type declaration semantics

Type declaration files (`.d.ts` files) follow the same semantics as other files
in Deno. This means that declaration files are assumed to be module declarations
(_UMD declarations_) and not ambient/global declarations. It is unpredictable
how Deno will handle ambient/global declarations.

In addition, if a type declaration imports something else, like another `.d.ts`
file, its resolution follow the normal import rules of Deno. For a lot of the
`.d.ts` files that are generated and available on the web, they may not be
compatible with Deno.

[esm.sh](https://esm.sh) is a CDN which provides type declarations by default
(via the `X-TypeScript-Types` header). It can be disabled by appending `?no-dts`
to the import URL:

```ts
import React from "https://esm.sh/react?no-dts";
```

## Behavior of JavaScript when type checking

When you import JavaScript code into TypeScript within Deno, even if you’ve set
`checkJs` to `false` (which is the default behavior for Deno), the TypeScript
compiler will still analyze the JavaScript module. It tries to infer the shape
of the exports from that module to validate the import in your TypeScript file.

Usually, this isn’t an issue when importing a standard ES module. However, there
are cases where TypeScript’s analysis might fail, for example, with modules that
have special packaging or are global UMD (Universal Module Definition) modules.
When faced with such situations, the best approach is to provide some form of
type information using one of the methods mentioned earlier.

### Internals

While it isn't required to understand how Deno works internally to be able to
leverage TypeScript with Deno well, it can help to understand how it works.

Before any code is executed or compiled, Deno generates a module graph by
parsing the root module, and then detecting all of its dependencies, and then
retrieving and parsing those modules, recursively, until all the dependencies
are retrieved.

For each dependency, there are two potential "slots" that are used. There is the
code slot and the type slot. As the module graph is filled out, if the module is
something that is or can be emitted to JavaScript, it fills the code slot, and
type only dependencies, like `.d.ts` files fill the type slot.

When the module graph is built, and there is a need to type check the graph,
Deno starts up the TypeScript compiler and feeds it the names of the modules
that need to be potentially emitted as JavaScript. During that process, the
TypeScript compiler will request additional modules, and Deno will look at the
slots for the dependency, offering it the type slot if it is filled before
offering it the code slot.

This means when you import a `.d.ts` module, or you use one of the solutions
above to provide alternative type modules for JavaScript code, that is what is
provided to TypeScript instead when resolving the module.
