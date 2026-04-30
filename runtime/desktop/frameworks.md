---
title: "Frameworks"
description: "Run Next.js, Astro, Fresh, Remix, Nuxt, SvelteKit, SolidStart, TanStack Start, and Vite SSR projects as desktop apps with no code changes."
---

Point `deno desktop` at a directory and it auto-detects the framework, picks the
right entry point, embeds the build output in the binary, and runs the
framework's production server (or dev server under `--hmr`) with the webview
pointed at it.

```sh
# Inside a Next.js / Astro / Fresh / etc. project:
deno desktop .
```

No code changes, no special adapter. The same project that runs as a web app
ships as a desktop app.

## Detection

Detection is based on config files and `package.json` dependencies. The first
match wins.

| Framework       | Detected by                                              |
| --------------- | -------------------------------------------------------- |
| Next.js         | `next.config.{js,mjs,ts}`                                |
| Astro           | `astro.config.{mjs,ts,js}`                               |
| Fresh           | `fresh.gen.ts` or `_fresh/` directory                    |
| Remix           | `@remix-run/react` or `@remix-run/dev` in `package.json` |
| Nuxt            | `nuxt.config.{ts,js,mjs}`                                |
| SvelteKit       | `svelte.config.{js,ts}`                                  |
| SolidStart      | `@solidjs/start` in `package.json`                       |
| TanStack Start  | `@tanstack/{react,solid}-start` in `package.json`        |
| Vite (SSR mode) | `vite.config.*` plus a `server.{js,ts,mjs}` entry        |

If none match, `deno desktop` falls back to treating the path as a script — the
same as `deno desktop main.ts`. You write a `Deno.serve()` handler and serve
your own UI.

## What detection does

When a framework is detected, the CLI:

1. **Generates a synthetic entry point** that imports the framework's production
   server (or dev server under `--hmr`).
2. **Embeds the build output** into the binary's virtual filesystem (`.next/`,
   `dist/`, `.output/`, `_fresh/`, `build/`, etc., depending on the framework).
3. **Self-extracts the VFS at runtime** so framework code finds its build output
   relative to its own working directory — Next.js looks under `.next/`, Astro
   under `dist/`, and so on.
4. **Runs the framework server** as your `Deno.serve()` handler. The webview
   navigates to the bound port like any other desktop app.

You should still build your project before running `deno desktop` —
`deno
desktop` does not run `next build`, `astro build`, etc. for you. Run the
framework's build step first.

## Per-framework notes

### Next.js

```sh
cd my-next-app
npx next build         # produce .next/
deno desktop .
```

Production: imports `next/dist/cli/next-start.js`. Dev (under `--hmr`):
`next/dist/cli/next-dev.js`. The `.next/` directory is embedded.

App Router and Pages Router both work.

### Astro

```sh
npm run build          # produce dist/
deno desktop .
```

Astro projects with an SSR adapter import `./dist/server/entry.mjs`. Static
projects (no adapter) are served via Deno's static file server pointed at
`dist/`.

Both modes work; SSR has access to the full Astro request lifecycle, static mode
is faster to start.

### Fresh

```sh
deno task build        # produce _fresh/
deno desktop .
```

Fresh 2.x: imports `_fresh/server.js` and runs the Vite dev server under
`--hmr`. Fresh 1.x: imports `./main.ts` directly.

### Remix

```sh
npm run build
deno desktop .
```

Production: runs `remix-serve` against the `build/` directory. Dev (under
`--hmr`): `@remix-run/dev` CLI.

### Nuxt

```sh
npm run build          # produce .output/
deno desktop .
```

Uses Nuxt's Nitro output at `.output/server/index.{ts,mjs}`. Dev (under
`--hmr`): `nuxi dev`.

### SvelteKit

```sh
npm run build
deno desktop .
```

Looks for `.deno-deploy/server.ts` first (the Deno Deploy adapter's output),
falling back to `.output/server/index.{ts,mjs}` (the Node adapter's output).
Dev: Vite dev server.

If you use a different adapter (`@sveltejs/adapter-static`, etc.), serve the
output directory yourself with `Deno.serve()` instead of relying on detection.

### SolidStart and TanStack Start

Both use the Nitro framework underneath; detection handles them via the
`.output/server/index.*` entry. Build first (`npm run build`) before running
`deno desktop`.

### Vite SSR

Plain Vite projects with a custom SSR entry (`server.ts`, `server.js`,
`server.mjs`) work with `deno desktop` if there is also a `vite.config.*`.
Production runs the SSR entry directly; dev (under `--hmr`) runs the Vite dev
server in middleware mode.

## Forcing a framework or opting out

There is no flag to force detection. To opt out — to ship a framework project
without using detection — pass an explicit script entry:

```sh
deno desktop ./my-server.ts
```

In `my-server.ts` you import and start the framework yourself. Use this when you
need control over startup that the detection cannot express.

## Hot reload in framework projects

Under `--hmr` the framework's own dev server runs and the webview connects to it
directly. State preservation, fast refresh, and error overlays all work the same
as in a browser. See [HMR](/runtime/desktop/hmr/) for details on both framework
and non-framework HMR modes.
