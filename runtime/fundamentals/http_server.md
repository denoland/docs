---
title: "Writing an HTTP Server"
oldUrl:
 - /runtime/manual/runtime/http_server_apis/
---

Deno has a built in HTTP server API that allows you to write HTTP servers. The
[`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) API supports
HTTP/1.1 and HTTP/2.

## A "Hello World" server

To start a HTTP server on a given port, you can use the `Deno.serve` function.
This function takes a handler function that will be called for each incoming
request, and is expected to return a response (or a promise resolving to a
response).

Here is an example of a server that returns a "Hello, World!" response for each
request:

```ts
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

The handler can also return a `Promise<Response>`, which means it can be an
`async` function.

By default `Deno.serve` will listen on port `8000`, but this can be changed by
passing in a port number in options bag as the first or second argument:

```js
// To listen on port 4242.
Deno.serve({ port: 4242 }, handler);

// To listen on port 4242 and bind to 0.0.0.0.
Deno.serve({ port: 4242, hostname: "0.0.0.0" }, handler);
```

## Inspecting the incoming request

Most servers will not answer with the same response for every request. Instead
they will change their answer depending on various aspects of the request: the
HTTP method, the headers, the path, or the body contents.

The request is passed in as the first argument to the handler function. Here is
an example showing how to extract various parts of the request:

```ts
Deno.serve(async (req) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  console.log("Path:", url.pathname);
  console.log("Query parameters:", url.searchParams);

  console.log("Headers:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("Body:", body);
  }

  return new Response("Hello, World!");
});
```

:::caution

Be aware that the `req.text()` call can fail if the user hangs up the connection
before the body is fully received. Make sure to handle this case. Do note this
can happen in all methods that read from the request body, such as `req.json()`,
`req.formData()`, `req.arrayBuffer()`, `req.body.getReader().read()`,
`req.body.pipeTo()`, etc.

:::

## Responding with a response

Most servers also do not respond with "Hello, World!" to every request. Instead
they might respond with different headers, status codes, and body contents (even
body streams).

Here is an example of returning a response with a 404 status code, a JSON body,
and a custom header:

```ts
Deno.serve((req) => {
  const body = JSON.stringify({ message: "NOT FOUND" });
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
```

Response bodies can also be streams. Here is an example of a response that
returns a stream of "Hello, World!" repeated every second:

```ts
Deno.serve((req) => {
  let timer: number;
  const body = new ReadableStream({
    async start(controller) {
      timer = setInterval(() => {
        controller.enqueue("Hello, World!\n");
      }, 1000);
    },
    cancel() {
      clearInterval(timer);
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
```

:::note

Note the `cancel` function above. This is called when the client hangs up the
connection. It is important to make sure that you handle this case, as otherwise
the server will keep queuing up messages forever, and eventually run out of
memory.

:::

Be aware that the response body stream is "cancelled" when the client hangs up
the connection. Make sure to handle this case. This can surface itself as an
error in a `write()` call on a `WritableStream` object that is attached to the
response body `ReadableStream` object (for example through a `TransformStream`).

## HTTPS support

To use HTTPS, pass two extra arguments in the options bag: `cert` and `key`.
These are contents of the certificate and key files, respectively.

```js
Deno.serve({
  port: 443,
  cert: Deno.readTextFileSync("./cert.pem"),
  key: Deno.readTextFileSync("./key.pem"),
}, handler);
```

:::note

To use HTTPS, you will need a valid TLS certificate and a private key for your
server.

:::

## HTTP/2 support

HTTP/2 support is "automatic" when using the HTTP server APIs with Deno. You
just need to create your server, and it will handle HTTP/1 or HTTP/2 requests
seamlessly.

HTTP/2 is also supported over cleartext with prior knowledge.

## Automatic body compression

The HTTP server has built in automatic compression of response bodies. When a
response is sent to a client, Deno determines if the response body can be safely
compressed. This compression happens within the internals of Deno, so it is fast
and efficient.

Currently Deno supports gzip and brotli compression. A body is automatically
compressed if the following conditions are true:

- The request has an
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  header which indicates the requester supports `br` for Brotli or `gzip`. Deno
  will respect the preference of the
  [quality value](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values)
  in the header.
- The response includes a
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  which is considered compressible. (The list is derived from
  [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json) with
  the actual list
  [in the code](https://github.com/denoland/deno/blob/v1.21.0/ext/http/compressible.rs).)
- The response body is greater than 64 bytes.

When the response body is compressed, Deno will set the `Content-Encoding`
header to reflect the encoding, as well as ensure the `Vary` header is adjusted
or added to indicate which request headers affected the response.

In addition to the logic above, there are a few reasons why a response **won’t**
be compressed automatically:

- The response contains a `Content-Encoding` header. This indicates your server
  has done some form of encoding already.
- The response contains a
  [`Content-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range)
  header. This indicates that your server is responding to a range request,
  where the bytes and ranges are negotiated outside of the control of the
  internals to Deno.
- The response has a
  [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
  header which contains a
  [`no-transform`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other)
  value. This indicates that your server doesn’t want Deno or any downstream
  proxies to modify the response.

## Serving WebSockets

Deno can upgrade incoming HTTP requests to a WebSocket. This allows you to
handle WebSocket endpoints on your HTTP servers.

To upgrade an incoming `Request` to a WebSocket you use the
`Deno.upgradeWebSocket` function. This returns an object consisting of a
`Response` and a web standard `WebSocket` object. The returned response should
be used to respond to the incoming request.

Because the WebSocket protocol is symmetrical, the `WebSocket` object is
identical to the one that can be used for client side communication.
Documentation for it can be found
[on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

```ts
Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });

  return response;
});
```

:::note

The connection the WebSocket was created on can not be used for HTTP traffic
after a WebSocket upgrade has been performed.

:::

:::note

Note that WebSockets are only supported on HTTP/1.1 for now.

:::
