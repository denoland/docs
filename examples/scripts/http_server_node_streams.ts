/**
 * @title HTTP server: Node.js streams
 * @difficulty intermediate
 * @tags cli
 * @run -N -R <url>
 * @resource {https://docs.deno.com/api/node/http/} Doc: node:http
 * @resource {/examples/convert_node_readable/} Example: Convert a Node.js Readable
 * @group Network
 *
 * Code ported from Node.js often produces Node streams: file streams,
 * database cursors, archive generators. This example serves them, both
 * from a node:http server and from Deno.serve.
 */
import { createServer } from "node:http";
import { Readable } from "node:stream";

// The node:http API works in Deno as-is. Piping a Readable into the
// response streams it to the client.
const nodeServer = createServer((_req, res) => {
  const stream = Readable.from(["Hello ", "from ", "node:http\n"]);
  res.setHeader("content-type", "text/plain");
  stream.pipe(res);
});
nodeServer.listen(8001);

// With Deno.serve, convert the Node stream to a web ReadableStream and use
// it as the Response body. Web streams carry bytes, so the chunks must be
// Uint8Arrays — a stream of strings will stall.
const encoder = new TextEncoder();
Deno.serve({ port: 8000 }, () => {
  const stream = Readable.from(
    ["Hello ", "from ", "Deno.serve\n"].map((s) => encoder.encode(s)),
  );
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: { "content-type": "text/plain" },
  });
});

// Both servers stream their responses chunk by chunk:
//
//   curl http://localhost:8001/
//   Hello from node:http
//
//   curl http://localhost:8000/
//   Hello from Deno.serve
