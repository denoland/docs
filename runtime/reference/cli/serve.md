---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno serve"
description: "A flexible and configurable HTTP server for Deno"
---

`deno serve` runs a file as an HTTP server. The file must export a default
object with a `fetch` handler. For a full guide on building HTTP servers, see
[Writing an HTTP Server](/runtime/fundamentals/http_server/).

## Basic usage

```typescript title="server.ts"
export default {
  fetch(_req: Request) {
    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```

```sh title=">_"
$ deno serve server.ts
```

By default, the server listens on port **8000**. Override it with `--port`:

```sh title=">_"
$ deno serve --port=3000 server.ts
```

## Routing requests

The `fetch` handler receives a standard
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.
Use the URL to route:

```typescript title="server.ts"
export default {
  fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies Deno.ServeDefaultExport;
```

## Binding to a hostname

By default, `deno serve` listens on `0.0.0.0`. Use `--host` to bind to a
specific interface:

```sh title=">_"
$ deno serve --host=127.0.0.1 server.ts
```

## Horizontal scaling

Run multiple server instances across CPU cores for better throughput:

```sh title=">_"
$ deno serve --parallel server.ts
```

## Watch mode

Restart the server automatically when files change:

```sh title=">_"
$ deno serve --watch server.ts
```

## Permissions

`deno serve` automatically grants network permissions needed to listen.
Additional permissions (like file reads) must be granted explicitly:

```sh title=">_"
$ deno serve --allow-read server.ts
```
