---
title: "TypeScript support"
description: "Learn how to use TypeScript with Deno. Covers configuration options, type checking, and best practices for writing type-safe Deno applications."
oldUrl:
  - /runtime/manual/advanced/typescript/
  - /runtime/manual/typescript/
  - /runtime/manual/typescript/overview/
  - /runtime/manual/getting_started/typescript/
  - /manual/advanced/typescript
  - /runtime/manual/advanced/typescript/overview/
---

TypeScript is a first class language in Deno, just like JavaScript or
WebAssembly. You can run or import TypeScript without installing anything more
than the Deno CLI. With its built-in TypeScript compiler, Deno will compile your
TypeScript code to JavaScript with no extra config needed. Deno can also type
check your TypeScript code, without requiring a separate type checking tool like
`tsc`.

## Type Checking

One of the main advantages of TypeScript is that it can make your code type
safe, catching errors during development rather than runtime. TypeScript is a
superset of JavaScript meaning that syntactically valid JavaScript becomes
TypeScript with warnings about being "unsafe".

:::note

**Deno type checks TypeScript in `strict mode` by default**, the TypeScript core
team
[recommends strict mode as a sensible default](https://www.typescriptlang.org/play/?#example/new-compiler-defaults).

:::

Deno allows you to type-check your code (without executing it) with the
[`deno check`](/runtime/reference/cli/check/) subcommand:

```shell
deno check module.ts
# or also type check remote modules and npm packages
deno check --all module.ts
# code snippets written in JSDoc can also be type checked
deno check --doc module.ts
# or type check code snippets in markdown files
deno check --doc-only markdown.md
```

:::note

Type checking can take a significant amount of time, especially if you are
working on a codebase where you are making a lot of changes. Deno optimizes type
checking, but it still comes at a cost. Therefore, **by default, TypeScript
modules are not type-checked before they are executed**.

:::

When using the `deno run` command, Deno will skip type-checking and run the code
directly. In order to perform a type check of the module before execution
occurs, you can use the `--check` flag with `deno run`:

```shell
deno run --check module.ts
# or also type check remote modules and npm packages
deno run --check=all module.ts
```

When Deno encounters a type error when using this flag, the process will exit
before executing the code.

In order to avoid this, you will either need to:

- resolve the issue
- use the `// @ts-ignore` or `// @ts-expect-error` pragmas to ignore the error
- or skip type checking all together.

When testing your code, type checking is enabled by default. You can use the
`--no-check` flag to skip type checking if preferred:

```shell
deno test --no-check
```

## Using with JavaScript

Deno runs JavaScript and TypeScript code. During type checking, Deno will only
type check TypeScript files by default though. If you want to type check
JavaScript files too, you can either add a `// @ts-check` pragma at the top of
the file, or add `compilerOptions.checkJs` to your `deno.json` file.

```ts title="main.js"
// @ts-check

let x = "hello";
x = 42; // Type 'number' is not assignable to type 'string'.
```

```json title="deno.json"
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

In JavaScript files, you can not use TypeScript syntax like type annotations or
importing types. You can use [TSDoc](https://tsdoc.org/) comments to provide
type information to the TypeScript compiler though.

```ts title="main.js"
// @ts-check

/**
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

## Providing declaration files

When importing untyped JavaScript modules from TypeScript code, you may need to
provide type information for the JavaScript module. This is not necessary if the
JavaScript is annotated with TSDoc comments. Without this additional type
information (in the form of a `.d.ts` declaration file), TypeScript will assume
everything exported from the JavaScript module is of type `any`.

`tsc` will pick up `d.ts` files that are siblings of a `js` file and have the
same basename, automatically. **Deno does not do this.** You must explicitly
specify either in the `.js` file (the source), or the `.ts` file (the importer)
where to find the `.d.ts` file.

### Providing types in the source

One should prefer specifying the `.d.ts` file in the `.js` file, as this makes
it easier to use the JavaScript module from multiple TypeScript modules: you
won't have to specify the `.d.ts` file in every TypeScript module that imports
the JavaScript module.

```ts title="add.js"
// @ts-self-types="./add.d.ts"

export function add(a, b) {
  return a + b;
}
```

```ts title="add.d.ts"
export function add(a: number, b: number): number;
```

### Providing types in the importer

If you can't modify the JavaScript source, you can specify the `.d.ts` file in
the TypeScript module that imports the JavaScript module.

```ts title="main.ts"
// @ts-types="./add.d.ts"
import { add } from "./add.js";
```

This is also useful for NPM packages that don't provide type information:

```ts title="main.ts"
// @ts-types="npm:@types/lodash"
import * as _ from "npm:lodash";
```

### Providing types for HTTP modules

Servers that host JavaScript modules via HTTP can also provide type information
for those modules in a HTTP header. Deno will use this information when
type-checking the module.

```http
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./add.d.ts
```

The `X-TypeScript-Types` header specifies the location of the `.d.ts` file that
provides type information for the JavaScript module. It is resolved relative to
the URL of the JavaScript module, just like `Location` headers.

## Type checking for browsers and web workers

By default, Deno type checks TypeScript modules as if they were running in the
main thread of the Deno runtime. However, Deno also supports type checking for
browsers, type checking for web workers, and type checking for combination
browser-Deno environments like when using SSR (Server Side Rendering) with Deno.

These environments have different global objects and APIs available to them.
Deno provides type definitions for these environments in the form of library
files. These library files are used by the TypeScript compiler to provide type
information for the global objects and APIs available in these environments.

The loaded library files can be changed using the `compilerOptions.lib` option
in a `deno.json` configuration file, or through `/// <reference lib="..." />`
comments in your TypeScript files. It is recommended to use the
`compilerOptions.lib` option in the `deno.json` configuration file to specify
the library files to use.

To enable type checking for a **browser environment**, you can specify the `dom`
library file in the `compilerOptions.lib` option in a `deno.json` configuration
file:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom"]
  }
}
```

This will enable type checking for a browser environment, providing type
information for global objects like `document`. This will however disable type
information for Deno-specific APIs like `Deno.readFile`.

To enable type checking for combined **browser and Deno environments**, like
using SSR with Deno, you can specify both the `dom` and `deno.ns` (Deno
namespace) library files in the `compilerOptions.lib` option in a `deno.json`
configuration file:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "deno.ns"]
  }
}
```

This will enable type checking for both browser and Deno environments, providing
type information for global objects like `document` and Deno-specific APIs like
`Deno.readFile`.

To enable type checking for a **web worker environment in Deno**, (ie code that
is run with `new Worker`), you can specify the `deno.worker` library file in the
`compilerOptions.lib` option in a `deno.json`.

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["deno.worker"]
  }
}
```

To specify the library files to use in a TypeScript file, you can use
`/// <reference lib="..." />` comments:

```ts
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
```

## Augmenting global types

Deno supports ambient or global types in TypeScript. This is useful when
polyfilling global objects or augmenting the global scope with additional
properties. **You should avoid using ambient or global types when possible**,
since they can lead to naming conflicts and make it harder to reason about your
code. They are also not supported when publishing to JSR.

To use ambient or global types in Deno, you can use either the `declare global`
syntax, or load a `.d.ts` file that augments the global scope.

### Using declare global to augment the global scope

You can use the `declare global` syntax in any of the TypeScript files that are
imported in your project to augment the global scope with additional properties.
For example:

```ts
declare global {
  interface Window {
    polyfilledAPI(): string;
  }
}
```

This makes the `polyfilledAPI` function available globally when the type
definition is imported.

### Using .d.ts files to augment the global scope

You can also use `.d.ts` files to augment the global scope. For example, you can
create a `global.d.ts` file with the following content:

```ts
interface Window {
  polyfilledAPI(): string;
}
```

Then you can load this `.d.ts` file in your TypeScript using
`/// <reference types="./global.d.ts" />`. This will augment the global scope
with the `polyfilledAPI` function.

Alternatively you can specify the `.d.ts` file in the `deno.json` configuration
file, in the `compilerOptions.types` array:

```json
{
  "compilerOptions": {
    "types": ["./global.d.ts"]
  }
}
```

This will also augment the global scope with the `polyfilledAPI` function.
