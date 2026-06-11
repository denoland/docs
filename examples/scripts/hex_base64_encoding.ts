/**
 * @title Hex and base64 encoding
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64} MDN: Uint8Array.prototype.toBase64
 * @resource {https://docs.deno.com/examples/convert_uint8array/} Example: Convert a Uint8Array
 * @group Encoding
 *
 * Binary data often needs to travel as text, in URLs, JSON, or HTTP
 * headers. Since Deno 2.x the Uint8Array built-in methods handle hex and
 * base64 directly, with no imports needed.
 */

// Encoding starts from bytes. To encode a string, convert it to a
// Uint8Array with TextEncoder first.
const bytes = new TextEncoder().encode("somestringtoencode");

// To encode the bytes as base64, use the built-in toBase64 method.
const base64Encoded = bytes.toBase64();
console.log(base64Encoded); // c29tZXN0cmluZ3RvZW5jb2Rl

// To decode base64 back into bytes, use the static fromBase64 method.
const base64Decoded = Uint8Array.fromBase64(base64Encoded);

// To get the value back as a string, use TextDecoder.
console.log(new TextDecoder().decode(base64Decoded)); // somestringtoencode

// Base64url is the URL-safe variant used in JWTs and web APIs. Pass the
// alphabet option to encode or decode it.
const urlSafe = bytes.toBase64({ alphabet: "base64url" });
console.log(urlSafe); // c29tZXN0cmluZ3RvZW5jb2Rl

// Hex encoding works the same way, with toHex and fromHex.
const hexEncoded = bytes.toHex();
console.log(hexEncoded); // 736f6d65737472696e67746f656e636f6465

// And back again.
const hexDecoded = Uint8Array.fromHex(hexEncoded);
console.log(new TextDecoder().decode(hexDecoded)); // somestringtoencode

// For formats beyond hex and base64, like base32 or base58, the Deno
// Standard Library provides encoders in jsr:@std/encoding.
