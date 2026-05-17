---
last_modified: 2026-04-18
title: "Deploying Deno to Cloudflare Workers with Wrangler"
description: "Learn how to build and deploy a Deno application to Cloudflare Workers using Wrangler"
url: /examples/cloudflare_workers_wrangler_tutorial/
---

Cloudflare Workers allows you to run JavaScript on Cloudflare's edge network.

This is a short How To guide on deploying a Deno function to Cloudflare Workers.
If you are looking to build a standard Deno web server instead, check out the
[HTTP Server tutorial](/examples/http_server/). If you want to use third-party
tool `denoflare`, refer to
[Cloudflare Workers tutorial](/examples/cloudflare_workers_tutorial/).

Note: You would only be able to deploy
[Module Workers](https://developers.cloudflare.com/workers/learning/migrating-to-module-workers/)
instead of web servers or apps.

## Setup wrangler

First, initialize your project and add Cloudflare's `wrangler` CLI as an npm
dependency. Deno's native npm support makes this seamless.

```shell
deno add npm:wrangler
```

Next, configure your Cloudflare project by creating a `wrangler.json` file in
the root directory. We'll set the entry point to a `src/mod.ts` file we will
create later.

```json
{
  "$schema": "https://www.unpkg.com/wrangler@4.38.0/config-schema.json",
  "name": "deno-wrangler",
  "main": "src/mod.ts",
  "compatibility_date": "2026-04-18",
  "observability": {
    "enabled": true
  }
}
```

Update your `deno.json` file to include helpful tasks for local development and
deployment. We can invoke Wrangler directly through Deno.

```json
{
  "tasks": {
    "deploy": "deno --allow-env --allow-run wrangler deploy",
    "dev": "deno wrangler dev",
    "start": "deno wrangler dev",
    "cf-typegen": "deno wrangler types"
  }
}
```

Run the type generation task to create Cloudflare environment types so your
TypeScript compiler understands the Cloudflare context.

```shell
deno task cf-typegen
```

## Create your function

Now, create your worker script in `src/mod.ts`. It needs to export an object
containing a `fetch` handler to satisfy the Cloudflare Module Worker API.

```typescript
export default {
  async fetch(req) {
    return new Response("Hello World");
  },
} satisfies ExportHandler<Env>;
```

## Setup build

Because Cloudflare Workers runs raw JavaScript and needs standard module
resolution, we must bundle our Deno code (and resolve Deno-specific imports)
before deploying when we depend on external libraries. We will use `esbuild` for
this. For a deeper dive into how this works, see the
[esbuild tutorial](https://www.google.com/search?q=/examples/esbuild/).

Add `esbuild` and the official Deno esbuild plugin to your dependencies:

```shell
deno add npm:esbuild jsr:@deno/esbuild-plugin
```

Create a `build.ts` script in your root directory. This script will bundle your
`src/mod.ts` file into a single JavaScript file at `dist/server.js`.

```typescript
import * as esbuild from "esbuild";
import { denoPlugin } from "@deno/esbuild-plugin";

await esbuild.build({
  entryPoints: ["./src/mod.ts"],
  outfile: "./dist/server.js",
  format: "esm",
  bundle: true,
  minify: true,
  treeShaking: true,
  plugins: [
    denoPlugin(),
  ],
});

await esbuild.stop();
```

Finally, add a build task to your `deno.json` (e.g.,
`"build": "deno run -A build.ts"`)

```json
{
  "tasks": {
    "build": "deno run -REW --allow-run build.ts"
  }
}
```

and update your `wrangler.json` to instruct Wrangler to execute this build step
prior to deployment. Make sure your `main` field points to the bundled output
(`dist/server.js`).

```json
{
  "$schema": "https://www.unpkg.com/wrangler@4.38.0/config-schema.json",
  "name": "deno-wrangler",
  "main": "dist/server.js",
  "compatibility_date": "2026-04-18",
  "observability": {
    "enabled": true
  },
  "build": {
    "command": "deno task build"
  }
}
```

## Deploy

With everything configured, deploying to Cloudflare's edge network is just one
command away.

Run the deploy task we set up in our deno.json:

```shell
deno task deploy
```

Wrangler will automatically run your build.ts script to bundle the application,
and then safely publish the resulting dist/server.js file to Cloudflare Workers.
Once finished, Wrangler will output the live URL where your worker is hosted.
