/**
 * @title HTTP server: Request timeouts
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal} MDN: AbortSignal
 * @resource {/examples/http_server} Example: HTTP server: Hello World
 * @group Network
 *
 * A handler that depends on a slow upstream can hold a connection open
 * forever. A per-request deadline turns that into a fast 504 instead. This
 * example aborts the handler's work when a deadline passes or when the
 * client disconnects, whichever comes first.
 */

const DEADLINE_MS = 1000;

// Simulated upstream work that honors aborts. Real code would pass the
// signal to fetch, a database driver, or another cancellable API.
function doWork(ms: number, signal: AbortSignal): Promise<Response> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(
      () => resolve(new Response("Work finished\n")),
      ms,
    );
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    }, { once: true });
  });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  // /slow takes longer than the deadline, anything else finishes quickly.
  const workMs = url.pathname === "/slow" ? 3000 : 10;

  // One controller, two reasons to abort: the deadline timer fires, or the
  // client goes away (req.signal). Passing the combined signal into the
  // work means an impatient client also cancels upstream calls instead of
  // leaving them running.
  const controller = new AbortController();
  const deadline = setTimeout(() => {
    controller.abort(new DOMException("Deadline exceeded", "TimeoutError"));
  }, DEADLINE_MS);
  req.signal.addEventListener(
    "abort",
    () => controller.abort(req.signal.reason),
    { once: true },
  );

  try {
    return await doWork(workMs, controller.signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return new Response("Gateway timeout\n", { status: 504 });
    }
    throw err;
  } finally {
    // Always clear the timer. A leaked timer keeps the event loop busy and
    // trips the timer sanitizer when the handler runs under Deno.test.
    clearTimeout(deadline);
  }
});

// AbortSignal.any([AbortSignal.timeout(DEADLINE_MS), req.signal]) builds
// the same combined signal in one line. The explicit timer used above has
// one advantage: it can be cleared as soon as the work completes.
//
// The fast path finishes well inside the deadline:
//
//   curl -i http://localhost:8000/fast
//
//   HTTP/1.1 200 OK
//   content-type: text/plain;charset=UTF-8
//   content-length: 14
//   date: Thu, 11 Jun 2026 18:55:21 GMT
//
//   Work finished
//
// The slow path is cut off after about one second:
//
//   curl -i http://localhost:8000/slow
//
//   HTTP/1.1 504 Gateway Timeout
//   content-type: text/plain;charset=UTF-8
//   content-length: 16
//   date: Thu, 11 Jun 2026 18:55:22 GMT
//
//   Gateway timeout
