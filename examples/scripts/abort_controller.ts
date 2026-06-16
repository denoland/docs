/**
 * @title Cancel async work with AbortController
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/AbortController} MDN: AbortController
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal} MDN: AbortSignal
 * @group Web Standard APIs
 *
 * AbortController produces an AbortSignal that can cancel fetch requests,
 * remove event listeners, and stop any code that checks the signal. One
 * controller can cancel many operations at once. This example aborts a
 * slow fetch, fans one signal out to several listeners, combines signals
 * with AbortSignal.any, and aborts with a custom reason.
 */

// Start a local server that takes a full second to answer, so the abort
// below always fires first and the example is self-contained.
const server = Deno.serve({ port: 0, onListen() {} }, async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return new Response("finally done");
});
const url = `http://localhost:${server.addr.port}/`;

// Pass the signal to fetch, then call abort on the controller. The fetch
// promise rejects with a DOMException whose name is AbortError.
const controller = new AbortController();
setTimeout(() => controller.abort(), 50);

try {
  await fetch(url, { signal: controller.signal });
} catch (err) {
  console.log((err as DOMException).name); // AbortError
}

// A signal is an EventTarget. Any number of listeners can subscribe to its
// abort event, so one controller can tear down several things together.
const teardown = new AbortController();
teardown.signal.addEventListener("abort", () => console.log("stop the upload")); // stop the upload
teardown.signal.addEventListener(
  "abort",
  () => console.log("hide the spinner"),
); // hide the spinner
teardown.abort();

// AbortSignal.any builds a signal that aborts as soon as any of its inputs
// abort. This is how you combine a user cancel with other conditions.
const userCancel = new AbortController();
const shutdown = new AbortController();
const combined = AbortSignal.any([userCancel.signal, shutdown.signal]);

userCancel.abort();
console.log(combined.aborted); // true
console.log(shutdown.signal.aborted); // false

// The abort method accepts a custom reason, which can be any value. The
// signal exposes it as signal.reason, and aborted fetches reject with it.
const custom = new AbortController();
custom.abort(new Error("user closed the dialog"));
console.log(custom.signal.aborted); // true
console.log((custom.signal.reason as Error).message); // user closed the dialog

// Without an explicit reason the signal gets a default DOMException.
const plain = new AbortController();
plain.abort();
console.log((plain.signal.reason as DOMException).name); // AbortError

// Stop the local server so the script can exit.
await server.shutdown();
