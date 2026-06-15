/**
 * @title Convert a Blob
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Blob} MDN: Blob
 * @resource {https://docs.deno.com/api/web/~/Blob} Doc: Blob
 * @group Encoding
 *
 * Blobs show up whenever you handle files or multipart form data, since an
 * uploaded File is a Blob too. A Blob is immutable and its data is read
 * asynchronously. This example shows how to get each common representation
 * out of one.
 */

// We start with a Blob containing the text "Hello".
const blob = new Blob(["Hello"], { type: "text/plain" });

// To convert to a string, use the built-in text method.
const text = await blob.text();
console.log(text); // Hello

// To convert to a Uint8Array, use the bytes method.
const bytes = await blob.bytes();
console.log(bytes); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]

// To convert to an ArrayBuffer, use the arrayBuffer method.
const buffer = await blob.arrayBuffer();
console.log(buffer.byteLength); // 5

// The stream method reads the Blob incrementally. This avoids holding a
// large file in memory all at once.
const stream = blob.stream();
for await (const chunk of stream) {
  console.log(chunk.length); // 5
}

// There is no direct method for a DataView. Wrap the ArrayBuffer
// instead.
const view = new DataView(await blob.arrayBuffer());
console.log(view.getUint8(0)); // 72

// A practical note: Response consumes a Blob directly, so an HTTP handler
// can return one without any conversion.
const response = new Response(blob);
console.log(response.headers.get("content-type")); // text/plain
