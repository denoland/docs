# Fetch Data

## Concepts

- Like browsers, Deno implements web standard APIs - such as
  [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- Deno is secure by default, meaning explicit permission must be granted to
  access the network.
- See also: Deno's [permissions](../manual/basics/permissions.md) model.

## Overview

When building a web application developers will usually need to retrieve data
from somewhere else on the web. This works no differently in Deno than in any
other JavaScript application, using the `fetch()` method. For more information
read the
[MDN documentation on fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

The difference with Deno occurs when running a script which makes a call over
the web. Deno is secure by design which means access to IO (Input / Output) is
prohibited by default. To make a call over the web Deno must be explicitly told
it is ok to do so. This is achieved by adding the `--allow-net` flag to the
`deno run` command.

## Example

**Command:** `deno run --allow-net fetch.ts`

```js
/**
 * Output: JSON Data
 */
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();

console.log(jsonData);

/**
 * Output: HTML Data
 */
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();

console.log(textData);

/**
 * Output: Error Message
 */
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```

## Files and Streams

Like in browsers, sending and receiving large files is possible thanks to the
[Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).
[`Deno.FsFile`](https://deno.land/api?s=Deno.FsFile) API provides two
properties: [`readable`](https://deno.land/api?s=Deno.FsFile#prop_readable) and
[`writable`](https://deno.land/api?s=Deno.FsFile#prop_writable), which can be
used to convert a Deno file into a writable or readable stream.

**Command:** `deno run --allow-read --allow-write --allow-net fetch_file.ts`

```ts
/**
 * Receiving a file
 */
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });

  await fileResponse.body.pipeTo(file.writable);
}

/**
 * Sending a file
 */
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});
```
