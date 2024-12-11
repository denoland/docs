/**
 * @title TCP Echo Server
 * @difficulty beginner
 * @tags cli
 * @run --allow-net echo_server.ts
 * @resource {https://docs.deno.com/api/deno/~/Deno.listen} Deno listen API docs
 * @resource {https://docs.deno.com/api/deno/~/Deno.Conn#property_readable} Readable connection API docs
 * @resource {https://docs.deno.com/api/deno/~/Deno.Conn#property_writable} Writable connection docs
 * @group Network
 *
 * An echo server is a simple network application that listens for incoming connections and requests, and then repeats back any data it receives from clients.<br><br>To test this example, try sending data to it with <a href="https://en.wikipedia.org/wiki/Netcat">Netcat</a> (Linux/MacOS only). For example, in your terminal run: <code>echo "Hello, Deno!" | nc localhost 8080</code>
 */

// Create a TCP listener that listens on port 8080. Log that it is listening.
const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");

// Wait for incoming connections, When a client connects to the server, read data from the client and write it back to the client.
for await (const conn of listener) {
  conn.readable.pipeTo(conn.writable);
}
