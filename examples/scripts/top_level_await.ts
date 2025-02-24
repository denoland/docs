/**
 * @title Await: CommonJS
 * @difficulty beginner
 * @tags cli
 * @resource {https://docs.deno.com/api/deno/~/Deno.readTextFile} Doc: Deno.readTextFile
 * @run <url>
 * @group Basics
 *
 * Example of how top-level await can be used by default in Deno. This example would assist in migrating from NodeJS (CommonJS) to Deno.
 */

// File: ./node-await.ts

// This example is what you may be used to with NodeJS when using CommonJS modules.
// Notice that for "await" to be used in this example, it must be wrapped in an "async" function.
const fs = require("node:fs");

async function readFile() {
  try {
    const data = await fs.promises.readFile("example.txt", "utf8");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readFile();

// File: ./deno-await.ts

// This is the same example as above, but with Deno.
// Notice that as well as being able to use "await" outside of an "async" function, we can also make use of Deno's Filesystem API.
try {
  const data = await Deno.readTextFile("example.txt");
  console.log(data);
} catch (err) {
  console.error(err);
}
