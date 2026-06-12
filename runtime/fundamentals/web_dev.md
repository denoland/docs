---
last_modified: 2026-06-12
title: "Web development"
description: "Set up Fresh, Next.js, Astro, Vite, Lume, or Docusaurus with Deno, or build a server without a framework. Verified commands and Deno-specific notes."
oldUrl:
  - /runtime/manual/getting_started/web_frameworks/
  - /runtime/fundamentals/web_frameworks/
---

This page shows you how to start a web project with Deno, either with a popular
framework or with nothing but the built-in HTTP server. For each framework you
get the current scaffolding command, how to run the dev server, and what is
actually different when the project runs under Deno instead of Node.js.

A note on permissions before you start: the scaffolding commands below use `-A`
(allow all permissions) because project generators genuinely need broad access.
They write files, read environment variables, and download and execute packages.
Servers you write yourself need far less, and the
[no-framework section](#without-a-framework) shows what minimal permissions look
like in practice.

## Fresh

[Fresh](https://fresh.deno.dev/) is the web framework built for Deno. It renders
pages on the server and ships no JavaScript to the client by default.
Interactive components are opt-in
[islands](https://jasonformat.com/islands-architecture/), so you only pay for
client-side rendering where you ask for it.

Create a project and start the dev server:

```sh
deno run -Ar jsr:@fresh/init my-fresh-app
cd my-fresh-app
deno task dev
```

The `-r` flag forces Deno to re-download the initializer so you always get the
latest version. The dev server prints its URL when it starts (Fresh 2 uses Vite
for development, which defaults to `http://localhost:5173`). Edit
`routes/index.tsx` to see changes live.

What's different under Deno: nothing to translate, because Fresh targets Deno
directly. Configuration lives in `deno.json` rather than `package.json`,
dependencies come from [JSR](https://jsr.io) and npm through the `imports` map,
and a `deno.lock` file pins them. The generated project sets
`"nodeModulesDir": "manual"` and the initializer creates a `node_modules`
directory, because the Vite-based dev server expects one. The generated tasks
already carry the permissions they need; for example the production `start` task
runs `deno serve -A _fresh/server.js`.

## Next.js

[Next.js](https://nextjs.org/) is a React framework with file-system routing and
server-side rendering. It has no Deno integration of its own, but it runs under
Deno through [Node.js compatibility](/runtime/fundamentals/node/).

```sh
deno run -A npm:create-next-app@latest my-next-app
cd my-next-app
deno install
deno task dev
```

Open `http://localhost:3000` and edit `app/page.tsx` to see changes live.

What's different under Deno: the scaffold is a standard npm project with a
`package.json`. When a `package.json` is present, Deno expects a local
`node_modules` directory, which is why `deno install` runs before the dev
server. Deno records resolved versions in `deno.lock`. `deno task dev` runs the
`dev` script from `package.json`, exactly like `npm run dev` would. To
understand how Deno handles JSX in general, see the
[JSX reference](/runtime/reference/jsx/).

## Astro

[Astro](https://astro.build/) is a content-focused framework that ships static
HTML by default and hydrates components only where needed.

```sh
deno run -A npm:create-astro@latest my-astro-site
cd my-astro-site
deno install
deno task dev
```

Open `http://localhost:4321` and edit `src/pages/index.astro` to see changes
live.

What's different under Deno: the same story as Next.js. Astro is an npm project
built on Vite, so it needs `node_modules`, which `deno install` creates. Beyond
that there is no Deno-specific configuration. If the setup wizard offers to
install dependencies for you, you can skip that step and let `deno install`
handle it.

## Vite

[Vite](https://vite.dev/) is a build tool and dev server used standalone or
underneath frameworks like Vue, React, and Svelte. Vite's own documentation
includes a Deno-specific scaffolding command:

```sh
deno init --npm vite my-vite-app
cd my-vite-app
deno install
deno task dev
```

You can pick a template directly, for example
`deno init --npm vite my-vite-app --template react-ts`. The dev server runs at
`http://localhost:5173`.

What's different under Deno: `deno init --npm vite` runs the `create-vite`
generator for you. The result is an npm project with a `package.json`, so
`deno install` creates the `node_modules` directory Vite requires. From there,
everything works as it would under Node.js.

## Lume

[Lume](https://lume.land/) is a static site generator built for Deno, inspired
by Jekyll and Eleventy.

```sh
mkdir my-lume-site
cd my-lume-site
deno run -A https://lume.land/init.ts
deno task serve
```

The `serve` task builds the site, starts a local server at
`http://localhost:3000`, and rebuilds on changes.

What's different under Deno: like Fresh, Lume is Deno-native. There is no
`package.json` and no `node_modules`. The site is configured in `_config.ts`,
tasks live in `deno.json`, and plugins are imported as modules.

## Docusaurus

[Docusaurus](https://docusaurus.io/) is a static site generator optimized for
documentation websites.

```sh
deno run -A npm:create-docusaurus@latest my-website classic --skip-install
cd my-website
deno install
deno task start
```

Open `http://localhost:3000` to see the site.

What's different under Deno: almost nothing. Docusaurus is a plain npm project
that runs through Deno's Node.js compatibility unchanged. The `--skip-install`
flag stops the generator from invoking npm, and `deno install` puts the
`node_modules` directory in place instead, the same as for Next.js and Astro.

## Without a framework

Deno ships an HTTP server in the runtime, so for APIs, webhooks, and small sites
you may not need a framework at all. The
[HTTP server guide](/runtime/fundamentals/http_server/) covers serving requests,
routing by URL, streaming, and WebSockets with zero dependencies.

When you outgrow hand-rolled routing, two lightweight options work well with
Deno:

[Hono](https://hono.dev/) is a small, fast router in the tradition of Express,
with first-class Deno support:

```sh
deno init --npm hono --template=deno my-hono-app
cd my-hono-app
deno task start
```

[Oak](https://jsr.io/@oak/oak) is a middleware framework in the tradition of
Koa, published on JSR. Add it with `deno add jsr:@oak/oak`, then create
`server.ts`:

```ts
import { Application, Router } from "@oak/oak";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Hello Oak!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8000 });
```

Servers like these are where Deno's
[permission model](/runtime/fundamentals/security/) pays off. Unlike the
scaffolding tools above, a basic server only needs network access:

```sh
deno run --allow-net server.ts
```

If your server later reads files or environment variables, add `--allow-read` or
`--allow-env` for exactly what it touches instead of reaching for `-A`.

## Keep going

- Build a server from scratch in the
  [HTTP server guide](/runtime/fundamentals/http_server/).
- See which browser-standard APIs (`fetch`, Web Streams, Web Crypto, and more)
  are available in the
  [web platform APIs reference](/runtime/reference/web_platform_apis/).
- Follow step-by-step framework tutorials, including React, Vue, SolidJS, and
  more, in the [examples and tutorials section](/examples/).
- When your app is ready for production, deploy it with [Deno Deploy](/deploy/).
