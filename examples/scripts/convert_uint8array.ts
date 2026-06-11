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

// To a string: decode the bytes with TextDecoder.
const text = new TextDecoder().decode(bytes);
console.log(text); // Hello

// To an ArrayBuffer: a Uint8Array is a view, so `.buffer` returns the
// underlying buffer — but beware: the view may cover only PART of that
// buffer (for example, a subarray). Respect byteOffset and byteLength.
const exact = bytes.buffer.slice(
  bytes.byteOffset,
  bytes.byteOffset + bytes.byteLength,
);
console.log(exact.byteLength); // 5

// If you know the view spans the whole buffer, `.buffer` alone is fine and
// does not copy.
console.log(bytes.buffer.byteLength); // 5

// To a Blob: pass the array in the Blob constructor's parts array.
const blob = new Blob([bytes]);
console.log(blob.size); // 5

// To a DataView: pass the buffer along with the view's offset and length so
// the DataView covers exactly the same bytes.
const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
console.log(view.getUint8(4)); // 111

// To a ReadableStream: ReadableStream.from() wraps any iterable. This is
// useful for APIs that consume streams, like the Response constructor.
const stream = ReadableStream.from([bytes]);
console.log(stream instanceof ReadableStream); // true

// To a Buffer (when working with Node.js APIs): Buffer.from(typedArray)
// copies the bytes. To share memory instead, pass the underlying buffer:
// Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).
import { Buffer } from "node:buffer";
const nodeBuffer = Buffer.from(bytes);
console.log(nodeBuffer.toString("utf8")); // Hello
