/**
 * @title HTTP server: Hot reload
 * @difficulty beginner
 * @tags cli
 * @run -N --watch-hmr <url>
 * @resource {https://docs.deno.com/runtime/run/watch_mode/} Doc: Watch mode
 * @resource {/examples/http_server} Example: HTTP Server: Hello world
 * @group Network
 *
 * Restarting a server by hand after every edit gets old fast. The
 * --watch-hmr flag hot-replaces changed modules inside the running
 * process, so the server keeps serving while you edit.
 */

// Nothing in the code needs to change; this is a plain HTTP server.
function handler(_req: Request): Response {
  return new Response("Hello, World!");
}

Deno.serve(handler);

// Run it with the --watch-hmr flag:
//
//   deno run --watch-hmr -N server.ts
//   HMR Process started.
//   Listening on http://0.0.0.0:8000/
//
// Edit the response text and save. The module is swapped in place, without
// a restart, and the next request already returns the new text:
//
//   HMR Replaced changed module file:///.../server.ts
//
// When a change cannot be hot-replaced, the process restarts
// automatically, so you never serve stale code.

// The plain --watch flag is the simpler variant: it always restarts the
// whole process on every change. Use it when you want a clean slate, for
// example to rerun module-level setup.

// By default every local file the server imports is watched. To watch
// extra paths, like templates or static assets, list them explicitly:
//
//   deno run --watch-hmr=static/ -N server.ts

// The --watch flag also works with deno serve, deno test, and most other
// subcommands.
