/**
 * @title Reading files
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-read <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.readFile} Doc: Deno.readFile
 * @resource {https://docs.deno.com/api/deno/~/Deno.open} Doc: Deno.open
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile} Doc: Deno.FsFile
 * @group File System
 *
 * Many applications need to read files from disk. Deno provides a simple
 * interface for reading files.
 */

// The easiest way to read a file is to just read the entire contents into
// memory as bytes.
// deno-lint-ignore no-unused-vars
const bytes = await Deno.readFile("hello.txt");

// Instead of reading the file as bytes, there is a convenience function to
// read the file as a string.
// deno-lint-ignore no-unused-vars
const text = await Deno.readTextFile("hello.txt");

// Often you need more control over when what parts of the file are read.
// For this you start by opening a file to get a `Deno.FsFile` object.
const file = await Deno.open("hello.txt");

// Read some bytes from the beginning of the file. Allow up to 5 to be read but
// also note how many actually were read.
const buffer = new Uint8Array(5);
const bytesRead = await file.read(buffer);
console.log(`Read ${bytesRead} bytes`);

// You can also seek to a known location in the file and read from there.
const pos = await file.seek(6, Deno.SeekMode.Start);
console.log(`Sought to position ${pos}`);
const buffer2 = new Uint8Array(2);
const bytesRead2 = await file.read(buffer2);
console.log(`Read ${bytesRead2} bytes`);

// You can use rewind back to the start using seek as well.
await file.seek(0, Deno.SeekMode.Start);

// Make sure to close the file when you are done.
file.close();

// Synchronous reading is also supported.
Deno.readFileSync("hello.txt");
Deno.readTextFileSync("hello.txt");
const f = Deno.openSync("hello.txt");
f.seekSync(6, Deno.SeekMode.Start);
const buf = new Uint8Array(5);
f.readSync(buf);
f.close();

// The `--allow-read` permission is required to read files.
