# File Server

## Concepts

- Use [Deno.open](https://deno.land/api?s=Deno.open) to read a file's content in
  chunks.
- Transform a Deno file into a
  [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).
- Use Deno's integrated HTTP server to run your own file server.

## Overview

Sending files over the network is a common requirement. As seen in the
[Fetch Data example](./fetch_data.md), because files can be of any size, it is
important to use streams in order to prevent having to load entire files into
memory.

## Example

**Command:** `deno run --allow-read=. --allow-net file_server.ts`

```ts
// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
console.log("File server running on http://localhost:8080/");

for await (const conn of server) {
  handleHttp(conn).catch(console.error);
}

async function handleHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // Use the request pathname as filepath
    const url = new URL(requestEvent.request.url);
    const filepath = decodeURIComponent(url.pathname);

    // Try opening the file
    let file;
    try {
      file = await Deno.open("." + filepath, { read: true });
    } catch {
      // If the file cannot be opened, return a "404 Not Found" response
      const notFoundResponse = new Response("404 Not Found", { status: 404 });
      await requestEvent.respondWith(notFoundResponse);
      continue;
    }

    // Build a readable stream so the file doesn't have to be fully loaded into
    // memory while we send it
    const readableStream = file.readable;

    // Build and send the response
    const response = new Response(readableStream);
    await requestEvent.respondWith(response);
  }
}
```

## Using the `std/http` file server

The Deno standard library provides you with a
[file server](https://jsr.io/@std/http/doc/file_server/~) so that you don't have
to write your own.

To use it, first install the remote script to your local file system. This will
install the script to the Deno installation root's bin directory, e.g.
`/home/alice/.deno/bin/file_server`.

```shell
deno install --allow-net --allow-read jsr:@std/http@^0/file_server
```

You can now run the script with the simplified script name. Run it:

```shell
$ file_server .
Listening on http://0.0.0.0:4507/
```

Now go to [http://0.0.0.0:4507/](http://0.0.0.0:4507/) in your web browser to
see your local directory contents.

The complete list of options are available via:

```shell
file_server --help
```

Example output:

```console
Deno File Server
    Serves a local directory in HTTP.
  INSTALL:
    deno install --allow-net --allow-read jsr:@std/http/file_server
  USAGE:
    file_server [path] [options]
  OPTIONS:
    -h, --help          Prints help information
    -p, --port <PORT>   Set port
    --cors              Enable CORS via the "Access-Control-Allow-Origin" header
    --host     <HOST>   Hostname (default is 0.0.0.0)
    -c, --cert <FILE>   TLS certificate file (enables TLS)
    -k, --key  <FILE>   TLS key file (enables TLS)
    --no-dir-listing    Disable directory listing
    All TLS options are required when one is provided.
```
