/**
 * @title Write a file incrementally
 * @difficulty beginner
 * @tags cli
 * @run -R -W <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile} Doc: Deno.FsFile
 * @resource {https://docs.deno.com/examples/writing_files/} Example: Writing files
 * @group File System
 *
 * Writing a file all at once is fine until the data is large or arrives in
 * pieces, like a download or a log. This example writes a file chunk by
 * chunk, and through a stream.
 */

// We work in a temporary directory.
const dir = await Deno.makeTempDir();

// Open a file for writing, creating it if needed.
const file = await Deno.open(`${dir}/log.txt`, {
  write: true,
  create: true,
});

// Each write call appends bytes at the current position. A single call may
// write fewer bytes than given, so for raw writes prefer the helper that
// retries until everything is written.
import { writeAll } from "jsr:@std/io/write-all";
const encoder = new TextEncoder();
await writeAll(file, encoder.encode("line 1\n"));
await writeAll(file, encoder.encode("line 2\n"));

// Close the file when done writing.
file.close();
console.log(await Deno.readTextFile(`${dir}/log.txt`)); // line 1\nline 2\n

// To append to an existing file instead of starting at the beginning, open
// it with the append option.
const log = await Deno.open(`${dir}/log.txt`, { append: true });
await writeAll(log, encoder.encode("line 3\n"));
log.close();

// A file is also a WritableStream destination. Any readable stream can be
// piped into it, and the pipe closes the file for you.
const source = ReadableStream.from(["streamed ", "content\n"])
  .pipeThrough(new TextEncoderStream());
const target = await Deno.open(`${dir}/stream.txt`, {
  write: true,
  create: true,
});
await source.pipeTo(target.writable);
console.log(await Deno.readTextFile(`${dir}/stream.txt`)); // streamed content

// Reading and writing files requires the -R and -W permissions.
await Deno.remove(dir, { recursive: true });
