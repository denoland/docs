---
title: "Run code"
description: "Run JavaScript and TypeScript with Deno: the secure-by-default permission model, running files, URLs and stdin, watch mode, and project tasks."
---

Deno runs JavaScript and TypeScript directly (no build step, no config) behind a
security sandbox that grants access only when you ask for it. This page covers
how your code actually runs: permissions, the ways to launch it, watch mode, and
tasks.

## Run a file

Point Deno at a file. TypeScript runs as-is:

```sh
deno run main.ts
```

`deno run` is explicit, but you can drop `run` for a file or task and Deno will
figure it out:

```sh
deno main.ts          # same as `deno run main.ts`
```

## Permissions: secure by default

This is the part that's different from Node. Code runs in a sandbox with **no
access to the network, filesystem, environment, or subprocesses** until you
grant it. A script that tries to read a file without permission stops and asks,
or fails if prompts are disabled.

Grant access with `--allow-*` flags (each has a short form):

```sh
deno run --allow-net main.ts        # network    (-N)
deno run --allow-read main.ts       # filesystem (-R)
deno run --allow-env main.ts        # env vars   (-E)
```

Scope them down to exactly what's needed, and combine as required:

```sh
deno run --allow-read=./data --allow-net=api.example.com main.ts
```

Use `--deny-*` to carve out exceptions, or `-A` / `--allow-all` to skip the
sandbox entirely (handy in trusted environments, but it gives up the
guarantees):

```sh
deno run -A main.ts
```

See [Permissions](/runtime/reference/permissions/) for every flag and
[Security](/runtime/fundamentals/security/) for the model behind them.

## Run from a URL or stdin

Deno can run code straight from a URL (handy for one-off tools and installers)
or from stdin:

```sh
deno run https://example.com/script.ts
echo 'console.log(1 + 1)' | deno run -
```

Remote code is sandboxed like everything else: it gets no permissions unless you
grant them.

## Reload on change with watch mode

Add `--watch` and Deno reruns your program whenever a file it depends on
changes. No `nodemon`, no extra dependency:

```sh
deno run --watch main.ts
```

`deno test`, `deno fmt`, and others accept `--watch` too.

## Run project tasks

Define repeatable commands in `deno.json` and run them with
[`deno task`](/runtime/reference/cli/task/), the equivalent of `npm run`:

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --watch --allow-net main.ts",
    "start": "deno run --allow-net main.ts"
  }
}
```

```sh
deno task dev
```

Tasks can run other tasks, set environment variables, and work cross-platform.

## Try code quickly

For experiments, evaluate an expression inline or open a REPL:

```sh
deno eval "console.log(Deno.version)"
deno repl
```

## Going further

- **[Write an HTTP server](/runtime/fundamentals/http_server/).** Handle
  requests with the web-standard [`Deno.serve`](/api/deno/~/Deno.serve).
- **[Web development](/runtime/fundamentals/web_dev/).** Build apps with Fresh,
  Next.js, Astro, and web-standard APIs.
- **[Web platform APIs](/runtime/reference/web_platform_apis/).** `fetch`,
  `Request`/`Response`, streams, Web Crypto, and the other browser globals Deno
  implements.
- **[Debugging](/runtime/fundamentals/debugging/).** Attach Chrome DevTools or
  your editor's debugger.
- **[deno run reference](/runtime/reference/cli/run/).** Every flag in detail.
