# Unstable Feature Flags

New features of the Deno runtime are often released behind feature flags, so
users can try out new APIs and features before they are finalized. Current
unstable feature flags are listed on this page, and can also be found in the CLI
help text by running:

```sh
deno --help
```

## Configuration in `deno.json`

You can specify which unstable features you'd like to enable for your project
using a
[configuration option in `deno.json`](../getting_started/configuration_file.md).

```json title="deno.json"
{
  "unstable": ["bare-node-builtins", "webgpu"]
}
```

The possible values in the `unstable` array are the flag names with the
`--unstable-` prefix removed.

## `--unstable`

Before more recent Deno versions (1.38+), unstable APIs were made available all
at once using the `--unstable` flag. Notably, [Deno KV](/kv/manual) and other
cloud primitive APIs are available behind this flag. To run a program with
access to these unstable features, you would run your script with:

```sh
deno run --unstable your_script.ts
```

In the future, we will use more granular feature flags to enable specific APIs,
as described below. Most features behind the older `--unstable` flag now also
have their own granular feature flag.

## `--unstable-bare-node-builtins`

:::info Enable via environment variable

This feature flag can also be enabled by setting any value for the following
environment variable:

```sh
export DENO_UNSTABLE_BARE_NODE_BUILTINS=true
```

:::

This flag enables you to
[import Node.js built-in modules](../node/node_specifiers.md) without a `node:`
specifier, as in the example below. You can also use this flag to enable npm
packages without an `npm:` specifier if you are manually managing your Node.js
dependencies ([see `byonm` flag](#--unstable-byonm)).

```ts title="example.ts"
import { readFileSync } from "fs";

console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

Use the feature flag when executing a script to enable this behavior.

```sh
deno run -A --unstable-bare-node-builtins ./example.ts
```

## `--unstable-byonm`

:::info Enable via environment variable

This feature flag can also be enabled by setting any value for the following
environment variable:

```sh
export DENO_UNSTABLE_BYONM=true
```

:::

This feature flag enables support for resolving modules from a local
`node_modules` folder that you manage outside of Deno with
[npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), or
[yarn](https://yarnpkg.com/). This may improve compatibility with Node.js
modules that have hard requirements on the installation behavior of npm clients,
or the presence of a `node_modules` folder.

In your Deno project folder, include a `package.json` file which declares your
dependencies, and manage them through an npm client as you would normally.
Consider a `package.json` with the following dependencies:

```json title="package.json"
{
  ...
  "dependencies": {
    "cowsay": "^1.5.0"
  }
  ...
}
```

You would install them as usual with:

```sh
npm install
```

Afterward, you could write code in a Deno program that looks like this:

```ts title="example.ts"
import cowsay from "npm:cowsay";

console.log(cowsay.say({
  text: "Hello from Deno using BYONM!",
}));
```

Use the feature flag when executing a script to enable this behavior.

```sh
deno run -A --unstable-byonm ./example.ts
```

## `--unstable-sloppy-imports`

:::info Enable via environment variable

This feature flag can also be enabled by setting any value for the following
environment variable:

```sh
export DENO_UNSTABLE_SLOPPY_IMPORTS=true
```

:::

This flag enables behavior which will infer file extensions from imports that do
not include them. Normally, the import statement below would produce an error:

```ts title="foo.ts"
import { Example } from "./bar";
console.log(Example);
```

```ts title="bar.ts"
export const Example = "Example";
```

Executing the script with sloppy imports enabled will remove the error, but
provide guidance that a more performant syntax should be used.

```sh
deno run --unstable-sloppy-imports foo.ts
```

Sloppy imports will allow (but print warnings for) the following:

- Omit file extensions from imports
- Use incorrect file extensions (e.g. importing with a `.js` extension when the
  actual file is `.ts`)
- Import a directory path, and automatically use `index.js` or `index.ts` as the
  import for that directory

## `--unstable-unsafe-proto`

Deno made a conscious decision to not support `Object.prototype.__proto__` for
security reasons. However there are still many npm packages that rely on this
property to work correctly.

This flag enables this property. Note that it is not recommended to use this,
but if you really need to use a package that relies on it, the escape hatch is
now available to you.

## `--unstable-workspaces`

:::info Enable via environment variable

This feature flag can also be enabled by setting any value for the following
environment variable:

```sh
export DENO_UNSTABLE_WORKSPACES=true
```

::: Enable unstable 'workspaces' feature

<!--
          [env: DENO_UNSTABLE_WORKSPACES=]

      --unstable-broadcast-channel
          Enable unstable `BroadcastChannel` API

      --unstable-cron
          Enable unstable Deno.cron API

      --unstable-ffi
          Enable unstable FFI APIs

      --unstable-fs
          Enable unstable file system APIs

      --unstable-http
          Enable unstable HTTP APIs

      --unstable-kv
          Enable unstable Key-Value store APIs

      --unstable-net
          Enable unstable net APIs

      --unstable-unsafe-proto
          Enable unsafe __proto__ support. This is a security risk.

      --unstable-webgpu
          Enable unstable `WebGPU` API

      --unstable-worker-options
          Enable unstable Web Worker APIs
-->
