/**
 * @title Filtering and controlling test runs
 * @difficulty beginner
 * @tags cli
 * @run deno test <url>
 * @resource {https://docs.deno.com/runtime/reference/cli/test/} Doc: deno test
 * @resource {/examples/tests_skip_focus/} Example: Skipping and focusing tests
 * @group Testing
 *
 * The test runner has flags for the everyday loops: run one test by name,
 * stop at the first failure, rerun on save, and spread test files across
 * CPU cores. This example demonstrates each on a small test file.
 */
import { assertEquals } from "jsr:@std/assert";

Deno.test("addition", () => {
  assertEquals(1 + 1, 2);
});

Deno.test("subtraction", () => {
  assertEquals(2 - 1, 1);
});

Deno.test("async work completes in time", async () => {
  // There is no built-in per-test timeout, so race the work against a
  // deadline. Clearing the timer keeps the sanitizers happy.
  await withTimeout(Promise.resolve("done"), 1000);
});

function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
  });
  return Promise.race([work, deadline]).finally(() => clearTimeout(timer));
}

// Run a single test by part of its name with --filter. Wrapping the value
// in slashes treats it as a regular expression:
//
//   deno test --filter "addition" control.test.ts
//   ok | 1 passed | 0 failed | 2 filtered out
//
//   deno test --filter "/add|sub/" control.test.ts

// Stop at the first failure with --fail-fast, or after N failures with
// --fail-fast=N. Without it, the runner reports every failure:
//
//   deno test --fail-fast control.test.ts

// Rerun tests automatically whenever a file in the module graph changes:
//
//   deno test --watch control.test.ts

// Run test FILES in parallel across CPU cores. Tests inside one file still
// run sequentially; the DENO_JOBS environment variable controls the worker
// count:
//
//   deno test --parallel
//   DENO_JOBS=4 deno test --parallel
