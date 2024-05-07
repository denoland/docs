/**
 * @title TCP Listener: Ping
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net <url>
 * @resource {https://deno.land/api?s=Deno.listen} Doc: Deno.listen
 * @group Network
 *
 * An example of a TCP listener on localhost that will log the message if written to and close the connection if connected to.
 */

// Instantiate an instance of text decoder to read the TCP stream bytes back into plaintext.
const decoder = new TextDecoder();

// Instantiate an instance of a TCP listener on localhost port 8080.
const listener = Deno.listen({
  hostname: "127.0.0.1",
  port: 8080,
  transport: "tcp",
});
// Await asynchronous connections that are established to our TCP listener.
for await (const conn of listener) {
  // Instantiate an buffer array to store the contents of our read TCP stream.
  const buf = new Uint8Array(1024);
  // Read the contents of the TCP stream into our buffer array.
  await conn.read(buf);
  // Here we log the results of the bytes that were read into our buffer array.
  console.log("Server - received: ", decoder.decode(buf));
  // We close the connection that was established.
  conn.close();
}
