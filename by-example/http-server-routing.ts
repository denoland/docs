/**
 * @title HTTP Server: Routing
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net <url>
 * @resource {/example/http-server} Example: HTTP Server: Hello World
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API} MDN: URL Pattern API
 * @playground https://dash.deno.com/playground/example-routing
 * @group Network
 *
 * An example of a HTTP server that handles requests with different responses
 * based on the incoming URL.
 */

// URL patterns can be used to match request URLs. They can contain named groups
// that can be used to extract parts of the URL, e.g. the book ID.
const BOOK_ROUTE = new URLPattern({ pathname: "/books/:id" });

function handler(req: Request): Response {
  // Match the incoming request against the URL patterns.
  const match = BOOK_ROUTE.exec(req.url);
  // If there is a match, extract the book ID and return a response.
  if (match) {
    const id = match.pathname.groups.id;
    return new Response(`Book ${id}`);
  }

  // If there is no match, return a 404 response.
  return new Response("Not found (try /books/1)", {
    status: 404,
  });
}

// To start the server on the default port, call `Deno.serve` with the handler.
Deno.serve(handler);
