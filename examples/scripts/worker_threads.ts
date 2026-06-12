/**
 * @title Use worker_threads in Deno
 * @difficulty intermediate
 * @tags cli
 * @run --allow-read <url>
 * @resource {https://docs.deno.com/api/node/worker_threads/} Doc: node:worker_threads
 * @resource {https://docs.deno.com/examples/web_workers/} Example: Web workers
 * @group System
 *
 * Deno supports the node:worker_threads module for moving work off the main
 * thread. A worker receives startup data through workerData and talks to
 * the main thread through parentPort. This example launches itself as a
 * worker to stay self-contained; normally the worker is its own module. The
 * web standard Worker API is the Deno-native alternative.
 */
import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from "node:worker_threads";
import process from "node:process";

// isMainThread distinguishes the two roles this one file plays.
if (isMainThread) {
  // The main thread starts the worker. The workerData option carries any
  // structured value to the worker as startup input.
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { numbers: [3, 4, 5] },
  });

  // Replies from the worker arrive on the message event as structured
  // values, no parsing needed. Once the result is in, the main thread asks
  // the worker to stop.
  worker.on("message", (message) => {
    console.log("from worker:", JSON.stringify(message)); // from worker: {"sum":12}
    worker.postMessage("stop");
  });

  // The exit event fires when the worker thread has shut down.
  worker.on("exit", (code) => {
    console.log(`worker exited with code ${code}`); // worker exited with code 0
  });
} else {
  // This branch runs inside the worker thread. The startup input is
  // available as workerData, and parentPort sends results back.
  const total = workerData.numbers.reduce((a: number, b: number) => a + b, 0);
  parentPort!.postMessage({ sum: total });

  // The worker stays alive while it listens on parentPort. Exiting the
  // process inside a worker ends just that thread.
  parentPort!.on("message", (message) => {
    if (message === "stop") {
      process.exit(0);
    }
  });
}
