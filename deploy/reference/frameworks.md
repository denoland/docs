---
title: Frameworks
description: "Detailed guide to supported JavaScript and TypeScript frameworks in Deno Deploy, including Next.js, Astro, Nuxt, SvelteKit, and more."
---

Deno Deploy supports a number of JavaScript and TypeScript frameworks out of the
box. This means that you can use these frameworks without any additional
configuration or setup.

Natively supported frameworks are tested to work with Deno Deploy and are
automatically detected when you create a new app. Deno Deploy automatically
optimizes the build and runtime configuration for these frameworks to be as
optimal as possible.

Frameworks not listed here are still likely to work, but may require manually
configuring the install and/or build command and the runtime configuration in
the build settings.

Feel like a framework is missing? Let us know in the
[Deno Deploy Discord channel](https://discord.gg/deno) or
[contact Deno support](/deploy/support/).

## Supported frameworks

### Next.js

Next.js is a React framework for building full-stack web applications. You use
React Components to build user interfaces, and Next.js for additional features
and optimizations.

Both pages and app router are supported out of the box. ISR, SSG, SSR, and PPR
are supported. Caching is supported out of the box, including using the new
`"use cache"`.

`next/image` works out of the box.

Next.js on Deno Deploy always builds in standalone mode.

Tracing is supported out of the box, and Next.js automatically emits some spans
for incoming requests, routing, rendering, and other operations.

### Astro

Astro is a web framework for building content-driven websites like blogs,
marketing, and e-commerce. Astro leverages server rendering over client-side
rendering in the browser as much as possible.

For static Astro sites, no additional configuration is needed to use Deno Deploy
.

When using SSR in Astro with Deno Deploy , you need to install the
[`@deno/astro-adapter`](https://github.com/denoland/deno-astro-adapter) package
and configure your `astro.config.mjs` file to use the adapter:

```bash
$ deno add npm:@deno/astro-adapter
# or npm install @deno/astro-adapter
# or yarn add @deno/astro-adapter
# or pnpm add @deno/astro-adapter
```

```diff title="astro.config.mjs"
  import { defineConfig } from 'astro/config';
+ import deno from '@deno/astro-adapter';
  
  export default defineConfig({
+   output: 'server',
+   adapter: deno(),
  });
```

Sharp image optimization is supported.

The `astro:env` API is supported.

### Nuxt

Create high-quality web applications with Nuxt, the open source framework that
makes full-stack development with Vue.js intuitive.

Nuxt requires no additional setup.

### SolidStart

SolidStart is an open source meta-framework designed to unify components that
make up a web application. It is built on top of Solid.

SolidStart requires no additional setup.

### SvelteKit

SvelteKit is a framework for rapidly developing robust, performant web
applications using Svelte.

SvelteKit requires no additional setup.

### Fresh

Fresh is a full stack modern web framework for JavaScript and TypeScript
developers. Fresh uses Preact as the JSX rendering engine.

Fresh requires no additional setup.

### Lume

Lume is a static site generator for building fast and modern websites using
Deno.

Lume requires no additional setup.

### Remix

> ⚠️ **Experimental**: Remix is not yet fully supported. It is in the process of
> being integrated into Deno Deploy. Some features may not work as expected.
> Please report any issues you encounter to the Deno team.
