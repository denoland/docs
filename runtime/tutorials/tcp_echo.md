---
title: "TCP echo Server"
oldUrl:
  - /runtime/manual/examples/tcp_echo/
---

## Concepts

- Listening for TCP port connections with
  [Deno.listen](https://docs.deno.com/api/deno/~/Deno.listen).
- Use
  [Deno.Conn.readable](https://docs.deno.com/api/deno/~/Deno.Conn#property_readable)
  and
  [Deno.Conn.writable](https://docs.deno.com/api/deno/~/Deno.Conn#property_writable)
  to take inbound data and redirect it to be outbound data.

## Example

This is an example of a server which accepts connections on port 8080, and
returns to the client anything it sends.

```ts
/**
 * echo_server.ts
 */
const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");
for await (const conn of listener) {
  conn.readable.pipeTo(conn.writable);
}
```

Run with:

```shell
deno run --allow-net echo_server.ts
```

To test it, try sending data to it with
[netcat](https://en.wikipedia.org/wiki/Netcat) (Linux/MacOS only). Below
`'hello world'` is sent over the connection, which is then echoed back to the
user:

```shell
$ nc localhost 8080
hello world
hello world
```

Like the [cat.ts example](./unix_cat.md), the `pipeTo()` method here also does
not make unnecessary memory copies. It receives a packet from the kernel and
sends back, without further complexity.
