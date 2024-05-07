/**
 * @title Handling OS Signals
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://deno.land/api?s=Deno.addSignalListener} Doc: Deno.addSignalListener
 * @group System
 *
 * You can listen for OS signals using the `Deno.addSignalListener` function.
 * This allows you to do things like gracefully shutdown a server when a
 * `SIGINT` signal is received.
 */

console.log("Counting seconds...");

let i = 0;

// We isolate the signal handler function so that we can remove it later.
function sigIntHandler() {
  console.log("interrupted! your number was", i);
  Deno.exit();
}

// Then, we can listen for the `SIGINT` signal,
// which is sent when the user presses Ctrl+C.
Deno.addSignalListener("SIGINT", sigIntHandler);

// While we're waiting for the signal, we can do other things,
// like count seconds, or start a server.
const interval = setInterval(() => {
  i++;
}, 1000);

// And, after 10 seconds, we can exit and remove the signal listener.
setTimeout(() => {
  clearInterval(interval);
  Deno.removeSignalListener("SIGINT", sigIntHandler);
  console.log("done! it has been 10 seconds");
}, 10_000);
