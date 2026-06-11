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

// A single write call may write fewer bytes than given. The standard
// library helper retries until the whole buffer is written.
import { writeAll } from "jsr:@std/io/write-all";
await writeAll(Deno.stdout, encoder.encode("All bytes written\n"));

// There is a synchronous variant as well.
Deno.stdout.writeSync(encoder.encode("Sync write\n"));

// Stdout is also a WritableStream, so a readable stream can be piped to it
// directly. Prevent the pipe from closing stdout if the program continues.
const stream = ReadableStream.from(["Streamed to stdout\n"])
  .pipeThrough(new TextEncoderStream());
await stream.pipeTo(Deno.stdout.writable, { preventClose: true });

// Errors and diagnostics belong on stderr instead, so they do not corrupt
// output that is being piped to another program.
await Deno.stderr.write(encoder.encode("A diagnostic message\n"));
