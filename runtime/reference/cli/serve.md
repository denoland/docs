---
last_modified: 2026-06-29
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno serve"
description: "A flexible and configurable HTTP server for Deno"
---

`deno serve` runs a file as an HTTP server using
[`Deno.serve()`](/api/deno/~/Deno.serve). The file must export a default object
with a `fetch` handler. For a full guide on building HTTP servers, see
[Writing an HTTP Server](/runtime/fundamentals/http_server/).

## Basic usage

```typescript title="server.ts"
export default {
  fetch(_req: Request) {
    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```

```sh
deno serve server.ts
```

By default, the server listens on port **8000**. Override it with `--port`:

```sh
deno serve --port=3000 server.ts
```

## `deno serve` vs `deno run`

Both approaches start an HTTP server, and the difference is who calls
[`Deno.serve()`](/api/deno/~/Deno.serve):

- With `deno serve`, Deno calls [`Deno.serve()`](/api/deno/~/Deno.serve) for
  you. Your file just exports a default object with a `fetch` handler. Deno owns
  the listener, which lets it add features such as running multiple instances
  across threads with [`--parallel`](#horizontal-scaling).
- With `deno run`, you call [`Deno.serve()`](/api/deno/~/Deno.serve) yourself
  inside the program. This gives you full control over the listen options and
  the surrounding code, and is the right choice when the server is one part of a
  larger program.

Use `deno serve` when the program is primarily an HTTP server and you want Deno
to manage it; use `deno run` with [`Deno.serve()`](/api/deno/~/Deno.serve) when
you need to control how and when the server starts.

## Default export shape

The file must export a default object that satisfies
[`Deno.ServeDefaultExport`](/api/deno/~/Deno.ServeDefaultExport). The object has
two properties:

```typescript
export interface ServeDefaultExport {
  fetch: ServeHandler;
  onListen?: (localAddr: Deno.Addr) => void;
}
```

### `fetch` (required)

The `fetch` handler receives a standard
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and a
[`ServeHandlerInfo`](/api/deno/~/Deno.ServeHandlerInfo) object with connection
metadata:

```typescript
type ServeHandler = (
  request: Request,
  info: ServeHandlerInfo,
) => Response | Promise<Response>;

interface ServeHandlerInfo {
  remoteAddr: Deno.Addr; // remote address of the connection
  completed: Promise<void>; // resolves when the request completes
}
```

If the handler throws, the error is isolated to that request — the server
continues serving.

### `onListen` (optional)

Called once when the server starts listening. If omitted, a default message is
logged to the console.

```typescript title="server.ts"
export default {
  fetch(request, info) {
    const { hostname, port } = info.remoteAddr as Deno.NetAddr;
    console.log(`${request.method} ${request.url} from ${hostname}:${port}`);

    return new Response("Hello, World!", {
      headers: { "content-type": "text/plain" },
    });
  },

  onListen({ hostname, port }) {
    console.log(`Server running at http://${hostname}:${port}/`);
  },
} satisfies Deno.ServeDefaultExport;
```

Any other properties on the default export are silently ignored. If `fetch` is
missing, no server starts. If `fetch` or `onListen` exist but are not functions,
a `TypeError` is thrown.

## Routing requests

Use the request URL to route to different handlers:

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

```sh
deno serve --host=127.0.0.1 server.ts
```

## HTTPS support

HTTPS can be enabled by providing the server TLS certificate and private key
pair as PEM-encoded files:

```sh
deno serve --tls-cert cert.pem --tls-key key.pem
```

## Horizontal scaling

Run multiple server instances across CPU cores for better throughput:

```sh
deno serve --parallel server.ts
```

## Watch mode

Restart the server automatically when files change:

```sh
deno serve --watch server.ts
```

## Permissions

`deno serve` automatically allows the server to listen without requiring
`--allow-net`. Additional permissions (like file reads) must be granted
explicitly:

```sh
deno serve --allow-read server.ts
```
