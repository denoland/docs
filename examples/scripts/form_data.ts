/**
 * @title Build and send forms with FormData
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/FormData} MDN: FormData
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Request/formData} MDN: Request.formData
 * @group Web Standard APIs
 *
 * FormData collects key and value pairs, including files, and fetch knows
 * how to send it as a multipart request. On the server, req.formData
 * parses it back. This example builds a form, inspects it, and sends it
 * through a real round trip to a local server.
 */

// Build a form field by field. The same key can appear more than once.
const form = new FormData();
form.append("name", "Deno");
form.append("tag", "fast");
form.append("tag", "secure");

// Files are appended as a Blob or File plus a filename. The Blob type
// becomes the content type of that part.
const readme = new Blob(["hello from a file"], { type: "text/plain" });
form.append("readme", readme, "readme.txt");

// get returns the first value for a key, getAll returns every value.
console.log(form.get("name")); // Deno
console.log(form.getAll("tag")); // [ "fast", "secure" ]

// A FormData object is iterable. File entries come back as File objects.
for (const [key, value] of form) {
  if (value instanceof File) {
    console.log(`${key}: file ${value.name}, ${value.size} bytes`); // readme: file readme.txt, 17 bytes
  } else {
    console.log(`${key}: ${value}`); // name: Deno, then tag: fast, then tag: secure
  }
}

// Start a local server that parses the form and echoes back what it got.
const server = Deno.serve({ port: 0, onListen() {} }, async (req) => {
  const data = await req.formData();
  const file = data.get("readme") as File;
  return Response.json({
    contentType: req.headers.get("content-type")?.split(";")[0],
    name: data.get("name"),
    tags: data.getAll("tag"),
    fileName: file.name,
    fileText: await file.text(),
  });
});

// Pass the form directly as the request body. fetch encodes it as
// multipart/form-data and sets the content type header, including the
// part boundary, automatically. Never set that header yourself.
const res = await fetch(`http://localhost:${server.addr.port}/`, {
  method: "POST",
  body: form,
});
const echoed = await res.json();

console.log(echoed.contentType); // multipart/form-data
console.log(echoed.name); // Deno
console.log(echoed.tags); // [ "fast", "secure" ]
console.log(echoed.fileName); // readme.txt
console.log(echoed.fileText); // hello from a file

// Stop the local server so the script can exit.
await server.shutdown();
