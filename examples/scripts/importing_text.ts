/**
 * @title Importing text files
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://github.com/whatwg/html/issues/9444} HTLM specification proposal
 * @group Unstable APIs
 *
 * Text files can be imported in JS and TS files using the `import` keyword.
 * This makes including static data in a library much easier.
 *
 * Using this feature requires `--unstable-raw-imports` CLI flag.
 */

// File: ./main.ts

// Text files can be imported in JS and TS modules. When doing so, you need to
// specify the `type: "text"` import attribute.
import text from "./log.txt" with { type: "txt" };
console.log(text);

// Dynamic imports are also supported.
const text = await import("./log.txt", {
  with: { type: "text" },
});
console.log(text);

/* File: ./log.txt
2025-07-01 08:15:12 - Program started
2025-07-01 08:16:45 - Uploading file: summary.xls
2025-07-01 08:17:33 - Error: Invalid file format (xls)
2025-07-01 08:18:01 - Uploadinf file failed: summary.xls
*/
