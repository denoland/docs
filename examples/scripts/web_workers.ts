/**
 * @title Web workers
 * @difficulty intermediate
 * @tags cli, web
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers} MDN: Web Workers
 * @resource {https://deno.land/manual@v1.30.0/runtime/workers} Manual: Workers
 * @group Advanced
 *
 * Workers are the only way of running javascript off of the main thread.
 * This can be useful for a wide variety of programs, especially those where
 * there is a lot of computation that needs to be done without blocking a
 * thread.
 */

// File: ./worker.ts

// First we will define a web worker, we can receive messages from the main
// thread and do some processing as a result of them.
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};

// File: ./main.ts

// Currently, Deno only supports module-type workers. To instantiate one
// we can use similar syntax to what is found on the web.
const worker = new Worker(
  new URL("./worker.ts", import.meta.url).href,
  {
    type: "module",
  },
);

// We can send a message to the worker by using the `postMessage` method
worker.postMessage({ filename: "./log.txt" });

// By default the worker inherits the permissions of the thread it was
// instantiated from. We can give workers certain permissions by using
// the deno.permissions option.
const worker2 = new Worker(
  new URL("./worker.ts", import.meta.url).href,
  {
    type: "module",
    deno: {
      permissions: {
        read: [
          new URL("./file_1.txt", import.meta.url),
          new URL("./file_2.txt", import.meta.url),
        ],
      },
    },
  },
);

// Because we instantiated this worker with specific permissions, this will
// cause the worker to try to read a file it doesn't have access to and thus
// will throw a permission error.
worker2.postMessage({ filename: "./log.txt" });
