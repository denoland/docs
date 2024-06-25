---
title: 'An Implementation of the Unix "cat" Program'
---

## Concepts

- Use the Deno runtime API to output the contents of a file to the console.
- [Deno.args](https://deno.land/api?s=Deno.args) accesses the command line
  arguments.
- [Deno.open](https://deno.land/api?s=Deno.open) is used to get a handle to a
  file.
- [Deno.stdout.writable](https://deno.land/api?s=Deno.stdout.writable) is used
  to get a writable stream to the console standard output.
- [Deno.FsFile.readable](https://deno.land/api?s=Deno.FsFile#prop_readable) is
  used to get a readable stream from the file. (This readable stream closes the
  file when it is finished reading, so it is not necessary to close the file
  explicitly.)
- Modules can be run directly from remote URLs.

## Example

In this program each command-line argument is assumed to be a filename, the file
is opened, and printed to stdout (e.g. the console).

```ts
/**
 * cat.ts
 */
for (const filename of Deno.args) {
  const file = await Deno.open(filename);
  await file.readable.pipeTo(Deno.stdout.writable, { preventClose: true });
}
```

To run the program:

```shell
deno run --allow-read https://deno.land/std/examples/cat.ts /etc/passwd
```
