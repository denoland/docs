/**
 * @title Convert an ArrayBuffer
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer} MDN: ArrayBuffer
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder} MDN: TextDecoder
 * @group Encoding
 *
 * An ArrayBuffer is a chunk of raw memory with no read or write interface
 * of its own. To use one returned by fetch, the Web Crypto API, or a file
 * read, you usually convert it to a view or another type first. This
 * example shows the common conversions.
 */

// We start with an ArrayBuffer containing the bytes of the string "Hello".
const buffer = new TextEncoder().encode("Hello").buffer as ArrayBuffer;

// To convert to a Uint8Array, wrap the buffer in a view. This does not
// copy the bytes. The view reads and writes the same memory.
const bytes = new Uint8Array(buffer);
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// For an independent copy instead of a shared view, slice the buffer
// first.
const copy = new Uint8Array(buffer.slice(0));
console.log(copy.buffer !== buffer); // true

// To convert to a string, decode the bytes with TextDecoder. It accepts an
// ArrayBuffer directly.
const text = new TextDecoder().decode(buffer);
console.log(text); // Hello

// To get a plain array of numbers, create a view and copy it into an
// array.
const numbers = Array.from(new Uint8Array(buffer));
console.log(numbers); // [ 72, 101, 108, 108, 111 ]

// To convert to a Blob, pass the buffer in the parts list of the Blob
// constructor. The optional type option sets the MIME type.
const blob = new Blob([buffer], { type: "text/plain" });
console.log(blob.size); // 5

// A DataView reads and writes numeric types at specific byte offsets,
// with explicit endianness.
const view = new DataView(buffer);
console.log(view.getUint8(0)); // 72

// When working with Node.js APIs, Buffer.from creates a Buffer viewing
// the same memory, just like Uint8Array does.
import { Buffer } from "node:buffer";
const nodeBuffer = Buffer.from(buffer);
console.log(nodeBuffer.toString("utf8")); // Hello
