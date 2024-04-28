/**
 * @title Manipulating byte arrays
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {$std/bytes} Doc: std/bytes
 *
 * When working with lower-level data we often deal
 * with byte arrays in the form of Uint8Arrays. There
 * are some common manipulations and queries that can
 * be done and are included with the standard library.
 */

// Let's initialize some byte arrays
const a = new Uint8Array([0, 1, 2, 3, 4]);
const b = new Uint8Array([5, 6, 7, 8, 9]);
const c = new Uint8Array([4, 5]);

// We can concatenate two byte arrays using the
// concat method
import { concat } from "jsr:@std/bytes/concat";
const d = concat([a, b]);
console.log(d); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Sometimes we need to repeat certain bytes
import { repeat } from "jsr:@std/bytes/repeat";
console.log(repeat(c, 4)); // [4, 5, 4, 5, 4, 5, 4, 5]

// Sometimes we need to mutate a Uint8Array and need a copy
import { copy } from "jsr:@std/bytes/copy";
const cpy = new Uint8Array(5);
console.log("Bytes copied:", copy(b, cpy)); // 5
console.log("Bytes:", cpy); // [5, 6, 7, 8, 9]
