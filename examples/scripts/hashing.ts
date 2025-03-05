/**
 * @title Hashing
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-read <url>
 * @resource {https://docs.deno.com/api/web/~/SubtleCrypto} Doc: crypto.subtle
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest} MDN: Cryptographic Digests
 * @group Cryptography
 *
 * Hashing data is a common operation that is facilitated
 * through Deno's support for the Web Crypto API. In addition,
 * the Deno Standard Library's implementation extends the standard API, allowing for
 * more advanced uses.
 */

// In our first example, we'll hash the contents of a string variable.
const message = "The easiest, most secure JavaScript runtime.";

// Before we can pass our message to the hashing function,
// we first need to encode it into a uint8 array.
const messageBuffer = new TextEncoder().encode(message);

// Here, we use the built-in crypto.subtle.digest method to hash our original message.
// The hash is returned as an ArrayBuffer. To obtain a string
// we'll need to do a little more work.
const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);

// We can encode this into a string using the standard
// library's encodeHex method.
import { encodeHex } from "jsr:@std/encoding/hex";
const hash = encodeHex(hashBuffer);
console.log(hash);

// For our second example, we'll hash the contents of a file.
// Hashing a file is a common operation and doing this
// without loading the whole file into memory is a typical
// requirement.

// The standard library has extensions to the Web
// Crypto API that are useful when doing things
// like hashing a file. These can be accessed through the
// "crypto" module, a drop-in replacement for the Web Crypto
// API that delegates to the native implementation when
// possible.
import { crypto } from "jsr:@std/crypto";
const file = await Deno.open("example.txt", { read: true });

// We obtain an async iterable using the readable property.
const readableStream = file.readable;

// This time, when we call crypto.subtle.digest, we're using the
// imported version that allows us to operate on the
// async iterable.
const fileHashBuffer = await crypto.subtle.digest("SHA-256", readableStream);

// Finally, we obtain the hex result using encodeHex like earlier.
const fileHash = encodeHex(fileHashBuffer);
console.log(fileHash);
