---
last_modified: 2026-06-25
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
  - /runtime/manual/node/faqs
  - /runtime/manual/node/npm_specifiers
  - /runtime/manual/node/private_registries
---

Most Node.js code runs in Deno without modification. Here is a standard Node
HTTP server, executed with `deno` instead of `node`:

```js title="main.mjs"
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.end("Hello from Node-style code in Deno\n");
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000/");
});
```

```sh
$ deno run --allow-net main.mjs
Listening on http://localhost:3000/
```

Find the surface you care about in the overview below, then jump to its section
for a working example, the rules behind it, and what to do when it doesn't work.

## Compatibility at a glance

| Surface                                         | Status                                                | Details                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `node:` built-in modules                        | Supported; nearly every module is implemented         | [Use a Node built-in module](#use-a-node-built-in-module)                                |
| npm packages                                    | Supported, via `npm:` specifiers or `package.json`    | [Using npm packages](#using-npm-packages)                                                |
| Node globals (`process`, `Buffer`, `__dirname`) | Supported; some need an explicit import               | [Use Node globals](#use-node-globals-like-process-and-buffer)                            |
| `package.json` (dependencies, scripts, `type`)  | Supported: dependencies, `deno task` scripts, `type`  | [Run an existing Node project](#run-an-existing-node-project)                            |
| CommonJS (`require()`, `.cjs`)                  | Supported; module type detection differs in one case  | [CommonJS support](#commonjs-support)                                                    |
| `node_modules` layouts                          | Optional; three modes, isolated or hoisted layout     | [Control node_modules](#control-node_modules)                                            |
| Native addons (Node-API)                        | Supported with local `node_modules` and `--allow-ffi` | [Use packages with native addons](#use-packages-with-native-addons)                      |
| `.npmrc` and registries                         | Supported: private registries, auth tokens, mTLS      | [Private registries](#private-registries), [.npmrc configuration](#.npmrc-configuration) |

As of Deno 2.8, **over 75% of Node's own test suite passes** in Deno, covering
nearly every `node:` module. Most pure-JavaScript npm packages work without
changes. The honest caveats: some APIs are partial, packages with native addons
need a local `node_modules` directory, and a few tools assume npm's exact
on-disk layout. The sections below cover each of those cases.

You can track the current state at
[node-test-viewer.deno.dev](https://node-test-viewer.deno.dev/) and browse the
[list of supported Node.js APIs](/runtime/reference/node_apis/).

## Using npm packages

To use a package from npm, import it with an `npm:` prefix and run the file:

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

```sh
$ deno run main.js
🦕 ❤️ npm
```

Deno downloads the package on first run and stores it in a global cache, so your
project directory stays clean. The full specifier format is:

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

A few rules to know:

- npm packages run under the same
  [permission system](/runtime/fundamentals/security/) as the rest of your code.
  If a package reads files or environment variables, grant `-R` or `-E` (or
  answer the permission prompts).
- You can declare dependencies in `package.json` or in the `imports` map of
  `deno.json` instead of writing `npm:` specifiers inline. See
  [Run an existing Node project](#run-an-existing-node-project).
- If a package fails with errors about missing files inside `node_modules`, it
  expects a local `node_modules` directory. See
  [Control node_modules](#control-node_modules).

For examples with popular libraries, refer to the
[tutorial section](/runtime/tutorials).

## Use a Node built-in module

Deno provides Node's built-in APIs through a compatibility layer. Import them
with the `node:` prefix:

```js title="main.mjs"
import * as os from "node:os";
console.log(os.cpus());
```

Run it with `deno run main.mjs` and you will get the same output as running the
program in Node.js. Updating any imports in your application to use `node:`
specifiers should enable any code using Node built-ins to function as it did in
Node.js.

The `node:module` built-in includes the
[`registerHooks()`](/runtime/reference/loader_hooks/) API, which you can use to
customize module resolution and loading from inside your program.

**Bare imports work too.** Since Deno 2.9, a specifier that matches a Node
built-in resolves to it even without the prefix, so `import * as os from "os"`
runs with no prefix and no flag. Before 2.9 the bare form errored unless you
opted in with an unstable flag. Prefer the explicit `node:` form anyway: it is
unambiguous, it is what the Deno LSP's quick-fixes insert, and it works in
Node.js too. A `deno.json` `imports` entry or `package.json` dependency of the
same name still wins over the built-in, and a `node_modules` package no longer
shadows it, matching Node.js.

<a href="/api/node/" class="docs-cta runtime-cta">Explore built-in Node APIs</a>

## Use Node globals like process and Buffer

Node.js defines a number of
[global objects](https://nodejs.org/api/globals.html) available to all programs.
Here is how the ones you will most often encounter in the wild map to Deno:

| Node global                  | In Deno                                  | What to do                                |
| ---------------------------- | ---------------------------------------- | ----------------------------------------- |
| `process`                    | Available everywhere                     | Use as-is, or import from `node:process`  |
| `Buffer`                     | Not global in your own code              | Import from `node:buffer`                 |
| `__filename`                 | Not defined                              | Use `import.meta.filename`                |
| `__dirname`                  | Not defined                              | Use `import.meta.dirname`                 |
| `require()`                  | Available in CommonJS files              | See [CommonJS support](#commonjs-support) |
| `setTimeout` / `setInterval` | Available; Node semantics since Deno 2.8 | Use as-is                                 |

Details on each:

- `process` is by far the most popular global used in npm packages and is
  available to all code. To prefer the explicit `node:process` import, enable
  the [`no-process-global`](/lint/rules/no-process-global/) lint rule (off by
  default since Deno 2.8); `deno lint` then flags uses of the global:

  ```js title="process.js"
  console.log(process.versions.deno);
  ```

  ```shell
  $ deno run process.js
  2.8.3
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

  Deno reports a current Node-compatible version: `process.version` is `v26.3.0`
  and `process.versions.napi` is `10` (Node-API version 10), so packages that
  gate on the Node or Node-API version see a modern runtime.

- `Buffer` needs to be explicitly imported from the `node:buffer` module:

  ```js title="buffer.js"
  import { Buffer } from "node:buffer";

  const buf = new Buffer(5, "0");
  ```

  For TypeScript users needing Node.js-specific types like `BufferEncoding`,
  these are available through the `NodeJS` namespace when using `@types/node`:

  ```ts title="buffer-types.ts"
  /// <reference types="npm:@types/node" />

  // Now you can use NodeJS namespace types
  function writeToBuffer(
    data: string,
    encoding: NodeJS.BufferEncoding,
  ): Buffer {
    return Buffer.from(data, encoding);
  }
  ```

  Prefer using
  [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
  or other
  [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
  subclasses instead.

- `setTimeout` / `setInterval`: starting in Deno 2.8, the global timer functions
  return a Node.js [`Timeout`](https://nodejs.org/api/timers.html#class-timeout)
  object instead of a number, matching Node.js semantics. The returned object
  exposes methods like `.ref()`, `.unref()`, `.refresh()`, and `.hasRef()`. It
  still coerces to a number (via `Symbol.toPrimitive`), so existing code that
  stores the timer ID as a number or passes it to `clearTimeout`/`clearInterval`
  continues to work unchanged.

  ```ts
  const t = setTimeout(() => {}, 1000);
  t.unref(); // don't keep the event loop alive for this timer
  clearTimeout(t);
  ```

## Run an existing Node project

Deno understands `package.json`, so a typical Node project runs with two
commands: one to install, one to run.

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "start": "node main.js"
  },
  "dependencies": {
    "chalk": "^5"
  }
}
```

```js title="main.js"
import chalk from "chalk";
console.log(chalk.green("ready"));
```

```sh
$ deno install
$ deno run -R -E main.js
ready
```

`deno install` reads `package.json` and creates a `node_modules` directory, so
bare imports like `"chalk"` resolve just as they do in Node. The `-R` and `-E`
flags grant the read and environment access that resolving `node_modules` (and
chalk's color detection) need.

What carries over from your `package.json`:

- **Dependencies** declared there are installed by `deno install` and importable
  by bare specifier.
- **Scripts** run via `deno task`, like `npm run`: `deno task start` runs the
  `start` script. Scripts execute in Deno's built-in cross-platform shell, and
  CLI tools installed in `node_modules/.bin` (test runners, bundlers, linters)
  resolve automatically. The commands themselves still run whatever executables
  they name, so a script that invokes `node` runs Node.
- **Fields** like `"type"` are respected when resolving modules (see
  [CommonJS support](#commonjs-support)).
- **`engines`** constraints are checked: `deno install` prints a warning for
  each `package.json` whose `node` or `deno` version requirement isn't satisfied
  by the current runtime, the same way npm and Yarn do. Other engine keys
  (`npm`, `yarn`, `pnpm`) are ignored.

Projects with a `package.json` default to the manual `node_modules` mode, which
is why the explicit `deno install` step is needed. The
[Control node_modules](#control-node_modules) section covers the alternatives.

**If it doesn't work:** if you run before installing, Deno points you straight
at the fix:

```sh
$ deno run -R -E main.js
error: Could not resolve "chalk", but found it in a package.json. Deno expects the node_modules/ directory to be up to date. Did you forget to run `deno install`?
    at file:///my-app/main.js:1:19
```

Run `deno install` (or set `"nodeModulesDir": "auto"` to skip the explicit
install step) and try again.

For a full checklist, optional toolchain improvements, and a Node-to-Deno
command cheatsheet, see the
[Migrating from Node.js to Deno guide](/runtime/migrate/).

### Tools that spawn `node`

Some native build tools resolve and run a `node` binary directly through the
operating system, which bypasses the `node` interception Deno normally does for
scripts and `child_process`. Next.js 16 is the motivating case: Turbopack's
native addon spawns a pool of `node` workers to run CSS and font loaders, so
`deno task dev` would fail those steps whenever no `node` binary is installed.

To make a separate Node install unnecessary, Deno stands in for `node`. When no
real `node` is found on your `PATH`, Deno places a `node` executable in its
cache directory and prepends that directory to the `PATH` of the processes it
starts. A tool that spawns `node` then reaches Deno, which translates the Node
arguments and runs as if you had invoked `deno node ...`.

This is best-effort and activates only when a real `node` is not already on
`PATH`, so an existing Node installation is never shadowed. Set
`DENO_DISABLE_NODE_SHIM=1` to turn the behavior off.

## Run an npm CLI tool

You can run npm CLI tools (packages with `bin` entries) directly, the way you
would with `npx`:

```sh
$ deno run -R -E npm:cowsay@1.5.0 "Hello there!"
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

The specifier format accepts a subpath that selects a specific binary when a
package ships several:

```console
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

For example, `deno run -R -E npm:cowsay@1.5.0/cowthink` runs the `cowthink`
binary from the same package. Scaffolding tools work the same way; this pair of
commands is equivalent:

```console
# npx allows remote execution of a package from npm or a URL
$ npx create-next-app@latest

# deno run allows remote execution of a package from various locations,
# and can be scoped to npm via the `npm:` specifier.
$ deno run -A npm:create-next-app@latest
```

**If it doesn't work:** tools that read files or environment variables stop at a
permission prompt (or fail in CI). Grant the specific permissions the tool
needs, or `-A` for trusted scaffolding tools that need broad access.

## CommonJS support

Deno supports CommonJS modules by default. Here is the smallest working setup
for a `.cjs` file with an npm dependency:

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

```js title="main.cjs"
const express = require("express");
```

```shell
$ deno install npm:express
Dependencies:
+ npm:express 5.2.1

$ deno run -R -E main.cjs
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],
    ...
  }
}
```

Two requirements drive this recipe. CommonJS resolution expects dependencies to
be installed in a local `node_modules` directory, which
`"nodeModulesDir":
"auto"` ensures (see
[Control node_modules](#control-node_modules)). And Deno's permission system
applies to CommonJS code too: you typically need `-R` (`--allow-read`) and `-E`
(`--allow-env`), because Deno probes `package.json` files and the `node_modules`
directory to resolve CommonJS modules.

### How Deno decides a file is CommonJS

If the file extension is `.cjs`, Deno treats the module as CommonJS without
consulting `package.json`.

Deno will also attempt to load `.js`, `.jsx`, `.ts`, and `.tsx` files as
CommonJS if there's a `package.json` file with the `"type": "commonjs"` option
next to the file, or up in the directory tree when in a project with a
`package.json` file:

```json title="package.json"
{
  "type": "commonjs"
}
```

```js title="main.js"
const express = require("express");
```

Tools like Next.js's bundler and others will generate a `package.json` file like
that automatically. If you have an existing project that uses CommonJS modules,
you can make it work with both Node.js and Deno by adding the
`"type": "commonjs"` option to the `package.json` file.

Deno does not otherwise analyze module contents to detect CommonJS, because
looking for `package.json` files on the file system and analyzing a module to
detect if it's CommonJS takes longer than not doing it, and to discourage the
use of CommonJS. You can opt into this detection by running with the
`--unstable-detect-cjs` flag in Deno >= 2.1.2. It takes effect except when
there's a `package.json` file with `{ "type": "module" }`.

### Call require() from an ES module

You can create an instance of the `require()` function manually:

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

In this scenario the same requirements apply as when running `.cjs` files:
dependencies need to be installed manually and appropriate permission flags
given.

### Mix CommonJS and ES modules

Deno's `require()` implementation supports requiring ES modules. This works the
same as in Node.js, where you can only `require()` ES modules that don't have
top-level await in their module graph. In other words, you can only `require()`
ES modules that are "synchronous".

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

The other direction works too. You can import CommonJS files in ES modules:

```js title="greet.cjs"
module.exports = {
  hello: "world",
};
```

```js title="main.js"
import greet from "./greet.cjs";
console.log(greet);
```

```shell
$ deno run main.js
{ hello: "world" }
```

**If it doesn't work:** Deno guides you when a file looks like CommonJS but
isn't loaded as such. Loading a `.js` file that uses `require` under a
`"type": "module"` project gives you the fix in the error itself:

```sh
$ deno run main.js
error: Uncaught (in promise) ReferenceError: require is not defined
const os = require("node:os");
           ^
    at file:///my-app/main.js:1:12

    info: Deno supports CommonJS modules in .cjs files, or when the closest
          package.json has a "type": "commonjs" option.
    hint: Rewrite this module to ESM,
          or change the file extension to .cjs,
          or add package.json next to the file with "type": "commonjs" option,
          or pass --unstable-detect-cjs flag to detect CommonJS when loading.
    docs: https://docs.deno.com/go/commonjs
```

Whenever you see an error about `module` or `require` not being defined, one of
those four fixes applies:

- Rewrite the code to ESM
- Change the file extension to `.cjs`
- Add a nearby `package.json` with `{ "type": "commonjs" }`
- Run with `--unstable-detect-cjs`

## Control node_modules

When you run `npm install`, npm creates a `node_modules` directory in your
project which houses the dependencies as specified in the `package.json` file.
By default, Deno instead resolves npm packages from a central global cache and
does not create a `node_modules` directory. This uses less space, keeps your
project directory clean, and is the recommended setup for new Deno projects.

There may however be cases where you need a local `node_modules` directory in
your Deno project, even if you don't have a `package.json` (eg. when using
frameworks like Next.js or Svelte or when depending on npm packages that use
Node-API).

### Choose a node_modules mode

| Mode   | When to use                                  | How to enable                                              |
| ------ | -------------------------------------------- | ---------------------------------------------------------- |
| none   | Most Deno projects; keep repo clean          | Default; do nothing                                        |
| auto   | Tools/bundlers expect node_modules; Node-API | `"nodeModulesDir": "auto"` or `--node-modules-dir=auto`    |
| manual | Existing package.json with install step      | `"nodeModulesDir": "manual"` + run `deno install`/npm/pnpm |

:::note

We recommend that you use the default `none` mode, and fall back to `auto` or
`manual` mode if you get errors about missing packages inside the `node_modules`
directory.

:::

### Automatic node_modules creation

If you need a `node_modules` directory in your project, you can use the
`--node-modules-dir=auto` flag on a per-command basis, or the
`"nodeModulesDir": "auto"` option in the config file, to tell Deno to create a
`node_modules` directory in the current working directory:

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
for projects that have npm dependencies that rely on the node_modules directory:
mostly projects using bundlers, or ones that have npm dependencies with
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

### Pick a layout: isolated vs hoisted

When a local `node_modules` directory exists, Deno can lay it out in two ways.
The default (**isolated**) installs each package into a content-addressed
`.deno/` directory and exposes it through a symlink, so every package only sees
its declared dependencies. This is similar to pnpm's layout.

```text
node_modules/
├── .deno/chalk@5.6.2/node_modules/chalk/   ← real files
└── chalk -> .deno/chalk@5.6.2/node_modules/chalk
```

Some npm tooling, and any package that walks `node_modules` looking for
flat-resolved siblings, assumes the **hoisted** layout that npm and Yarn classic
use. Deno 2.8 adds a hoisted mode
([denoland/deno#32788](https://github.com/denoland/deno/pull/32788)) you can opt
into with `nodeModulesLinker` in `deno.json`. The hoisted linker requires a
manually-managed `node_modules` directory, so set `nodeModulesDir` to `manual`:

```json title="deno.json"
{
  "nodeModulesDir": "manual",
  "nodeModulesLinker": "hoisted"
}
```

Or as a one-off CLI flag (also requiring `--node-modules-dir=manual`):

```sh
deno install --node-modules-dir=manual --node-modules-linker=hoisted
```

In hoisted mode the most-depended-upon version of each package is placed at the
top of `node_modules/`, and conflicting versions are nested under the dependent
that needs them, just like npm:

```text
node_modules/
├── chalk/         ← real files
├── express/
├── ms/            ← hoisted: most commonly needed version
└── debug/
    └── node_modules/
        └── ms/    ← nested: a different version
```

Stick with the default isolated mode unless a tool you depend on requires the
hoisted layout. Isolated mode catches phantom dependencies that hoisted layouts
hide.

## Use packages with native addons

Deno supports [Node-API addons](https://nodejs.org/api/n-api.html) used by
popular npm packages like [`esbuild`](https://www.npmjs.com/package/esbuild),
[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) and
[`npm:duckdb`](https://www.npmjs.com/package/duckdb). You can expect packages
that use public Node-APIs to work.

As of Deno 2.0, npm packages using Node-API addons are supported when a local
`node_modules/` directory is present. Configure
`"nodeModulesDir": "auto" | "manual"` in `deno.json` or run with
`--node-modules-dir=auto|manual`. And, like all native FFI, pass `--allow-ffi`
to grant explicit permission. Review
[Security and permissions](/runtime/reference/permissions/#ffi-(foreign-function-interface)).

**If it doesn't work:** many addons rely on npm lifecycle scripts (for example,
`postinstall`) to build or download their native binding, and Deno does not run
those scripts by default, for security reasons. Installing such a package warns
you:

```sh
$ deno install npm:duckdb
╭ Warning
│
│  Ignored build scripts for packages:
│  npm:duckdb@1.4.4
│
│  Run "deno approve-scripts" to run build scripts.
╰─
```

Ignore the warning and the addon fails at runtime, because the native binding
the install script never fetched is missing:

```sh
$ deno run -R -E --allow-ffi main.mjs
error: Uncaught (in promise) Error: Cannot find module '/my-app/node_modules/.deno/duckdb@1.4.4/node_modules/duckdb/lib/binding/duckdb.node'
```

The fix is to allow that specific package's scripts (or run the interactive
`deno approve-scripts` command):

```sh
$ deno install --allow-scripts=npm:duckdb
Initialize duckdb@1.4.4: running 'install' script

$ deno run -R -E --allow-ffi main.mjs
[ { answer: 42 } ]
```

The [`deno install` docs](/runtime/reference/cli/install/) cover the
lifecycle-scripts options in full.

## Control package export conditions

Package exports can be
[conditioned](https://nodejs.org/api/packages.html#conditional-exports) on the
resolution mode. The conditions satisfied by an import from a Deno ESM module
are as follows:

```json
["deno", "node", "import", "module-sync", "default"]
```

This means that the first condition listed in a package export whose key equals
any of these strings will be matched. For `require()` resolution, including
`createRequire()`, the conditions are:

```json
["require", "node", "module-sync", "default"]
```

Deno also applies `module-sync` when analyzing CommonJS modules that re-export
through `require()`.

You can expand the import conditions list using the `--conditions` CLI flag:

```shell
deno run --conditions development,react-server main.ts
```

```json
[
  "development",
  "react-server",
  "deno",
  "node",
  "import",
  "module-sync",
  "default"
]
```

## Get Node and npm type definitions

Starting in Deno 2.8, `deno check` and the LSP include `lib.node` in every
type-check by default, so Node ambient types like `Buffer`, `NodeJS.Timeout`,
and `process` resolve without any configuration:

```ts
// 2.8+: type-checks with no extra setup
const buf: Buffer = Buffer.from("hello");
const t: NodeJS.Timeout = setTimeout(() => {}, 0);
```

The bundled `lib.node` tracks the major version of `@types/node` that matches
the Node release Deno reports in `process.versions.node`. If you need to pin a
specific `@types/node` version (for example to match the Node version your
project standardizes on), add it as an explicit dependency:

```jsonc title="deno.json"
{
  "imports": {
    "@types/node": "npm:@types/node@^22"
  }
}
```

On versions before 2.8, or if you've opted out of `lib.node`, you can still load
the types with a reference directive:

```ts
/// <reference types="npm:@types/node" />
```

The same directive lets you use types from the `NodeJS` namespace, like
`BufferEncoding`, in your own signatures:

```ts title="buffer-types.ts"
/// <reference types="npm:@types/node" />

// Now you can use NodeJS namespace types
function writeToBuffer(data: string, encoding: NodeJS.BufferEncoding): Buffer {
  return Buffer.from(data, encoding);
}
```

### Types for npm packages

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

### When a package's types look wrong

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

## Private registries

:::caution

Not to be confused with
[private repositories and modules](/runtime/packages/private_repositories/).

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
//mycompany.com:8111/:_authToken=secretToken
```

Replace `http://mycompany.com:8111/` with the actual URL of your private
registry and `secretToken` with your authentication token. `_authToken` is the
standard bearer-token form; registries that use legacy `_auth` credentials are
also supported (see the `.npmrc` features list below).

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

### `.npmrc` configuration

Beyond the basic registry / token setup above, Deno reads several other `.npmrc`
fields. The ones most likely to matter:

- **Mutual-TLS authentication** (Deno 2.8+): `certfile` and `keyfile` point at
  PEM files used to authenticate the client when the registry requires mTLS.

  ```ini title=".npmrc"
  //registry.mycompany.com/:certfile=/etc/deno/client.crt
  //registry.mycompany.com/:keyfile=/etc/deno/client.key
  ```

- **`email` on `_auth` entries** (Deno 2.8+): some legacy on-prem registries
  require an `email` alongside the auth token.

  ```ini title=".npmrc"
  //registry.mycompany.com/:_auth=secretToken
  //registry.mycompany.com/:email=ci@mycompany.com
  ```

- **`min-release-age`**: refuses to install package versions younger than the
  configured age, as a supply-chain guard. Since Deno 2.9 a 24-hour minimum is
  applied by default even when nothing is set, so freshly published versions are
  skipped automatically; set an explicit value to change the window, or `0` to
  turn it off. The same control is available as the CLI flag
  `--minimum-dependency-age`, the `minimumDependencyAge` field in `deno.json`,
  and the `NPM_CONFIG_MIN_RELEASE_AGE` environment variable. See
  [Minimum dependency age](/runtime/packages/supply_chain/#minimum-dependency-age)
  for the full picture.

  ```ini title=".npmrc"
  min-release-age=3
  ```

- **`trust-policy`**: with `no-downgrade`, refuses to resolve a package version
  whose publishing-trust level (trusted publishing, provenance, or staged
  publishing) is weaker than the one already recorded in your lockfile. Off by
  default. See
  [Publishing-trust policy](/runtime/packages/supply_chain/#publishing-trust-policy)
  for the full picture.

  ```ini title=".npmrc"
  trust-policy=no-downgrade
  ```

- **`NPM_CONFIG_REGISTRY` env var**: overrides the registry set in `.npmrc`,
  matching npm's precedence (handy in CI when you want to redirect installs
  without editing the checked-in `.npmrc`).

### `file:` and `link:` dependencies in published packages

Some published npm packages accidentally ship a `file:` or `link:` specifier in
their `package.json` that points at a path on the publisher's machine:

```jsonc title="some-package/package.json"
{
  "dependencies": {
    "lodash": "^4.17.0",
    "local-helpers": "file:../local-helpers"
  }
}
```

Starting in Deno 2.8, those `file:` and `link:` entries are silently skipped
while resolving npm metadata, so packages that carry a stray local-path
dependency install cleanly instead of failing with an "Invalid version
requirement" error.
