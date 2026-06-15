/**
 * @title Debounce a function
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/async/doc/~/debounce} Doc: @std/async debounce
 * @resource {https://jsr.io/@std/async/doc/~/DebouncedFunction} Doc: @std/async DebouncedFunction
 * @group Standard library
 *
 * A debounced function waits until calls stop arriving before it runs.
 * That makes it a good fit for noisy event sources, such as file watcher
 * events that fire several times for a single save. This example shows
 * how a burst of calls collapses into one, and how to flush or cancel a
 * pending call.
 */

import { debounce } from "jsr:@std/async/debounce";
import { delay } from "jsr:@std/async/delay";

// Wrap a function with debounce and a wait time in milliseconds. The
// counter proves how many times the wrapped function actually runs.
let runs = 0;
const record = debounce((text: string) => {
  runs += 1;
  console.log(`ran with: ${text}`); // ran with: third
}, 100);

// Three calls land inside the 100ms window. Each call resets the timer,
// so only the last one runs, 100ms after the burst ends.
record("first");
record("second");
record("third");

// Wait past the debounce window so the pending call can fire.
await delay(150);
console.log(`runs: ${runs}`); // runs: 1

// The pending property reports whether a call is waiting. The flush
// method runs that pending call immediately instead of waiting.
const notify = debounce((msg: string) => {
  console.log(`notify: ${msg}`); // notify: deploy finished
}, 5_000);

notify("deploy finished");
console.log(notify.pending); // true
notify.flush();
console.log(notify.pending); // false

// The clear method drops the pending call without running it.
let pings = 0;
const ping = debounce(() => {
  pings += 1;
}, 5_000);

ping();
ping.clear();
console.log(pings); // 0
console.log(ping.pending); // false
