/**
 * @title WebSocket server: Per-socket state
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket} Doc: Deno.upgradeWebSocket
 * @resource {/examples/websocket_pubsub/} Example: WebSocket server: Broadcasting messages
 * @group Network
 *
 * Most WebSocket servers need to know who each socket belongs to: a
 * username, a room, a session. This example attaches state to every
 * connection and uses it when handling messages.
 */

// State for one connection. The upgrade request is the natural place to
// pull it from: query parameters, cookies, or an auth header.
interface Session {
  username: string;
  joined: Date;
}

const sessions = new Map<WebSocket, Session>();

Deno.serve((req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("This endpoint expects a WebSocket", { status: 426 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  // Read the username from the connection URL, e.g. /?username=ada.
  const username = new URL(req.url).searchParams.get("username") ?? "guest";

  // Each handler closes over this connection's socket, and the Map lets
  // any other part of the server look the session up later.
  socket.onopen = () => {
    sessions.set(socket, { username, joined: new Date() });
    socket.send(`welcome, ${username}`);
  };

  socket.onmessage = (event) => {
    const session = sessions.get(socket)!;
    socket.send(`${session.username} said: ${event.data}`);
  };

  socket.onclose = () => {
    sessions.delete(socket);
  };

  return response;
});

// Connecting with a username tags every reply:
//
//   const ws = new WebSocket("ws://localhost:8000/?username=ada");
//   ws.onmessage = (event) => console.log(event.data);
//   ws.onopen = () => ws.send("hi");
//
//   welcome, ada
//   ada said: hi

// Note that Deno's WebSocket upgrade does not negotiate per-message
// compression; large payloads are sent as-is, so compress them yourself if
// it matters.
