/**
 * @title Unzip gzipped file
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-write --allow-read <url>
 * @group File Systm
 *
 * An example of how to decompress a gzipped file and save it to disk.
 */


// Open the gzipped file for reading
const file = await Deno.open("large_file.json.gz");

// Create a new file to write the decompressed data
const outputPath = await Deno.create("large_file.json");

// Get the writable stream of the output file
const writableStream = (outputPath).writable;

// Create a decompression stream for gzip format
const stream = new DecompressionStream("gzip");

// Pipe the readable stream of the gzipped file through the decompression stream and then to the writable stream of the output file
file.readable.pipeThrough(stream).pipeTo(writableStream);
