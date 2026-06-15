/**
 * @title Set a timeout on fetch
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static} MDN: AbortSignal.timeout
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static} MDN: AbortSignal.any
 * @group Web Standard APIs
 *
 * fetch has no timeout option, but it accepts an AbortSignal, and
 * AbortSignal.timeout builds one that aborts after a given number of
 * milliseconds. This example times out a slow request, tells timeouts
 * apart from other failures, and combines a timeout with a manual cancel.
 */

// Start a local server where the delay is controlled by a query parameter,
// so the timeouts in this example are deterministic and self-contained.
const server = Deno.serve({ port: 0, onListen() {} }, async (req) => {
  const delay = Number(new URL(req.url).searchParams.get("delay"));
  await new Promise((resolve) => setTimeout(resolve, delay));
  return new Response(`answered after ${delay}ms`);
});
const base = `http://localhost:${server.addr.port}`;

// When the response arrives before the deadline, the signal does nothing.
const fast = await fetch(`${base}/?delay=0`, {
  signal: AbortSignal.timeout(1000),
});
console.log(await fast.text()); // answered after 0ms

// When the deadline passes first, fetch rejects with a DOMException whose
// name is TimeoutError, not AbortError.
try {
  await fetch(`${base}/?delay=1000`, { signal: AbortSignal.timeout(200) });
} catch (err) {
  console.log((err as DOMException).name); // TimeoutError
}

// Other failures have different names, so you can tell them apart and only
// retry what makes sense. A connection error rejects with a TypeError.
try {
  await fetch("http://localhost:9/", { signal: AbortSignal.timeout(1000) });
} catch (err) {
  if ((err as Error).name === "TimeoutError") {
    console.log("the server was too slow");
  } else {
    console.log(`not a timeout: ${(err as Error).name}`); // not a timeout: TypeError
  }
}

// AbortSignal.any combines a deadline with a manual cancel button. The
// fetch rejects with the reason of whichever signal aborts first.
const cancelButton = new AbortController();
const signal = AbortSignal.any([
  cancelButton.signal,
  AbortSignal.timeout(2000),
]);
setTimeout(() => cancelButton.abort(new Error("user pressed cancel")), 50);

try {
  await fetch(`${base}/?delay=1000`, { signal });
} catch (err) {
  console.log((err as Error).message); // user pressed cancel
}

// Stop the local server so the script can exit.
await server.shutdown();
