# Creating a Subprocess

## Concepts

- Deno is capable of spawning a subprocess via
  [Deno.Command](https://deno.land/api?s=Deno.Command).
- `--allow-run` permission is required to spawn a subprocess.
- Spawned subprocesses do not run in a security sandbox.
- Communicate with the subprocess via the
  [stdin](https://deno.land/api?s=Deno.stdin),
  [stdout](https://deno.land/api?s=Deno.stdout) and
  [stderr](https://deno.land/api?s=Deno.stderr) streams.

## Simple example

This example is the equivalent of running `'echo hello'` from the command line.

```ts
/**
 * subprocess_simple.ts
 */

// define command used to create the subprocess
const command = new Deno.Command(Deno.execPath(), {
  args: [
    "eval",
    "console.log('hello'); console.error('world')",
  ],
});

// create subprocess and collect output
const { code, stdout, stderr } = await command.output();

console.assert(code === 0);
console.assert("world\n" === new TextDecoder().decode(stderr));
console.log(new TextDecoder().decode(stdout));
```

Run it:

```shell
$ deno run --allow-run --allow-read ./subprocess_simple.ts
hello
```

## Security

The `--allow-run` permission is required for creation of a subprocess. Be aware
that subprocesses are not run in a Deno sandbox and therefore have the same
permissions as if you were to run the command from the command line yourself.

## Communicating with subprocesses

By default when you use `Deno.Command()` the subprocess inherits `stdin`,
`stdout` and `stderr` of the parent process. If you want to communicate with
started a subprocess you must use the `"piped"` option.

## Piping to files

This example is the equivalent of running `yes &> ./process_output` in bash.

```ts
/**
 * subprocess_piping_to_file.ts
 */

import {
  mergeReadableStreams,
} from "jsr:std/streams@^0/merge_readable_streams.ts";

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
$ deno run --allow-run --allow-read --allow-write ./subprocess_piping_to_file.ts
```
