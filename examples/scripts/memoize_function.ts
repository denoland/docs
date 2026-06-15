/**
 * @title Memoize an expensive function
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/cache/doc/~/memoize} Doc: @std/cache memoize
 * @resource {https://jsr.io/@std/cache/doc/~/LruCache} Doc: @std/cache LruCache
 * @group Standard library
 *
 * Memoization caches the result of a function call so repeated calls
 * with the same arguments return instantly. The standard library ships
 * memoize for the wrapping and LruCache for keeping the cache bounded.
 * This example proves cache hits with a call counter and shows eviction
 * when the cache fills up.
 */

import { LruCache, type MemoizationCacheResult, memoize } from "jsr:@std/cache";

// A counter reveals how often the real function body runs.
let calls = 0;
function slowSquare(n: number): number {
  calls += 1;
  return n * n;
}

const fastSquare = memoize(slowSquare);

// The first call with a given argument computes the result.
console.log(fastSquare(9)); // 81
// The second call returns the cached value without running the body.
console.log(fastSquare(9)); // 81
console.log(calls); // 1

// A new argument is a cache miss, so the body runs again.
console.log(fastSquare(12)); // 144
console.log(calls); // 2

// By default the cache is an unbounded Map. The cache property exposes
// it for inspection or manual invalidation.
console.log(fastSquare.cache.size); // 2

// An LruCache keeps at most maxSize entries and evicts the least
// recently used one when a new entry would exceed the limit.
const lru = new LruCache<string, MemoizationCacheResult<number>>(2);

let lookups = 0;
const lookup = memoize((id: number): number => {
  lookups += 1;
  return id * 10;
}, { cache: lru });

lookup(1);
lookup(2);
// Adding a third entry evicts the entry for 1, the oldest of the two.
lookup(3);

// Calling with 1 again is a miss now, so the function body runs again.
lookup(1);
console.log(lookups); // 4
