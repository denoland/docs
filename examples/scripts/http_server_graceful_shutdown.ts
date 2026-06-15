/**
 * @title HTTP server: Graceful shutdown
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.HttpServer} Deno: HttpServer
 * @resource {https://docs.deno.com/api/deno/~/Deno.addSignalListener} Deno: addSignalListener
 * @group Network
 *
 * Killing a server mid-request drops connections and loses work. A graceful
 * shutdown stops accepting new connections, lets in-flight requests finish,
 * and only then exits. Deno.serve returns an HttpServer whose shutdown
 * method does exactly that, much like server.close in node:http.
 */

// A deliberately slow endpoint so a request can be in flight during
// shutdown. The root responds immediately.
const server = Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/slow") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return new Response("Slow work finished\n");
  }
  return new Response("Hello\n");
});

async function shutdown(signal: string) {
  console.log(`${signal} received, draining connections...`);

  // Safety net: if draining hangs (a stuck client, an endless stream),
  // exit anyway after a deadline.
  const hardExit = setTimeout(() => {
    console.error("Drain timed out, exiting now");
    Deno.exit(1);
  }, 10_000);

  // shutdown() stops the listener so no new connections are accepted, then
  // resolves once every in-flight request has completed.
  await server.shutdown();

  // Clear the timer and remove the signal listeners. Both keep the event
  // loop alive, so the process exits on its own once they are gone.
  clearTimeout(hardExit);
  Deno.removeSignalListener("SIGINT", onSigint);
  Deno.removeSignalListener("SIGTERM", onSigterm);
  console.log("All requests drained, bye");
}

const onSigint = () => shutdown("SIGINT");
const onSigterm = () => shutdown("SIGTERM");

// SIGINT is what Ctrl+C sends, SIGTERM is what process managers, docker
// stop, and Kubernetes send first. Note that SIGTERM listeners are not
// supported on Windows.
Deno.addSignalListener("SIGINT", onSigint);
if (Deno.build.os !== "windows") {
  Deno.addSignalListener("SIGTERM", onSigterm);
}

// Start a slow request, then send SIGTERM while it is still running:
//
//   curl http://localhost:8000/slow &
//   kill -TERM <server pid>
//
// The server logs:
//
//   SIGTERM received, draining connections...
//   All requests drained, bye
//
// and the curl still prints its full response before the process exits:
//
//   Slow work finished
