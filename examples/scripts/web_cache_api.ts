/**
 * @title Cache HTTP responses with the Web Cache API
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Cache} MDN: Cache
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage} MDN: CacheStorage
 * @group Web Standard APIs
 *
 * Deno implements the Web Cache API from service workers. The caches
 * global stores Response objects keyed by request URL, persisted on disk
 * between runs, and the same code works on Deno Deploy. This example
 * starts a local server that counts requests, then proves a cached fetch
 * helper only hits the server once.
 */

// This server counts how many requests actually reach it. Port 0 asks
// the operating system for any free port.
let requestCount = 0;
const server = Deno.serve({ port: 0, onListen: () => {} }, () => {
  requestCount++;
  return new Response(JSON.stringify({ message: "hello" }), {
    headers: { "content-type": "application/json" },
  });
});

// caches.open returns a named cache, creating it on first use. No extra
// permission flags are needed for the cache itself.
const cache = await caches.open("example-cache-v1");

// The helper tries the cache first and falls back to the network. A
// response body can be read only once, so store a clone and return the
// original.
async function cachedFetch(url: string): Promise<Response> {
  const cached = await cache.match(url);
  if (cached) {
    return cached;
  }
  const response = await fetch(url);
  await cache.put(url, response.clone());
  return response;
}

// The first call misses the cache and reaches the server.
const url = `http://localhost:${server.addr.port}/data`;
const first = await cachedFetch(url);
console.log(await first.json()); // { message: "hello" }

// The second call is served from the cache.
const second = await cachedFetch(url);
console.log(await second.json()); // { message: "hello" }

// The server saw exactly one request, so the cache really answered the
// second call.
console.log(requestCount); // 1

// cache.delete removes a single entry, caches.delete removes the whole
// named cache. Both return whether something was deleted.
console.log(await cache.delete(url)); // true
console.log(await caches.delete("example-cache-v1")); // true

await server.shutdown();
