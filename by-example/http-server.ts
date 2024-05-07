/**
 * @title HTTP Server: Hello World
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net <url>
 * @resource {https://deno.land/api?s=Deno.serve} Doc: Deno.serve
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Response} MDN: Response
 * @playground https://dash.deno.com/playground/example-helloworld
 * @group Network
 *
 * An example of a HTTP server that serves a "Hello World" message.
 */

// HTTP servers need a handler function. This function is called for every
// request that comes in. It must return a `Response`. The handler function can
// be asynchronous (it may return a `Promise`).
function handler(_req: Request): Response {
  return new Response("Hello, World!");
}

// To start the server on the default port, call `Deno.serve` with the handler.
Deno.serve(handler);
