---
last_modified: 2026-11-12
title: "Using KV from Node.js"
description: "Connect to a Deno KV database on Deno Deploy, or to a self-hosted denokv server, from Node.js with the @deno/kv client and a KV Connect URL."
oldUrl:
  - /kv/manual/node/
---

A Deno KV database hosted on Deno Deploy can be used from Node.js through the
[official client library on npm](https://www.npmjs.com/package/@deno/kv). The
library speaks the open
[KV Connect](https://github.com/denoland/denokv/blob/main/proto/kv-connect.md)
protocol, so the same client also connects to a self-hosted
[`denokv`](https://github.com/denoland/denokv) server.

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

// Connect to a KV database on Deno Deploy
const kv = await openKv(
  "https://api.deno.com/v2/databases/<Database ID>/connect",
);

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

Once the client is initialized, the Deno KV API is available in Node, with one
exception: queue operations (`enqueue` / `listenQueue`) are not part of the KV
Connect protocol, so they are unavailable over a remote connection. The
[package README](https://www.npmjs.com/package/@deno/kv) has the full support
matrix and the supported Node.js versions.

## KV Connect URLs

Connecting to a KV database outside of Deno requires a KV Connect URL. For a
database hosted on Deno Deploy it has this format:

```
https://api.deno.com/v2/databases/<Database ID>/connect
```

Where to find the database ID and how to create the access token that
authenticates the connection (`DENO_KV_ACCESS_TOKEN`, or `accessToken` above) is
described in
[Connect from outside Deno Deploy](/deploy/reference/deno_kv/#connect-from-outside-deno-deploy);
the same URL and token work from the Deno CLI.

For a self-hosted `denokv` server, use the URL the server is listening on (for
example `http://localhost:4512`) and the access token it was started with.

## More information

More information about how to use the Deno KV module for Node can be found on
the project's [README page](https://www.npmjs.com/package/@deno/kv).
