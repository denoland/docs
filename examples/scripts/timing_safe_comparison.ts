/**
 * @title Compare secrets in constant time
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/crypto/doc/timing-safe-equal} Doc: timingSafeEqual
 * @resource {https://codahale.com/a-lesson-in-timing-attacks/} A lesson in timing attacks
 * @group Cryptography
 *
 * An ordinary comparison like a === b returns as soon as the first byte
 * differs, so a correct first byte takes measurably longer to reject than
 * a wrong one. By timing many requests, an attacker can recover a secret
 * one byte at a time. When comparing API keys, tokens, or digests, use a
 * comparison whose duration does not depend on where the inputs differ.
 */

import { timingSafeEqual } from "jsr:@std/crypto/timing-safe-equal";

// timingSafeEqual compares two buffers of the same length in constant
// time. Digests are a natural fit since they always have a fixed length.
const encoder = new TextEncoder();
const digestA = await crypto.subtle.digest(
  "SHA-256",
  encoder.encode("my-api-key"),
);
const digestB = await crypto.subtle.digest(
  "SHA-256",
  encoder.encode("my-api-key"),
);
console.log(timingSafeEqual(digestA, digestB)); // true

// Raw secrets often differ in length, and a length mismatch alone leaks
// timing information. Hashing both sides first maps every input to the
// same 32 byte length, then the digests can be compared safely.
async function safeCompare(actual: string, expected: string) {
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(actual)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return timingSafeEqual(a, b);
}

// A correct secret matches, a wrong one of any length does not.
console.log(await safeCompare("my-api-key", "my-api-key")); // true
console.log(await safeCompare("my-api", "my-api-key")); // false

// The same @std/crypto module extends WebCrypto with additional digest
// algorithms. Its crypto.subtle accepts everything the built-in one does,
// plus algorithms like BLAKE3, and the digests feed the same comparison.
import { crypto as stdCrypto } from "jsr:@std/crypto";

const fast = await stdCrypto.subtle.digest(
  "BLAKE3",
  encoder.encode("my-api-key"),
);
console.log(new Uint8Array(fast).length); // 32
console.log(timingSafeEqual(fast, fast.slice(0))); // true
