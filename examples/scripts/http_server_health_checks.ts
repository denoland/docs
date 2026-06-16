/**
 * @title HTTP server: Health checks
 * @difficulty beginner
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/} Kubernetes: Liveness and readiness probes
 * @resource {/examples/http_server} Example: HTTP server: Hello World
 * @group Network
 *
 * Health endpoints let load balancers and orchestrators decide what to do
 * with a process. Liveness answers "is this process alive at all", readiness
 * answers "can it take traffic right now". This server exposes both.
 */

// Readiness depends on the things the server needs to do useful work, such
// as a database pool or a warmed cache. Here a flag flips to true once the
// simulated dependency has started up.
let dbConnected = false;

setTimeout(() => {
  dbConnected = true;
  console.log("Database connected, now ready");
}, 2000);

// In a real service this would issue a cheap query, like SELECT 1.
function pingDb(): Promise<boolean> {
  return Promise.resolve(dbConnected);
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  // Probes must see the current state, so never let a cache answer them.
  const headers = { "cache-control": "no-store" };

  // Liveness: a 200 whenever the process is serving requests. Orchestrators
  // restart the container when this fails repeatedly, so keep it free of
  // dependency checks. A broken database should not cause a restart loop.
  if (url.pathname === "/healthz") {
    return new Response("ok\n", { status: 200, headers });
  }

  // Readiness: 200 only when dependencies are usable. On failure the
  // orchestrator takes the instance out of load balancing but does not
  // restart it, and puts it back once it reports ready again.
  if (url.pathname === "/readyz") {
    const ready = await pingDb();
    return new Response(ready ? "ready\n" : "database unavailable\n", {
      status: ready ? 200 : 503,
      headers,
    });
  }

  return new Response("Hello\n", { headers });
});

// Right after startup the process is alive but not yet ready:
//
//   curl -i http://localhost:8000/healthz
//
//   HTTP/1.1 200 OK
//   cache-control: no-store
//   content-length: 3
//   date: Thu, 11 Jun 2026 18:55:02 GMT
//
//   ok
//
//   curl -i http://localhost:8000/readyz
//
//   HTTP/1.1 503 Service Unavailable
//   cache-control: no-store
//   content-length: 21
//   date: Thu, 11 Jun 2026 18:55:02 GMT
//
//   database unavailable
//
// Two seconds later the dependency is up and readiness flips:
//
//   curl -i http://localhost:8000/readyz
//
//   HTTP/1.1 200 OK
//   cache-control: no-store
//   content-length: 6
//   date: Thu, 11 Jun 2026 18:55:04 GMT
//
//   ready
