/**
 * @title HTTP Server: WebSockets
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net <url>
 * @resource {/examples/http-server} Example: HTTP Server: Hello World
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/WebSocket} MDN: WebSocket
 * @group Network
 *
 * An example of a HTTP server that handles websocket requests.
 */

// To start the server on the default port, call `Deno.serve` with the handler.
Deno.serve((req) => {
  // First, we verify if the client is negotiating to upgrade to websockets.
  // If not, we can give a status of 501 to specify we don't support plain
  // http requests.
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  // We can then upgrade the request to a websocket
  const { socket, response } = Deno.upgradeWebSocket(req);

  // We now have access to a standard websocket object.
  // Let's handle the "open" event
  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });

  // We can also handle messages in a similar way. Here we set up
  // a simple ping / pong example.
  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });

  // Lastly we return the response created from upgradeWebSocket.
  return response;
});
