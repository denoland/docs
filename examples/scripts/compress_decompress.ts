/**
 * @title Compress and decompress data
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream} MDN: CompressionStream
 * @resource {https://docs.deno.com/examples/unzip_gzipped_file/} Example: Unzip gzipped file
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

// Because these are streams, large files can be compressed on the fly
// without loading them into memory, straight from file to file.
