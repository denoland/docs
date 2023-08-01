# Simple HTTP Web Server

## Concepts

- Use Deno's integrated HTTP server to run your own web server.

## Overview

With just a few lines of code you can run your own HTTP web server with control
over the response status, request headers and more.

## Sample web server

In this example, the user-agent of the client is returned to the client:

**webserver.ts**:

```ts
// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // without awaiting the function
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    // The native HTTP server uses the web standard `Request` and `Response`
    // objects.
    const body = `Your user-agent is:\n\n${
      requestEvent.request.headers.get("user-agent") ?? "Unknown"
    }`;
    // The requestEvent's `.respondWith()` method is how we send the response
    // back to the client.
    requestEvent.respondWith(
      new Response(body, {
        status: 200,
      }),
    );
  }
}
```

Then run this with:

```shell
deno run --allow-net webserver.ts
```

Then navigate to `http://localhost:8080/` in a browser.

### Using the `std/http` library

> ℹ️ Since
> [the stabilization of _native_ HTTP bindings in
`^1.13.x`](https://deno.com/blog/v1.13#stabilize-native-http-server-api),
> std/http now supports a _native_ HTTP server from ^0.107.0. The legacy server
> module was removed in 0.117.0.

**webserver.ts**:

```ts
import { serve } from "https://deno.land/std/http/server.ts";

const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
```

Then run this with:

```shell
deno run --allow-net webserver.ts
```
