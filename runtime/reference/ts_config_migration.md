---
title: "Configuring TypeScript"
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

Deno’s flexibility shines in its equal treatment of TypeScript and JavaScript.
Whether you’re transitioning from JavaScript to TypeScript or vice versa, Deno
has features to ease the journey.

## Type Checking JavaScript

You may wish to make your JavaScript more type-sound without adding type
annotations everywhere. Deno supports using the TypeScript type checker to type
check JavaScript. You can mark individual files by adding the check JavaScript
pragma to the file:

```js
// @ts-check
```

This will cause the type checker to infer type information about the JavaScript
code and raise any issues as diagnostic issues.

These can be turned on for all JavaScript files in a program by providing a
configuration file with the check JS option set to `true`, as below. Then use
the `--config` option when running on the command line.

```json
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

## Using JSDoc in JavaScript

When type-checking JavaScript or importing JavaScript into TypeScript, JSDoc
annotations can provide additional type information beyond what can just be
inferred from the code itself. Deno supports this seamlessly if you annotate
your code inline with the supported
[TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).

For example to set the type of an array use the following JSDoc comment:

```js
/** @type {string[]} */
const a = [];
```

## Skipping type checking

You might have TypeScript code that you are experimenting with, where the syntax
is valid but not fully type safe. You can bypass type checking for a whole
program by passing the `--no-check` flag.

You can also skip whole files being type checked, including JavaScript if you
have check JS enabled, by using the `nocheck` pragma:

```js
// @ts-nocheck
```

## Renaming JS files to TS files

TypeScript files benefit from the TypeScript compiler being able to do more
thorough safety checks of your code. This is often referred to as _strict mode_.
When you rename a `.js` file to `.ts` you'll might see new type errors that you
TypeScript wasn't able to detect before.

## Configuring TypeScript in Deno

TypeScript offers many configuration options, which can be daunting if you're
just starting out with TS. Deno aims to simplify using TypeScript, instead of
drowning you in countless settings. Deno configures TypeScript to **just work**
out of the box. No extra configuration headaches required!

However, if you do want to change the TypeScript compiler options, Deno allows
you to do so in your `deno.json` file. Provide a path on the command line, or
use the default. For example:

```console
deno run --config ./deno.json main.ts
```

:::note

If you are creating libraries that require a configuration file, remember that
all of the consumers of your TS modules will require that configuration file
too. In addition, there could be settings in the configuration file that make
other TypeScript modules incompatible.

:::

## TS Compiler Options

Here is a table of compiler options that can be changed, their default in Deno
and any other notes about that option:

| Option                           | Default                 | Notes                                                                                                                                     |
| -------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowJs`                        | `true`                  | This almost never needs to be changed                                                                                                     |
| `allowUnreachableCode`           | `false`                 |                                                                                                                                           |
| `allowUnusedLabels`              | `false`                 |                                                                                                                                           |
| `checkJs`                        | `false`                 | If `true` causes TypeScript to type check JavaScript                                                                                      |
| `jsx`                            | `"react"`               |                                                                                                                                           |
| `jsxFactory`                     | `"React.createElement"` |                                                                                                                                           |
| `jsxFragmentFactory`             | `"React.Fragment"`      |                                                                                                                                           |
| `keyofStringsOnly`               | `false`                 |                                                                                                                                           |
| `lib`                            | `[ "deno.window" ]`     | The default for this varies based on other settings in Deno. If it is supplied, it overrides the default. See below for more information. |
| `noErrorTruncation`              | `false`                 |                                                                                                                                           |
| `noFallthroughCasesInSwitch`     | `false`                 |                                                                                                                                           |
| `noImplicitAny`                  | `true`                  |                                                                                                                                           |
| `noImplicitOverride`             | `true`                  |                                                                                                                                           |
| `noImplicitReturns`              | `false`                 |                                                                                                                                           |
| `noImplicitThis`                 | `true`                  |                                                                                                                                           |
| `noImplicitUseStrict`            | `true`                  |                                                                                                                                           |
| `noStrictGenericChecks`          | `false`                 |                                                                                                                                           |
| `noUnusedLocals`                 | `false`                 |                                                                                                                                           |
| `noUnusedParameters`             | `false`                 |                                                                                                                                           |
| `noUncheckedIndexedAccess`       | `false`                 |                                                                                                                                           |
| `reactNamespace`                 | `React`                 |                                                                                                                                           |
| `strict`                         | `true`                  |                                                                                                                                           |
| `strictBindCallApply`            | `true`                  |                                                                                                                                           |
| `strictFunctionTypes`            | `true`                  |                                                                                                                                           |
| `strictPropertyInitialization`   | `true`                  |                                                                                                                                           |
| `strictNullChecks`               | `true`                  |                                                                                                                                           |
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
- `"deno.unstable"` - This includes the addition unstable `Deno` global
  namespace APIs.
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

Deno applies a design principle of _no non-standard module resolution_. When
TypeScript checks a file, it focuses solely on its types. In contrast, the `tsc`
compiler employs intricate logic to resolve those types. By default, `tsc`
expects ambiguous module specifiers with extensions (e.g., `.ts`, `.d.ts` or
`.js`). Deno, however, deals with explicit specifiers.

Here’s where it gets interesting: Imagine you want to consume a TypeScript file
that’s already transpiled to JavaScript, along with its type definition file
(`mod.js` and `mod.d.ts`). If you import `mod.js` into Deno, it strictly follows
your request and imports the JavaScript file. But here’s the catch: Your code
won’t be as thoroughly type-checked as if TypeScript considered the `mod.d.ts`
file alongside the `mod.js` file.

To address this, Deno offers two solutions, each catering to specific scenarios:

**As the Importer:** If you know what types should apply to a JavaScript module,
you can enhance type checking by explicitly specifying the types.

**As the Supplier:** If you’re the provider or host of the module, everyone
consuming it benefits without worrying about type resolution.

## Providing types when importing

If you are consuming a JavaScript module and you have either created types (a
`.d.ts` file) or have otherwise obtained the types you want to use, you can
instruct Deno to use that file when type checking, instead of the JavaScript
file, using the `@ts-types` compiler hint.

For example if you have a JavaScript module, `coolLib.js`, and a separate
`coolLib.d.ts` file, you would import it like this:

```ts
// @ts-types="./coolLib.d.ts"
import * as coolLib from "./coolLib.js";
```

When you’re performing type checking on `coolLib` and using it in your file, the
TypeScript type definitions from `coolLib.d.ts` will take precedence over
examining the JavaScript file.

The compiler hint pattern-matching is quite flexible, it accepts both quoted and
non-quoted values for the specifier, as well as any whitespace around the equals
sign.

> ℹ️ _Note_: In the past the `@ts-types` directive was called `@deno-types`. This alias still works, but is not recommended anymore. Use `@ts-types`.
> `@ts-types`. This is not recommended anymore.

## Providing types when hosting

If you have control over the module’s source code or how the file is hosted on a
web server, there are two ways to let Deno know about the types for a specific
module (which won’t require any special action from the importer).

### @ts-self-types

If you are providing a JavaScript file, and want to provide a declaration file
that contains the types for this file, you can specify a `@ts-self-types`
directive in the JS file, pointing to the declaration file.

For example, if you make a `coolLib.js` library, and write its type definitions
in `coolLib.d.ts` the `ts-self-types` directive would look like this:

```js title="coolLib.js"
// @ts-self-types="./coolLib.d.ts"

// ... the rest of the JavaScript ...
```

### X-TypeScript-Types

Deno supports a header for remote modules that instructs Deno where to locate
the types for a given module. For example, a response for
`https://example.com/coolLib.js` might look something like this:

```console
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

When seeing this header, Deno would attempt to retrieve
`https://example.com/coolLib.d.ts` and use that when type checking the original
module.

## Using ambient or global types

Overall it is better to use module/UMD type definitions with Deno, where a
module expressly imports the types it depends upon. Modular type definitions can
express
[augmentation of the global scope](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)
via the `declare global` in the type definition. For example:

```ts
declare global {
  var AGlobalString: string;
}
```

This would make `AGlobalString` available in the global namespace when importing
the type definition.

In some cases though, when leveraging other existing type libraries, it may not
be possible to leverage modular type definitions. Therefore there are ways to
include arbitrary type definitions when type checking programmes.

### Triple-slash directive

This option couples the type definitions to the code itself. By adding a
triple-slash `types` directive in a TS file (not a JS file!), near the type of a
module, type checking the file will include the type definition. For example:

```ts
/// <reference types="./types.d.ts" />
```

The specifier provided is resolved just like any other specifier in Deno, which
means it requires an extension, and is relative to the module referencing it. It
can be a fully qualified URL as well:

```ts
/// <reference types="https://deno.land/x/pkg@1.0.0/types.d.ts" />
```

### Suppling "types" in deno.json

Another option is to provide a `"types"` value to the `"compilerOptions"` in
your `deno.json`. For example:

```json title="deno.json"
{
  "compilerOptions": {
    "types": [
      "./types.d.ts",
      "https://deno.land/x/pkg@1.0.0/types.d.ts",
      "/Users/me/pkg/types.d.ts"
    ]
  }
}
```

Like the triple-slash reference above, the specifier supplied in the `"types"`
array will be resolved like other specifiers in Deno. In the case of relative
specifiers, it will be resolved relative to the path to the config file. Make
sure to tell Deno to use this file by specifying `--config=path/to/file` flag.

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

Then when running deno subcommand, you would need to pass the
`--config path/to/file` argument, or if you are using an IDE which leverages the
Deno language server, set the `deno.config` setting.

If you also have non-worker scripts, you will either need to omit the `--config`
argument, or have one that is configured to meet the needs of your non-worker
scripts.

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
