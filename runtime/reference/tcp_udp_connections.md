---
title: "TCP & UDP connections"
---

The [`Deno.listen`](/api/deno/~/Deno.listen)-API gives you low level access to
handling TCP or UDP connections. If your use case is spinning up an HTTP server
you should use [`Deno.serve`](/runtime/fundamentals/http_server) instead.

## Listening for a connection

In order to accept requests, first you need to listen for a connection on a
network port.

```ts
const listener = Deno.listen({ port: 8080 });
```

:::info

When supplying a port, Deno assumes you are going to listen on a TCP socket as
well as bind to the localhost. You can specify `transport: "tcp"` to be more
explicit as well as provide an IP address or hostname in the `hostname` property
as well.

:::

If there is an issue with opening the network port, `Deno.listen()` will throw,
so often in a server sense, you will want to wrap it in a `try ... catch` block
in order to handle exceptions, such as the port already being in use.

```ts
try {
  const listener = Deno.listen({ port: 8080 });
} catch (err) {
  // handle error
}
```

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

## Handling connections

Once we are listening for a connection, we need to handle the connection. The
return value of `Deno.listen()` or `Deno.listenTls()` is a `Deno.Listener` which
is an async iterable which yields up `Deno.Conn` connections as well as provide
a couple methods for handling connections.

To use it as an async iterable you would do something like this:

```ts
const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  // ...handle the connection...
}
```

Every connection made would yield a `Deno.Conn` assigned to `conn`. Then further
processing can be applied to the connection.

There is also an `.accept()` method on the listener which can be used:

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
blocks. When it comes to accepting TLS connections, there can be many
conditions, like invalid or unknown certificates which can be surfaced on the
listener and might need handling in the user code.

A listener also has a `.close()` method which can be used to close the listener.
