# HTTP Server APIs

Deno currently has three HTTP Server APIs:

- [`Deno.serve`](https://deno.land/api?s=Deno.serve): native,
  _higher-level_, supports HTTP/1.1 and HTTP2, this is the preferred API to
  write HTTP servers in Deno.
- [`Deno.serveHttp`](https://deno.land/api?s=Deno.serveHttp):
  native, _low-level_, supports HTTP/1.1 and HTTP2.

- [A "Hello World" server](#a-hello-world-server)
- [Inspecting the incoming request](#inspecting-the-incoming-request)
- [Responding with a response](#responding-with-a-response)
- [HTTPS support](#https-support)
- [HTTP/2 support](#http2-support)
- [Serving WebSockets](#serving-websockets)

### A "Hello World" server

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

> ℹ️ The handler can also return a `Promise<Response>`, which means it can be an
> `async` function.

By default `Deno.serve` will listen on port `8000`, but this can be changed by
passing in a port number in options bag as the first or second argument:

```js
// To listen on port 4242.
Deno.serve({ port: 4242 }, handler);

// To listen on port 4500 and bind to 0.0.0.0.
Deno.serve({ port: 4242, hostname: "0.0.0.0", handler });
```

### Inspecting the incoming request

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

> ⚠️ Be aware that the `req.text()` call can fail if the user hangs up the
> connection before the body is fully received. Make sure to handle this case.
> Do note this can happen in all methods that read from the request body, such
> as `req.json()`, `req.formData()`, `req.arrayBuffer()`,
> `req.body.getReader().read()`, `req.body.pipeTo()`, etc.

### Responding with a response

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

> ℹ️ Note the `cancel` function here. This is called when the client hangs up the
> connection. This is important to make sure that you handle this case, as
> otherwise the server will keep queuing up messages forever, and eventually run
> out of memory.

> ⚠️ Beware that the response body stream is "cancelled" when the client hangs up
> the connection. Make sure to handle this case. This can surface itself as an
> error in a `write()` call on a `WritableStream` object that is attached to the
> response body `ReadableStream` object (for example through a
> `TransformStream`).

### HTTPS support

> ℹ️ To use HTTPS, you will need a valid TLS certificate and a private key for
> your server.

To use HTTPS, pass two extra arguments in the options bag: `cert` and `key`.
These are contents of the certificate and key files, respectively.

```js
Deno.serve({
  port: 443,
  cert: Deno.readTextFile("./cert.pem"),
  key: Deno.readTextFile("./key.pem"),
}, handler);
```

### HTTP/2 support

HTTP/2 support is "automatic" when using the HTTP server APIs with Deno. You
just need to create your server, and the server will handle HTTP/1 or HTTP/2
requests seamlessly.

HTTP/2 is also supported over cleartext with prior knowledge.

### Automatic body compression

The HTTP server has built in automatic compression of response bodies. When a
response is sent to a client, Deno determines if the response body can be safely
compressed. This compression happens within the internals of Deno, so it is fast
and efficient.

Currently Deno supports gzip and brotli compression. A body is automatically
compressed if the following conditions are true:

- The request has an
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  header which indicates the requestor supports `br` for brotli or `gzip`. Deno
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

When the response body is compressed, Deno will set the Content-Encoding header
to reflect the encoding as well as ensure the Vary header is adjusted or added
to indicate what request headers affected the response.

When is compression skipped? In addition to the logic above, there are a few
other reasons why a response won’t be compressed automatically:

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

## `Deno.serveHttp`

We generally recommend that you use the `Deno.serve` API described above, as it
handles all of the intricacies of parallel requests on a single connection,
error handling, and so on. However, if you are interested creating your own
robust and performant web servers in Deno, lower-level, _native_ HTTP server
APIs are available as of Deno 1.9 and later.

> ⚠️ You should probably not be using this API, as it is not easy to get right.
> Use the `Deno.serve` API instead.

### Listening for a connection

In order to accept requests, first you need to listen for a connection on a
network port. To do this in Deno, you use `Deno.listen()`:

```ts
const server = Deno.listen({ port: 8080 });
```

> ℹ️ When supplying a port, Deno assumes you are going to listen on a TCP socket
> as well as bind to the localhost. You can specify `transport: "tcp"` to be
> more explicit as well as provide an IP address or hostname in the `hostname`
> property as well.

If there is an issue with opening the network port, `Deno.listen()` will throw,
so often in a server sense, you will want to wrap it in the `try ... catch`
block in order to handle exceptions, like the port already being in use.

You can also listen for a TLS connection (e.g. HTTPS) using `Deno.listenTls()`:

```ts
const server = Deno.listenTls({
  port: 8443,
  certFile: "localhost.crt",
  keyFile: "localhost.key",
  alpnProtocols: ["h2", "http/1.1"],
});
```

The `certFile` and `keyFile` options are required and point to the appropriate
certificate and key files for the server. They are relative to the CWD for Deno.
The `alpnProtocols` property is optional, but if you want to be able to support
HTTP/2 on the server, you add the protocols here, as the protocol negotiation
happens during the TLS negotiation with the client and server.

> ℹ️ Generating SSL certificates is outside of the scope of this documentation.
> There are many resources on the web which address this.

### Handling connections

Once we are listening for a connection, we need to handle the connection. The
return value of `Deno.listen()` or `Deno.listenTls()` is a `Deno.Listener` which
is an async iterable which yields up `Deno.Conn` connections as well as provide
a couple methods for handling connections.

To use it as an async iterable we would do something like this:

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  // ...handle the connection...
}
```

Every connection made would yield up a `Deno.Conn` assigned to `conn`. Then
further processing can be applied to the connection.

There is also the `.accept()` method on the listener which can be used:

```ts
const server = Deno.listen({ port: 8080 });

while (true) {
  try {
    const conn = await server.accept();
    // ... handle the connection ...
  } catch (err) {
    // The listener has closed
    break;
  }
}
```

Whether using the async iterator or the `.accept()` method, exceptions can be
thrown and robust production code should handle these using `try ... catch`
blocks. Especially when it comes to accepting TLS connections, there can be many
conditions, like invalid or unknown certificates which can be surfaced on the
listener and might need handling in the user code.

A listener also has a `.close()` method which can be used to close the listener.

### Serving HTTP

Once a connection is accepted, you can use `Deno.serveHttp()` to handle HTTP
requests and responses on the connection. `Deno.serveHttp()` returns a
`Deno.HttpConn`. A `Deno.HttpConn` is like a `Deno.Listener` in that requests
the connection receives from the client are asynchronously yielded up as a
`Deno.RequestEvent`.

To deal with HTTP requests as async iterable it would look something like this:

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      // ... handle requestEvent ...
    }
  })();
}
```

The `Deno.HttpConn` also has the method `.nextRequest()` which can be used to
await the next request. It would look something like this:

```ts
const server = Deno.listen({ port: 8080 });

while (true) {
  try {
    const conn = await server.accept();
    (async () => {
      const httpConn = Deno.serveHttp(conn);
      while (true) {
        try {
          const requestEvent = await httpConn.nextRequest();
          // ... handle requestEvent ...
        } catch (err) {
          // the connection has finished
          break;
        }
      }
    })();
  } catch (err) {
    // The listener has closed
    break;
  }
}
```

Note that in both cases we are using an IIFE to create an inner function to deal
with each connection. If we awaited the HTTP requests in the same function scope
as the one we were receiving the connections, we would be blocking accepting
additional connections, which would make it seem that our server was "frozen".
In practice, it might make more sense to have a separate function all together:

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // ... handle requestEvent
  }
}

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  handle(conn);
}
```

In the examples from this point on, we will focus on what would occur within an
example `handle()` function and remove the listening and connection
"boilerplate".

#### HTTP Requests and Responses

HTTP requests and responses in Deno are essentially the inverse of web standard
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). The
Deno HTTP Server API and the Fetch API leverage the
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
classes. So if you are familiar with the Fetch API you just need to flip them
around in your mind and now it is a server API.

As mentioned above, a `Deno.HttpConn` asynchronously yields up
`Deno.RequestEvent`s. These request events contain a `.request` property and a
`.respondWith()` method.

The `.request` property is an instance of the `Request` class with the
information about the request. For example, if we wanted to know what URL path
was being requested, we would do something like this:

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);
    console.log(`path: ${url.pathname}`);
  }
}
```

The `.respondWith()` method is how we complete a request. The method takes
either a `Response` object or a `Promise` which resolves with a `Response`
object. Responding with a basic "hello world" would look like this:

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(
      new Response("hello world", {
        status: 200,
      }),
    );
  }
}
```

Note that we awaited the `.respondWith()` method. It isn't required, but in
practice any errors in processing the response will cause the promise returned
from the method to be rejected, like if the client disconnected before all the
response could be sent. While there may not be anything your application needs
to do, not handling the rejection will cause an "unhandled rejection" to occur
which will terminate the Deno process, which isn't so good for a server. In
addition, you might want to await the promise returned in order to determine
when to do any cleanup from for the request/response cycle.

The web standard `Response` object is pretty powerful, allowing easy creation of
complex and rich responses to a client, and Deno strives to provide a `Response`
object that as closely matches the web standard as possible, so if you are
wondering how to send a particular response, checkout the documentation for the
web standard
[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

### HTTP/2 Support

HTTP/2 support is effectively transparent within the Deno runtime. Typically
HTTP/2 is negotiated between a client and a server during the TLS connection
setup via
[ALPN](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation). To
enable this, you need to provide the protocols you want to support when you
start listening via the `alpnProtocols` property. This will enable the
negotiation to occur when the connection is made. For example:

```ts
const server = Deno.listenTls({
  port: 8443,
  certFile: "localhost.crt",
  keyFile: "localhost.key",
  alpnProtocols: ["h2", "http/1.1"],
});
```

The protocols are provided in order of preference. In practice, the only two
protocols that are supported currently are HTTP/2 and HTTP/1.1 which are
expressed as `h2` and `http/1.1`.

Currently Deno does not support upgrading a plain-text HTTP/1.1 connection to an
HTTP/2 cleartext connection via the `Upgrade` header (see:
[#10275](https://github.com/denoland/deno/issues/10275)), so therefore HTTP/2
support is only available via a TLS/HTTPS connection.

### Serving WebSockets

Deno can upgrade incoming HTTP requests to a WebSocket. This allows you to
handle WebSocket endpoints on your HTTP servers.

To upgrade an incoming `Request` to a WebSocket you use the
`Deno.upgradeWebSocket` function. This returns an object consisting of a
`Response` and a web standard `WebSocket` object. The returned response should
be used to respond to the incoming request using the `respondWith` method. Only
once `respondWith` is called with the returned response, the WebSocket is
activated and can be used.

Because the WebSocket protocol is symmetrical, the `WebSocket` object is
identical to the one that can be used for client side communication.
Documentation for it can be found
[on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

> Note: We are aware that this API can be challenging to use, and are planning
> to switch to
> [`WebSocketStream`](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
> once it is stabilized and ready for use.

```ts
async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(handleReq(requestEvent.request));
  }
}

function handleReq(req: Request): Response {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => console.log("socket closed");
  return response;
}
```

WebSockets are only supported on HTTP/1.1 for now. The connection the WebSocket
was created on can not be used for HTTP traffic after a WebSocket upgrade has
been performed.
