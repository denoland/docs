/**
 * @title Stream JSON Lines data
 * @difficulty beginner
 * @tags cli, deploy
 * @run <url>
 * @resource {https://jsr.io/@std/json} Doc: @std/json
 * @resource {https://jsonlines.org} Spec: JSON Lines
 * @group Encoding
 *
 * JSON Lines, also called NDJSON, stores one JSON value per line. Log
 * files, data exports and streaming APIs use it because each line can be
 * processed on its own, without parsing the whole document. The Standard
 * Library provides stream transforms for both directions in jsr:@std/json.
 */
import { JsonParseStream, JsonStringifyStream } from "jsr:@std/json";
import { TextLineStream } from "jsr:@std/streams";

// This is a typical log in JSON Lines format, one JSON object per line.
const ndjson = `{"level":"info","message":"server started"}
{"level":"warn","message":"high memory usage"}
{"level":"error","message":"request failed"}
`;

// To consume it, build a pipeline. TextLineStream splits the text into
// lines and JsonParseStream parses each line into a value. Any readable
// stream of bytes works as a source, such as a file or a response body.
const entries = new Blob([ndjson]).stream()
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream())
  .pipeThrough(new JsonParseStream());

// Each entry arrives as soon as its line is complete, so a process can
// react to the first record before the last one even exists.
for await (const entry of entries) {
  console.log(entry);
}
//- { level: "info", message: "server started" }
//- { level: "warn", message: "high memory usage" }
//- { level: "error", message: "request failed" }

// To produce JSON Lines, pipe values through a JsonStringifyStream. Every
// chunk it emits is one JSON text followed by a newline character, ready
// to append to a file or send over a socket.
const events = [
  { id: 1, type: "click" },
  { id: 2, type: "scroll" },
];
const lines = ReadableStream.from(events)
  .pipeThrough(new JsonStringifyStream());

// We trim each chunk before logging because console.log adds its own
// newline.
for await (const line of lines) {
  console.log(line.trimEnd());
}
//- {"id":1,"type":"click"}
//- {"id":2,"type":"scroll"}
