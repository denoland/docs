/**
 * @title Generate secure random values
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues} MDN: crypto.getRandomValues
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID} MDN: crypto.randomUUID
 * @group Cryptography
 *
 * Session tokens, password reset links, and API keys must be impossible to
 * guess. Math.random is not suitable for secrets because its output is
 * predictable from earlier outputs. The built-in Web Crypto API provides a
 * cryptographically secure random source instead.
 */

// Fill a typed array with random bytes from the secure random source.
const bytes = crypto.getRandomValues(new Uint8Array(16));
console.log(bytes); // e.g. Uint8Array(16) [ 81, 186, 47, ... ]

// Generate a v4 UUID, handy as a unique identifier.
console.log(crypto.randomUUID()); // e.g. 721475a3-3280-4f61-8d5f-374c83a7cdfa

// For tokens that travel in URLs or headers, encode random bytes as text.
// 32 random bytes give 256 bits of entropy, plenty for a session token.
const token = crypto.getRandomValues(new Uint8Array(32));
const options = { alphabet: "base64url", omitPadding: true } as const;
console.log(token.toBase64(options)); // e.g. QIUpF1ewQ-bc...
console.log(token.toHex()); // e.g. 4085291757b0...

// A uniform random integer in a range takes more care. The naive approach,
// value % range, is biased: 2 ** 32 is rarely a multiple of the range, so
// the leftover values at the top wrap around and make small results
// slightly more likely. Rejection sampling discards that uneven tail and
// retries, which keeps every value in the range equally likely.
function randomInt(min: number, max: number): number {
  const range = max - min;
  const limit = Math.floor(2 ** 32 / range) * range;
  const sample = new Uint32Array(1);
  do {
    crypto.getRandomValues(sample);
  } while (sample[0] >= limit);
  return min + (sample[0] % range);
}

// Roll a die: a uniform integer from 1 to 6.
console.log(randomInt(1, 7)); // e.g. 5
