---
last_modified: 2026-06-12
title: "TypeScript support"
description: "TypeScript is a first-class language in Deno. Run .ts files directly with no build step, type-check with deno check, reuse your tsconfig.json, and skip the toolchain you needed under Node.js."
oldUrl:
  - /runtime/manual/advanced/typescript/
  - /runtime/manual/typescript/
  - /runtime/manual/typescript/overview/
  - /runtime/manual/getting_started/typescript/
  - /manual/advanced/typescript
  - /runtime/manual/advanced/typescript/overview/
  - /runtime/fundamentals/
---

TypeScript is a first-class language in Deno. Put TypeScript in a file and run
it — there is no compiler to install, no `tsconfig.json` to write, and no build
step:

```ts title="main.ts"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

```sh
deno run main.ts
```

Deno also ships the type checker: `deno check` plays the role of `tsc --noEmit`,
with strict mode on by default.

## How TypeScript runs in Deno

Deno treats executing TypeScript and type-checking it as two separate concerns:

- **Execution**: when you `deno run` a TypeScript file, Deno strips the types
  and hands the resulting JavaScript to V8. This is fast, happens in-process,
  and is cached, but it does not look at whether the types are correct.
- **Type checking**: `deno check` (or `deno run --check`) runs the real
  TypeScript compiler over your code without executing it.

This means **type errors do not stop your code from running unless you ask**.
Checking a whole module graph is expensive, so Deno keeps it out of the hot
edit-run loop and lets you invoke it where it earns its cost: in your editor
(via the Deno language server), in CI, and in `deno test`, which type-checks by
default.

A consequence worth knowing: Deno never emits JavaScript files. There is no
`outDir`, no `dist/` directory, and no source map configuration — error stack
traces point at your `.ts` sources directly. If you genuinely need `.js` output
(for example, to ship a library to consumers running Node or a bundler), that is
a separate tool: [`deno transpile`](/runtime/reference/cli/transpile/) or
[`deno pack`](/runtime/reference/cli/pack/).

## Coming from Node.js

If you write TypeScript for Node.js today, most of your toolchain has a built-in
replacement:

| In your Node.js project                         | In Deno                                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tsx`, `ts-node`, or `node` with type stripping | `deno run main.ts`                                                                                              |
| `tsc --noEmit`                                  | `deno check`                                                                                                    |
| `tsconfig.json`                                 | Optional. Auto-detected if present; Deno-first projects use `compilerOptions` in `deno.json`                    |
| `typescript` as a devDependency                 | Nothing to install — the checker ships inside the `deno` binary                                                 |
| `@types/node`                                   | Built in — `node:` imports are typed out of the box                                                             |
| ESLint + Prettier with TypeScript plugins       | [`deno lint`](/runtime/reference/cli/lint/) and [`deno fmt`](/runtime/reference/cli/fmt/) handle `.ts` natively |

Three differences trip up Node.js developers most often:

**Imports use real file extensions.** In Deno you write
`import { greet } from "./greet.ts"` — the extension is required, and it is the
actual extension of the file on disk. If you are used to `tsc` with Node-style
ESM, this replaces the counterintuitive habit of writing `./greet.js` to import
a file named `greet.ts`. See [Modules](/runtime/fundamentals/modules/) for how
resolution works, including npm packages.

**Deno runs the full TypeScript language.** Node's built-in type stripping is
limited to erasable syntax: enums, namespaces with runtime code, and parameter
properties need an extra experimental transform flag. Deno runs all of these
without flags.

**Most of your `tsconfig.json` is about emit, and emit doesn't exist.** Options
like `target`, `module`, `outDir`, `esModuleInterop`, and `sourceMap` configure
output that Deno never produces. Deno warns about ignored options and the
[migration table](/runtime/reference/ts_config_migration/#migrating-compileroptions-from-nodejs)
in the configuration reference says what to do with each one — for most, the
answer is "delete it".

If you are moving a whole project over, the
[Migrating from Node.js](/runtime/migrate/) guide covers the rest (dependencies,
`package.json`, npm scripts).

## Type checking

Deno type-checks in
[strict mode](https://www.typescriptlang.org/tsconfig/#strict) by default. It
also turns on `noImplicitOverride`, which `tsc` leaves off even under `strict`.
The
[compiler options table](/runtime/reference/ts_config_migration/#ts-compiler-options)
lists every default.

Check your code without running it using
[`deno check`](/runtime/reference/cli/check/):

```sh
# Check the whole project
deno check

# Check a specific file or directory
deno check main.ts
deno check src/

# Also type-check remote modules and npm dependencies
deno check --all main.ts

# Type-check JavaScript files too, without adding @ts-check to each one
deno check --check-js main.js
```

`deno check` exits non-zero on errors, so it works as-is in CI. It can also
check code blocks in JSDoc comments and markdown files — see
[documentation tests](/runtime/test/doc_tests/).

To type-check before execution, add `--check` to `deno run`:

```sh
deno run --check main.ts

# Include remote modules and npm packages in the check
deno run --check=all main.ts
```

With this flag, a type error stops the process before any code runs. You can
resolve the error, suppress it with a `// @ts-expect-error` or `// @ts-ignore`
comment, or drop the flag.

`deno test` and `deno bench` type-check by default. Pass `--no-check` to skip
it:

```sh
deno test --no-check
```

## Configuring TypeScript compiler options

Deno's defaults are strict and modern, so most projects need no configuration at
all. When you do want to change the checker's behavior, use the
`compilerOptions` field in [`deno.json`](/runtime/fundamentals/configuration/):

```json title="deno.json"
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

The
[full list of supported options and their defaults](/runtime/reference/ts_config_migration/#ts-compiler-options)
is in the configuration reference. For JSX settings (React, Preact, and
friends), see the [JSX reference](/runtime/reference/jsx/).

### Using an existing tsconfig.json {#tsconfig}

You do not have to translate your configuration to try Deno. Each workspace
directory containing a `deno.json` or `package.json` is probed for a
`tsconfig.json` — if one exists, Deno automatically uses it for type checking
and the language server, no flags needed. Since Deno 2.1, `jsconfig.json` is
also auto-detected when a `package.json` is present, which is useful for
JavaScript-only projects.

For example, an existing Node.js project with this `tsconfig.json`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "lib": ["dom", "esnext"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

will be picked up automatically by `deno check` and the Deno language server. If
a `deno.json` with its own `compilerOptions` is added later, those take
precedence. Emit-related options are ignored (with a warning), since Deno never
emits.

For Deno-first projects, prefer `compilerOptions` in `deno.json` over a separate
`tsconfig.json`. See
[Configuring TypeScript](/runtime/reference/ts_config_migration/) for supported
fields, precedence rules, and project-reference behavior.

## Type checking JavaScript

Deno runs JavaScript and TypeScript side by side, but only type-checks
TypeScript files by default. To include a JavaScript file in checking, add a
`// @ts-check` pragma at the top of the file, or enable
`compilerOptions.checkJs` for the whole project:

```js title="main.js"
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

JavaScript files can't contain TypeScript syntax like type annotations, but you
can provide the same information in
[JSDoc comments](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html),
which the type checker reads:

```js title="main.js"
// @ts-check

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

## Providing declaration files

When importing an untyped JavaScript module from TypeScript, the checker assumes
everything it exports is `any`. To fix that, supply a `.d.ts` declaration file
(unless the JavaScript is already annotated with JSDoc).

One important difference from `tsc`: `tsc` automatically picks up a `.d.ts` file
sitting next to a `.js` file with the same basename. **Deno does not.** You must
say where the declaration file is, either in the JavaScript source or at the
import site.

### Providing types in the source

Prefer declaring types in the `.js` file itself with `@ts-self-types`, so every
importer gets them for free:

```js title="add.js"
// @ts-self-types="./add.d.ts"

export function add(a, b) {
  return a + b;
}
```

```ts title="add.d.ts"
export function add(a: number, b: number): number;
```

### Providing types in the importer

If you can't modify the JavaScript source, annotate the import with `@ts-types`:

```ts title="main.ts"
// @ts-types="./add.d.ts"
import { add } from "./add.js";
```

This also works for npm packages that ship without type information, pointing at
the corresponding `@types` package:

```ts title="main.ts"
// @ts-types="npm:@types/lodash"
import * as _ from "npm:lodash";
```

### Providing types for HTTP modules

Servers hosting JavaScript modules can advertise a declaration file in an
`X-TypeScript-Types` response header, which Deno resolves relative to the module
URL (like a `Location` header) and uses during type checking. CDNs such as
[esm.sh](https://esm.sh) set this header for you.

## Targeting browsers and web workers

By default, Deno type-checks code against the Deno runtime's global scope (the
`deno.window` library): `Deno.readFile` exists, `document` does not. Code
destined for other environments can swap the type libraries via
`compilerOptions.lib`. The common case is code shared between Deno and the
browser:

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

This adds browser globals like `document` while keeping the `Deno` namespace
available through `deno.ns`. Use `lib: ["deno.worker"]` (or a
`/// <reference lib="deno.worker" />` directive) for code that runs in a
`new Worker`. The
[lib property reference](/runtime/reference/ts_config_migration/#using-the-lib-property)
describes the available libraries, conflicts to expect, and worker-specific
setup.

## Augmenting global types

When polyfilling a global API, you can teach the type checker about it with
`declare global`. Note that Deno 2 has no `window` object — globals live on
`globalThis`, so declare them with `var`:

```ts
declare global {
  var polyfilledAPI: () => string;
}
```

With this declaration imported, `globalThis.polyfilledAPI` type-checks.

Alternatively, put the augmentation in a `.d.ts` file and load it via a
triple-slash directive (`/// <reference types="./global.d.ts" />`) or globally
in `deno.json`:

```json title="deno.json"
{
  "compilerOptions": {
    "types": ["./global.d.ts"]
  }
}
```

Avoid global augmentation when an ordinary import will do: globals can cause
naming conflicts, make code harder to reason about, and are not supported when
publishing to [JSR](https://jsr.io).

## Next steps

- Set up your editor with the Deno language server for inline type checking —
  see
  [Setup your environment](/runtime/getting_started/setup_your_environment/).
- Read the
  [TypeScript configuration reference](/runtime/reference/ts_config_migration/)
  for the full compiler options table and `tsconfig.json` semantics.
- Type-check the examples in your docs with
  [documentation tests](/runtime/test/doc_tests/).
- Moving an existing project? Start with
  [Migrating from Node.js](/runtime/migrate/).
