/**
 * @title Measure performance with marks and measures
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Performance} MDN: Performance
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure} MDN: performance.measure
 * @group Web Standard APIs
 *
 * The performance API measures elapsed time with sub-millisecond
 * precision. performance.now gives quick deltas, while named marks and
 * measures build a timeline you can query later and inspect in the
 * DevTools performance panel when debugging with the inspector. Timings
 * differ on every machine and run, so the outputs below are examples.
 */

// performance.now returns milliseconds since the program started. The
// difference between two calls times a block of code.
const start = performance.now();
let total = 0;
for (let i = 0; i < 1_000_000; i++) {
  total += Math.sqrt(i);
}
const elapsed = performance.now() - start;
console.log(`loop took ${elapsed.toFixed(1)} ms`); // e.g. loop took 2.8 ms

// Marks are named points in time. Place one before and one after the
// work you care about.
performance.mark("wait-start");
await new Promise((resolve) => setTimeout(resolve, 50));
performance.mark("wait-end");

// A measure is the named span between two marks. It is returned and also
// recorded on the timeline.
const waitMeasure = performance.measure("wait", "wait-start", "wait-end");
console.log(`${waitMeasure.name}: ${waitMeasure.duration.toFixed(1)} ms`); // e.g. wait: 51.5 ms

// With one mark you can measure from it to now by omitting the end mark.
performance.mark("parse-start");
JSON.parse(
  JSON.stringify({ items: Array.from({ length: 10_000 }, (_, i) => i) }),
);
performance.measure("parse", "parse-start");

// All recorded measures are available later by type, so you can time
// several stages and report them together at the end.
for (const entry of performance.getEntriesByType("measure")) {
  console.log(`${entry.name} took ${entry.duration.toFixed(1)} ms`); // e.g. wait took 51.5 ms
}

// Entries can also be fetched by name.
console.log(performance.getEntriesByName("wait").length); // 1

// Clearing marks and measures resets the timeline, which keeps memory
// flat in long-running processes.
performance.clearMarks();
performance.clearMeasures();
console.log(performance.getEntriesByType("measure").length); // 0
