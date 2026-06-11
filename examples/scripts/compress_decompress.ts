/**
 * @title Compress and decompress data
 * @difficulty beginner
 * @tags cli, deploy
 * @run -R -W <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream} MDN: CompressionStream
 * @resource {https://docs.deno.com/examples/streaming_files/} Example: Streaming file operations
 * @group Encoding
 *
 * Compressing data before storing or sending it saves space and bandwidth.
 * The web standard CompressionStream and DecompressionStream support gzip
 * and deflate with no dependencies. This example compresses a string and
 * decompresses it back.
 */

// We start with some repetitive data that compresses well.
const input = "Hello Deno! ".repeat(100);

// To compress, pipe a stream of the data through a CompressionStream and
// collect the result. Wrapping in a Response makes collecting easy.
const compressedStream = new Blob([input]).stream()
  .pipeThrough(new CompressionStream("gzip"));
const compressed = await new Response(compressedStream).bytes();
console.log(input.length, "->", compressed.length); // 1200 -> 53

// To decompress, pipe the compressed bytes through a DecompressionStream.
const decompressedStream = new Blob([compressed]).stream()
  .pipeThrough(new DecompressionStream("gzip"));
const output = await new Response(decompressedStream).text();
console.log(output === input); // true

// Both streams also support the deflate format, and deflate-raw for the
// variant without headers.
const deflated = await new Response(
  new Blob([input]).stream().pipeThrough(new CompressionStream("deflate")),
).bytes();
console.log(deflated.length); // 41

// Because these are streams, files of any size can be processed without
// loading them into memory, straight from file to file. We gzip a file on
// disk and unpack it again.
const dir = await Deno.makeTempDir();
await Deno.writeTextFile(`${dir}/large.json`, input);

// To compress a file, pipe its readable stream through a CompressionStream
// into the output file. The pipe closes both files when it finishes.
const source = await Deno.open(`${dir}/large.json`);
const gzFile = await Deno.create(`${dir}/large.json.gz`);
await source.readable
  .pipeThrough(new CompressionStream("gzip"))
  .pipeTo(gzFile.writable);

// To decompress a gzipped file, pipe it through a DecompressionStream the
// same way.
const gzipped = await Deno.open(`${dir}/large.json.gz`);
const restored = await Deno.create(`${dir}/restored.json`);
await gzipped.readable
  .pipeThrough(new DecompressionStream("gzip"))
  .pipeTo(restored.writable);

console.log((await Deno.readTextFile(`${dir}/restored.json`)) === input); // true

// Reading and writing files requires the -R and -W permissions.
await Deno.remove(dir, { recursive: true });
