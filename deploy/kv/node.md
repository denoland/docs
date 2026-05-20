---
last_modified: 2026-05-13
title: "Using KV in Node.js"
oldUrl:
  - /kv/manual/node/
---

:::warning Sunsetting on July 20, 2026

This page covers connecting to a Deno KV database hosted on
<strong>Deno Deploy Classic</strong>
(<a href="https://dash.deno.com">dash.deno.com</a>). Deploy Classic will be shut
down on July 20, 2026 — see the
<a href="/deploy/migration_guide/">migration guide</a> for details.

On the new <a href="/deploy/">Deno Deploy</a> platform, KV databases are
provisioned per app through the
<a href="/deploy/reference/databases/">Databases</a> feature and accessed from
your app code via
<a href="/api/deno/~/Deno.openKv"><code>Deno.openKv()</code></a> without a
connection URL — see
<a href="/deploy/reference/deno_kv/">Deno KV on Deno Deploy</a>. External KV
Connect access to new‑Deploy KV databases is not currently exposed.

:::

Connecting from Node.js to a Deno KV database hosted on Deno Deploy Classic is
supported via our
[official client library on npm](https://www.npmjs.com/package/@deno/kv). You
can find usage instructions for this option below. The same library can also
connect to any other endpoint implementing the open
[KV Connect](https://github.com/denoland/denokv/blob/main/proto/kv-connect.md)
protocol, such as a self‑hosted [`denokv`](https://github.com/denoland/denokv)
instance.

## Installation and usage

Use your preferred npm client to install the client library for Node.js using
one of the commands below.

<deno-tabs group-id="npm-client">
<deno-tab value="npm" label="npm" default>

```sh
npm install @deno/kv
```

</deno-tab>
<deno-tab value="pnpm" label="pnpm">

```sh
pnpm add @deno/kv
```

</deno-tab>
<deno-tab value="yarn" label="yarn">

```sh
yarn add @deno/kv
```

</deno-tab>
</deno-tabs>

Once you've added the package to your Node project, you can import the `openKv`
function (supports both ESM `import` and CJS `require`-based usage):

```js
import { openKv } from "@deno/kv";

// Connect to a KV instance
const kv = await openKv("<KV Connect URL>");

// Write some data
await kv.set(["users", "alice"], { name: "Alice" });

// Read it back
const result = await kv.get(["users", "alice"]);
console.log(result.value); // { name: "Alice" }
```

By default, the access token used for authentication comes from the
`DENO_KV_ACCESS_TOKEN` environment variable. You can also pass it explicitly:

```js
import { openKv } from "@deno/kv";

const kv = await openKv("<KV Connect URL>", { accessToken: myToken });
```

Once your Deno KV client is initialized, the same API available in Deno may be
used in Node as well.

## KV Connect URLs

Connecting to a KV database outside of Deno requires a
[KV Connect](https://github.com/denoland/denokv/blob/main/proto/kv-connect.md)
URL. A KV Connect URL for a database hosted on Deno Deploy Classic will be in
this format: `https://api.deno.com/databases/<database-id>/connect`.

The `database-id` for your project can be found in the
[Deno Deploy Classic dashboard](https://dash.deno.com), under your project's
"KV" tab.

![Connection string locations in Deploy](./images/kv-connect.png)

## More information

More information about how to use the Deno KV module for Node can be found on
the project's [README page](https://www.npmjs.com/package/@deno/kv).
