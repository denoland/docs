/**
 * @title Find a free port
 * @difficulty beginner
 * @tags cli
 * @run -N <url>
 * @resource {https://jsr.io/@std/net/doc/get-available-port} @std/net: getAvailablePort
 * @resource {https://docs.deno.com/api/deno/~/Deno.serve} Deno: serve
 * @group Network
 *
 * Test servers and helper processes should not fight over hardcoded ports.
 * The getAvailablePort function from @std/net asks the operating system for
 * a free port, and Deno.serve with port 0 does the same thing in one step.
 */

import { getAvailablePort } from "jsr:@std/net";

// getAvailablePort binds port 0, reads the port the OS picked, and closes
// the probe listener. Optionally pass { preferredPort: 8000 } to try a
// fixed port first and fall back to a random one.
const port = getAvailablePort();
console.log(port); // e.g. 61678

const server = Deno.serve(
  { port, onListen: ({ port }) => console.log(`listening on ${port}`) },
  () => new Response("Hello from a random port\n"),
);

// Note there is a small race: between getAvailablePort returning and the
// server starting, another process could grab the port. Asking Deno.serve
// itself for port 0 has no such window, the listener that gets the random
// port is the one you keep. Read the assigned port from server.addr.
// In Node the same trick is server.listen(0) plus server.address().port.
const server2 = Deno.serve(
  { port: 0, onListen: () => {} },
  () => new Response("Hello from port 0\n"),
);
console.log(server2.addr.port); // e.g. 61679

// Both servers answer normally on their assigned ports.
const res = await fetch(`http://localhost:${server2.addr.port}/`);
console.log(await res.text()); // Hello from port 0

await server.shutdown();
await server2.shutdown();
