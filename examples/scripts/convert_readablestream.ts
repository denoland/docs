/**
 * @title Convert a ReadableStream
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream} MDN: ReadableStream
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Response} MDN: Response
 * @group Encoding
 *
 * Network responses, file handles, and subprocess output all hand you a
 * ReadableStream. The easiest way to collect one into a string, bytes, or
 * JSON is to wrap it in a Response, which provides all the conversion
 * methods. This example shows each common conversion.
 */

// A helper that produces a fresh stream of UTF-8 bytes for each conversion
// below, because a stream can only be read once.
function streamOf(text: string): ReadableStream<Uint8Array> {
  return ReadableStream.from([new TextEncoder().encode(text)]);
}

// To collect into a string, wrap the stream in a Response and use the text
// method.
const text = await new Response(streamOf("Hello")).text();
console.log(text); // Hello

// To collect into a Uint8Array, use the bytes method.
const bytes = await new Response(streamOf("Hello")).bytes();
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// To collect into an ArrayBuffer, use the arrayBuffer method.
const buffer = await new Response(streamOf("Hello")).arrayBuffer();
console.log(buffer.byteLength); // 5

// To parse the stream contents as JSON, use the json method.
const data = await new Response(streamOf('{"name":"Deno"}')).json();
console.log(data.name); // Deno

// To collect into a Blob, use the blob method.
const blob = await new Response(streamOf("Hello")).blob();
console.log(blob.size); // 5

// To get an array of the raw chunks instead of joining them, use
// Array.fromAsync. Each chunk arrives as it was written to the stream.
const chunks = await Array.fromAsync(streamOf("Hello"));
console.log(chunks.length); // 1

// Remember that a stream is consumed by reading it. To use the same stream
// in two places, split it with tee first.
const [first, second] = streamOf("Hello").tee();
console.log(await new Response(first).text()); // Hello
console.log(await new Response(second).text()); // Hello
