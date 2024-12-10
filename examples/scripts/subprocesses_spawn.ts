/**
 * @title Subprocesses: Spawning
 * @difficulty intermediate
 * @tags cli
 * @run --allow-run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.Command} Doc: Deno.Command
 * @group System
 *
 * For more complex usecases, we don't simply want the output of some
 * command. In this case, we can spawn a subprocess and interact with
 * it.
 */

// The Deno namespace has a unified api for interacting with the outside system
// called Deno.Command. With it, we can initialize some information about the
// command but it will not be executed immediately.
const command = new Deno.Command("deno", {
  args: [
    "fmt",
    "-",
  ],
  stdin: "piped",
  stdout: "piped",
});

// In a slightly more complex case, we want to interact with a spawned
// process. To do this, we first need to spawn it.
const process = command.spawn();

// We can now pipe the input into stdin. To do this we must first get
// a writer from the stream and write to it
const writer = process.stdin.getWriter();
writer.write(new TextEncoder().encode("console.log('hello')"));
writer.releaseLock();

// We must then close stdin
await process.stdin.close();

// We can now wait for the process to output the results
const result = await process.output();
console.log(new TextDecoder().decode(result.stdout));
