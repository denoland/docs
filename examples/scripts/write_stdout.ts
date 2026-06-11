/**
 * @title Write to stdout
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.stdout} Doc: Deno.stdout
 * @resource {https://docs.deno.com/examples/reading_stdin/} Example: Read from stdin
 * @group System
 *
 * console.log is fine for debugging, but command line tools often need
 * precise control over standard output: no forced newline, raw bytes, or
 * piping a whole stream. This example shows each approach.
 */

// Deno.stdout accepts raw bytes. Unlike console.log, nothing is appended,
// so the two writes below land on the same line.
const encoder = new TextEncoder();
await Deno.stdout.write(encoder.encode("Hello, "));
await Deno.stdout.write(encoder.encode("World!\n")); // Hello, World!

// A single low-level write call may write fewer bytes than given. The web
// standard writer on Deno.stdout guarantees the whole chunk is written.
// Release the lock afterwards so other code can use stdout again.
const writer = Deno.stdout.writable.getWriter();
await writer.write(encoder.encode("All bytes written\n"));
writer.releaseLock();

// There is a synchronous variant of the low-level write as well.
Deno.stdout.writeSync(encoder.encode("Sync write\n"));

// A readable stream can be piped to stdout directly. Prevent the pipe from
// closing stdout if the program continues.
const stream = ReadableStream.from(["Streamed to stdout\n"])
  .pipeThrough(new TextEncoderStream());
await stream.pipeTo(Deno.stdout.writable, { preventClose: true });

// Code written for Node.js uses process.stdout, which works in Deno too
// and accepts strings directly.
import process from "node:process";
process.stdout.write("Via process.stdout\n");

// Errors and diagnostics belong on stderr instead, so they do not corrupt
// output that is being piped to another program.
await Deno.stderr.write(encoder.encode("A diagnostic message\n"));
