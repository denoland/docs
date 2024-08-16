---
title: "Deno Namespace APIs"
oldUrl: /runtime/manual/runtime/
---

The global Deno namespace contains APIs that are not web standard, including
APIs for reading from files, opening TCP sockets, serving HTTP, and executing
subprocesses, etc.

For a full list of Deno Built-in APIs, see the
[reference](https://docs.deno.com/api/deno/~/Deno). Below we highlight some of
the most important.

## File System

The Deno runtime comes with
[various functions for working with files and directories](https://docs.deno.com/api/deno/file-system).
You will need to use --allow-read and --allow-write permissions to gain access
to the file system.

Refer to the links below for code examples of how to use the file system
functions.

- [Reading files in several different ways](https://docs.deno.com/examples/reading-files)
- [Reading files in streams](../../tutorials/file_server.md)
- [Reading a text file (`Deno.readTextFile`)](../../tutorials/read_write_files.md#reading-a-text-file)
- [Writing a text file (`Deno.writeTextFile`)](../../tutorials/read_write_files.md#writing-a-text-file)

## Network

The Deno runtime comes with
[built-in functions for dealing with connections to network ports](https://docs.deno.com/api/deno/network).

Refer to the links below for code examples for common functions.

- [Connect to the hostname and port (`Deno.connect`)](https://docs.deno.com/api/deno/~/Deno.connect)
- [Announcing on the local transport address (`Deno.listen`)](https://docs.deno.com/api/deno/~/Deno.listen)

## Subprocesses

The Deno runtime comes with
[built-in functions for spinning up subprocesses](https://docs.deno.com/api/deno/sub-process).

Refer to the links below for code samples of how to create a subprocess.

- [Creating a subprocess (`Deno.Command`)](../../tutorials/subprocess.md)

## Errors

The Deno runtime comes with
[20 error classes](https://docs.deno.com/api/deno/errors) that can be raised in
response to a number of conditions.

Some examples are:

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

They can be used as below:

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("the file was not found");
  } else {
    // otherwise re-throw
    throw error;
  }
}
```
