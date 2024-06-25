---
pagination_next: manual/basics/permissions
title: "Web Frameworks"
---

Most likely, if you're building a more complex application, you'll be
interacting with Deno through a web framework. There are two kinds of web
frameworks that Deno supports:

- **Node.js native frameworks/tools/libraries.** Some of the most popular
  tooling, for example esbuild, explicitly supports both Node.js and Deno. The
  drawback here is that you might not get the best experience or performance.
- **Deno native frameworks/tools/libraries.** We present some of these below.

## Deno-native frameworks

### Fresh

[Fresh](https://fresh.deno.dev/) is the most popular web framework for Deno. It
uses a model where you send no JavaScript to clients by default. The majority of
rendering is done on a server, and the client is only responsible for
re-rendering small
[islands of interactivity](https://jasonformat.com/islands-architecture/). This
means the developer explicitly opts in to client side rendering for specific
components.

### Aleph

[Aleph.js](https://alephjs.org/docs/get-started) is the second most popular web
framework for Deno. It gives you the same sort of quick-start with React as
Create-React-App. Like Next.js, Aleph provides SSR and SSG out of the box in
order to allow developers to create SEO-friendly apps. In addition, Aleph
provides some other built-in features that don't come out of the box in Next.js,
such as:

- Hot Reloading (Using React Fast Refresh)
- ESM Import Syntax (No need for webpack)
- TypeScript-Readys

### Ultra

[Ultra](https://ultrajs.dev/) is a modern streaming React framework for Deno
that is another alternative to Aleph. It's a way to use React to build dynamic
media-rich websites, similar to Next.js.

Deno itself supports JSX and TypeScript out-of-the-box (and therefore Ultra does
as well), but they don't work in the browser. Ultra takes over the task of
transpiling JSX and TypeScript to regular JavaScript.

Other highlights of Ultra include:

- written in Deno.
- powered by import maps.
- 100% esm.
- uses import maps in both development and production, which massively
  simplifies toolchains - you don't have to deal with heaps of bundling and
  transpilation.
- source code is shipped in production, similar to how it's written.
- imports, exports, work as they do in development.

### Lume

[Lume](https://lume.land/) is a static site generator for Deno that is inspired
by other static site generators such Jekyll or Eleventy. It's simple to use and
configure, while being super flexible. Highlights include:

- Support for multiple file formats like Markdown, YAML, JavaScript, TypeScript,
  JSX, Nunjucks.
- You can hook in any processor to transform assets, for example sass or postcss
  for CSS.
- No need to install thousand of packages in `node_modules` or complex bundlers.

### Hono

[Hono](https://hono.dev) is a light-weight web app framework in the tradition of
Express and Sinatra. In just a few lines of code, you can set up an API server
or a server for dynamic web pages. Hono provides a Deno-native installation
path, and works great with Deno’s built-in TypeScript tooling.

- This website is served by Hono running on
  [Deno Deploy](https://deno.com/deploy).

### Oak

[Oak](https://deno.land/x/oak) is a web application framework for Deno, inspired
by Koa and @koa/router.

As a middleware framework, Oak is the glue between your frontend application and
a potential database or other data sources (e.g. REST APIs, GraphQL APIs). Just
to give you an idea, the following is a list of common tech stacks to build
client-server architectures:

- React.js (Frontend) + Oak (Backend) + PostgreSQL (Database)
- Vue.js (Frontend) + Oak (Backend) + MongoDB (Database)
- Angular.js (Frontend) + Oak (Backend) + Neo4j (Database)

Oak offers additional functionality over the native Deno HTTP server, including
a basic router, JSON parser, middlewares, plugins, etc.
