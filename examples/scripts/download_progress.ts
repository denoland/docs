/**
 * @title Download a file with progress
 * @difficulty intermediate
 * @tags cli
 * @run -N -W <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/TransformStream} MDN: TransformStream
 * @resource {/examples/streaming_files} Example: Streaming file operations
 * @group Network
 *
 * Streaming a download straight to disk keeps memory flat no matter how big
 * the file is. A TransformStream sits in the middle of the pipe, counts the
 * bytes flowing through, and reports progress against the content-length
 * header. The chunks themselves pass through untouched.
 */

const url = "https://deno.com/favicon.ico";
const output = "favicon.ico";

const response = await fetch(url);
if (!response.ok || response.body === null) {
  throw new Error(`download failed: ${response.status}`);
}

// content-length is the total size in bytes. Servers that compress or
// stream on the fly may omit it, so treat it as optional.
const total = Number(response.headers.get("content-length") ?? "0");

let received = 0;
let lastReport = Date.now();

function report() {
  if (total > 0) {
    const percent = Math.floor((received / total) * 100);
    console.log(`${received} / ${total} bytes (${percent}%)`);
  } else {
    // Without content-length there is no percentage, only a running count.
    console.log(`${received} bytes`);
  }
}

// The transform sees every chunk on its way to the file, without copying
// or buffering anything. Reporting is throttled so a large download does
// not print thousands of lines.
const progress = new TransformStream<Uint8Array, Uint8Array>({
  transform(chunk, controller) {
    received += chunk.byteLength;
    const now = Date.now();
    if (now - lastReport >= 100) {
      lastReport = now;
      report();
    }
    controller.enqueue(chunk);
  },
});

// Deno.open returns a file whose writable property is a standard
// WritableStream, so the response body pipes directly into it. pipeTo
// closes the file when the stream ends.
const file = await Deno.open(output, {
  write: true,
  create: true,
  truncate: true,
});
await response.body.pipeThrough(progress).pipeTo(file.writable);

// One final report, because the throttle may have skipped the last chunk.
report();
console.log(`saved ${output}`);

// With node:fs the same pipe works through the web stream bridge:
// Readable.fromWeb(response.body).pipe(createWriteStream(output)).
//
//   deno run -N -W download_progress.ts
//   15406 / 15406 bytes (100%)
//   saved favicon.ico
//
// Small files arrive in a few chunks, so only the final report prints.
// Larger downloads print a progress line roughly every 100 milliseconds.
