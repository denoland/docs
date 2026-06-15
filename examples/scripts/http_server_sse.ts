/**
 * @title HTTP server: Server-sent events
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events} MDN: Server-sent events
 * @resource {/examples/http_server_streaming} Example: HTTP server: Streaming
 * @group Network
 *
 * Server-sent events push updates from the server to the browser over a
 * single long-lived HTTP response, with automatic reconnection built into
 * the EventSource API. This example sends the time once per second.
 */

// An SSE response is a stream of text blocks. Each event is a line starting
// with data:, followed by a blank line.
function handler(_req: Request): Response {
  let timer: ReturnType<typeof setInterval>;
  const body = new ReadableStream({
    start(controller) {
      timer = setInterval(() => {
        const event = `data: ${new Date().toISOString()}\n\n`;
        controller.enqueue(new TextEncoder().encode(event));
      }, 1000);
    },
    // Stop producing events when the client disconnects.
    cancel() {
      clearInterval(timer);
    },
  });

  // The content type is what makes this server-sent events. Disabling
  // proxy buffering and caching keeps events flowing immediately.
  return new Response(body, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-store",
    },
  });
}

Deno.serve(handler);

// In the browser, EventSource consumes the stream and reconnects
// automatically if the connection drops:
//
//   const source = new EventSource("http://localhost:8000/");
//   source.onmessage = (event) => console.log(event.data);
//
// From the terminal, curl shows the raw protocol:
//
//   curl http://localhost:8000/
//   data: 2026-06-11T13:37:00.000Z
//
//   data: 2026-06-11T13:37:01.000Z
