/**
 * @title TCP connector: Ping
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.connect} Doc: Deno.connect
 * @resource {/examples/tcp-listener} Example: TCP Listener
 * @group Network
 *
 * An example of connecting to a TCP server on localhost and writing a 'ping' message to the server.
 */

// Instantiate an instance of text encoder to write to the TCP stream.
const encoder = new TextEncoder();
// Establish a connection to our TCP server that is currently being run on localhost port 8080.
const conn = await Deno.connect({
  hostname: "127.0.0.1",
  port: 8080,
  transport: "tcp",
});
// Encode the 'ping' message and write to the TCP connection for the server to receive.
await conn.write(encoder.encode("ping"));
