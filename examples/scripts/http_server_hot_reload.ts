/**
 * @title HTTP server: Hot reload
 * @difficulty beginner
 * @tags cli
 * @run -N --watch <url>
 * @resource {https://docs.deno.com/runtime/getting_started/command_line_interface/#watch-mode} Doc: Watch mode
 * @resource {/examples/http_server} Example: HTTP Server: Hello world
 * @group Network
 *
 * Restarting a server by hand after every edit gets old fast. The --watch
 * flag restarts the process whenever a file in the module graph changes.
 */

// Nothing in the code needs to change; this is a plain HTTP server.
Deno.serve(() => new Response("Hello, World!"));

// Run it with the --watch flag:
//
//   deno run --watch -N server.ts
//   Watcher Process started.
//   Listening on http://0.0.0.0:8000/
//
// Edit the response text, save, and the watcher restarts the server:
//
//   Watcher File change detected! Restarting!
//   Listening on http://0.0.0.0:8000/

// By default every local file the server imports is watched. To watch
// extra paths, like templates or static assets, list them explicitly:
//
//   deno run --watch=static/ -N server.ts

// The --watch flag works with deno serve, deno test, and most other
// subcommands as well.
