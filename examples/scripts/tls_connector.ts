/**
 * @title TCP/TLS connector: Ping
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net --allow-read <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.connectTls} Doc: Deno.connectTls
 * @resource {/examples/tls_listener} Example: TCP/TLS Listener
 * @group Network
 *
 * An example of connecting to a TCP server using TLS on localhost and writing a 'ping' message to the server.
 */

// Read a CA Certificate from the file system
const caCert = await Deno.readTextFile("./root.pem");

// Establish a connection to our TCP server using TLS that is currently being run on localhost port 443.
// We use a custom CA root certificate here. If we remove this option, Deno defaults to using
// Mozilla's root certificates.
const conn = await Deno.connectTls({
  hostname: "127.0.0.1",
  port: 443,
  caCerts: [caCert],
});

// Instantiate an instance of text encoder to write to the TCP stream.
const encoder = new TextEncoder();

// Encode the 'ping' message and write to the TCP connection for the server to receive.
await conn.write(encoder.encode("ping"));
