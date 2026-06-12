/**
 * @title Inspect memory with heap snapshots
 * @difficulty intermediate
 * @tags cli
 * @run -R -W <url>
 * @resource {https://docs.deno.com/api/node/v8/} Doc: node:v8
 * @resource {https://docs.deno.com/runtime/fundamentals/debugging/} Doc: Debugging
 * @group Advanced
 *
 * When memory keeps growing, a heap snapshot shows what is holding it: a
 * full dump of every live object, inspectable in Chrome DevTools. This
 * example takes one programmatically.
 */
import v8 from "node:v8";

// Something to find in the snapshot: a deliberately retained array.
const retained: string[] = [];
for (let i = 0; i < 10_000; i++) {
  retained.push(`entry ${i}`);
}

// Write a snapshot of the current heap to a file. The .heapsnapshot
// extension is what DevTools expects.
const file = v8.writeHeapSnapshot("./before-cleanup.heapsnapshot");
console.log(file); // ./before-cleanup.heapsnapshot

// Open Chrome DevTools at chrome://inspect, go to the Memory tab, load the
// file, and search for "entry " to find the retained strings, along with
// the retainer chain explaining why they cannot be collected.

// For leak hunting, take a second snapshot after the suspect operation and
// diff the two in DevTools.
retained.length = 0;
v8.writeHeapSnapshot("./after-cleanup.heapsnapshot");

// To take snapshots interactively instead, run the program with
// --inspect-brk and use the Memory tab against the live process:
//
//   deno run --inspect-brk main.ts

console.log("snapshots written");

// Clean up the demo files.
await Deno.remove("./before-cleanup.heapsnapshot");
await Deno.remove("./after-cleanup.heapsnapshot");
