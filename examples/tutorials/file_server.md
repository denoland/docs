---
title: "Write a file server"
url: /examples/file_server_tutorial/
oldUrl:
  - /runtime/manual/examples/file_server/
  - /runtime/tutorials/file_server/
---

A file server listens for incoming HTTP requests and serves files from the local
file system. This tutorial demonstrates how to create a simple file server using
Deno's built-in [file system APIs](/api/deno/file-system).

## Write a simple File Server

To start, create a new file called `file-server.ts`.

We'll use Deno's built in [HTTP server](/api/deno/~/Deno.serve) to listen for
incoming requests. In your new `file-server.ts` file, add the following code:

```ts title="file-server.ts"
Deno.serve(
  { hostname: "localhost", port: 8080 },
  (request) => {
    const url = new URL(request.url);
    const filepath = decodeURIComponent(url.pathname);
  },
);
```

> If you're not familiar with the `URL` object, you can learn more about it in
> the [URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL)
> documentation. The
> [decodeURIComponent function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
> is used to decode the URL-encoded path, in the case that characters have been
> percent-encoded.)

### Open a file and stream its contents

When a request is received, we'll attempt to open the file specified in the
request URL with [`Deno.open`](/api/deno/~/Deno.open).

If the requested file exists, we'll convert it into a readable stream of data
with the
[ReadableStream API](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream),
and stream its contents to the response. We don't know how large the requested
file might be, so streaming it will prevent memory issues when serving large
files or multiple requests concurrently.

If the file does not exist, we'll return a "404 Not Found" response.

In the body of the request handler, below the two variables, add the following
code:

```ts
try {
  const file = await Deno.open("." + filepath, { read: true });
  return new Response(file.readable);
} catch {
  return new Response("404 Not Found", { status: 404 });
}
```

### Run the file server

Run your new file server with the `deno run` command, allowing read access and
network access:

```shell
deno run --allow-read=. --allow-net file-server.ts
```

## Using the file server provided by the Deno Standard Library

Writing a file server from scratch is a good exercise to understand how Deno's
HTTP server works. However, writing production ready file server from scratch
can be complex and error-prone. It's better to use a tested and reliable
solution.

The Deno Standard Library provides you with a
[file server](https://jsr.io/@std/http/doc/file-server/~) so that you don't have
to write your own.

To use it, first install the remote script to your local file system:

```shell
# Deno 1.x
deno install --allow-net --allow-read jsr:@std/http@1/file-server
# Deno 2.x
deno install --global --allow-net --allow-read jsr:@std/http@1/file-server
```

> This will install the script to the Deno installation root's bin directory,
> e.g. `/home/user/.deno/bin/file-server`.

You can now run the script with the simplified script name:

```shell
$ file-server .
Listening on:
- Local: http://0.0.0.0:8000
```

To see the complete list of options available with the file server, run
`file-server --help`.

If you visit [http://0.0.0.0:8000/](http://0.0.0.0:8000/) in your web browser
you will see the contents of your local directory.

### Using the @std/http file server in a Deno project

To use the file-server in a
[Deno project](/runtime/getting_started/first_project), you can add it to your
`deno.json` file with:

```sh
deno add jsr:@std/http
```

And then import it in your project:

```ts title="file-server.ts"
import { serveDir } from "@std/http/file-server";

Deno.serve((req) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "path/to/static/files/dir",
    });
  }
  return new Response();
});
```

This code will set up an HTTP server with `Deno.serve`. When a request comes in,
it checks if the requested path starts with “/static”. If so, it serves files
from the specified directory. Otherwise, it responds with an empty response.

🦕 Now you know how to write your own simple file server, and how to use the
file-server utility provided by the Deno Standard Library. You're equipped to
tackle a whole variety of tasks - whether it’s serving static files, handling
uploads, transforming data, or managing access control - you're ready to serve
files with Deno.
