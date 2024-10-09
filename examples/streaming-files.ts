/**
 * @title Streaming file operations
 * @difficulty intermediate
 * @tags cli
 * @run --allow-read --allow-write <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.open} Doc: Deno.open
 * @resource {https://docs.deno.com/api/deno/~/Deno.FsFile} Doc: Deno.FsFile
 * @group File System
 *
 * Sometimes we need more granular control over file operations.
 * Deno provides a low level interface to file operations that
 * may be used for this purpose.
 */

// For our first example we will demonstrate using a writeable stream.
// To handle any low level file operations we must first open the file.
const output = await Deno.open("example.txt", {
  create: true,
  append: true,
});

// We are now able to obtain a writer from the output.
// This automatically handles closing the file when done.
const outputWriter = output.writable.getWriter();

// Before we do anything with the writer, we should make sure it's ready.
await outputWriter.ready;

// Let's write some text to the file
const outputText = "I love Deno!";
const encoded = new TextEncoder().encode(outputText);
await outputWriter.write(encoded);

// Now we close the write stream (and the file)
await outputWriter.close();

// For our next example, let's read the text from the file!
const input = await Deno.open("example.txt");

// Let's get a reader from the input
const inputReader = input.readable.getReader();
const decoder = new TextDecoder();

// Let's read each chunk from the file
// and print it to the console.
let done = false;
do {
  const result = await inputReader.read();
  done = result.done;

  if (result.value) {
    console.log(`Read chunk: ${decoder.decode(result.value)}`);
  }
} while (!done);
