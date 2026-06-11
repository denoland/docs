/**
 * @title WebSocket server: Broadcasting messages
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket} Doc: Deno.upgradeWebSocket
 * @resource {/examples/http_server_websocket/} Example: HTTP server: WebSockets
 * @group Network
 *
 * Chat rooms, live dashboards, and multiplayer games all need one thing:
 * deliver a message from one client to all the others. This example keeps
 * track of connected sockets and broadcasts every message it receives.
 */

// All currently connected clients. A Set handles disconnects cleanly.
const clients = new Set<WebSocket>();

function broadcast(message: string) {
  for (const client of clients) {
    // A socket may be mid-handshake or closing; only send when open.
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

Deno.serve((req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("This endpoint expects a WebSocket", { status: 426 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  // Register the socket once the connection is established, and clean up
  // when it goes away for any reason.
  socket.onopen = () => {
    clients.add(socket);
    broadcast(`${clients.size} clients connected`);
  };
  socket.onclose = () => {
    clients.delete(socket);
    broadcast(`${clients.size} clients connected`);
  };

  // Relay each incoming message to everyone, including the sender.
  socket.onmessage = (event) => {
    broadcast(event.data);
  };

  return response;
});

// Connect two clients from another terminal and every message appears in
// both:
//
//   const ws = new WebSocket("ws://localhost:8000/");
//   ws.onmessage = (event) => console.log(event.data);
//   ws.onopen = () => ws.send("hello, everyone");

// This state lives in one process. To broadcast across several servers or
// deno serve --parallel workers, relay messages through something shared,
// like Deno KV watch or a Redis channel.
