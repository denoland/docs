/**
 * @title Two-way streaming with WebSocketStream
 * @difficulty intermediate
 * @tags cli
 * @run --unstable-net --allow-net <url>
 * @resource {https://docs.deno.com/api/web/~/WebSocketStream} Doc: WebSocketStream
 * @resource {https://docs.deno.com/examples/websocket/} Example: Outbound WebSockets
 * @group Network
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>WebSocketStream is a promise-based alternative to the event-based
 * WebSocket API. It exposes the connection as a pair of web streams, which
 * brings backpressure and async iteration to WebSocket code and composes
 * with everything else that speaks ReadableStream and WritableStream.
 */

// Start a WebSocket echo server to talk to. The server side uses the
// standard Deno.upgradeWebSocket, so only the client below needs the
// unstable WebSocketStream API.
const server = Deno.serve({ port: 8000 }, (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.onmessage = (event) => socket.send(`echo: ${event.data}`);
  return response;
});

// Connect with WebSocketStream. Instead of waiting for an open event, you
// await the opened promise, which resolves with the readable and writable
// ends of the connection once the handshake completes.
const wss = new WebSocketStream("ws://localhost:8000");
const { readable, writable } = await wss.opened;

// Send messages by writing to the writable stream.
const writer = writable.getWriter();
await writer.write("hello");
await writer.write("world");

// Receive messages by reading from the readable stream. Backpressure works
// the way it does in any web stream: if you stop reading, the other side
// is eventually told to stop sending.
const reader = readable.getReader();
console.log((await reader.read()).value); // echo: hello
console.log((await reader.read()).value); // echo: world

// Closing takes an optional code and reason, and the closed promise
// resolves with the code and reason the connection closed with.
wss.close({ code: 1000, reason: "done" });
console.log(await wss.closed); // { closeCode: 1000, reason: "done" }

await server.shutdown();
