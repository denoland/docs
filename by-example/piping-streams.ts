/**
 * @title Piping Streams
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net --allow-read --allow-write <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream} MDN: ReadableStream
 * @resource {/examples/tcp-listener.ts} Example: TCP Listener
 * @group Network
 *
 * Deno implements web-standard streams which comes with many advantages. One of the most useful
 * features of streams is how they can be piped to and from different sources.
 */

// A common usecase for streams is downloading files without buffering the whole file in memory.
// First, we open a file we want to write to
const download = await Deno.open("example.html", { create: true, write: true });

// Now let's make a request to a web page
const req = await fetch("https://examples.deno.land");

// We can pipe this response straight into the file. In a more realistic example, we would
// handle a bad request, but here we'll just use the nullish coalescing operator. Instead of
// opening the file and manually piping the fetch body to it, we could also just use `Deno.writeFile`.
req.body?.pipeTo(download.writable);

// Pipes can connect a lot of things. For example, we could pipe the file we just downloaded into
// stdout. We could also pipe our streams through transformers to get a more interesting result. In this
// case, we will pipe our file through a stream which will highlight all "<" characters in the terminal.

// First we will import a utility from the standard library to help us with this.
import { bgBrightYellow } from "jsr:@std/fmt/colors";

// Then we will create a transform stream utility class
class HighlightTransformStream extends TransformStream<string, string> {
  constructor() {
    super({
      transform: (chunk, controller) => {
        controller.enqueue(chunk.replaceAll("<", bgBrightYellow("<")));
      },
    });
  }
}

// Let's open our file for reading
const example = await Deno.open("example.html", { read: true });

// Now we can pipe the result from the file, into a TextDecoderStream, into our custom transform class,
// back through a TextEncoderStream, and finally into stdout
await example.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new HighlightTransformStream())
  .pipeThrough(new TextEncoderStream())
  .pipeTo(Deno.stdout.writable);
