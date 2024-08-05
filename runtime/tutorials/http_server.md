---
title: "Simple HTTP Web Server"
oldUrl:
  - /runtime/manual/examples/http_server/
---

Deno's integrated HTTP server allows you to create and run your own web server.

With just a few lines of code we'll write an HTTP web server with control over
the response status, request headers and more.

Create a new file called `server.ts` and add the following code:

## Using Deno Serve

```ts title="server.ts"
const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 200 });
};

console.log(`HTTP server running. Access it at: http://localhost:${port}/`);
Deno.serve({ port }, handler);
```

Then run this with:

```bash
deno run --allow-net server.ts
```

You can read more about the `--allow-net` flag and other permissions in the
[permissions tutorial](/tutorials/permissions).

You can now access your server at `http://localhost:8080/`.

## Processing the request

The `handler` function is called for each incoming request. It receives a
`Request` object and returns a `Response` object. If you want to process the
request differently, based on the URL, method, or other request properties, you
can do so by inspecting the `Request` object.

For example, you can check the request method and URL path to return different
responses:

```ts title="server.ts"
const port = 8080;

const handler = (request: Request): Response => {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return new Response("Hello, world!", { status: 200 });
  } else {
    return new Response("Not found", { status: 404 });
  }
};

console.log(`HTTP server running. Access it at: http://localhost:8080/`);
Deno.serve({ port }, handler);
```

In this example, the server responds with "Hello, world!" for requests to the
root URL (`/`) and with "Not found" for any other URL.

## Advanced routing

For more sophisticated routing, or larger applications, you can use a library
like [Oak](https://jsr.io/@oak/oak). Below is an example of a simple Oak server:

```ts title="server.ts"
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = JSON.stringify({ message: "Hello, World!" });
});

router.get("/foo", (ctx) => {
  ctx.response.body = JSON.stringify({ message: "Foo" });
});

app.use(router.routes());

if (import.meta.main) {
  await app.listen({ port: 8080 });
}
```

You can learn more about importing modules in the tutorial on
[importing and using modules](/tutorials/importing_modules).
