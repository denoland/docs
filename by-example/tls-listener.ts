/**
 * @title TCP/TLS Listener: Ping
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net --allow-read <url>
 * @resource {https://deno.land/api?s=Deno.listenTls} Doc: Deno.listenTls
 * @group Network
 *
 * An example of a TCP listener using TLS on localhost that will log the message if written to and close the connection if connected to.
 */

// Instantiate an instance of a TCP listener on localhost port 443.
const listener = Deno.listenTls({
  hostname: "127.0.0.1",
  port: 443,
  transport: "tcp",
  cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});

// Await asynchronous connections that are established to our TCP listener.
for await (const conn of listener) {
  // Pipe the contents of the TCP stream into stdout
  await conn.readable.pipeTo(Deno.stdout.writable);

  // We close the connection that was established.
  conn.close();
}
