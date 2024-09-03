---
title: "TypeScript support"
oldUrl:
  - /runtime/manual/advanced/typescript/
  - /runtime/manual/typescript/
  - /runtime/manual/typescript/overview/
  - /runtime/manual/getting_started/typescript/
  - /manual/advanced/typescript
  - /runtime/manual/advanced/typescript/overview/
  - /runtime/manual/advanced/typescript/types/
  - /runtime/advanced/typescript/configuration/
---

TypeScript is a first class language in Deno, just like JavaScript or
WebAssembly, you can run or import TypeScript without installing anything more
than the Deno CLI. With its built-in TypeScript compiler, Deno will compile your
TypeScript code to JavaScript with no extra config needed, making your
development process a breeze.

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
[`deno check`](/runtime/manual/tools/check/) subcommand:

```shell
deno check module.ts
# or also type check remote modules and npm packages
deno check --all module.ts
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

When Deno encounters a type error, the process will exit before executing the
code. If you have used the `--check` flag then type-related diagnostics will
prevent the program from running: it will halt on these warnings, and exit the
process before executing the code.

In order to avoid this, you will either need to resolve the issue, use the
`// @ts-ignore` or `// @ts-expect-error` pragmas, or skip type checking all
together.

When testing your code, type checking is enabled by default, you can use the
`--no-check` flag to skip type checking if preferred:

```shell
deno test --no-check
```

## Determining the type of file

Since Deno supports JavaScript, TypeScript, JSX, TSX modules, Deno has to make a
decision about how to treat each of these kinds of files. For local modules,
Deno makes this determination based on the extension. When the extension is
absent in a local file, it is assumed to be JavaScript. The module type can be
overridden using the `--ext` argument. This is useful if the module does not
have a file extension, e.g. because it is embedded in another file.

A `.d.ts` file and a `.ts` file have different semantics in TypeScript and
different ways they need to be handled in Deno. While we expect to convert a
`.ts` file into JavaScript, a `.d.ts` file contains no "runnable" code, it is
simply describing types. When Deno fetches a remote module, the media type for a
`.ts.` and `.d.ts` file looks the same. So the path is checked, if a file has a
path that ends with `.d.ts` it will be treated as type definition only file
instead of "runnable" TypeScript.

### Supported media types

The following table provides a list of media types which Deno supports when
identifying the type of file of a remote module:

| Media Type                 | How File is Handled                                         |
| -------------------------- | ----------------------------------------------------------- |
| `application/typescript`   | TypeScript (with path extension influence)                  |
| `text/typescript`          | TypeScript (with path extension influence)                  |
| `video/vnd.dlna.mpeg-tts`  | TypeScript (with path extension influence)                  |
| `video/mp2t`               | TypeScript (with path extension influence)                  |
| `application/x-typescript` | TypeScript (with path extension influence)                  |
| `application/javascript`   | JavaScript (with path extensions influence)                 |
| `text/javascript`          | JavaScript (with path extensions influence)                 |
| `application/ecmascript`   | JavaScript (with path extensions influence)                 |
| `text/ecmascript`          | JavaScript (with path extensions influence)                 |
| `application/x-javascript` | JavaScript (with path extensions influence)                 |
| `application/node`         | JavaScript (with path extensions influence)                 |
| `text/jsx`                 | JSX                                                         |
| `text/tsx`                 | TSX                                                         |
| `text/plain`               | Attempt to determine that path extension, otherwise unknown |
| `application/octet-stream` | Attempt to determine that path extension, otherwise unknown |

## Mixing JavaScript and TypeScript

By default, Deno does not type check JavaScript. Check out the documentation on
[configuring your project](./configuration.md) to find out more about how to
configure your project to do this. Deno does support JavaScript importing
TypeScript and TypeScript importing JavaScript.

An important note though is that when type checking TypeScript, by default Deno
will "read" all the JavaScript in order to be able to evaluate how it might have
an impact on the TypeScript types. The type checker will do the best it can to
figure out the types of the JavaScript you import into TypeScript, including
reading any JSDoc comments. Details of this are discussed in detail in the
[Types and type declarations](./types.md) section.

## Type resolution

Deno adheres to a design principle of no non-standard module resolution, meaning
it deals with explicit module specifiers. This can cause issues when importing
JavaScript files that have corresponding type definition files. To address this,
Deno offers these solutions:

1. **Provide types when importing** to ensure that TypeScript uses the specified
   type definition file for type checking. Use the `@ts-types` compiler hint to
   specify a type definition file for a JavaScript module:

   ```ts
   // @ts-types="./coolLib.d.ts"
   import * as coolLib from "./coolLib.js";
   ```

2. **Provide types when hosting**. Use the `@ts-self-types` pragma in the
   JavaScript file to point to the type definition file:

   ```ts
   // @ts-self-types="./coolLib.d.ts"
   ```

This informs Deno to use the type definition file for type checking while still
loading the JavaScript file for execution.

3. **Using HTTP headers for remote modules**. Deno supports a header for remote
   modules that instructs the runtime on where to locate the types for a given
   module. For example, a response for `https://example.com/coolLib.js` might
   look like this:

```ts
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

When seeing this header, Deno would attempt to retrieve
`https://example.com/coolLib.d.ts` and use that when type checking the original
module.

## Using ambient or global types

Using module/UMD type definitions with Deno is generally preferred, as it allows
a module to explicitly import the types it depends on. Modular type definitions
can augment the global scope using `declare` global. For example:

```ts
declare global {
  var AGlobalString: string;
}
```

This makes `AGlobalString` available globally when the type definition is
imported.

However, when using existing type libraries, it might not always be possible to
use modular type definitions. In such cases, there are methods to include
arbitrary type definitions during type checking.

### Using a triple-slash directive

You can couple type definitions directly to the code by adding a triple-slash
types directive in a TypeScript file. This includes the type definition during
type checking. For example:

```ts
/// <reference types="./types.d.ts" />
```

The specifier can be a relative path or a fully qualified URL:

```ts
/// <reference types="https://deno.land/x/pkg@1.0.0/types.d.ts" />
```

### Using a configuration file

Another option is to use a configuration file to include type definitions by
specifying a "types" value in the "compilerOptions". For example:

```json
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

Relative specifiers in the "types" array are resolved relative to the config
file’s path. Use the `--config=path/to/file` flag to tell Deno to use this
configuration file.

## Type Checking Web Workers

When Deno loads a TypeScript module in a web worker, it automatically type
checks the module and its dependencies against the Deno web worker library. In
contexts such as `deno cache` or in editors you may want to instruct Deno to use
the web worker library. You can do this a couple of ways:

### Using triple-slash directives

This option couples the library settings with the code itself. By adding the
following triple-slash directives near the top of the entry point file for the
worker script, Deno will type check it as a Deno worker script, irrespective of
how the module is analyzed:

```ts
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

- The first directive ensures no other default libraries are used, preventing
  conflicting type definitions.
- The second directive instructs Deno to apply the built-in Deno worker type
  definitions and dependent libraries.

These directives help Deno automatically detect and apply the correct libraries
during type checking when using commands like deno cache or deno bundle, or when
using an IDE with the Deno language server. However, this approach makes the
code less portable to non-Deno platforms like tsc, as only Deno includes the
"deno.worker" library.

### Using a configuration file

Another option is to use a configuration file that is configured to apply the
library files. A minimal file that would work would look something like this:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

Then when running a command on the command line, you would need to pass the
`--config path/to/file` argument, or if you are using an IDE which leverages the
Deno language server, set the `deno.config` setting.

If you also have non-worker scripts, you will either need to omit the `--config`
argument, or have one that is configured to meet the needs of your non-worker
scripts.

## Important points

### Type Declaration Semantics

- Type declaration files (`.d.ts files`) in Deno are treated as module
  declarations (UMD) rather than ambient/global declarations.

- Importing within type declarations follows Deno’s normal import rules, which
  may cause compatibility issues with some `.d.ts` files available online.

- The CDN [esm.sh](esm.sh) provides type declarations by default, which can be
  disabled by appending `?no-dts` to the import URL.

### Behavior of JavaScript When Type Checking

- When importing JavaScript into TypeScript in Deno, the TypeScript compiler
  performs static analysis on the JavaScript module to determine the shape of
  its exports, even if `checkJs` is set to `false`.

- This can cause issues with modules that have special packaging or are global
  UMD modules, leading to misleading errors. Providing types using one of the
  mentioned methods can help.
