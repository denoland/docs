/**
 * @title HTTP Requests
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run --allow-net <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API} MDN: Fetch API
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream} MDN: ReadableStream
 * @group Network
 *
 * This example demonstrates how to make a HTTP request to a server.
 */

// To make a request to a server, you use the `fetch` API.
let resp = await fetch("https://example.com");

// The response is a `Response` object. This contains the status code, headers,
// and the body.
console.log(resp.status); // 200
console.log(resp.headers.get("Content-Type")); // "text/html"
console.log(await resp.text()); // "Hello, World!"

// The response body can also be read as JSON, an ArrayBuffer, or a Blob. A body
// can be read only once.
resp = await fetch("https://example.com");
await resp.arrayBuffer();
/** or await resp.json(); */
/** or await resp.blob(); */

// The response body can also be streamed in chunks.
resp = await fetch("https://example.com");
for await (const chunk of resp.body!) {
  console.log("chunk", chunk);
}

// When making a request, you can also specify the method, headers, and a body.
const body = `{"name": "Deno"}`;
resp = await fetch("https://example.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "foobar",
  },
  body,
});

// `fetch` also accepts a `Request` object instead of URL + options.
const req = new Request("https://example.com", {
  method: "DELETE",
});
resp = await fetch(req);

// Instead of a string, the body can also be any typed array, blob, or
// a URLSearchParams object.
const url = "https://example.com";
new Request(url, {
  method: "POST",
  body: new Uint8Array([1, 2, 3]),
});
new Request(url, {
  method: "POST",
  body: new Blob(["Hello, World!"]),
});
new Request(url, {
  method: "POST",
  body: new URLSearchParams({ "foo": "bar" }),
});

// Forms can also be sent with `fetch` by using a `FormData` object as the body.
const formData = new FormData();
formData.append("name", "Deno");
formData.append("file", new Blob(["Hello, World!"]), "hello.txt");
resp = await fetch("https://example.com", {
  method: "POST",
  body: formData,
});

// Fetch also supports streaming the request body.
const bodyStream = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode("Hello, World!"));
    controller.close();
  },
});
resp = await fetch("https://example.com", {
  method: "POST",
  body: bodyStream,
});
