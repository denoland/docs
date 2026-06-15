/**
 * @title Hashing and verifying passwords
 * @difficulty intermediate
 * @tags cli, deploy
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits} MDN: SubtleCrypto.deriveBits
 * @resource {https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html} OWASP: Password Storage Cheat Sheet
 * @group Cryptography
 *
 * Passwords must never be stored in plain text, and a plain digest like
 * SHA-256 is too fast to resist brute force. A password hash needs a salt
 * and a deliberately slow derivation. This example uses PBKDF2 from the
 * built-in Web Crypto API.
 */

// The OWASP recommended cost for PBKDF2 with SHA-256.
const ITERATIONS = 600_000;

// Hash a password with a random salt. Store the salt next to the hash;
// it is not a secret, it only makes each hash unique.
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveBits(password, salt);
  return `${salt.toBase64()}:${hash.toBase64()}`;
}

// Verify by re-deriving with the stored salt and comparing the results in
// constant time.
async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, expected] = stored.split(":")
    .map((part) => Uint8Array.fromBase64(part));
  const actual = await deriveBits(password, salt);
  return timingSafeEqual(actual, expected);
}

// The key derivation itself: PBKDF2 with SHA-256, producing 256 bits.
async function deriveBits(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    key,
    256,
  );
  return new Uint8Array(bits);
}

// Compare hashes in constant time so the comparison itself does not leak
// how many leading bytes matched.
import { timingSafeEqual } from "jsr:@std/crypto/timing-safe-equal";

// Putting it together: hash at signup, verify at login.
const stored = await hashPassword("hunter2");
console.log(stored.length > 60); // true

console.log(await verifyPassword("hunter2", stored)); // true
console.log(await verifyPassword("wrong", stored)); // false

// PBKDF2 ships with the runtime and is OWASP approved. If your threat
// model calls for a memory-hard algorithm, use argon2 via an npm package
// instead, the API shape stays the same: hash at signup, verify at login.
