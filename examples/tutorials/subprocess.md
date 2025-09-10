---
title: "Creating a subprocess"
description: "A guide to working with subprocesses in Deno. Learn how to spawn processes, handle input/output streams, manage process lifecycles, and implement inter-process communication patterns safely."
url: /examples/subprocess_tutorial/
oldUrl:
  - /runtime/manual/examples/subprocess/
  - /runtime/tutorials/subprocess/
---

## Concepts

- Deno is capable of spawning a subprocess via
  [Deno.Command](https://docs.deno.com/api/deno/~/Deno.Command).
- `--allow-run` permission is required to spawn a subprocess.
- Spawned subprocesses do not run in a security sandbox.
- Communicate with the subprocess via the
  [stdin](https://docs.deno.com/api/deno/~/Deno.stdin),
  [stdout](https://docs.deno.com/api/deno/~/Deno.stdout) and
  [stderr](https://docs.deno.com/api/deno/~/Deno.stderr) streams.

## Simple example

This example is the equivalent of running `echo "Hello from Deno!"` from the
command line.

```ts title="subprocess_simple.ts"
// define command used to create the subprocess
const command = new Deno.Command("echo", {
  args: [
    "Hello from Deno!",
  ],
});

// create subprocess and collect output
const { code, stdout, stderr } = await command.output();

console.assert(code === 0);
console.log(new TextDecoder().decode(stdout));
console.log(new TextDecoder().decode(stderr));
```

Run it:

```shell
$ deno run --allow-run=echo ./subprocess_simple.ts
Hello from Deno!
```

## Security

The `--allow-run` permission is required for creation of a subprocess. Be aware
that subprocesses are not run in a Deno sandbox and therefore have the same
permissions as if you were to run the command from the command line yourself.

## Communicating with subprocesses

By default when you use `Deno.Command()` the subprocess inherits `stdin`,
`stdout` and `stderr` of the parent process. If you want to communicate with a
started subprocess you must use the `"piped"` option.

## Piping to files

This example is the equivalent of running `yes &> ./process_output` in bash.

```ts title="subprocess_piping_to_files.ts"
import {
  mergeReadableStreams,
} from "jsr:@std/streams@1.0.0-rc.4/merge-readable-streams";

// create the file to attach the process to
const file = await Deno.open("./process_output.txt", {
  read: true,
  write: true,
  create: true,
});

// start the process
const command = new Deno.Command("yes", {
  stdout: "piped",
  stderr: "piped",
});

const process = command.spawn();

// example of combining stdout and stderr while sending to a file
const joined = mergeReadableStreams(
  process.stdout,
  process.stderr,
);

// returns a promise that resolves when the process is killed/closed
joined.pipeTo(file.writable).then(() => console.log("pipe join done"));

// manually stop process "yes" will never end on its own
setTimeout(() => {
  process.kill();
}, 100);
```

Run it:

```shell
$ deno run --allow-run=yes --allow-read=. --allow-write=. ./subprocess_piping_to_file.ts
```

## Reading subprocess output with convenience methods

When working with spawned subprocesses, you can use convenience methods on the
`stdout` and `stderr` streams to easily collect and parse output. These methods
are similar to those available on `Response` objects:

```ts title="subprocess_convenience_methods.ts"
const command = new Deno.Command("deno", {
  args: [
    "eval",
    "console.log(JSON.stringify({message: 'Hello from subprocess'}))",
  ],
  stdout: "piped",
  stderr: "piped",
});

const process = command.spawn();

// Use convenience methods to collect output
const stdoutText = await process.stdout.text();
const stderrText = await process.stderr.text();

console.log("stdout:", stdoutText);
console.log("stderr:", stderrText);

// Wait for the process to complete
const status = await process.status;
console.log("Exit code:", status.code);
```

Available convenience methods include:

- `.text()` - Returns the output as a UTF-8 string
- `.bytes()` - Returns the output as a `Uint8Array`
- `.arrayBuffer()` - Returns the output as an `ArrayBuffer`
- `.json()` - Parses the output as JSON and returns the parsed object

```ts title="subprocess_json_parsing.ts"
const command = new Deno.Command("deno", {
  args: ["eval", "console.log(JSON.stringify({name: 'Deno', version: '2.0'}))"],
  stdout: "piped",
});

const process = command.spawn();

// Parse JSON output directly
const jsonOutput = await process.stdout.json();
console.log("Parsed JSON:", jsonOutput); // { name: "Deno", version: "2.0" }

await process.status;
```
