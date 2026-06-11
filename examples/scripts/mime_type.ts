/**
 * @title Get the MIME type of a file
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/media-types} Doc: @std/media-types
 * @resource {https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types} MDN: MIME types
 * @group File System
 *
 * Serving a file over HTTP needs a content type header. The standard
 * library maps file extensions to MIME types. This example looks up the
 * type for a few file names.
 */
import { contentType } from "jsr:@std/media-types";
import { extname } from "jsr:@std/path";

// Look up the MIME type for a file name by its extension.
console.log(contentType(extname("photo.png"))); // image/png
console.log(contentType(extname("data.json"))); // application/json

// Text types include their charset, ready to use in a header.
console.log(contentType(extname("index.html"))); // text/html; charset=UTF-8

// Unknown extensions return undefined, so provide a fallback. The standard
// fallback for arbitrary binary data is application/octet-stream.
const type = contentType(extname("archive.xyz")) ??
  "application/octet-stream";
console.log(type); // application/octet-stream

// A typical use: serving a file with the right header.
function _serveFile(path: string, file: ReadableStream): Response {
  return new Response(file, {
    headers: {
      "content-type": contentType(extname(path)) ??
        "application/octet-stream",
    },
  });
}

// Note that the lookup trusts the file name. To identify a file by its
// actual contents, inspect its magic bytes instead.
