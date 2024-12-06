/**
 * @title Benchmarking
 * @difficulty beginner
 * @tags cli
 * @run deno bench <url>
 * @resource {https://docs.deno.com/runtime/reference/cli/benchmarker} Manual: Benchmarker tool
 * @resource {/learn/examples/http-requests} Example: HTTP Requests
 * @group System
 *
 * When writing libraries, a very common task that needs to be done is
 * testing the speed of methods, usually against other libraries. Deno
 * provides an easy-to-use subcommand for this purpose.
 */

// The most basic form of deno benchmarking is providing a name and an
// anonymous function to run.
Deno.bench("URL parsing", () => {
  new URL("https://deno.land");
});

// We are also able to use an async function.
Deno.bench("Async method", async () => {
  await crypto.subtle.digest("SHA-256", new Uint8Array([1, 2, 3]));
});

// We can optionally use long form bench definitions.
Deno.bench({
  name: "Long form",
  fn: () => {
    new URL("https://deno.land");
  },
});

// We are also able to group certain benchmarks together
// using the optional group and baseline arguments.
Deno.bench({
  name: "Date.now()",
  group: "timing",
  baseline: true,
  fn: () => {
    Date.now();
  },
});

Deno.bench({
  name: "performance.now()",
  group: "timing",
  fn: () => {
    performance.now();
  },
});
