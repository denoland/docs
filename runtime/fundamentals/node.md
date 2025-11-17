---
title: "Node and npm Compatibility"
description: "Guide to using Node.js modules and npm packages in Deno. Learn about compatibility features, importing npm packages, and differences between Node.js and Deno environments."
oldUrl:
  - /runtime/reference/node/
  - /runtime/manual/npm_nodejs/std_node/
  - /runtime/manual/node/
  - /runtime/manual/npm_nodejs/cdns/
  - /runtime/manual/using_deno_with_other_technologies/node/cdns/
  - /runtime/manual/node/node_specifiers
  - /runtime/manual/node/package_json
  - /runtime/manual/node/migrate/
  - /runtime/manual/references/cheatsheet/
  - /runtime/manual/node/cheatsheet/
  - /runtime/manual/node/faqs
  - /runtime/manual/node/npm_specifiers
  - /runtime/manual/node/private_registries
---

- **Deno is Node-compatible**. Most Node projects will run in Deno with little
  or no change!
- **Deno supports npm packages**. Just use the `npm:` specifier in the import,
  and Deno takes care of the rest.

For example, here's how you'd import Hono from npm in a Deno project:

```ts
import { Hono } from "npm:hono";
```

That's all you really need to know to get started! However, there are some key
differences between the two runtimes that you can take advantage of to make your
code simpler and smaller when migrating your Node.js projects to Deno.

We provide a (list of supported Node.js APIs)[/runtime/reference/node_apis/]
that you can use in Deno.

## Quick start

### Import an npm package

```ts title="main.ts"
import chalk from "npm:chalk@5";
console.log(chalk.green("Hello from npm in Deno"));
```

```sh
deno run main.ts
```

### Execute CommonJS

Use `.cjs` extension to inform Deno that module is using CommonJS system.

```js title="main.cjs"
const chalk = require("chalk");
console.log(chalk.green("Hello from npm in Deno"));
```

```sh
deno run main.cjs
```

### Use a Node API

```js title="process.js"
import path from "node:path";
console.log(path.join("./foo", "../bar"));
```

## Using Node's built-in modules

Deno provides a compatibility layer that allows the use of Node.js built-in APIs
within Deno programs. However, in order to use them, you will need to add the
`node:` specifier to any import statements that use them:

```js title=main.mjs
import * as os from "node:os";
console.log(os.cpus());
```

And run it with `deno run main.mjs` - you will notice you get the same output as
running the program in Node.js.

Updating any imports in your application to use `node:` specifiers should enable
any code using Node built-ins to function as it did in Node.js.

To make updating existing code easier, Deno will provide helpful hints for
imports that don't use `node:` prefix:

```js title="main.mjs"
import * as os from "os";
console.log(os.cpus());
```

```sh
$ deno run main.mjs
error: Relative import path "os" not prefixed with / or ./ or ../
  hint: If you want to use a built-in Node module, add a "node:" prefix (ex. "node:os").
    at file:///main.mjs:1:21
```

The same hints and additional quick-fixes are provided by the Deno LSP in your
editor.

<a href="/api/node/" class="docs-cta runtime-cta">Explore built-in Node APIs</a>

## Using npm packages

Deno has native support for importing npm packages by using `npm:` specifiers.
For example:

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

Can be run with:

```sh
$ deno run main.js
🦕 ❤️ npm
```

No `npm install` is necessary before the `deno run` command and no
`node_modules` folder is created. These packages are also subject to the same
[permissions](/runtime/fundamentals/security/) as other code in Deno.

### First-class package.json support

Deno understands `package.json` in your project. You can:

- Declare dependencies there (alongside or instead of inline `npm:` specifiers).
- Use scripts from `package.json` via `deno task` (for example,
  `deno task start`).
- Rely on `package.json` fields like `type` when resolving modules (see CommonJS
  support below).

By default, dependencies are stored in Deno's global cache without creating a
local `node_modules` directory. If your tools expect `node_modules`, opt-in
using `nodeModulesDir` in `deno.json`.

npm specifiers have the following format:

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

This also allows functionality that may be familar from the `npx` command.

```console
# npx allows remote execution of a package from npm or a URL
$ npx create-next-app@latest

# deno run allows remote execution of a package from various locations,
# and can scoped to npm via the `npm:` specifier.
$ deno run -A npm:create-next-app@latest
```

For examples with popular libraries, please refer to the
[tutorial section](/runtime/tutorials).

## Node.js global objects

In Node.js, there are a number of
[global objects](https://nodejs.org/api/globals.html) available in the scope of
all programs that are specific to Node.js, eg. `process` object.

Here are a few globals that you might encounter in the wild and how to use them
in Deno:

- `process` - Deno provides the `process` global, which is by far the most
  popular global used in popular npm packages. It is available to all code.
  However, Deno will guide you towards importing it explicitly from
  `node:process` module by providing lint warnings and quick-fixes:

```js title="process.js"
console.log(process.versions.deno);
```

```shell
$ deno run process.js
2.0.0
$ deno lint process.js
error[no-process-global]: NodeJS process global is discouraged in Deno
 --> /process.js:1:13
  |
1 | console.log(process.versions.deno);
  |             ^^^^^^^
  = hint: Add `import process from "node:process";`

  docs: https://docs.deno.com/lint/rules/no-process-global


Found 1 problem (1 fixable via --fix)
Checked 1 file
```

- `require()` - see [CommonJS support](#commonjs-support)

- `Buffer` - to use `Buffer` API it needs to be explicitly imported from the
  `node:buffer` module:

```js title="buffer.js"
import { Buffer } from "node:buffer";

const buf = new Buffer(5, "0");
```

For TypeScript users needing Node.js-specific types like `BufferEncoding`, these
are available through the `NodeJS` namespace when using `@types/node`:

```ts title="buffer-types.ts"
/// <reference types="npm:@types/node" />

// Now you can use NodeJS namespace types
function writeToBuffer(data: string, encoding: NodeJS.BufferEncoding): Buffer {
  return Buffer.from(data, encoding);
}
```

Prefer using
[`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
or other
[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
subclasses instead.

- `__filename` - use `import.meta.filename` instead.

- `__dirname` - use `import.meta.dirname` instead.

## CommonJS support

Deno supports CommonJS modules by default.

Note: Deno's permission system still applies to CommonJS code. You may need
`--allow-read` because Deno probes `package.json` and `node_modules` to resolve
CommonJS modules.

### Use .cjs extension

If the file extension is `.cjs` Deno will treat this module as CommonJS.

```js title="main.cjs"
const express = require("express");
```

Deno does not look for `package.json` files and `type` option to determine if
the file is CommonJS or ESM.

When using CommonJS, Deno expects that dependencies will be installed manually
and a `node_modules` directory will be present. It's best to set
`"nodeModulesDir": "auto"` in your `deno.json` to ensure that.

```shell
$ cat deno.json
{
  "nodeModulesDir": "auto"
}

$ deno install npm:express
Add npm:express@5.0.0

$ deno run -R -E main.cjs
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],
    ...
  }
}
```

`-R` and `-E` flags are used to allow permissions to read files and environment
variables.

You can also just run a `.cjs` file directly:

```sh
deno run -A main.cjs
```

### package.json type option

Deno will attempt to load `.js`, `.jsx`, `.ts`, and `.tsx` files as CommonJS if
there's a `package.json` file with `"type": "commonjs"` option next to the file,
or up in the directory tree when in a project with a package.json file.

```json title="package.json"
{
  "type": "commonjs"
}
```

```js title="main.js"
const express = require("express");
```

Tools like Next.js's bundler and others will generate a `package.json` file like
that automatically.

If you have an existing project that uses CommonJS modules, you can make it work
with both Node.js and Deno, by adding `"type": "commonjs"` option to the
`package.json` file.

### Always detecting if a file might be CommonJS

Telling Deno to analyze modules as possibly being CommonJS is possible by
running with the `--unstable-detect-cjs` in Deno >= 2.1.2. This will take
effect, except when there's a _package.json_ file with `{ "type": "module" }`.

Looking for package.json files on the file system and analyzing a module to
detect if its CommonJS takes longer than not doing it. For this reason and to
discourage the use of CommonJS, Deno does not do this behavior by default.

### Create require() manually

An alternative option is to create an instance of the `require()` function
manually:

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

In this scenario the same requirements apply, as when running `.cjs` files -
dependencies need to be installed manually and appropriate permission flags
given.

### require(ESM)

Deno's `require()` implementation supports requiring ES modules.

This works the same as in Node.js, where you can only `require()` ES modules
that don't have Top-Level Await in their module graph - or in other words you
can only `require()` ES modules that are "synchronous".

```js title="greet.js"
export function greet(name) {
  return `Hello ${name}`;
}
```

```js title="esm.js"
import { greet } from "./greet.js";

export { greet };
```

```js title="main.cjs"
const esm = require("./esm");
console.log(esm);
console.log(esm.greet("Deno"));
```

```shell
$ deno run -R main.cjs
[Module: null prototype] { greet: [Function: greet] }
Hello Deno
```

### Import CommonJS modules

You can also import CommonJS files in ES modules.

```js title="greet.cjs"
module.exports = {
  hello: "world",
};
```

```js title="main.js"
import greet from "./greet.js";
console.log(greet);
```

```shell
$ deno run main.js
{
  "hello": "world"
}
```

### Hints and suggestions

Deno will guide you when a file looks like CommonJS but isn’t loaded as such. If
you see an error about `module` not being defined, fix it by one of the
following:

- Rewrite to ESM
- Change the file extension to `.cjs`
- Add a nearby `package.json` with `{ "type": "commonjs" }`
- Run with `--unstable-detect-cjs`

See docs: [CommonJS in Deno](https://docs.deno.com/go/commonjs)

## Conditional exports

Package exports can be
[conditioned](https://nodejs.org/api/packages.html#conditional-exports) on the
resolution mode. The conditions satisfied by an import from a Deno ESM module
are as follows:

```json
["deno", "node", "import", "default"]
```

This means that the first condition listed in a package export whose key equals
any of these strings will be matched. You can expand this list using the
`--unstable-node-conditions` CLI flag:

```shell
deno run --unstable-node-conditions development,react-server main.ts
```

```json
["development", "react-server", "deno", "node", "import", "default"]
```

## Importing types

Many npm packages ship with types, you can import these and use them with types
directly:

```ts
import chalk from "npm:chalk@5";
```

Some packages do not ship with types but you can specify their types with the
[`@ts-types`](/runtime/fundamentals/typescript) directive. For example, using a
[`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types)
package:

```ts
// @ts-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

### Module resolution

The official TypeScript compiler `tsc` supports different
[moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution)
settings. Deno only supports the modern `node16` resolution. Unfortunately many
npm packages fail to correctly provide types under node16 module resolution,
which can result in `deno check` reporting type errors, that `tsc` does not
report.

If a default export from an `npm:` import appears to have a wrong type (with the
right type seemingly being available under the `.default` property), it's most
likely that the package provides wrong types under node16 module resolution for
imports from ESM. You can verify this by checking if the error also occurs with
`tsc --module node16` and `"type": "module"` in `package.json` or by consulting
the [Are the types wrong?](https://arethetypeswrong.github.io/) website
(particularly the "node16 from ESM" row).

If you want to use a package that doesn't support TypeScript's node16 module
resolution, you can:

1. Open an issue at the issue tracker of the package about the problem. (And
   perhaps contribute a fix :) (Although, unfortunately, there is a lack of
   tooling for packages to support both ESM and CJS, since default exports
   require different syntaxes. See also
   [microsoft/TypeScript#54593](https://github.com/microsoft/TypeScript/issues/54593))
2. Use a [CDN](/runtime/fundamentals/modules/#url_imports), that rebuilds the
   packages for Deno support, instead of an `npm:` identifier.
3. Ignore the type errors you get in your code base with `// @ts-expect-error`
   or `// @ts-ignore`.

## Including Node types

Node ships with many built-in types like `Buffer` that might be referenced in an
npm package's types. To load these you must add a types reference directive to
the `@types/node` package:

```ts
/// <reference types="npm:@types/node" />
```

Note that it is fine to not specify a version for this in most cases because
Deno will try to keep it in sync with its internal Node code, but you can always
override the version used if necessary.

## Run npm binaries

You can run npm CLI tools (packages with `bin` entries) directly without
`npm install` by using an `npm:` specifier:

```console
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

For example:

```sh
$ deno run --allow-read npm:cowsay@1.5.0 "Hello there!"
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

$ deno run --allow-read npm:cowsay@1.5.0/cowthink "What to eat?"
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## node_modules

When you run `npm install`, npm creates a `node_modules` directory in your
project which houses the dependencies as specified in the `package.json` file.

Deno uses [npm specifiers](/runtime/fundamentals/node/#using-npm-packages) to
resolve npm packages to a central global npm cache, instead of using a
`node_modules` folder in your projects. This is ideal since it uses less space
and keeps your project directory clean.

There may however be cases where you need a local `node_modules` directory in
your Deno project, even if you don’t have a `package.json` (eg. when using
frameworks like Next.js or Svelte or when depending on npm packages that use
Node-API).

### Choosing a node_modules mode

- Use no local node_modules (default) when your project runs fine with Deno's
  global cache. No setup required.
- Use auto when some tools expect node_modules or you rely on Node-API addons
  and want automatic creation.
- Use manual when your project has a package.json and you prefer an explicit
  install step.

| Mode   | When to use                                  | How to enable                                              |
| ------ | -------------------------------------------- | ---------------------------------------------------------- |
| none   | Most Deno projects; keep repo clean          | Default; do nothing                                        |
| auto   | Tools/bundlers expect node_modules; Node-API | `"nodeModulesDir": "auto"` or `--node-modules-dir=auto`    |
| manual | Existing package.json with install step      | `"nodeModulesDir": "manual"` + run `deno install`/npm/pnpm |

### Default Deno dependencies behavior

By default, Deno will not create a `node_modules` directory when you use the
`deno run` command, dependencies will be installed into the global cache. This
is the recommended setup for new Deno projects.

### Automatic node_modules creation

If you need a `node_modules` directory in your project, you can use the
`--node-modules-dir` flag or `nodeModulesDir: auto` option in the config file to
tell Deno to create a `node_modules` directory in the current working directory:

```sh
deno run --node-modules-dir=auto main.ts
```

or with a configuration file:

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

The auto mode automatically installs dependencies into the global cache and
creates a local node_modules directory in the project root. This is recommended
for projects that have npm dependencies that rely on node_modules directory -
mostly projects using bundlers or ones that have npm dependencies with
postinstall scripts.

### Manual node_modules creation

If your project has a `package.json` file, you can use the manual mode, which
requires an installation step to create your `node_modules` directory:

```sh
deno install
deno run --node-modules-dir=manual main.ts
```

or with a configuration file:

```json title="deno.json"
{ "nodeModulesDir": "manual" }
```

You would then run `deno install/npm install/pnpm install` or any other package
manager to create the `node_modules` directory.

Manual mode is the default mode for projects using a `package.json`. You may
recognize this workflow from Node.js projects. It is recommended for projects
using frameworks like Next.js, Remix, Svelte, Qwik etc, or tools like Vite,
Parcel or Rollup.

:::note

We recommend that you use the default `none` mode, and fallback to `auto` or
`manual` mode if you get errors about missing packages inside the `node_modules`
directory.

:::

### node_modules flag

You can also enable the creation of a `node_modules` directory on a per-command
basis with the `--node-modules-dir` flag.

```ts title="main.ts"
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello"));
```

```sh
deno run --node-modules-dir main.ts
```

Running the above command, with a `--node-modules-dir` flag, will create a
`node_modules` folder in the current directory with a similar folder structure
to npm.

## Node-API addons

Summary: Node-API addons work in Deno when a local `node_modules/` is present
and you grant `--allow-ffi`.

Deno supports [Node-API addons](https://nodejs.org/api/n-api.html) used by
popular npm packages like [`esbuild`](https://www.npmjs.com/package/esbuild),
[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) and
[`npm:duckdb`](https://www.npmjs.com/package/duckdb). You can expect packages
that use public Node-APIs to work.

:::note

Many addons rely on npm lifecycle scripts (for example, `postinstall`). Deno
supports them, but they are not run by default for security reasons. See the
[`deno install` docs](/runtime/reference/cli/install/).

:::

As of Deno 2.0, npm packages using Node-API addons are supported when a local
`node_modules/` directory is present. Configure
`"nodeModulesDir": "auto" | "manual"` in `deno.json` or run with
`--node-modules-dir=auto|manual`.

Like all native FFI, pass `--allow-ffi` to grant explicit permission. Review
[Security and permissions](/runtime/fundamentals/security/#ffi-(foreign-function-interface)).

## Migrating from Node to Deno

Running your Node.js project with Deno is a straightforward process. In most
cases you can expect little to no changes to be required, if your project is
written using ES modules.

Main points to be aware of:

1. Use the `node:` specifier for built-in modules (see Using Node's built-in
   modules above).
2. Some Node globals like `Buffer` must be imported from `node:buffer` (see
   Node.js global objects).
3. `require()` is available in `.cjs` files or via `createRequire` (see CommonJS
   support).

### Running scripts

Deno supports running npm scripts natively with the
[`deno task`](/runtime/reference/cli/task_runner/) subcommand (If you're
migrating from Node.js, this is similar to the `npm run script` command).
Consider the following Node.js project with a script called `start` inside its
`package.json`:

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "eslint"
  }
}
```

You can execute this script with Deno by running:

```sh
deno task start
```

### Optional improvements

Deno ships a unified toolchain (configuration, linter, formatter, test runner)
that can simplify your setup when migrating:

- Configuration: /runtime/fundamentals/configuration/
- Linter: /runtime/reference/cli/linter/
- Formatter: /runtime/reference/cli/formatter/
- Test runner: /runtime/reference/cli/test/

## Private registries

:::caution

Not to be confused with
[private repositories and modules](/runtime/fundamentals/modules/#private-repositories).

:::

Deno supports private registries, which allow you to host and share your own
modules. This is useful for organizations that want to keep their code private
or for individuals who want to share their code with a select group of people.

### What are private registries?

Large organizations often host their own private npm registries to manage
internal packages securely. These private registries serve as repositories where
organizations can publish and store their proprietary or custom packages. Unlike
public npm registries, private registries are accessible only to authorized
users within the organization.

### How to use private registries with Deno

First, configure your
[`.npmrc`](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc) file to point
to your private registry. The `.npmrc` file must be in the project root or
`$HOME` directory. Add the following to your `.npmrc` file:

```sh
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_auth=secretToken
```

Replace `http://mycompany.com:8111/` with the actual URL of your private
registry and `secretToken` with your authentication token.

Then update Your `deno.json` or `package.json` to specify the import path for
your private package. For example:

```json title="deno.json"
{
  "imports": {
    "@mycompany/package": "npm:@mycompany/package@1.0.0"
  }
}
```

or if you're using a `package.json`:

```json title="package.json"
{
  "dependencies": {
    "@mycompany/package": "1.0.0"
  }
}
```

Now you can import your private package in your Deno code:

```typescript title="main.ts"
import { hello } from "@mycompany/package";

console.log(hello());
```

and run it using the `deno run` command:

```sh
deno run main.ts
```

## Node to Deno Cheatsheet

| Node.js                                | Deno                          |
| -------------------------------------- | ----------------------------- |
| `node file.js`                         | `deno file.js`                |
| `ts-node file.ts`                      | `deno file.ts`                |
| `nodemon`                              | `deno run --watch`            |
| `node -e`                              | `deno eval`                   |
| `npm i` / `npm install`                | `deno install`                |
| `npm install -g`                       | `deno install -g`             |
| `npm run`                              | `deno task`                   |
| `eslint`                               | `deno lint`                   |
| `prettier`                             | `deno fmt`                    |
| `package.json`                         | `deno.json` or `package.json` |
| `tsc`                                  | `deno check` ¹                |
| `typedoc`                              | `deno doc`                    |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                   |
| `nexe` / `pkg`                         | `deno compile`                |
| `npm explain`                          | `deno info`                   |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                |
| `tsserver`                             | `deno lsp`                    |
| `nyc` / `c8` / `istanbul`              | `deno coverage`               |
| benchmarks                             | `deno bench`                  |

¹ Type checking happens automatically, TypeScript compiler is built into the
`deno` binary.
