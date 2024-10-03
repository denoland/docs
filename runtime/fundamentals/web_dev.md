---
title: "Web development"
oldUrl:
 - /runtime/manual/getting_started/web_frameworks/
 - /runtime/fundamentals/web_frameworks/
---

Deno offers a secure and developer-friendly environment for building web
applications, making your web dev a delightful experience.

1. Deno has [secure defaults](/runtime/fundamentals/security/), meaning it
   requires explicit permission for file, network, and environment access,
   reducing the risk of security vulnerabilities.
2. Deno has [built-in TypeScript support](/runtime/fundamentals/typescript/),
   allowing you to write TypeScript code without additional configuration or
   tooling.
3. Deno comes with a [standard library](/runtime/fundamentals/standard_library/)
   that includes modules for common tasks like HTTP servers, file system
   operations, and more.

Most likely, if you're building a more complex application, you'll be
interacting with Deno through a web framework.

## React/Next

[React](https://reactjs.org/) is a popular JavaScript library for building user
interfaces. To use React with Deno, you can use the popular web framework
[Next.js](https://nextjs.org/).

To get started with Next.js in Deno, you can create a new next app and run it
immediately with Deno:

```sh
deno run -A npm:create-next-app@latest my-next-app
cd my-next-app
deno task dev
```

This will create a new Next.js app with TypeScript and run it with Deno. You can
then open your browser to `http://localhost:3000` to see your new app, and start
editing `page.tsx` to see your changes live.

To better understand how JSX and Deno interface under the hood, read on
[here](/runtime/reference/jsx/).

## Fresh

[Fresh](https://fresh.deno.dev/) is the most popular web framework for Deno. It
uses a model where you send no JavaScript to clients by default.

To get started with a Fresh app, you can use the following command and follow
the cli prompts to create your app:

```sh
deno run -A -r https://fresh.deno.dev
cd my-fresh-app
deno task start
```

This will create a new Fresh app and run it with Deno. You can then open your
browser to `http://localhost:8000` to see your new app. Edit `/routes/index.tsx`
to see your changes live.

Fresh does the majority of its rendering on the server, and the client is only
responsible for re-rendering small
[islands of interactivity](https://jasonformat.com/islands-architecture/). This
means the developer explicitly opts in to client side rendering for specific
components.

## Astro

[Astro](https://astro.build/) is a static site generator that allows developers
to create fast and lightweight websites.

To get started with Astro, you can use the following command to create a new
Astro site:

```sh
deno run -A npm:create-astro my-astro-site
cd my-astro-site
deno task dev
```

This will create a new Astro site and run it with Deno. You can then open your
browser to `http://localhost:4321` to see your new site. Edit
`/src/pages/index.astro` to see your changes live.

## Vite

[Vite](https://vitejs.dev/) is a web dev build tool that serves your code via
native ES modules, which can be run directly in the browser. Vite is a great
choice for building modern web applications with Deno.

To get started with Vite, you can use the following command to create a new Vite
app:

```sh
deno run -A npm:create-vite@latest
cd my-vite-app
deno install
deno task dev
```

## Lume

[Lume](https://lume.land/) is a static site generator for Deno that is inspired
by other static site generators such Jekyll or Eleventy.

To get started with Lume, you can use the following command to create a new Lume
site:

```sh
mkdir my-lume-site
cd my-lume-site
deno run -A https://lume.land/init.ts
deno task serve
```

## Docusaurus

[Docusaurus](https://docusaurus.io/) is a static site generator that is
optimized for technical documentation websites.

To get started with Docusaurus, you can use the following command to create a
new Docusaurus site:

```sh
deno run -A npm:create-docusaurus@latest my-website classic
cd my-website
deno task start
```

## Hono

[Hono](https://hono.dev) is a light-weight web app framework in the tradition of
Express and Sinatra.

To get started with Hono, you can use the following command to create a new Hono
app:

```sh
deno run -A npm:create-hono@latest
cd my-hono-app
deno task start
```

This will create a new Hono app and run it with Deno. You can then open your
browser to `http://localhost:8000` to see your new app.

## Oak

[Oak](https://jsr.io/@oak/oak) is a middleware framework for handling HTTP with
Deno. Oak is the glue between your frontend application and a potential database
or other data sources (e.g. REST APIs, GraphQL APIs).

Oak offers additional functionality over the native Deno HTTP server, including
a basic router, JSON parser, middlewares, plugins, etc.

To get started with Oak, make a file called `server.ts` and add the following:

```ts
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Hello oak!</h1>
      </body>
    </html>
  `;
});

const app = new Application();
const port = 8080;

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on http://localhost:${port}`);

app.listen({ port: port });
```

Run the server with the following command:

```sh
deno run --allow-net server.ts
```

## Node projects

Deno will run your Node.js projects out the box. Check out our guide on
[migrating your Node.js project to Deno](/runtime/fundamentals/node/#migrating-from-node.js-to-deno).
