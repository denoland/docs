---
last_modified: 2026-06-15
title: "Web development"
description: "Build for the web with Deno: start with the built-in HTTP server, choose a Deno-native or npm framework, and run each one with verified commands and Deno-specific notes."
oldUrl:
  - /runtime/manual/getting_started/web_frameworks/
  - /runtime/fundamentals/web_frameworks/
---

There are three ways to build for the web with Deno, and this page covers all of
them: start from the built-in HTTP server with no dependencies, reach for a
Deno-native framework, or run an established npm framework through Deno's
Node.js compatibility. Pick the row that matches what you're building:

| Approach                    | Reach for it when                                                   | Covered below                                           |
| --------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| **No framework**            | APIs, webhooks, small sites; you want minimal dependencies          | [Start without a framework](#start-without-a-framework) |
| **A Deno-native framework** | You want the smoothest Deno experience, no Node compatibility layer | [Deno-native frameworks](#deno-native-frameworks)       |
| **An npm framework**        | You want an established React, Vue, or Svelte ecosystem framework   | [Run an npm framework](#run-an-npm-framework)           |

## Start without a framework

Deno ships an HTTP server in the runtime, so for APIs, webhooks, and small sites
you may not need a framework at all. `Deno.serve` takes a handler that receives
a standard [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
and returns a
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), the
same objects you already know from the browser. Here is a server that returns an
HTML page, a JSON API route, and a static file:

```ts title="server.ts"
import { serveDir } from "jsr:@std/http/file-server";

Deno.serve((req) => {
  const { pathname } = new URL(req.url);

  // A JSON API route
  if (pathname === "/api/hello") {
    return Response.json({ message: "Hello from Deno" });
  }

  // Static assets from ./public, served under /static/
  if (pathname.startsWith("/static/")) {
    return serveDir(req, { fsRoot: "public", urlRoot: "static" });
  }

  // Everything else: an HTML page
  return new Response(
    `<!doctype html>
<link rel="stylesheet" href="/static/style.css">
<h1>Hello from Deno</h1>
<p>Try <a href="/api/hello">/api/hello</a></p>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
});
```

This is where Deno's [permission model](/runtime/fundamentals/security/) pays
off: a server you write yourself asks for exactly what it touches. This one
needs network access to listen and read access to serve files from `public/`,
and nothing more:

```sh
deno run --allow-net --allow-read server.ts
```

The [HTTP server guide](/runtime/fundamentals/http_server/) takes this further:
routing, streaming responses, graceful shutdown, HTTPS, HTTP/2, and WebSockets,
all with zero dependencies.

### Lightweight routers

When you outgrow hand-rolled routing but don't want a full framework, two small
libraries work well with Deno.

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

```ts title="server.ts"
import { Application, Router } from "@oak/oak";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Hello Oak!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
```

Run it the same way, granting only network access:

```sh
deno run --allow-net server.ts
```

## Deno-native frameworks

These frameworks target Deno directly. There is no `package.json` to translate
and no Node.js compatibility layer in the way: configuration lives in
`deno.json`, dependencies come from [JSR](https://jsr.io) and npm through the
`imports` map, and a `deno.lock` file pins them.

### Fresh

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
directly. The generated project sets `"nodeModulesDir": "manual"` and the
initializer creates a `node_modules` directory, because the Vite-based dev
server expects one. The generated tasks already carry the permissions they need;
for example the production `start` task runs `deno serve -A _fresh/server.js`.

### Lume

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

## Run an npm framework

Established npm frameworks run under Deno through
[Node.js compatibility](/runtime/fundamentals/node/), and the pattern is the
same for all of them:

1. **Scaffold** with the framework's own generator, run through Deno. Generators
   need `-A` (allow all) because they write files, read environment variables,
   and download and execute packages.
2. **Install** with `deno install`. The scaffold is a standard npm project with
   a `package.json`, and Deno expects a local `node_modules` directory when one
   is present. This step creates it and records resolved versions in
   `deno.lock`.
3. **Run** the dev server with `deno task`, which executes the scripts from
   `package.json` exactly as `npm run` would.

So a full setup looks like:

```sh
deno run -A npm:create-next-app@latest my-app
cd my-app
deno install
deno task dev
```

The scaffold command and dev server differ per framework. These are all verified
to run under Deno:

| Framework                            | Scaffold command                                          | Start dev server            |
| ------------------------------------ | --------------------------------------------------------- | --------------------------- |
| [Next.js](https://nextjs.org/)       | `deno run -A npm:create-next-app@latest my-app`           | `deno task dev` → `:3000`   |
| [Astro](https://astro.build/)        | `deno run -A npm:create-astro@latest my-app`              | `deno task dev` → `:4321`   |
| [Vite](https://vite.dev/)            | `deno init --npm vite my-app`                             | `deno task dev` → `:5173`   |
| [SvelteKit](https://svelte.dev/)     | `deno run -A npm:sv create my-app`                        | `deno task dev` → `:5173`   |
| [Nuxt](https://nuxt.com/)            | `deno run -A npm:create-nuxt@latest my-app`               | `deno task dev` → `:3000`   |
| [Docusaurus](https://docusaurus.io/) | `deno run -A npm:create-docusaurus@latest my-app classic` | `deno task start` → `:3000` |

A few per-framework notes:

- **Vite** can take a template directly, for example
  `deno init --npm vite my-app --template react-ts`. `deno init --npm vite` runs
  the `create-vite` generator for you.
- **SvelteKit** and **Nuxt** generators are interactive: they prompt for a
  template and options, and both already list Deno as a package manager.
- **Astro**'s setup wizard may offer to install dependencies for you; skip that
  and let `deno install` handle it.
- **Docusaurus** also accepts `--skip-install` to stop the generator from
  invoking npm, leaving the install to `deno install`.

To understand how Deno handles JSX in any of these, see the
[JSX reference](/runtime/reference/jsx/).

## Keep going

- Build a server from scratch in the
  [HTTP server guide](/runtime/fundamentals/http_server/).
- See which browser-standard APIs (`fetch`, Web Streams, Web Crypto, and more)
  are available in the
  [web platform APIs reference](/runtime/reference/web_platform_apis/).
- Follow step-by-step framework tutorials, including React, Vue, SolidJS, and
  more, in the [examples and tutorials section](/examples/).
- When your app is ready for production, deploy it with [Deno Deploy](/deploy/).
