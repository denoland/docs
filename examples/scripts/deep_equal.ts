/**
 * @title Check if two values are deeply equal
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://jsr.io/@std/assert/doc/~/equal} Doc: @std/assert equal
 * @resource {https://docs.deno.com/api/node/util/} Doc: node:util
 * @group Basics
 *
 * Two objects with the same contents are not equal with the === operator,
 * which compares references. To compare by value, use a deep equality
 * check. This example shows the two built-in options.
 */

// Reference comparison fails even when the contents match.
const first = { a: 1 };
const second = { a: 1 };
console.log(first === second); // false

// The standard library exports equal, a non-throwing deep comparison.
import { equal } from "jsr:@std/assert";

console.log(equal({ a: [1, 2] }, { a: [1, 2] })); // true
console.log(equal(new Map([["a", 1]]), new Map([["a", 1]]))); // true
console.log(equal({ a: 1 }, { a: 1, b: undefined })); // false

// Node.js compatibility offers isDeepStrictEqual with the same job.
import { isDeepStrictEqual } from "node:util";

console.log(isDeepStrictEqual({ a: [1, 2] }, { a: [1, 2] })); // true

// Strict means types matter. A string is never equal to a number.
console.log(isDeepStrictEqual({ a: 1 }, { a: "1" })); // false

// In tests, prefer the asserting variant, which prints a readable diff of
// the two values on failure.
import { assertEquals } from "jsr:@std/assert";

assertEquals({ a: [1, 2] }, { a: [1, 2] });
console.log("assertEquals passed"); // assertEquals passed
