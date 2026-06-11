/**
 * @title Transform data with TransformStream
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/TransformStream} MDN: TransformStream
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough} MDN: pipeThrough
 * @group Web Standard APIs
 *
 * A TransformStream sits in the middle of a stream pipeline and rewrites
 * chunks as they pass through. You plug one in with pipeThrough. Built-in
 * helpers like TextEncoderStream and CompressionStream are transform
 * streams too. This example uppercases chunks, splits text into lines,
 * numbers them, and uses flush to deal with leftovers.
 */

// The transform callback receives each chunk and a controller. Whatever
// the callback enqueues comes out of the readable side. This one maps
// each string chunk to its uppercase form.
const upper = new TransformStream<string, string>({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

// ReadableStream.from turns an iterable into a stream, and Array.fromAsync
// collects a stream back into an array, which keeps the example compact.
const shouted = await Array.fromAsync(
  ReadableStream.from(["hello", "streams"]).pipeThrough(upper),
);
console.log(shouted); // [ "HELLO", "STREAMS" ]

// Transforms can carry state between chunks. This splitter buffers the
// tail after the last newline until the next chunk completes the line.
// The flush callback runs once the input ends, which is the moment to
// emit anything still sitting in the buffer.
function lineSplitter(): TransformStream<string, string> {
  let buffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop()!;
      for (const line of lines) controller.enqueue(line);
    },
    flush(controller) {
      if (buffer.length > 0) controller.enqueue(buffer);
    },
  });
}

// A second stateful transform numbers whatever lines flow through it.
function lineNumberer(): TransformStream<string, string> {
  let lineNumber = 0;
  return new TransformStream({
    transform(line, controller) {
      lineNumber += 1;
      controller.enqueue(`${lineNumber}: ${line}`);
    },
  });
}

// Transforms compose by chaining pipeThrough calls. Note how the chunk
// boundaries fall in the middle of words, and how charlie has no trailing
// newline, so only the flush callback can emit it.
const numbered = await Array.fromAsync(
  ReadableStream.from(["alpha\nbra", "vo\nchar", "lie"])
    .pipeThrough(lineSplitter())
    .pipeThrough(lineNumberer()),
);
console.log(numbered); // [ "1: alpha", "2: bravo", "3: charlie" ]

// Backpressure is automatic: when the consumer is slow, the transform
// callback is simply not called again until there is room downstream.
console.log("pipeline finished"); // pipeline finished
