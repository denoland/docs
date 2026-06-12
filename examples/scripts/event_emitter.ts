/**
 * @title Use EventEmitter from node:events
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/node/events/} Doc: node:events
 * @resource {https://docs.deno.com/examples/web_workers/} Example: Web workers
 * @group System
 *
 * EventEmitter is the classic Node.js building block for things that emit
 * named events, and countless npm packages hand you one. Deno supports it
 * through the node:events module. This example registers listeners, emits
 * events, and shows the special behavior of the error event.
 */

import { EventEmitter, once } from "node:events";

const emitter = new EventEmitter();

// on registers a listener that runs for every matching emit. The extra
// emit arguments are passed to the listener.
function onMessage(text: string) {
  console.log(`received: ${text}`);
}
emitter.on("message", onMessage);
emitter.emit("message", "hello"); // received: hello
emitter.emit("message", "again"); // received: again

// once (the method) registers a listener that runs a single time and is
// then removed automatically.
emitter.once("connected", () => console.log("connected fired"));
emitter.emit("connected"); // connected fired
emitter.emit("connected"); // (nothing, the listener is gone)

// off removes a previously registered listener. You need the same
// function reference you passed to on.
emitter.off("message", onMessage);
emitter.emit("message", "ignored"); // (nothing)

// emit returns whether any listener was called, which is an easy way to
// see the effect.
console.log(emitter.emit("message", "ignored")); // false

// The error event is special: emitting it with no error listener
// registered throws the error instead of silently doing nothing. Always
// attach an error listener to emitters that can fail.
try {
  emitter.emit("error", new Error("disk full"));
} catch (err) {
  console.log(`threw: ${(err as Error).message}`); // threw: disk full
}
emitter.on("error", (err: Error) => console.log(`handled: ${err.message}`));
emitter.emit("error", new Error("disk full")); // handled: disk full

// The once function (imported from node:events, not the method) returns a
// promise that resolves with the event arguments, which lets you await an
// event in async code.
setTimeout(() => emitter.emit("ready", "database"), 10);
const [what] = await once(emitter, "ready");
console.log(`ready: ${what}`); // ready: database
