# Read and Write Files

## Concepts

- Deno's runtime API provides the
  [Deno.readTextFile](https://deno.land/api?s=Deno.readTextFile) and
  [Deno.writeTextFile](https://deno.land/api?s=Deno.writeTextFile) asynchronous
  functions for reading and writing entire text files.
- Like many of Deno's APIs, synchronous alternatives are also available. See
  [Deno.readTextFileSync](https://deno.land/api?s=Deno.readTextFileSync) and
  [Deno.writeTextFileSync](https://deno.land/api?s=Deno.writeTextFileSync).
- Use `--allow-read` and `--allow-write` permissions to gain access to the file
  system.

## Overview

Interacting with the filesystem to read and write files is a common requirement.
Deno provides a number of ways to do this via the
[standard library](https://jsr.io/@std) and the
[Deno runtime API](https://deno.land/api).

As highlighted in the [Fetch Data example](./fetch_data.md), Deno restricts
access to Input / Output by default for security reasons. Therefore when
interacting with the filesystem the `--allow-read` and `--allow-write` flags
must be used with the `deno run` command.

## Reading a text file

The Deno runtime API makes it possible to read text files via the
`Deno.readTextFile()` method, which requires a path string or URL object. The
method returns a promise which provides access to the file's text data.

**Command:** `deno run --allow-read read.ts`

```typescript
/**
 * read.ts
 */
const text = await Deno.readTextFile("./people.json");

console.log(text);

/**
 * Output:
 *
 * [
 *   {"id": 1, "name": "John", "age": 23},
 *   {"id": 2, "name": "Sandra", "age": 51},
 *   {"id": 5, "name": "Devika", "age": 11}
 * ]
 */
```

## Writing a text file

The Deno runtime API allows developers to write text to files via the
`Deno.writeTextFile()` method, which requires a file path and text string. The
method returns a promise which resolves when the file was successfully written.

To run the command the `--allow-write` flag must be supplied to the `deno run`
command.

**Command:** `deno run --allow-write write.ts`

```typescript
/**
 * write.ts
 */
await Deno.writeTextFile("./hello.txt", "Hello World!");

console.log("File written to ./hello.txt");

/**
 * Output: File written to ./hello.txt
 */
```

You can _append_ text to a file like this:

```typescript
await Deno.writeTextFile("./hello.txt", "This text will be appended.", {
  append: true,
});
```

By combining `Deno.writeTextFile` and `JSON.stringify` you can write serialized
JSON objects to a file. This example uses synchronous `Deno.writeTextFileSync`,
but this can also be done asynchronously using `await Deno.writeTextFile`.

To execute the code, the `deno run` command needs the write flag.

**Command:** `deno run --allow-write write.ts`

```typescript
/**
 * write.ts
 */
function writeJson(path: string, data: object): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}

console.log(writeJson("./data.json", { hello: "World" }));

/**
 * Output: Written to ./data.json
 */
```
