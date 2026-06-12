/**
 * @title Run async tasks with a concurrency limit
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/async/doc/~/pooledMap} Doc: @std/async pooledMap
 * @resource {https://jsr.io/@std/async/doc/~/delay} Doc: @std/async delay
 * @group Standard library
 *
 * Firing hundreds of requests at once can overwhelm a server or hit rate
 * limits. The pooledMap function maps an async function over a list while
 * keeping at most a fixed number of tasks running at the same time. This
 * example proves the limit with a counter and shows the order results
 * come back in.
 */

import { pooledMap } from "jsr:@std/async/pool";
import { delay } from "jsr:@std/async/delay";

// Track how many tasks run at once. The maximum observed value proves
// that the pool never exceeds its limit.
let inFlight = 0;
let maxInFlight = 0;
const completed: number[] = [];

// Each item simulates a network call that takes a different amount of
// time. The first argument caps concurrency at 2.
const durations = [300, 100, 150, 250];
const results = pooledMap(2, durations, async (ms) => {
  inFlight += 1;
  maxInFlight = Math.max(maxInFlight, inFlight);
  await delay(ms);
  completed.push(ms);
  inFlight -= 1;
  return ms;
});

// pooledMap returns an async iterable. Collect it with Array.fromAsync
// or consume it with a for await loop as results become available.
const yielded = await Array.fromAsync(results);

// Only 2 tasks ever ran at the same time, even with 4 items queued.
console.log(maxInFlight); // 2

// Tasks finish in completion order: the 100ms task beats the 300ms one.
console.log(completed); // [ 100, 150, 300, 250 ]

// Results are still yielded in input order, not completion order. Each
// result waits until the results before it are ready.
console.log(yielded); // [ 300, 100, 150, 250 ]
