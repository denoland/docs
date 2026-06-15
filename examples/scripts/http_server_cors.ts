/**
 * @title HTTP server: CORS
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS} MDN: Cross-Origin Resource Sharing
 * @resource {/examples/http_server} Example: HTTP server: Hello World
 * @group Network
 *
 * Browsers block cross-origin requests unless the server opts in with CORS
 * headers. This example answers OPTIONS preflight requests and sets the
 * allow-origin header on actual responses, echoing back origins from a
 * configured allowlist instead of using a wildcard.
 */

// The origins allowed to call this API. Echoing one of these back is safer
// than a wildcard: responses to credentialed requests (cookies, client
// certificates, authorization headers) must name a concrete origin, the
// browser rejects * in that mode.
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://app.example.com",
]);

function corsHeaders(req: Request): Headers {
  const headers = new Headers();
  const origin = req.headers.get("origin");
  if (origin && allowedOrigins.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    // The response now differs per origin, so shared caches must key on it.
    headers.set("vary", "origin");
  }
  return headers;
}

Deno.serve((req) => {
  const headers = corsHeaders(req);

  // Before non-simple requests (methods like PUT, or custom headers) the
  // browser sends an OPTIONS preflight. Answer with the methods and headers
  // we accept. max-age lets the browser cache the verdict for a day.
  if (req.method === "OPTIONS") {
    headers.set("access-control-allow-methods", "GET, POST, PUT, DELETE");
    headers.set("access-control-allow-headers", "content-type, authorization");
    headers.set("access-control-max-age", "86400");
    return new Response(null, { status: 204, headers });
  }

  // Actual responses only need the allow-origin header (plus
  // access-control-expose-headers if the page should read custom headers).
  headers.set("content-type", "application/json");
  return new Response(JSON.stringify({ message: "Hello, CORS" }), { headers });
});

// Simulate a preflight from an allowed origin with curl:
//
//   curl -i -X OPTIONS http://localhost:8000/ \
//     -H "origin: http://localhost:5173" \
//     -H "access-control-request-method: PUT"
//
//   HTTP/1.1 204 No Content
//   access-control-allow-headers: content-type, authorization
//   access-control-allow-methods: GET, POST, PUT, DELETE
//   access-control-allow-origin: http://localhost:5173
//   access-control-max-age: 86400
//   vary: origin
//   date: Thu, 11 Jun 2026 18:54:35 GMT
//
// A request from an origin that is not on the allowlist gets no CORS
// headers back, so the browser blocks the page from reading the response.
