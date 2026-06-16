/**
 * @title Convert a Buffer (node:buffer)
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://docs.deno.com/api/node/buffer/} Doc: node:buffer
 * @resource {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array} MDN: Uint8Array
 * @group Encoding
 *
 * Node.js APIs and many npm packages produce Buffer objects. Deno supports
 * Buffer through the node:buffer module, and since Buffer is a subclass of
 * Uint8Array, converting to web-standard types is straightforward. This
 * example shows the common conversions in both directions.
 */
import { Buffer } from "node:buffer";

// We start with a Buffer containing the bytes of the string "Hello".
const buffer = Buffer.from("Hello", "utf8");

// To convert to a string, use the built-in toString method with an
// optional encoding.
console.log(buffer.toString("utf8")); // Hello

// A Buffer is a subclass of Uint8Array, so web APIs accept it directly.
// To get a plain Uint8Array view over the same memory, pass byteOffset and
// length. Buffers are often slices of a larger shared allocation.
const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.length);
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// To get an exact ArrayBuffer, slice the range out of the underlying
// buffer. Taking the buffer property alone may include unrelated bytes
// from the shared allocation pool.
const arrayBuffer = buffer.buffer.slice(
  buffer.byteOffset,
  buffer.byteOffset + buffer.byteLength,
);
console.log(arrayBuffer.byteLength); // 5

// The Blob constructor accepts a Buffer like any other view.
const blob = new Blob([buffer]);
console.log(blob.size); // 5

// To convert to a ReadableStream, wrap it with ReadableStream.from.
const stream = ReadableStream.from([buffer]);
console.log(stream instanceof ReadableStream); // true

// For the reverse direction, TextDecoder accepts any ArrayBuffer view, so
// it decodes DataViews and Buffers directly.
const view = new DataView(arrayBuffer);
console.log(new TextDecoder().decode(view)); // Hello
