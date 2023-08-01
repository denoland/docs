# TCP server

This is an example of a server which accepts connections on port 8080, and
returns to the client anything it sends.

```ts
const hostname = "0.0.0.0";
const port = 8080;
const listener = Deno.listen({ hostname, port });
console.log(`Listening on ${hostname}:${port}`);
for await (const conn of listener) {
  conn.readable.pipeTo(conn.writable);
}
```

For security reasons, Deno does not allow programs to access the network without
explicit permission. To allow accessing the network, use a command-line flag:

```shell
deno run --allow-net https://deno.land/std/examples/echo_server.ts
```

To test it, try sending data to it with `netcat` (or `telnet` on Windows):

> Note for Windows users: netcat is not available on Windows. Instead you can
> use the built-in telnet client. The telnet client is disabled in Windows by
> default. It is easy to enable however: just follow the instructions
> [on Microsoft TechNet](https://social.technet.microsoft.com/wiki/contents/articles/38433.windows-10-enabling-telnet-client.aspx)

```shell
# Note for Windows users: replace the `nc` below with `telnet`
$ nc localhost 8080
hello world
hello world
```

Like the `cat.ts` example, the `pipeTo(writable)` method does not make a copy of
the data. The data is directly written from the readable stream to the writable
stream.
