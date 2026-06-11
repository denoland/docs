/**
 * @title Convert a Uint8Array
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array} MDN: Uint8Array
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream} MDN: ReadableStream
 * @group Encoding
 *
 * Uint8Array is the workhorse binary type in Deno: file reads, network
 * payloads, and hashes all produce or consume it. This example shows how to
 * convert one into the other common binary and text representations.
 */

// We start with a Uint8Array containing the bytes of the string "Hello".
const bytes = new TextEncoder().encode("Hello");

// To convert to a string, decode the bytes with TextDecoder.
const text = new TextDecoder().decode(bytes);
console.log(text); // Hello

// A Uint8Array is a view over an underlying ArrayBuffer. The view may
// cover only part of that buffer, so to get an exact ArrayBuffer, slice
// the range described by byteOffset and byteLength.
const exact = bytes.buffer.slice(
  bytes.byteOffset,
  bytes.byteOffset + bytes.byteLength,
);
console.log(exact.byteLength); // 5

// If the view is known to span its whole buffer, the buffer property can
// be used directly. This does not copy the bytes.
console.log(bytes.buffer.byteLength); // 5

// To convert to a Blob, pass the array in the parts list of the Blob
// constructor.
const blob = new Blob([bytes]);
console.log(blob.size); // 5

// To create a DataView over the same bytes, pass the buffer together with
// the offset and length of the view.
const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
console.log(view.getUint8(4)); // 111

// ReadableStream.from wraps any iterable into a stream. This is useful for
// APIs that consume streams, like the Response constructor.
const stream = ReadableStream.from([bytes]);
console.log(stream instanceof ReadableStream); // true

// When working with Node.js APIs, convert to a Buffer with Buffer.from.
// This copies the bytes. To share memory instead, pass the underlying
// buffer together with the offset and length.
import { Buffer } from "node:buffer";
const nodeBuffer = Buffer.from(bytes);
console.log(nodeBuffer.toString("utf8")); // Hello
