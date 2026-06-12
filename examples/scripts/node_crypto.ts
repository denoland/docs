/**
 * @title Hash and sign with node:crypto
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://docs.deno.com/api/node/crypto/} Doc: node:crypto
 * @resource {/examples/hashing/} Example: Hashing with the Web Crypto API
 * @group Cryptography
 *
 * Deno supports the node:crypto module so that npm packages relying on it
 * work out of the box. For new code the web-standard Web Crypto API is the
 * preferred path, but when you maintain code written against node:crypto,
 * or interoperate with packages that use it, the familiar functions are
 * available.
 */

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

// Hash data with the classic update and digest chain. The hex digest of a
// fixed input is always the same.
const hash = createHash("sha256").update("hello world").digest("hex");
console.log(hash);
// b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9

// An HMAC authenticates a message with a shared secret key. Only someone
// who knows the key can produce or verify this tag.
const hmac = createHmac("sha256", "secret-key")
  .update("hello world")
  .digest("hex");
console.log(hmac);
// 095d5a21fe6d0646db223fdf3de6436bb8dfb2fab0b51677ecf6441fcf5f2a67

// randomBytes returns cryptographically secure random bytes as a Buffer.
console.log(randomBytes(16).toString("hex")); // e.g. 1dec06198400...

// timingSafeEqual compares two equal-length buffers in constant time,
// which is the right way to check secrets like HMAC tags.
const expected = Buffer.from(hmac, "hex");
const actual = createHmac("sha256", "secret-key")
  .update("hello world")
  .digest();
console.log(timingSafeEqual(expected, actual)); // true
