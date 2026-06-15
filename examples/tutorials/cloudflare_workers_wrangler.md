---
last_modified: 2026-04-18
title: "Deploying Deno to Cloudflare Workers with Wrangler"
description: "Learn how to build and deploy a Deno application to Cloudflare Workers using Wrangler"
url: /examples/cloudflare_workers_wrangler_tutorial/
---

Cloudflare Workers allows you to run JavaScript on Cloudflare's edge network.

Wrangler is the official CLI for Node.js provided by Cloudflare for its
developer platform. In this tutorial, we will deploy a Cloudflare Worker by
using Wrangler from Deno.

Denoflare, a Deno-friendly third-party tool, is guaranteed to run on Deno, but
unlike Wrangler, there is no guarantee that it can correctly utilize Cloudflare
features. If you want to use `denoflare`, refer to
[Cloudflare Workers tutorial](/examples/cloudflare_workers_tutorial/).

## Setup wrangler

First, add the wrangler npm module to your project.

```shell
deno add npm:wrangler
```

Next, create `wrangler.json`. Since the wrangler initialization script generates
many files that are only necessary for Node.js, we will write it manually.
Because the JSON schema references `node_modules` by default, we will configure
it to reference the schema from unpkg.com instead.

```json
{
  "$schema": "https://www.unpkg.com/wrangler/config-schema.json",
  "name": "deno-wrangler",
  "main": "src/mod.ts",
  "compatibility_date": "2026-04-18",
  "observability": {
    "enabled": true
  }
}
```

Also, update `deno.json` to add commands that invoke wrangler features. The
`dev` and `start` commands overlap, but this is to align with what wrangler
generates for Node.js environment.

```json
{
  "tasks": {
    "deploy": "deno --allow-env --allow-run npm:wrangler deploy",
    "dev": "deno npm:wrangler dev",
    "start": "deno npm:wrangler dev",
    "cf-typegen": "deno npm:wrangler types"
  }
}
```

Finally, execute the `cf-typegen` command to automatically generate the type
definition file, `worker-configuration.d.ts`.

```shell
deno task cf-typegen
```

## Create your function

Now, create your worker script in `src/mod.ts`. It needs to export an object
containing a `fetch` handler to satisfy the Cloudflare Module Worker API which
is generated as `worker-configuration.d.ts` in the previous step.

```typescript
export default {
  async fetch(req) {
    return new Response("Hello World");
  },
} satisfies ExportedHandler<Env>;
```

## Setup build

Wrangler includes a built-in build system powered by esbuild, but it is
configured for Node.js by default. Since this is incompatible with Deno's module
resolution mechanism, you must set up your own build environment and configure
[Custom Builds](https://developers.cloudflare.com/workers/wrangler/custom-builds/).

First, download esbuild and the official Deno esbuild plugin.

```shell
deno add npm:esbuild jsr:@deno/esbuild-plugin
```

Next, create a build script in build.ts. This will bundle src/mod.ts into a
single JavaScript file at dist/server.js.

```typescript
import * as esbuild from "esbuild";
import { denoPlugin } from "@deno/esbuild-plugin";

await esbuild.build({
  entryPoints: ["src/mod.ts"],
  outfile: "dist/server.js",
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

Then, we will set up the build script execution task in `deno.json`.

```json
{
  "tasks": {
    "build": "deno run -REW --allow-run build.ts"
  }
}
```

Finally, edit wrangler.json to set it to run the build task during deployment,
and configure the output file to be the entry point.

```json
{
  "$schema": "https://www.unpkg.com/wrangler/config-schema.json",
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

Once you have finished configuring wrangler, you can deploy your worker to the
Cloudflare edge network by executing the `deploy` command.

```shell
deno task deploy
```

Wrangler will automatically run your build.ts script to bundle the application,
and then safely publish the resulting dist/server.js file to Cloudflare Workers.
Once finished, Wrangler will output the live URL where your worker is hosted.
