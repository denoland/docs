/**
 * @title Convert an ArrayBuffer
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer} MDN: ArrayBuffer
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder} MDN: TextDecoder
 * @group Encoding
 *
 * An ArrayBuffer is a chunk of raw memory with no read or write interface of
 * its own. To do anything useful with one — returned by `fetch`, the Web
 * Crypto API, or a file read — you usually convert it to a view or another
 * type first. This example shows the common conversions.
 */

// We start with an ArrayBuffer containing the bytes of the string "Hello".
const buffer = new TextEncoder().encode("Hello").buffer as ArrayBuffer;

// To a Uint8Array: wrap the buffer in a view. This does not copy the bytes —
// the view reads and writes the same memory.
const bytes = new Uint8Array(buffer);
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// If you need an independent copy instead of a shared view, slice the buffer
// first.
const copy = new Uint8Array(buffer.slice(0));
console.log(copy.buffer !== buffer); // true

// To a string: decode the bytes with TextDecoder. It accepts an ArrayBuffer
// directly.
const text = new TextDecoder().decode(buffer);
console.log(text); // Hello

// To an array of numbers: create a view, then spread or copy it into a plain
// array.
const numbers = Array.from(new Uint8Array(buffer));
console.log(numbers); // [ 72, 101, 108, 108, 111 ]

// To a Blob: pass the buffer in the Blob constructor's parts array. An
// optional type supplies the MIME type.
const blob = new Blob([buffer], { type: "text/plain" });
console.log(blob.size); // 5

// To a DataView: wrap the buffer to read or write specific numeric types at
// specific byte offsets, with explicit endianness.
const view = new DataView(buffer);
console.log(view.getUint8(0)); // 72

// To a Buffer (when working with Node.js APIs): Buffer.from(arrayBuffer)
// creates a view over the same memory, like Uint8Array does.
import { Buffer } from "node:buffer";
const nodeBuffer = Buffer.from(buffer);
console.log(nodeBuffer.toString("utf8")); // Hello
