/**
 * @title HTTP server: Rate limiting
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429} MDN: 429 Too Many Requests
 * @resource {/examples/http_server} Example: HTTP server: Hello world
 * @group Network
 *
 * A rate limiter protects a server from clients that send too many requests.
 * The token bucket algorithm allows short bursts while enforcing a steady
 * average rate. Each client gets a bucket of tokens that refills over time,
 * and every request spends one token. When the bucket is empty the server
 * answers 429 with a retry-after header.
 */

// Each client may average REFILL_RATE requests per second, with bursts of
// up to BURST requests when the bucket is full.
const REFILL_RATE = 1;
const BURST = 5;

interface Bucket {
  tokens: number;
  last: number;
}

// Buckets are keyed by client IP and live in memory.
const buckets = new Map<string, Bucket>();

function take(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { tokens: BURST, last: now };

  // Refill lazily based on how much time passed since the last request,
  // instead of running a timer per client.
  const elapsed = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(BURST, bucket.tokens + elapsed * REFILL_RATE);
  bucket.last = now;
  buckets.set(ip, bucket);

  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1;
  return true;
}

// Buckets for idle clients are useless after they refill completely, so a
// periodic sweep keeps the Map from growing forever. Deno.unrefTimer marks
// the interval as non-blocking, so the process can still exit normally.
const IDLE_MS = (BURST / REFILL_RATE) * 1000;
const sweeper = setInterval(() => {
  const cutoff = Date.now() - IDLE_MS;
  for (const [ip, bucket] of buckets) {
    if (bucket.last < cutoff) buckets.delete(ip);
  }
}, 30_000);
Deno.unrefTimer(sweeper);

Deno.serve((_req, info) => {
  // The second handler argument carries connection details, including the
  // network address of the client.
  const ip = info.remoteAddr.hostname;

  if (!take(ip)) {
    // retry-after tells well-behaved clients how long to back off. One
    // token takes 1 / REFILL_RATE seconds to appear.
    return new Response("too many requests\n", {
      status: 429,
      headers: { "retry-after": String(Math.ceil(1 / REFILL_RATE)) },
    });
  }

  return new Response("ok\n");
});

// Behind a load balancer the socket address belongs to the proxy, not the
// client. In that case derive the key from a trusted header such as
// x-forwarded-for instead of info.remoteAddr.

// Sending requests faster than the refill rate drains the bucket. The first
// five requests spend the burst capacity, then the server starts refusing:
//
//   for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/; done
//   200
//   200
//   200
//   200
//   200
//   429
//   429
