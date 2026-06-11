/**
 * @title HTTP server: Scaling across CPU cores
 * @difficulty intermediate
 * @tags cli
 * @run deno serve --parallel <url>
 * @resource {https://docs.deno.com/runtime/reference/cli/serve/} Doc: deno serve
 * @resource {/examples/http_server} Example: HTTP Server: Hello world
 * @group Network
 *
 * A single process handles requests on one core. The deno serve subcommand
 * can run a whole pool of workers behind one port with the --parallel
 * flag. The server exports its handler instead of calling Deno.serve.
 */

// With deno serve, the module's default export provides the fetch handler.
// The runtime owns the listening socket, which is what lets it share the
// port between workers.
export default {
  fetch(_req: Request): Response {
    return new Response("Hello, World!");
  },
} satisfies Deno.ServeDefaultExport;

// Start one worker per CPU core:
//
//   deno serve --parallel server.ts
//   deno serve: Listening on http://0.0.0.0:8000/ with 8 threads
//
// Incoming connections are distributed across the workers. Set the
// DENO_JOBS environment variable to control the worker count:
//
//   DENO_JOBS=4 deno serve --parallel server.ts

// Each worker is a separate isolate: module-level state like counters or
// caches is per worker, not shared. Keep shared state in something
// external, like a database or Deno KV.
