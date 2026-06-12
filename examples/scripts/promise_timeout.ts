/**
 * @title Add a timeout to any promise
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/async/doc/~/deadline} Doc: @std/async deadline
 * @resource {https://jsr.io/@std/async/doc/~/abortable} Doc: @std/async abortable
 * @group Standard library
 *
 * A promise has no built-in time limit, so a stalled request can hang a
 * program forever. The deadline function wraps any promise and rejects
 * it after a given number of milliseconds. The abortable function does
 * the same with an AbortSignal, which lets a user or another event
 * cancel the wait.
 */

import { abortable, deadline, delay } from "jsr:@std/async";

// When the promise settles before the time limit, deadline resolves
// with its value as if the wrapper was not there.
const fast = delay(50).then(() => "fetched 3 records");
console.log(await deadline(fast, 1_000)); // fetched 3 records

// When the time limit hits first, deadline rejects with a DOMException
// named TimeoutError.
const slow = delay(2_000, { persistent: false }).then(() => "too late");
try {
  await deadline(slow, 100);
} catch (err) {
  console.log((err as DOMException).name); // TimeoutError
}

// The rejection only stops the waiting. The slow task above keeps
// running in the background unless it accepts a signal and honors it,
// so pass an AbortSignal to the underlying work whenever you can.

// The abortable function ties a promise to an AbortSignal instead of a
// clock. Here the same signal also cancels the underlying delay, so no
// work is left running after the abort.
const controller = new AbortController();
const work = delay(2_000, { signal: controller.signal })
  .then(() => "report ready");

setTimeout(() => controller.abort(), 50);

try {
  await abortable(work, controller.signal);
} catch (err) {
  console.log((err as DOMException).name); // AbortError
}
