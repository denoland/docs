/**
 * @title Write benchmarks with Deno.bench
 * @difficulty beginner
 * @tags cli
 * @run deno bench <url>
 * @resource {https://docs.deno.com/runtime/fundamentals/testing/#benchmarking} Doc: Benchmarking
 * @resource {https://docs.deno.com/api/deno/~/Deno.bench} Doc: Deno.bench
 * @group CLI
 *
 * Deno has a built-in benchmark runner. Register benchmarks with Deno.bench
 * and run them with the deno bench subcommand, which reports timings and
 * compares grouped benchmarks against a baseline.
 */

// A classic question: for membership checks, how much faster is a Set than
// an Array? Prepare both with the same ten thousand items, then look for an
// element near the end, the worst case for the array.
const items = Array.from({ length: 10_000 }, (_, i) => `item-${i}`);
const itemsArray = [...items];
const itemsSet = new Set(items);
const needle = "item-9999";

// Benchmarks that belong to the same group are compared with each other in
// the summary. Exactly one of them can be marked as the baseline.
Deno.bench({
  name: "Array.prototype.includes",
  group: "lookup",
  baseline: true,
  fn: () => {
    itemsArray.includes(needle);
  },
});

Deno.bench({
  name: "Set.prototype.has",
  group: "lookup",
  fn: () => {
    itemsSet.has(needle);
  },
});

// Sometimes a benchmark needs setup that should not be measured. The bench
// context passed to the function exposes start and end methods that limit
// the measured section. Here only the join call is timed, not building the
// input array.
Deno.bench("join parts", (b) => {
  const parts = Array.from({ length: 1_000 }, (_, i) => `part-${i}`);
  b.start();
  parts.join(", ");
  b.end();
});

// Run the file with deno bench. The trailing columns with min, max and
// percentiles are trimmed here to keep the table narrow:
//
//   deno bench deno_bench.ts
//       CPU | Apple M1 Max
//   Runtime | Deno 2.8.2 (aarch64-apple-darwin)
//
//   | benchmark                  | time/iter (avg) |        iter/s |
//   | -------------------------- | --------------- | ------------- |
//   | join parts                 |         15.8 µs |        63,360 |
//
//   group lookup
//   | Array.prototype.includes   |          9.9 µs |       101,400 |
//   | Set.prototype.has          |          4.3 ns |   233,500,000 |
//
//   summary
//     Array.prototype.includes
//        2303x slower than Set.prototype.has
//
// The linear scan takes microseconds while the hash lookup takes
// nanoseconds, so the Set wins by more than three orders of magnitude.

// Useful flags: deno bench --filter lookup runs only matching benchmarks,
// and deno bench --json emits machine-readable results.
