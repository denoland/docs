/**
 * @title Read input line by line with node:readline
 * @difficulty beginner
 * @tags cli
 * @run -R -W <url>
 * @resource {https://docs.deno.com/api/node/readline/} Doc: node:readline
 * @resource {https://docs.deno.com/examples/reading_stdin/} Example: Read from stdin
 * @group System
 *
 * The node:readline module reads a stream one line at a time, no matter
 * how the bytes are chunked, and it powers interactive prompts in many
 * Node.js programs. Deno supports it out of the box. This example
 * processes a file line by line and asks a question on the terminal.
 */

// We write a small file to read back, so the example is self contained.
const dir = await Deno.makeTempDir();
const path = `${dir}/access.log`;
await Deno.writeTextFile(
  path,
  "GET /index.html\nGET /styles.css\nPOST /api/login\nGET /favicon.ico\n",
);

// createInterface takes any readable stream as input. Combined with a
// file stream from node:fs it iterates the file line by line. The
// crlfDelay option makes sure Windows style \r\n line endings count as
// one line break.
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const rl = createInterface({
  input: createReadStream(path),
  crlfDelay: Infinity,
});

// The interface is an async iterable of lines, without the line breaks.
let total = 0;
let gets = 0;
for await (const line of rl) {
  total++;
  if (line.startsWith("GET ")) gets++;
  console.log(`line ${total}: ${line}`);
}
console.log(`${gets} of ${total} requests were GETs`);
// line 1: GET /index.html
// line 2: GET /styles.css
// line 3: POST /api/login
// line 4: GET /favicon.ico
// 3 of 4 requests were GETs

// The promises variant adds question, which prints a prompt and resolves
// with the user's answer. That only makes sense on a terminal, so we
// guard it the same way interactive prompts usually are. (When stdin is a
// pipe or a file, this block is skipped.)
import readline from "node:readline/promises";
import process from "node:process";

if (Deno.stdin.isTerminal()) {
  const prompter = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const name = await prompter.question("What is your name? ");
  console.log(`Hello, ${name}!`);
  prompter.close();
}

// Reading the file requires the -R permission; creating the temporary
// file requires -W.
await Deno.remove(dir, { recursive: true });
