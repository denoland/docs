/**
 * @title Importing binary files
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://github.com/whatwg/html/issues/9444} HTLM specification proposal
 * @group Unstable APIs
 *
 * Binary files can be imported in JS and TS files using the `import` keyword.
 * This makes including static data in a library much easier.
 *
 * Using this feature requires `--unstable-raw-imports` CLI flag.
 */

// File: ./main.ts

// Binary files can be imported in JS and TS modules. When doing so, you need to
// specify the `type: "bytes"` import attribute.
import bytes from "./image.png" with { type: "bytes" };
console.log(text);

// Dynamic imports are also supported.
const text = await import("./image.png", {
  with: { type: "bytes" },
});
console.log(bytes);

/* File: ./image.png
89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52
00 00 00 01 00 00 00 01 08 02 00 00 00 90 77 53
de 00 00 00 0c 49 44 41 54 78 da 63 60 60 60 00
00 00 04 00 01 c8 ea eb f9 00 00 00 00 49 45 4e
44 ae 42 60 82
*/
