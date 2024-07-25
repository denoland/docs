---
title: "File system APIs"
oldUrl:
  - /deploy/docs/runtime-fs/
---

Deno Deploy supports a limited set of the file system APIs available in Deno.
These file system APIs can access static files from your deployments. Static
files are for example:

- The files in your GitHub repository, if you deploy via the GitHub integration.
- The entrypoint file in a playground deployment.

The APIs that are available are:

- [Deno.cwd](#denocwd)
- [Deno.readDir](#denoreaddir)
- [Deno.readFile](#denoreadfile)
- [Deno.readTextFile](#denoreadtextfile)
- [Deno.open](#denoopen)
- [Deno.stat](#denostat)
- [Deno.lstat](#denolstat)
- [Deno.realPath](#denorealpath)
- [Deno.readLink](#denoreadlink)

## Deno.cwd

`Deno.cwd()` returns the current working directory of your deployment. It is
located at the root of your deployment's root directory. For example, if you
deployed via the GitHub integration, the current working directory is the root
of your GitHub repository.

## Deno.readDir

`Deno.readDir()` allows you to list the contents of a directory.

The function is fully compatible with
[Deno](https://doc.deno.land/deno/stable/~/Deno.readDir).

```ts
function Deno.readDir(path: string | URL): AsyncIterable<DirEntry>
```

The path can be a relative or absolute. It can also be a `file:` URL.

### Example

This example lists the contents of a directory and returns this list as a JSON
object in the response body.

```js
async function handler(_req) {
  // List the posts in the `blog` directory located at the root
  // of the repository.
  const posts = [];
  for await (const post of Deno.readDir(`./blog`)) {
    posts.push(post);
  }

  // Return JSON.
  return new Response(JSON.stringify(posts, null, 2), {
    headers: {
      "content-type": "application/json",
    },
  });
}

Deno.serve(handler);
```

## Deno.readFile

`Deno.readFile()` allows you to read a file fully into memory.

The function definition is similar to
[Deno](https://doc.deno.land/deno/stable/~/Deno.readFile), but it doesn't
support
[`ReadFileOptions`](https://doc.deno.land/deno/stable/~/Deno.ReadFileOptions)
for the time being. Support will be added in the future.

```ts
function Deno.readFile(path: string | URL): Promise<Uint8Array>
```

The path can be a relative or absolute. It can also be a `file:` URL.

### Example

This example reads the contents of a file into memory as a byte array, then
returns it as the response body.

```js
async function handler(_req) {
  // Let's read the README.md file available at the root
  // of the repository to explore the available methods.

  // Relative paths are relative to the root of the repository
  const readmeRelative = await Deno.readFile("./README.md");
  // Absolute paths.
  // The content of the repository is available under at Deno.cwd().
  const readmeAbsolute = await Deno.readFile(`${Deno.cwd()}/README.md`);
  // File URLs are also supported.
  const readmeFileUrl = await Deno.readFile(
    new URL(`file://${Deno.cwd()}/README.md`),
  );

  // Decode the Uint8Array as string.
  const readme = new TextDecoder().decode(readmeRelative);
  return new Response(readme);
}

Deno.serve(handler);
```

> Note: to use this feature, you must link a GitHub repository to your project.

Deno Deploy supports the `Deno.readFile` API to read static assets from the file
system. This is useful for serving static assets such as images, stylesheets,
and JavaScript files. This guide demonstrates how to use this feature.

Imagine the following file structure on a GitHub repository:

```console
├── mod.ts
└── style.css
```

The contents of `mod.ts`:

```ts
async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // This is how the server works:
  // 1. A request comes in for a specific asset.
  // 2. We read the asset from the file system.
  // 3. We send the asset back to the client.

  // Check if the request is for style.css.
  if (pathname.startsWith("/style.css")) {
    // Read the style.css file from the file system.
    const file = await Deno.readFile("./style.css");
    // Respond to the request with the style.css file.
    return new Response(file, {
      headers: {
        "content-type": "text/css",
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>Example</h1>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

Deno.serve(handleRequest);
```

The path provided to the
[`Deno.readFile`](https://docs.deno.com/api/deno/~/Deno.readFile) API is
relative to the root of the repository. You can also specify absolute paths, if
they are inside `Deno.cwd`.

## Deno.readTextFile

This function is similar to [Deno.readFile](#Deno.readFile) except it decodes
the file contents as a UTF-8 string.

```ts
function Deno.readTextFile(path: string | URL): Promise<string>
```

### Example

This example reads a text file into memory and returns the contents as the
response body.

```js
async function handler(_req) {
  const readme = await Deno.readTextFile("./README.md");
  return new Response(readme);
}

Deno.serve(handler);
```

## Deno.open

`Deno.open()` allows you to open a file, returning a file handle. This file
handle can then be used to read the contents of the file. See
[`Deno.File`](#denofile) for information on the methods available on the file
handle.

The function definition is similar to
[Deno](https://doc.deno.land/deno/stable/~/Deno.open), but it doesn't support
[`OpenOptions`](https://doc.deno.land/deno/stable/~/Deno.OpenOptions) for the
time being. Support will be added in the future.

```ts
function Deno.open(path: string | URL): Promise<Deno.File>
```

The path can be a relative or absolute. It can also be a `file:` URL.

### Example

This example opens a file, and then streams the content as the response body.

```js
async function handler(_req) {
  // Open the README.md file available at the root of the repository.
  const file = await Deno.open("./README.md");

  // Use the `readable` property, which is a `ReadableStream`. This will
  // automatically close the file handle when the response is done sending.
  return new Response(file.readable);
}

Deno.serve(handler);
```

## Deno.File

`Deno.File` is a file handle returned from [`Deno.open()`](#denoopen). It can be
used to read chunks of the file using the `read()` method. The file handle can
be closed using the `close()` method.

The interface is similar to
[Deno](https://doc.deno.land/deno/stable/~/Deno.File), but it doesn't support
writing to the file, or seeking. Support for the latter will be added in the
future.

```ts
class File {
  readonly rid: number;

  close(): void;
  read(p: Uint8Array): Promise<number | null>;
}
```

The path can be a relative or absolute. It can also be a `file:` URL.

## Deno.File#read()

The read method is used to read a chunk of the file. It should be passed a
buffer to read the data into. It returns the number of bytes read or `null` if
the end of the file has been reached.

```ts
function read(p: Uint8Array): Promise<number | null>;
```

### Deno.File#close()

The close method is used to close the file handle. Closing the handle will
interrupt all ongoing reads.

```ts
function close(): void;
```

## Deno.stat

`Deno.stat()` reads a file system entry's metadata. It returns a
[`Deno.FileInfo`](#fileinfo) object. Symlinks are followed.

The function definition is the same as
[Deno](https://doc.deno.land/deno/stable/~/Deno.stat). It does not return
modification time, access time, or creation time values.

```ts
function Deno.stat(path: string | URL): Promise<Deno.FileInfo>
```

The path can be a relative or absolute. It can also be a `file:` URL.

### Example

This example gets the size of a file, and returns the result as the response
body.

```js
async function handler(_req) {
  // Get file info of the README.md at the root of the repository.
  const info = await Deno.stat("./README.md");

  // Get the size of the file in bytes.
  const size = info.size;

  return new Response(`README.md is ${size} bytes large`);
}

Deno.serve(handler);
```

## Deno.lstat

`Deno.lstat()` is similar to `Deno.stat()`, but it does not follow symlinks.

The function definition is the same as
[Deno](https://doc.deno.land/deno/stable/~/Deno.lstat). It does not return
modification time, access time, or creation time values.

```ts
function Deno.lstat(path: string | URL): Promise<Deno.FileInfo>
```

The path can be a relative or absolute. It can also be a `file:` URL.

## Deno.FileInfo

The `Deno.FileInfo` interface is used to represent a file system entry's
metadata. It is returned by the [`Deno.stat()`](#denostat) and
[`Deno.lstat()`](#denolstat) functions. It can represent either a file, a
directory, or a symlink.

In Deno Deploy, only the file type, and size properties are available. The size
property behaves the same way it does on Linux.

```ts
interface FileInfo {
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  size: number;
}
```

## Deno.realPath

`Deno.realPath()` returns the resolved absolute path to a file after following
symlinks.

The function definition is the same as
[Deno](https://doc.deno.land/deno/stable/~/Deno.realPath).

```ts
function Deno.realPath(path: string | URL): Promise<string>
```

The path can be a relative or absolute. It can also be a `file:` URL.

### Example

This example calls `Deno.realPath()` to get the absolute path of a file in the
root of the repository. The result is returned as the response body.

```ts
async function handler(_req) {
  const path = await Deno.realPath("./README.md");

  return new Response(`The fully resolved path for ./README.md is ${path}`);
}

Deno.serve(handler);
```

## Deno.readLink

`Deno.readLink()` returns the target path for a symlink.

The function definition is the same as
[Deno](https://doc.deno.land/deno/stable/~/Deno.readLink).

```ts
function Deno.readLink(path: string | URL): Promise<string>
```

The path can be a relative or absolute. It can also be a `file:` URL.

### Example

This example calls `Deno.readLink()` to get the absolute path of a file in the
root of the repository. The result is returned as the response body.

```ts
async function handler(_req) {
  const path = await Deno.readLink("./my_symlink");

  return new Response(`The target path for ./my_symlink is ${path}`);
}

Deno.serve(handler);
```
