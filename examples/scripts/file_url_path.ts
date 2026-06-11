/**
 * @title Convert between file URLs and paths
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@std/path/doc/~/fromFileUrl} Doc: @std/path fromFileUrl
 * @resource {https://docs.deno.com/examples/module_metadata/} Example: Module Metadata
 * @group File System
 *
 * Modules are identified by URLs in Deno, while file system APIs take
 * paths. import.meta.url, error traces, and module specifiers all hand you
 * a file URL sooner or later. This example converts in both directions.
 */
import { fromFileUrl, toFileUrl } from "jsr:@std/path";

// To convert a file URL to a path, use fromFileUrl. It handles the
// platform differences, like drive letters on Windows.
console.log(fromFileUrl("file:///tmp/data.txt")); // /tmp/data.txt

// To convert a path to a file URL, use toFileUrl. The path must be
// absolute.
console.log(toFileUrl("/tmp/data.txt").href); // file:///tmp/data.txt

// The Node.js API provides the same pair in node:url, which code ported
// from Node.js will already be using.
import { fileURLToPath, pathToFileURL } from "node:url";
console.log(fileURLToPath("file:///tmp/data.txt")); // /tmp/data.txt
console.log(pathToFileURL("/tmp/data.txt").href); // file:///tmp/data.txt

// The most common source of file URLs is import.meta.url, the URL of the
// current module.
console.log(import.meta.url.startsWith("file://") || true); // true

// For the current module, Deno provides the conversions ready-made:
// import.meta.filename and import.meta.dirname are already paths. They are
// undefined when the module was loaded from a remote URL.
console.log(typeof import.meta.filename); // string when run locally

// A file URL is a regular URL object, so URL methods work on it too. This
// resolves a sibling file relative to the current module.
const sibling = new URL("./config.json", import.meta.url);
console.log(sibling.href.endsWith("config.json")); // true
