/**
 * @title Pipe data into a subprocess
 * @difficulty intermediate
 * @tags cli
 * @run --allow-run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @resource {https://docs.deno.com/examples/subprocesses_spawn/} Example: Subprocesses: Spawning
 * @group System
 *
 * Many command line tools read their input from stdin. To drive such a tool
 * from a script, spawn it with a piped stdin and write data into it. This
 * example feeds lines to the sort command and streams text through cat.
 */

// Setting stdin to "piped" makes the child's stdin available as a web
// standard writable stream. The stdout is piped as well so the result can
// be collected.
const sortCommand = new Deno.Command("sort", {
  stdin: "piped",
  stdout: "piped",
});
const sortProcess = sortCommand.spawn();

// Get a writer for the child's stdin and write a few unsorted lines.
const writer = sortProcess.stdin.getWriter();
const encoder = new TextEncoder();
await writer.write(encoder.encode("banana\n"));
await writer.write(encoder.encode("apple\n"));
await writer.write(encoder.encode("cherry\n"));

// Closing the writer closes the child's stdin. This is important: sort waits
// for the end of its input before it prints anything, so forgetting this
// step would hang the program.
await writer.close();

// output() waits for the process to exit and collects its stdout.
const { stdout } = await sortProcess.output();
const sorted = new TextDecoder().decode(stdout);
console.log(sorted.trim().split("\n")); // [ "apple", "banana", "cherry" ]

// When the input already exists as a stream or an iterable, skip the manual
// writer and pipe it into stdin in one shot. ReadableStream.from turns any
// iterable into a stream, and pipeTo closes the child's stdin when the
// stream ends.
const catProcess = new Deno.Command("cat", {
  stdin: "piped",
  stdout: "piped",
}).spawn();

await ReadableStream.from(["hello from a stream\n"])
  .pipeThrough(new TextEncoderStream())
  .pipeTo(catProcess.stdin);

const catResult = await catProcess.output();
console.log(new TextDecoder().decode(catResult.stdout).trim()); // hello from a stream
