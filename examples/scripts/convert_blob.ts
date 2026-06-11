/**
 * @title Convert a Blob
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Blob} MDN: Blob
 * @resource {https://docs.deno.com/api/web/~/Blob} Doc: Blob
 * @group Encoding
 *
 * Blobs show up whenever you handle files or multipart form data — an
 * uploaded `File` is a Blob too. A Blob is immutable and its data is read
 * asynchronously; this example shows how to get each common representation
 * out of one.
 */

// We start with a Blob containing the text "Hello".
const blob = new Blob(["Hello"], { type: "text/plain" });

// To a string: Blob has a built-in async method for it.
const text = await blob.text();
console.log(text); // Hello

// To a Uint8Array: use the bytes() method.
const bytes = await blob.bytes();
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// To an ArrayBuffer: also built in.
const buffer = await blob.arrayBuffer();
console.log(buffer.byteLength); // 5

// To a ReadableStream: stream() reads the Blob incrementally, which avoids
// holding a large file in memory all at once.
const stream = blob.stream();
for await (const chunk of stream) {
  console.log(chunk.length); // 5
}

// To a DataView: there is no direct method; wrap the ArrayBuffer.
const view = new DataView(await blob.arrayBuffer());
console.log(view.getUint8(0)); // 72

// A practical note: `Response` can also consume a Blob directly, so you can
// return one from an HTTP handler without converting it yourself.
const response = new Response(blob);
console.log(response.headers.get("content-type")); // text/plain
