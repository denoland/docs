/**
 * @title Read from stdin
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.stdin} Doc: Deno.stdin
 * @resource {https://jsr.io/@std/streams/doc/~/TextLineStream} Doc: @std/streams TextLineStream
 * @group System
 *
 * Command line tools that work in pipelines read their input from stdin.
 * Try this example with some piped input, for instance:
 * echo "hello" | deno run https://docs.deno.com/examples/scripts/reading_stdin.ts
 */

// For interactive prompts there are global helpers, no stream handling
// needed. (They return null when stdin is not a terminal.)
if (Deno.stdin.isTerminal()) {
  const name = prompt("What is your name?");
  console.log(`Hello, ${name}!`);
}

// To read all of stdin as a string, collect its readable stream with a
// Response. This waits until the input ends.
const input = await new Response(Deno.stdin.readable).text();
console.log(`Read ${input.length} characters`);

// For line-by-line processing, decode the byte stream into text and split
// it into lines with the standard library. This processes input as it
// arrives instead of waiting for the end, which suits large or endless
// pipelines.
import { TextLineStream } from "jsr:@std/streams";

// deno-lint-ignore no-unused-vars
async function processLines() {
  const lines = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lines) {
    console.log(`line: ${line}`);
  }
}

// Note that a stream can only be consumed once: pick one of the approaches
// above per program run.
