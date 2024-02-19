# TCP sockets and TLS

Deno Deploy supports outbound TCP and TLS connections. These APIs allow you to
use databases like PostgreSQL, SQLite, MongoDB, etc., with Deploy.

## `Deno.connect`

Make outbound TCP connections.

The function definition is same as
[Deno](https://doc.deno.land/deno/stable/~/Deno.connect) with the limitation
that `transport` option can only be `tcp` and `hostname` cannot be localhost or
empty.

```ts
function Deno.connect(options: ConnectOptions): Promise<Conn>
```

### Example

```js
async function handler(_req) {
  // Make a TCP connection to example.com
  const connection = await Deno.connect({
    port: 80,
    hostname: "example.com",
  });

  // Send raw HTTP GET request.
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // Read 15 bytes from the connection.
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // Return the bytes as plain text.
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

Deno.serve(handler);
```

## `Deno.connectTls`

Make outbound TLS connections.

The function definition is the same as
[Deno](https://doc.deno.land/deno/stable/~/Deno.connectTls) with the limitation
that hostname cannot be localhost or empty.

```ts
function Deno.connectTls(options: ConnectTlsOptions): Promise<Conn>
```

### Example

```js
async function handler(_req) {
  // Make a TLS connection to example.com
  const connection = await Deno.connectTls({
    port: 443,
    hostname: "example.com",
  });

  // Send raw HTTP GET request.
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // Read 15 bytes from the connection.
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // Return the bytes as plain text.
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

Deno.serve(handler);
```
