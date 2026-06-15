/**
 * @title Communicate with a child process over IPC
 * @difficulty intermediate
 * @tags cli
 * @run -A <url>
 * @resource {https://docs.deno.com/api/node/child_process/} Doc: node:child_process
 * @resource {https://docs.deno.com/examples/subprocess_tutorial/} Example: Subprocess spawning
 * @group System
 *
 * Pipes carry bytes, but coordinating with a worker process is easier with
 * structured messages. Deno supports the Node.js IPC channel through
 * node:child_process fork. This example forks itself and exchanges
 * messages with the child.
 */
import { fork } from "node:child_process";
import process from "node:process";

// In the child, process.send exists. The child answers each message it
// receives and exits when asked.
if (process.send) {
  process.on("message", (message) => {
    if (message === "stop") {
      process.exit(0);
    }
    process.send!({ answer: `pong: ${message}` });
  });
} else {
  // In the parent, fork starts the child with an IPC channel attached.
  // Forking this same file keeps the example self-contained; normally the
  // child is its own module.
  const child = fork(new URL(import.meta.url).pathname);

  // Messages from the child arrive on the message event. They are
  // structured values, not bytes, so no parsing is needed.
  child.on("message", (message) => {
    console.log("from child:", JSON.stringify(message)); // {"answer":"pong: ping"}
    child.send("stop");
  });

  // Send a message to the child to start the exchange.
  child.send("ping");

  // The parent finishes when the child exits.
  child.on("exit", (code) => {
    console.log(`child exited with code ${code}`); // child exited with code 0
  });
}
