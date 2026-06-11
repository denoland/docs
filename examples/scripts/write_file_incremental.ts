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

// Every open file exposes a web standard WritableStream. Its writer
// guarantees each chunk is fully written before the promise resolves.
const encoder = new TextEncoder();
const writer = file.writable.getWriter();
await writer.write(encoder.encode("line 1\n"));
await writer.write(encoder.encode("line 2\n"));

// Closing the writer also closes the file.
await writer.close();
console.log(await Deno.readTextFile(`${dir}/log.txt`)); // line 1\nline 2\n

// To append to an existing file instead of starting at the beginning, open
// it with the append option.
const log = await Deno.open(`${dir}/log.txt`, { append: true });
const appender = log.writable.getWriter();
await appender.write(encoder.encode("line 3\n"));
await appender.close();

// Any readable stream can also be piped into the file directly, and the
// pipe closes the file for you.
const source = ReadableStream.from(["streamed ", "content\n"])
  .pipeThrough(new TextEncoderStream());
const target = await Deno.open(`${dir}/stream.txt`, {
  write: true,
  create: true,
});
await source.pipeTo(target.writable);
console.log(await Deno.readTextFile(`${dir}/stream.txt`)); // streamed content

// The Node.js API offers the same operations. appendFile adds to a file in
// one call, and createWriteStream is the classic incremental writer used
// by many npm packages.
import { appendFile } from "node:fs/promises";
await appendFile(`${dir}/log.txt`, "line 4\n");

import { createWriteStream } from "node:fs";
import { finished } from "node:stream/promises";
const nodeStream = createWriteStream(`${dir}/node.txt`);
nodeStream.write("written with ");
nodeStream.write("node:fs\n");
nodeStream.end();
await finished(nodeStream);
console.log(await Deno.readTextFile(`${dir}/node.txt`)); // written with node:fs

// Reading and writing files requires the -R and -W permissions.
await Deno.remove(dir, { recursive: true });
