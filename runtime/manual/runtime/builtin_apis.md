---
title: "Deno namespace APIs"
oldUrl: /runtime/manual/runtime/
---

The global Deno namespace contains APIs that are not web standard, including
APIs for reading from files, opening TCP sockets, serving HTTP, and executing
subprocesses, etc.

For a full list of Deno Built-in APIs, see the
[reference](https://deno.land/api?s=Deno). Below we highlight some of the most
important.

## Errors

The Deno runtime comes with [20 error classes](https://deno.land/api#Errors)
that can be raised in response to a number of conditions.

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

## File System

The Deno runtime comes with
[various functions for working with files and directories](https://deno.land/api#File_System).
You will need to use --allow-read and --allow-write permissions to gain access
to the file system.

Refer to the links below for code examples of how to use the file system
functions.

- [Reading files in several different ways](https://examples.deno.land/reading-files)
- [Reading files in streams](../../tutorials/file_server.md)
- [Reading a text file (`Deno.readTextFile`)](../../tutorials/read_write_files.md#reading-a-text-file)
- [Writing a text file (`Deno.writeTextFile`)](../../tutorials/read_write_files.md#writing-a-text-file)

## I/O

The Deno runtime comes with
[built-in functions for working with resources and I/O](https://deno.land/api#I/O).

Refer to the links below for code examples for common functions.

- [Closing resources (`Deno.close`)](https://doc.deno.land/deno/stable/~/Deno.close)
- [Seeking a certain position within the resource (`Deno.seek`)](https://doc.deno.land/deno/stable/~/Deno.seek)

## Network

The Deno runtime comes with
[built-in functions for dealing with connections to network ports](https://deno.land/api#Network).

Refer to the links below for code examples for common functions.

- [Connect to the hostname and port (`Deno.connect`)](https://doc.deno.land/deno/stable/~/Deno.connect)
- [Announcing on the local transport address (`Deno.listen`)](https://doc.deno.land/deno/stable/~/Deno.listen)

## Sub Process

The Deno runtime comes with
[built-in functions for spinning up subprocesses](https://deno.land/api#Sub_Process).

Refer to the links below for code samples of how to create a subprocess.

- [Creating a subprocess (`Deno.Command`)](../../tutorials/subprocess.md)
