/**
 * @title Hash large files with streams
 * @difficulty intermediate
 * @tags cli
 * @run -R -W <url>
 * @resource {https://jsr.io/@std/crypto} Web Crypto extensions in the Standard Library
 * @resource {/examples/hashing/} Example: Hashing
 * @group Cryptography
 *
 * The Web Crypto digest function takes a single buffer, so hashing a file
 * with it means reading the whole file into memory first. The Standard
 * Library ships a drop-in crypto wrapper whose digest also accepts async
 * iterables, such as a file's readable stream, and hashes chunk by chunk
 * in constant memory.
 */

import { crypto } from "jsr:@std/crypto";

// Create a file to hash. In real code this could be gigabytes.
const path = await Deno.makeTempFile();
await Deno.writeTextFile(path, "a".repeat(1_000_000));

// Open the file and pass its readable stream straight to digest. The
// stream is consumed chunk by chunk and never held in memory at once.
const file = await Deno.open(path);
const streamed = await crypto.subtle.digest("SHA-256", file.readable);
console.log(new Uint8Array(streamed).toHex());
// cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0

// For comparison, the one-shot approach: read the entire file into memory
// and hash the buffer. The standard wrapper still accepts plain buffers,
// so this is exactly what built-in Web Crypto would do.
const whole = await Deno.readFile(path);
const oneShot = await crypto.subtle.digest("SHA-256", whole);

// Both approaches produce the same digest.
console.log(
  new Uint8Array(streamed).toHex() === new Uint8Array(oneShot).toHex(),
); // true

await Deno.remove(path);
