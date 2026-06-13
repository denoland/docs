/**
 * @title Proxy HTTP requests
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Request} MDN: Request
 * @resource {/examples/http_server} Example: HTTP Server: Hello world
 * @group Network
 *
 * A reverse proxy receives requests and forwards them to another server.
 * Because fetch, Request, and Response are the same objects on both sides,
 * a proxy in Deno is a few lines: rewrite the URL, forward, return.
 */

// The server we forward every request to.
const UPSTREAM = "https://example.com";

async function handler(req: Request): Promise<Response> {
  // Build the upstream URL from the incoming request's path and query.
  const url = new URL(req.url);
  const target = new URL(url.pathname + url.search, UPSTREAM);

  // Forward the method, headers, and body as they came in. The host header
  // must match the upstream, so let fetch regenerate it.
  const headers = new Headers(req.headers);
  headers.delete("host");

  const response = await fetch(target, {
    method: req.method,
    headers,
    body: req.body,
    redirect: "manual",
  });

  // Responses stream straight through; nothing is buffered in memory.
  return response;
}

Deno.serve(handler);

// Requests to the proxy now answer with the upstream's content:
//
//   curl -s http://localhost:8000/ | head -c 15
//   <!doctype html>

// A real deployment usually adds forwarding headers so the upstream knows
// the original client, e.g. headers.set("x-forwarded-for", clientIp) using
// the info argument of the handler.

// The same proxy works on a node:http server; fetch bridges to the web
// Response, whose body is then streamed out through the Node response.
import { createServer } from "node:http";

createServer(async (req, res) => {
  const target = new URL(req.url ?? "/", UPSTREAM);
  const response = await fetch(target);
  res.writeHead(
    response.status,
    Object.fromEntries(response.headers.entries()),
  );
  for await (const chunk of response.body ?? []) {
    res.write(chunk);
  }
  res.end();
}).listen(8001);
