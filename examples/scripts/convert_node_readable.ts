/**
 * @title Convert a Node.js Readable
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://docs.deno.com/api/node/stream/} Doc: node:stream
 * @resource {https://docs.deno.com/examples/convert_readablestream/} Example: Convert a ReadableStream
 * @group Encoding
 *
 * Node.js APIs and npm packages often return a Node.js Readable rather than
 * a web ReadableStream. The node:stream/consumers module collects one into
 * any common type directly. This example shows each conversion.
 */
import { Readable } from "node:stream";
import { blob, buffer, json, text } from "node:stream/consumers";

// A helper that produces a fresh Readable for each conversion below,
// because a stream can only be read once.
function readableOf(content: string): Readable {
  return Readable.from([content]);
}

// To collect into a string, use the text consumer.
console.log(await text(readableOf("Hello"))); // Hello

// To parse the stream contents as JSON, use the json consumer.
const data = await json(readableOf('{"name":"Deno"}')) as { name: string };
console.log(data.name); // Deno

// To collect into a Buffer, use the buffer consumer. Since a Buffer is a
// Uint8Array, this is also the route to bytes.
const bytes = await buffer(readableOf("Hello"));
console.log(bytes.length); // 5

// To collect into a Blob, use the blob consumer. An ArrayBuffer is then one
// call away.
const asBlob = await blob(readableOf("Hello"));
console.log(asBlob.size); // 5

// To get an array of the chunks, use the built-in toArray method.
const chunks = await readableOf("Hello").toArray();
console.log(chunks); // [ "Hello" ]

// To convert to a web ReadableStream, use the static toWeb method. Web
// streams carry bytes, so the Readable should contain Uint8Array chunks.
// The reverse direction is Readable.fromWeb.
const byteReadable = Readable.from([new TextEncoder().encode("Hello")]);
const webStream = Readable.toWeb(byteReadable);
console.log(await new Response(webStream as ReadableStream).text()); // Hello
