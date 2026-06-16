/**
 * @title Route fetch through an HTTP proxy
 * @difficulty intermediate
 * @tags cli
 * @run -N <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.createHttpClient} Doc: Deno.createHttpClient
 * @resource {/runtime/reference/env_variables/} Environment variables that Deno reads
 * @group Network
 *
 * Deno honors the HTTP_PROXY, HTTPS_PROXY, and NO_PROXY environment
 * variables by default, for both module downloads and fetch, with no code
 * changes. When one fetch call needs a different proxy than the rest of the
 * process, Deno.createHttpClient configures a proxy explicitly. This example
 * starts a tiny logging proxy and routes a single fetch through it.
 */

// A client talking to an HTTP proxy puts the absolute target URL in the
// request line instead of just a path. Deno.serve exposes that URL as
// req.url, so forwarding it with fetch is enough to act as a basic proxy
// for plain HTTP targets. A real proxy also implements the CONNECT method
// to tunnel HTTPS traffic, which this handler does not.
const proxy = Deno.serve({ port: 8080 }, async (req) => {
  console.log("proxy saw:", req.method, req.url);
  const headers = new Headers(req.headers);
  headers.delete("host");
  return await fetch(req.url, {
    method: req.method,
    headers,
    body: req.body,
    redirect: "manual",
  });
});

// createHttpClient returns a client with its own connection settings.
// Passing it through the client option of fetch routes only that call
// through the proxy; every other fetch in the process is unaffected.
const client = Deno.createHttpClient({
  proxy: { url: "http://localhost:8080/" },
});

const response = await fetch("http://example.com/", { client });
const body = await response.text();
console.log("status:", response.status);
console.log("got example.com:", body.includes("Example Domain"));

// Close the client and stop the proxy so the script exits.
client.close();
await proxy.shutdown();

// The proxy logs the absolute URL it was asked for, which proves the
// request went through it rather than straight to example.com:
//
//   deno run -N fetch_http_proxy.ts
//   Listening on http://0.0.0.0:8080/ (http://localhost:8080/)
//   proxy saw: GET http://example.com/
//   status: 200
//   got example.com: true

// To proxy everything without touching code, set the environment variables
// instead. NO_PROXY lists hosts that bypass the proxy:
//
//   HTTP_PROXY=http://localhost:8080 deno run -N main.ts
//   NO_PROXY=localhost,127.0.0.1 HTTPS_PROXY=http://proxy.example.com:3128 deno run -N main.ts
