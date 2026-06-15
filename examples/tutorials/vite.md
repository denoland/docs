---
last_modified: 2026-06-13
title: "Use Vite with Deno"
description: "Step-by-step tutorial on building a front-end app with Vite and Deno. Learn how to scaffold a project, install dependencies, run the dev server with hot module replacement, and build for production."
url: /examples/vite_tutorial/
---

[Vite](https://vite.dev/) is a fast build tool and development server for modern
front-end projects. It pairs well with Deno: you scaffold with the standard Vite
templates, and Deno runs the dev server, manages npm dependencies, and builds
for production, all with no separate Node.js install.

## Scaffold a Vite project

Use the official Vite project creator through Deno's npm support. In an empty
directory, run it and follow the prompts to pick a framework (vanilla, React,
Vue, Svelte, and others) and a variant:

```sh
deno run -A npm:create-vite@latest
```

To skip the prompts, pass the target directory and a template directly:

```sh
deno run -A npm:create-vite@latest . --template vanilla-ts
```

This writes a `package.json`, an `index.html` entry point, and a `src`
directory. Deno reads the `scripts` in `package.json` as tasks, so the Vite
commands are available through `deno task`.

## Install dependencies

Vite and its plugins come from npm. Install them with Deno, which writes them to
a local `node_modules` directory:

```sh
deno install
```

```sh
Dev dependencies:
+ npm:typescript 6.0.3
+ npm:vite 8.0.16
```

## Run the dev server

Start Vite's development server, which serves the app with hot module
replacement so changes appear in the browser instantly:

```sh
deno task dev
```

```sh
  VITE v8.0.16  ready in 120 ms

  ➜  Local:   http://localhost:5173/
```

Open the URL and edit a file under `src/` to see the page update without a full
reload.

## Build for production

When you are ready to ship, build the optimized static bundle:

```sh
deno task build
```

```sh
vite v8.0.16 building client environment for production...
✓ 9 modules transformed.
dist/index.html                 0.45 kB │ gzip: 0.29 kB
dist/assets/index-CsUDhMuy.css  4.10 kB │ gzip: 1.46 kB
dist/assets/index-B4vdZNPd.js   4.52 kB │ gzip: 2.02 kB
✓ built in 239ms
```

The `dist` directory holds the hashed, minified output, ready to deploy to
[Deno Deploy](https://docs.deno.com/deploy/) or any static host. Run
`deno task preview` to serve that production build locally before you ship it.
