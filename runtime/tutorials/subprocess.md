---
title: "Creating a Subprocess"
oldUrl:
  - /runtime/manual/examples/subprocess/
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

```ts
/**
 * subprocess_simple.ts
 */

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

Be very careful using this permission as in many cases it does not provide much
security. For example:

1. Using `--allow-run` without an allow list is essentially the same as
   `--allow-all`. A script could execute the `deno` executable with full
   permissions (ex. `deno eval '<malicious code goes here>'`).
1. Using `--allow-run=... --allow-write` means a script could overwrite an
   executable on the path and execute it.
1. Using `--allow-run=... --allow-env=PATH` and any `--allow-write=...` means a
   script could modify the `PATH` to a writable location, then write an
   executable and execute it.

Even when locking down some of the scenarios listed above there are still
possible exploits (ex. when combining options with `--deny` flags). Think
through the combination of flags that you use carefully when using
`--allow-run`!

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
