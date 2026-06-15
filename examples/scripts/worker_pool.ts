/**
 * @title Distribute work across a worker pool
 * @difficulty intermediate
 * @tags cli
 * @resource {https://docs.deno.com/examples/web_workers/} Example: Web workers
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers} MDN: Using web workers
 * @group Web standard APIs
 *
 * A single web worker moves heavy computation off the main thread, but a
 * pool of workers uses every CPU core. The pattern: spawn one worker per
 * core, feed each a task, and hand out the next task whenever a worker
 * reports back. This example counts primes below several limits in
 * parallel.
 */

// File: ./worker.ts

// The worker receives a number, does the CPU-heavy counting, and posts
// the result back. Workers process messages one at a time, which is what
// makes "send the next task when a result arrives" work.
self.onmessage = (e: MessageEvent<number>) => {
  const limit = e.data;
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  self.postMessage({ limit, count });
};

// File: ./main.ts

// A queue of independent tasks, more than we have cores.
const tasks = [1e6, 2e6, 3e6, 4e6, 5e6, 6e6, 7e6, 8e6];
const results: { limit: number; count: number }[] = [];

// navigator.hardwareConcurrency reports the number of logical cores.
// Spawning more workers than that only adds scheduling overhead.
const poolSize = Math.min(navigator.hardwareConcurrency, tasks.length);
console.log(`pool size: ${poolSize}`); // pool size: 8

// Each worker runs a loop expressed with messages: assign a task, wait
// for the result, assign the next. When the queue is empty the worker is
// terminated and its slot resolves.
let nextTask = 0;
await Promise.all(
  Array.from({ length: poolSize }, () => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    return new Promise<void>((resolve) => {
      const assign = () => {
        if (nextTask >= tasks.length) {
          worker.terminate();
          resolve();
          return;
        }
        worker.postMessage(tasks[nextTask++]);
      };
      worker.onmessage = (e) => {
        results.push(e.data);
        assign();
      };
      assign();
    });
  }),
);

// Results arrive in completion order, not submission order, so sort them
// if order matters. On an 8-core machine this runs roughly 4x faster
// than the same loop on the main thread.
results.sort((a, b) => a.limit - b.limit);
console.log(results[0]); // { limit: 1000000, count: 78498 }
console.log(results.at(-1)); // { limit: 8000000, count: 539777 }
