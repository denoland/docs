/**
 * @title ULID
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://github.com/ulid/spec} ULID: Specification
 * @group Cryptography
 *
 * One common need for distributed systems are identifiers. ULIDs are a universally
 * unique lexicographically sortable identifier with some nice properties. They are
 * 128-bit values, encoded as 26 character strings which also encode the timestamp.
 * They play very nicely with Deno KV.
 */

// The standard library contains a function for generating ULIDs.
import { ulid } from "jsr:@std/ulid";

// To generate a ULID, simply call the function.
console.log(ulid());
console.log(ulid());
console.log(ulid());

// ULIDs can also be generated from a timestamp. This is useful for migrating from
// another system.
const timestamp = Date.now();
console.log(ulid(timestamp));
console.log(ulid(timestamp));
console.log(ulid(timestamp));

// Given a ULID, you can get the timestamp back out
import { decodeTime } from "jsr:@std/ulid/mod.ts";
const myULID = ulid();
console.log(decodeTime(myULID));

// Optionally, if you're not on a distributed system and want monotonic ULIDs,
// you can use the monotonic ULID generator instead.
import { monotonicUlid } from "jsr:@std/ulid/mod.ts";
console.log(monotonicUlid(150000)); // 000XAL6S41ACTAV9WEVGEMMVR8
console.log(monotonicUlid(150000)); // 000XAL6S41ACTAV9WEVGEMMVR9
console.log(monotonicUlid(150000)); // 000XAL6S41ACTAV9WEVGEMMVRA
