/**
 * @title HTTP server: SSE (Server-Sent Events)
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net <url>
 * @resource {/examples/http-server-streaming} Example: HTTP server: Streaming
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream} MDN: Server-sent events
 * @playground https://dash.deno.com/playground/server-sent-event
 * @group Network
 *
 * An example HTTP Server Sent Event streams a response back to the client.
 */

/**
 * Represents an event in the Server-Sent Events (SSE) protocol.
 */
export interface Event {
  data: string | boolean | number | object; //The data associated with the event, which can be an ArrayBuffer or ArrayBufferLike.
  id?: number; //An optional identifier for the event.
  event?: string; //The type of the event.
}

export const sseRequiredHeaders = {
  "content-type": "text/event-stream",
  "cache-control": "no-cache",
  "connection": "keep-alive",
  "transfer-encoding": "chunked",
};

/**
 * The SSE class provides a way to create a server-sent events (SSE) stream.
 * It uses a TransformStream to convert Event objects into Uint8Array chunks
 * that can be read by a ReadableStream.
 */
export class SSE {
  trans: TransformStream<Event, Uint8Array>;
  /**
   * Constructs a new SSE instance, initializing the TransformStream and its writer.
   */
  constructor() {
    const encoder = new TextEncoder();
    const trans = new TransformStream<Event, Uint8Array>({
      transform(chunk, controller) {
        const lines = [];
        chunk.id && lines.push(`id: ${chunk.id}`);
        chunk.event && lines.push(`event: ${chunk.event}`);
        switch (typeof chunk.data) {
          case "string":
          case "boolean":
          case "number":
            lines.push(`data: ${chunk.data}`);
            break;
          case "object":
            lines.push(`data: ${JSON.stringify(chunk.data)}`);
            break;
          default:
            lines.push(`data: ${chunk.data || ""}`);
        }
        const message = encoder.encode(lines.join("\n") + "\n\n");
        controller.enqueue(message);
      },
    });
    this.trans = trans;
  }

  /**
   * Generates an HTTP response with the required headers for Server-Sent Events (SSE).
   *
   * @returns {Response} A new Response object with the readable stream and SSE headers.
   */
  response(source: ReadableStream<Event>): Response {
    const reader = source.pipeThrough(this.trans);
    return this.responseRaw(reader);
  }

  /**
   * Creates an HTTP response with the given readable stream as the body.
   * The response is configured with headers required for Server-Sent Events (SSE).
   *
   * @param source - The readable stream to be used as the response body.
   * @returns A Response object with the provided stream and SSE headers.
   */
  responseRaw(source: ReadableStream): Response {
    return new Response(source, {
      headers: sseRequiredHeaders,
      status: 200,
    });
  }
}

/**
 * An example HTTP server-sent-event that streams a response back to the client.
 */
function handler(_req: Request): Response {
  // instantiate the SSE class
  const sse = new SSE();
  // set up a demo Server-Sent Events stream
  let timer: number | undefined = undefined;
  let counter = 0;

  // Create a ReadableStream that emits an event every second
  const body = new ReadableStream<Event>({
    start(controller) {
      timer = setInterval(() => {
        counter++;
        const message = `It is ${new Date().toString()}`;
        if (!controller.desiredSize) return; // Check if the stream is still writable
        controller.enqueue({ data: message });
        controller.enqueue({ data: { deno: "land" }, id: counter, event: "data" });
      }, 1000);
      //stop timer in 10 seconds
      setTimeout(() => {
        clearInterval(timer);
        controller.enqueue({ data: '[DONE]' });//just like OPEN AI Server Sent Event
        if (!controller.desiredSize) return; // Check if the stream is still writable
        controller.close();
      }, 4000);
    },
    cancel() {
      if (timer !== undefined) {
        clearInterval(timer);
      }
    },
  });

  return sse.response(body);
}

// To start the server on the default port, call `Deno.serve` with the handler.
Deno.serve(handler);
