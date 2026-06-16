/**
 * @title Communicate between workers with BroadcastChannel
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel} MDN: BroadcastChannel
 * @resource {https://docs.deno.com/deploy/api/runtime-broadcast-channel/} Deno Deploy: BroadcastChannel
 * @group Web Standard APIs
 *
 * BroadcastChannel is a named bus. Every channel opened with the same name
 * receives what the others post, with no direct references between them.
 * That makes it a simple way for the main thread and workers to talk. On
 * Deno Deploy the same API even spans separate instances of an
 * application. This example runs a worker from an inline module and
 * exchanges messages with it over a shared channel name.
 */

// The worker is defined inline as source code, so this example stays in
// one file. In a real program this would live in its own module, created
// with new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }).
const workerCode = `
const channel = new BroadcastChannel("jobs");

// A channel never receives its own posts, only posts from the others.
channel.onmessage = (event) => {
  if (event.data.type === "job") {
    channel.postMessage({ type: "result", note: "finished " + event.data.name });
    channel.close();
    self.close();
  }
};

// Announce readiness, because messages posted before this channel existed
// would have been lost.
channel.postMessage({ type: "ready" });
`;

// Turn the source into a Blob URL and start a module worker from it.
const blobUrl = URL.createObjectURL(
  new Blob([workerCode], { type: "application/javascript" }),
);
new Worker(blobUrl, { type: "module" });

// Open a channel with the same name on the main thread. Wait for the
// worker to say it is listening, hand it a job, and print the result.
const channel = new BroadcastChannel("jobs");

channel.onmessage = (event) => {
  if (event.data.type === "ready") {
    console.log("worker is listening"); // worker is listening
    channel.postMessage({ type: "job", name: "resize avatar.png" });
  } else if (event.data.type === "result") {
    console.log(event.data.note); // finished resize avatar.png
    // Close the channel so the process can exit. The worker already
    // closed its own side and shut itself down with self.close.
    channel.close();
    URL.revokeObjectURL(blobUrl);
  }
};
