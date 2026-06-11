/**
 * @title Convert a string to bytes and back
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder} MDN: TextEncoder
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder} MDN: TextDecoder
 * @group Encoding
 *
 * Hashing, file writes, and network protocols all want bytes, not strings.
 * This example shows how to encode a string into each common binary type
 * and decode it back.
 */

// We start with a plain string.
const text = "Hello";

// To convert to a Uint8Array of UTF-8 bytes, use TextEncoder.
const bytes = new TextEncoder().encode(text);
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// To convert back, use TextDecoder.
console.log(new TextDecoder().decode(bytes)); // Hello

// To get an ArrayBuffer, encode first and take the underlying buffer.
const buffer = new TextEncoder().encode(text).buffer;
console.log(buffer.byteLength); // 5

// To convert to a Blob, pass the string directly. The Blob constructor
// encodes it as UTF-8 for you.
const blob = new Blob([text]);
console.log(blob.size); // 5

// To convert to a ReadableStream, the most direct route is through a Blob.
const stream = new Blob([text]).stream();
console.log(await new Response(stream).text()); // Hello

// To convert to a base64 string, encode to bytes and use the built-in
// toBase64 method.
const base64 = new TextEncoder().encode(text).toBase64();
console.log(base64); // SGVsbG8=

// To decode base64 back to a string, combine fromBase64 and TextDecoder.
console.log(new TextDecoder().decode(Uint8Array.fromBase64(base64))); // Hello

// When working with Node.js APIs, Buffer.from encodes a string directly,
// with an optional encoding argument.
import { Buffer } from "node:buffer";
console.log(Buffer.from(text, "utf8").toString("base64")); // SGVsbG8=
