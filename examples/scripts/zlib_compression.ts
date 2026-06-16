/**
 * @title Compress data with node:zlib
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://docs.deno.com/api/node/zlib/} Doc: node:zlib
 * @resource {/examples/compress_decompress/} Example: Compress and decompress data
 * @group Encoding
 *
 * The node:zlib module is built into Deno and offers more codecs and
 * options than the web standard streams, including brotli and synchronous
 * one-shot helpers. For simple gzip and deflate streaming, the web
 * standard CompressionStream in /examples/compress_decompress/ needs no
 * imports at all.
 */
import {
  brotliCompressSync,
  brotliDecompressSync,
  gunzipSync,
  gzip,
  gzipSync,
} from "node:zlib";
import { promisify } from "node:util";

// We compress some repetitive data, which compresses well.
const input = new TextEncoder().encode("Hello Deno! ".repeat(100));

// To compress a buffer in one call, use gzipSync. The result is a Buffer,
// which is a Uint8Array subclass.
const gzipped = gzipSync(input);
console.log(input.length, "->", gzipped.length); // 1200 -> 47

// To decompress, use gunzipSync. The round trip restores the exact bytes.
const restored = gunzipSync(gzipped);
console.log(new TextDecoder().decode(restored).slice(0, 11)); // Hello Deno!
console.log(restored.length === input.length); // true

// The sync functions block the event loop while they run. In a server,
// promisify the callback variant and await it instead.
const gzipAsync = promisify(gzip);
const gzipped2 = await gzipAsync(input);
console.log(gzipped2.length); // 47

// node:zlib also implements brotli, which CompressionStream does not
// offer. Brotli usually compresses text harder than gzip.
const brotli = brotliCompressSync(input);
console.log(brotli.length); // 30
console.log(brotliDecompressSync(brotli).length); // 1200
