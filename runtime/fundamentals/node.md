---
title: "Node and npm support"
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

Modern Node.js projects will run in Deno with little to no reworking required.
However, there are some key differences between the two runtimes that you can
take advantage of to make your code simpler and smaller when migrating your
Node.js projects to Deno.

<a href="/api/node/" class="docs-cta runtime-cta">Explore built-in Node APIs</a>

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

npm specifiers have the following format:

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

For examples with popular libraries, please refer to the
[tutorial section](/runtime/tutorials).

### CommonJS support

CommonJS is a module system that predates
[ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
While we firmly believe that ES modules are the future of JavaScript, there are
millions of npm libraries that are written in CommonJS and Deno offers full
support for them. Deno will automatically determine if a package is using
CommonJS and make it work seamlessly when imported:

```js, title="main.js"
import react from "npm:react";
console.log(react);
```

```shell
$ deno run -E main.js
18.3.1
```

_`npm:react` is a CommonJS package. Deno allows you to import it as if it were
an ES module._

Deno strongly encourages the use of ES modules in your code but offers CommonJS
support with following restrictions:

**Use .cjs extension**

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
variables. permissions.

**Deno's permission system is still in effect when using CommonJS modules.** It
is necessary to provide at least `--allow-read` permission as Deno will probe
the file system for `package.json` files and `node_modules` directory to
properly resolve CommonJS modules.

***Create require() manually**

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

**require(ESM)**

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

**import index.cjs**

You can also import CommonJS files in ES modules, provided that these files use
`.cjs` extension.

Deno does not look for `package.json` files and `type` option to determine if
the file is CommonJS or ESM.

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

_Notice that in this example no permission flags were specified - when importing
CJS from ES modules, Deno can staticaly analyze and find relevant modules
without having to probe file system at runtime._

**Hints and suggestions**

Deno will provide useful hints and suggestions to guide you towards working code
when working with CommonJS modules.

As an example, if you try to run a CommonJS module that doesn't have `.cjs`
extension you might see this:

```js title="main.js"
module.exports = {
  hello: "world",
};
```

```shell
$ deno run main.js
error: Uncaught (in promise) ReferenceError: module is not defined
module.exports = {
^
    at file:///main.js:1:1

    info: Deno does not support CommonJS modules without `.cjs` extension.
    hint: Rewrite this module to ESM or change the file extension to `.cjs`.
```

### Importing types

Many npm packages ship with types, you can import these and use them with types
directly:

```ts
import chalk from "npm:chalk@5";
```

Some packages do not ship with types but you can specify their types with the
[`@deno-types`](/runtime/fundamentals/typescript) directive. For example, using
a
[`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types)
package:

```ts
// @deno-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

**Module resolution**

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

### Including Node types

Node ships with many built-in types like `Buffer` that might be referenced in an
npm package's types. To load these you must add a types reference directive to
the `@types/node` package:

```ts
/// <reference types="npm:@types/node" />
```

Note that it is fine to not specify a version for this in most cases because
Deno will try to keep it in sync with its internal Node code, but you can always
override the version used if necessary.

### Executable npm scripts

npm packages with `bin` entries can be executed from the command line without an
`npm install` using a specifier in the following format:

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

### node_modules

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

#### Default Deno dependencies behavior

By default, Deno will not create a `node_modules` directory when you use the
`deno run` command, dependencies will be installed into the global cache. This
is the recommended setup for new Deno projects.

#### Automatic node_modules creation

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

#### Manual node_modules creation

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

#### node_modules with Deno 1.X

Use the `--node-modules-dir` flag.

For example, given `main.ts`:

```ts
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello"));
```

```sh
deno run --node-modules-dir main.ts
```

Running the above command, with a `--node-modules-dir` flag, will create a
`node_modules` folder in the current directory with a similar folder structure
to npm.

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
error[no-process-globals]: NodeJS process global is discouraged in Deno
 --> /process.js:1:13
  |
1 | console.log(process.versions.deno);
  |             ^^^^^^^
  = hint: Add `import process from "node:process";`

  docs: https://lint.deno.land/rules/no-process-globals


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

Prefer using
[`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
or other
[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
subclasses instead.

- `__filename` - use `import.meta.filename` instead.

- `__dirname` - use `import.meta.dirname` instead.

## Node-API addons

Deno supports [Node-API addons](https://nodejs.org/api/n-api.html) that are used
by popular npm packages like [`esbuild`](https://www.npmjs.com/package/esbuild),
[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) or
[`npm:duckdb`](https://www.npmjs.com/package/duckdb).

You can expect all packages that use public and documented Node-APIs to work.

:::info

Most packages using Node-API addons rely on npm "lifecycle scripts", like
`postinstall`.

While Deno supports them, they are not run by default due to security
considerations. Read more in
[`deno install` docs](/runtime/reference/cli/install/).

:::

As of Deno 2.0, npm packages using Node-API addons **are only supported when a
`node_modules/` directory is present**. Add `"nodeModulesDir": "auto"` or
`"nodeModulesDir": "manual"` setting your `deno.json` file, or run with
`--node-modules-dir=auto|manual` flag to ensure these packages work correctly.
In case of misconfiguration Deno will provide hints how the situation can be
resolved.

## Migrating from Node to Deno

Running your Node.js project with Deno is a straightforward process. In most
cases you can expect little to no changes to be required, if your project is
written using ES modules.

Main points to be aware of, include:

1. Importing Node.js built-in modules requires the `node:` specifier:

```js
// ❌
import * as fs from "fs";
import * as http from "http";

// ✅
import * as fs from "node:fs";
import * as http from "node:http";
```

:::tip

It is recommended to change these import specifiers in your existing project
anyway. This is a recommended way to import them in Node.js too.

:::

2. Some [globals available in Node.js](#nodejs-global-objects) need to be
   explicitly imported, eg. `Buffer`:

```js
import { Buffer } from "node:buffer";
```

3. `require()` is only available in files with `.cjs` extension, in other files
   an instance of `require()`
   [needs to be created manually](#nodejs-global-objects). npm dependencies can
   use `require()` regardless of file extension.

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

One of Deno's core strengths is a unified toolchain that comes with support for
TypeScript out of the box, and tools like a linter, formatter and a test runner.
Switching to Deno allows you to simplify your toolchain and reduces the number
of moving components in your project.

**Configuration**

Deno has its own config file, `deno.json` or `deno.jsonc`, which can be used to
[configure your project](/runtime/fundamentals/configuration/)

You can use it to [define dependencies](/runtime/fundamentals/configuration/)
using the `imports` option - you can migrate your dependencies one-by-one from
`package.json`, or elect to not define them in the config file at all and use
`npm:` specifiers inline in your code.

In addition to specifying dependencies you can use `deno.json` to define tasks,
lint and format options, path mappings, and other runtime configurations.

**Linting**

Deno ships with a built-in linter that is written with performance in mind. It's
similar to ESlint, though with a limited number of rules. If you don't rely on
ESLint plugins, you can drop `eslint` dependency from `devDependencies` section
of `package.json` and use `deno lint` instead.

Deno can lint large projects in just a few milliseconds. You can try it out on
your project by running:

```sh
deno lint
```

This will lint all files in your project. When the linter detects a problem, it
will show the line in your editor and in the terminal output. An example of what
that might look like:

```sh
error[no-constant-condition]: Use of a constant expressions as conditions is not allowed.
 --> /my-project/bar.ts:1:5
  | 
1 | if (true) {
  |     ^^^^
  = hint: Remove the constant expression

  docs: https://lint.deno.land/rules/no-constant-condition


Found 1 problem
Checked 4 files
```

Many linting issues can be fixed automatically by passing the `--fix` flag:

```sh
deno lint --fix
```

A full list of all supported linting rules can be found on
[https://lint.deno.land/](https://lint.deno.land/). To learn more about how to
configure the linter, check out the
[`deno lint` subcommand](/runtime/reference/cli/linter/).

**Formatting**

Deno ships with a [built-in formatter](/runtime/reference/cli/formatter/) that
can optionally format your code according to the Deno style guide. Instead of
adding `prettier` to your `devDependencies` you can instead use Deno's built-in
zero-config code formatter `deno fmt`.

You can run the formatter on your project by running:

```sh
deno fmt
```

If using `deno fmt` in CI, you can pass the `--check` argument to make the
formatter exit with an error when it detects improperly formatted code.

```sh
deno fmt --check
```

The formatting rules can be configured in your `deno.json` file. To learn more
about how to configure the formatter, check out the
[`deno fmt` subcommand](/runtime/reference/cli/formatter/).

**Testing**

Deno encourages writing tests for your code, and provides a built-in test runner
to make it easy to write and run tests. The test runner is tightly integrated
into Deno, so that you don't have to do any additional configuration to make
TypeScript or other features work.

```ts title="my_test.ts"
Deno.test("my test", () => {
  // Your test code here
});
```

```sh
deno test
```

When passing the `--watch` flag, the test runner will automatically reload when
any of the imported modules change.

To learn more about the test runner and how to configure it, check out the
[`deno test` subcommand](/runtime/reference/cli/test/) documentation.

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
