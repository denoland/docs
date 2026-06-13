---
last_modified: 2026-06-12
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
for the rules and edge cases.

## Compatibility at a glance

| Surface                                         | Status                                                | Details                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `node:` built-in modules                        | Supported; nearly every module is implemented         | [Node built-in modules](#node-built-in-modules)                                          |
| npm packages                                    | Supported, via `npm:` specifiers or `package.json`    | [Using npm packages](#using-npm-packages)                                                |
| Node globals (`process`, `Buffer`, `__dirname`) | Supported; some need an explicit import               | [Node globals](#node-globals)                                                            |
| `package.json` (dependencies, scripts, `type`)  | Supported: dependencies, `deno task` scripts, `type`  | [package.json support](#package.json-support)                                            |
| CommonJS (`require()`, `.cjs`)                  | Supported; module type detection differs in one case  | [CommonJS support](#commonjs-support)                                                    |
| `node_modules` layouts                          | Optional; three modes, isolated or hoisted layout     | [node_modules](#node_modules)                                                            |
| Native addons (Node-API)                        | Supported with local `node_modules` and `--allow-ffi` | [Node-API addons](#node-api-addons)                                                      |
| `.npmrc` and registries                         | Supported: private registries, auth tokens, mTLS      | [Private registries](#private-registries), [.npmrc configuration](#.npmrc-configuration) |

As of Deno 2.8, **over 75% of Node's own test suite passes** in Deno, covering
nearly every `node:` module. You can track the current state at
[node-test-viewer.deno.dev](https://node-test-viewer.deno.dev/) and browse the
[list of supported Node.js APIs](/runtime/reference/node_apis/).

## Node built-in modules

Node's built-in APIs are available in Deno through the `node:` import prefix:

```js title="main.mjs"
import * as os from "node:os";
console.log(os.cpus());
```

Run it with `deno run main.mjs` to get the same output as in Node.js.

The rules:

- **`node:os` and bare `os` both work.** Since Deno 2.9, a specifier that
  matches a Node built-in resolves to it automatically, so `import os from "os"`
  runs with no prefix and no flag. Before 2.9 the bare form errored unless you
  passed `--unstable-bare-node-builtins`. Prefer the explicit `node:` form: it
  is unambiguous, it is what the Deno LSP's quick-fixes insert, and it works in
  Node.js too, so updated files stay portable.
- **Your own mappings take precedence.** A `deno.json` `imports` entry or a
  `package.json` dependency of the same name wins over the built-in; a
  same-named package in `node_modules` no longer shadows it, matching Node.js.
- **Loader hooks work.** The `node:module` built-in includes the
  [`registerHooks()`](/runtime/reference/loader_hooks/) API, which you can use
  to customize module resolution and loading from inside your program.

<a href="/api/node/" class="docs-cta runtime-cta">Explore built-in Node APIs</a>

## Using npm packages

Deno imports npm packages natively with `npm:` specifiers:

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

```sh
$ deno run main.js
🦕 ❤️ npm
```

The specifier format is:

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

The rules:

- **By default there is no `node_modules` folder.** Dependencies are downloaded
  into Deno's global cache the first time you run the code. Some packages and
  tools still need a local `node_modules` directory or an install step; see
  [node_modules](#node_modules).
- **Permissions apply.** npm packages are subject to the same
  [permissions](/runtime/fundamentals/security/) as other code in Deno.
- **You can declare dependencies in `package.json`** instead of writing `npm:`
  specifiers inline; see [package.json support](#package.json-support).
- For examples with popular libraries, refer to the
  [tutorial section](/runtime/tutorials).

### Running npm binaries

`npm:` specifiers also cover the use case of the `npx` command:

```console
# npx allows remote execution of a package from npm or a URL
$ npx create-next-app@latest

# deno run can execute packages remotely as well,
# scoped to npm via the `npm:` specifier
$ deno run -A npm:create-next-app@latest
```

You can run any npm CLI tool (a package with `bin` entries) directly, using the
format `npm:<package-name>[@<version-requirement>][/<binary-name>]`:

```sh
$ deno run -R npm:cowsay@1.5.0 "Hello there!"
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

A subpath selects a different binary from the same package:

```sh
$ deno run -R npm:cowsay@1.5.0/cowthink "What to eat?"
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

### Conditional exports

Package exports can be
[conditioned](https://nodejs.org/api/packages.html#conditional-exports) on the
resolution mode. The conditions satisfied by an import from a Deno ESM module
are as follows:

```json
["deno", "node", "import", "module-sync", "default"]
```

The first condition listed in a package export whose key equals any of these
strings is matched. For `require()` resolution, including `createRequire()`, the
conditions are:

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

## Node globals

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

## package.json support

Deno understands the `package.json` in your project. Given:

```json title="package.json"
{
  "name": "my-app",
  "type": "module",
  "scripts": {
    "start": "deno run -R main.js"
  },
  "dependencies": {
    "camelcase": "^8"
  }
}
```

```js title="main.js"
import camelCase from "camelcase";
console.log(camelCase("hello deno"));
```

you can install the dependencies and run the `start` script:

```sh
$ deno install
$ deno task start
Task start deno run -R main.js
helloDeno
```

What works:

- **Dependencies**: bare specifiers like `camelcase` resolve through the
  `dependencies` field (alongside or instead of inline `npm:` specifiers).
- **Scripts**: `deno task` runs the `scripts` entries (for example,
  `deno task start`).
- **The `type` field**: Deno honors `"type": "commonjs"` and `"type": "module"`
  when resolving modules (see [CommonJS support](#commonjs-support)).

Note that a project containing a `package.json` defaults to the `manual`
`node_modules` mode, so an install step is expected; see
[node_modules](#node_modules).

## CommonJS support

Deno supports CommonJS modules by default:

```js title="add.cjs"
module.exports.add = (a, b) => a + b;
```

```js title="main.cjs"
const { add } = require("./add.cjs");
console.log(add(2, 3));
```

```sh
$ deno run -R main.cjs
5
```

Two ground rules:

- When using CommonJS, Deno expects dependencies to be installed manually and a
  `node_modules` directory to be present. Set `"nodeModulesDir": "auto"` in your
  `deno.json` to ensure that (see [node_modules](#node_modules)).
- Deno's permission system also applies to CommonJS code. You typically need the
  `-R` (`--allow-read`) and `-E` (`--allow-env`) flags, because Deno probes
  `package.json` files and the `node_modules` directory to resolve CommonJS
  modules.

### How Deno determines module type

- **`.cjs` files are always CommonJS.** Deno does not consult `package.json` for
  them:

  ```js title="main.cjs"
  const express = require("express");
  ```

- **`.js`, `.jsx`, `.ts`, and `.tsx` files are CommonJS when `package.json` says
  so.** Deno will attempt to load them as CommonJS if there's a `package.json`
  file with the `"type": "commonjs"` option next to the file, or up in the
  directory tree when in a project with a `package.json` file:

  ```json title="package.json"
  {
    "type": "commonjs"
  }
  ```

  ```js title="main.js"
  const express = require("express");
  ```

  Tools like Next.js's bundler and others will generate a `package.json` file
  like that automatically. If you have an existing project that uses CommonJS
  modules, you can make it work with both Node.js and Deno by adding the
  `"type": "commonjs"` option to the `package.json` file.

- **Deno does not otherwise analyze module contents to detect CommonJS**,
  because probing the file system and analyzing modules is slower than not doing
  it, and to discourage the use of CommonJS. You can opt into this detection by
  running with the `--unstable-detect-cjs` flag in Deno >= 2.1.2. It takes
  effect except when there's a `package.json` file with `{ "type": "module" }`.

### Using require()

To run the `.cjs` express example above, install the dependency and pass the
read and env permission flags:

```shell
$ cat deno.json
{
  "nodeModulesDir": "auto"
}

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

In ES modules, you can create an instance of the `require()` function manually:

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

In this scenario the same requirements apply as when running `.cjs` files:
dependencies need to be installed manually and appropriate permission flags
given.

### CommonJS and ESM interop

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

You can also import CommonJS files in ES modules:

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

### Troubleshooting

Deno will guide you when a file looks like CommonJS but isn't loaded as such. If
you see an error about `module` not being defined, fix it by one of the
following:

- Rewrite the code to ESM
- Change the file extension to `.cjs`
- Add a nearby `package.json` with `{ "type": "commonjs" }`
- Run with `--unstable-detect-cjs`

## node_modules

By default, Deno resolves
[npm specifiers](/runtime/fundamentals/node/#using-npm-packages) to a central
global npm cache and does not create a `node_modules` directory. This uses less
space, keeps your project directory clean, and is the recommended setup for new
Deno projects.

You may however need a local `node_modules` directory, even without a
`package.json` (eg. when using frameworks like Next.js or Svelte, or npm
packages that use Node-API).

### Choosing a node_modules mode

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

Use the `--node-modules-dir=auto` flag on a per-command basis, or the
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

Auto mode installs dependencies into the global cache and creates a local
node_modules directory in the project root. It is recommended when npm
dependencies rely on the node_modules directory: mostly projects using bundlers,
or ones with postinstall scripts.

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

Any package manager works for the install step: `deno install`, `npm install`,
`pnpm install`, etc.

Manual mode is the default mode for projects using a `package.json`, matching
the workflow you know from Node.js projects. It is recommended for projects
using frameworks like Next.js, Remix, Svelte, Qwik etc, or tools like Vite,
Parcel or Rollup.

### node_modules layout: isolated vs hoisted

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

## Node-API addons

Deno supports [Node-API addons](https://nodejs.org/api/n-api.html) used by
popular npm packages like [`esbuild`](https://www.npmjs.com/package/esbuild),
[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) and
[`npm:duckdb`](https://www.npmjs.com/package/duckdb). You can expect packages
that use public Node-APIs to work.

The requirements:

- **A local `node_modules` directory must be present** (supported as of Deno
  2.0). Configure `"nodeModulesDir": "auto" | "manual"` in `deno.json` or run
  with `--node-modules-dir=auto|manual`.
- **FFI permission is required.** Like all native FFI, pass `--allow-ffi` to
  grant explicit permission. Review
  [Security and permissions](/runtime/reference/permissions/#ffi-(foreign-function-interface)).

:::note

Many addons rely on npm lifecycle scripts (for example, `postinstall`). Deno
supports them, but they are not run by default for security reasons. See the
[`deno install` docs](/runtime/reference/cli/install/).

:::

## TypeScript types

### Importing types

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

### Including Node types

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

## Migrating from Node to Deno

Running a Node.js project with Deno usually requires little to no change. See
the [Migrating from Node.js to Deno guide](/runtime/migrate/) for the details,
optional toolchain improvements, and a Node-to-Deno command cheatsheet.

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

- **`min-release-age`** (Deno 2.8+): refuses to install package versions younger
  than the configured age. Useful as a default supply-chain guard for all
  installs. The same control is also available as the CLI flag
  `--minimum-dependency-age` and the `minimumDependencyAge` field in
  `deno.json`. See
  [Minimum dependency age](/runtime/packages/supply_chain/#minimum-dependency-age)
  for the full picture.

  ```ini title=".npmrc"
  min-release-age=3
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
