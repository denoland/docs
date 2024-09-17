/**
 * @title UDP listener: Ping
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net --unstable-net <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.listenDatagram} Doc: Deno.listenDatagram
 * @resource {/examples/udp-connector} Example: UDP Connector
 * @group Network
 *
 * An example of a UDP listener on localhost that will log the message
 * if written to and close the connection if connected to.
 */

// Instantiate an instance of text decoder to read the UDP stream bytes back into plaintext.
const decoder = new TextDecoder();

// Instantiate an instance of a UDP listener on localhost port 10000.
const listener = Deno.listenDatagram({
  port: 10000,
  transport: "udp",
});

// Await asynchronous messages that are sent to our UDP listener.
for await (const [data, address] of listener) {
  // Here we log the address of the sender of the data
  console.log("Server - received information from", address);

  // Here we log the results of the bytes that were read into our buffer array.
  console.log("Server - received:", decoder.decode(data));

  // We close the connection that was established.
  listener.close();
}
