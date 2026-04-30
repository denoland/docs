/**
 * @title Checking for file existence
 * @difficulty beginner
 * @tags cli, deploy
 * @run -R <url>
 * @group File System
 *
 * When creating files it can be useful to first ensure that
 * such a file doesn't already exist.
 */

// Use the Node.js-compatible `fs.exists` function for a simple check.
import { exists } from "node:fs";

exists("./example.txt", (fileExists) => {
  console.log(fileExists); // true or false
});

// For a promise-based approach, use `access` from `node:fs/promises`.
import { access } from "node:fs/promises";

try {
  await access("./example.txt");
  console.log("File exists");
} catch {
  console.log("File does not exist");
}
