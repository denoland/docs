---
title: "API Reference"
sidebar_title: "Overview"
pagination_next: /deploy/api/runtime-broadcast-channel
oldUrl:
  - /deploy/docs/runtime-api/
---

This is a reference for runtime APIs available on Deno Deploy. This API is very
similar to the standard [runtime API](/runtime/manual/runtime), but some APIs
are not available in the same way, given that Deno Deploy is a serverless
environment.

Please use this section of the documentation to explore available APIs on Deno
Deploy.

### Web APIs

- [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console)
- [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob)
- [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  - `fetch`
  - `Request`
  - `Response`
  - `URL`
  - `File`
  - `Blob`
- [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream)
- [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)
- [Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
  - `randomUUID()`
  - `getRandomValues()`
  - [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
  (`setTimeout`, `clearTimeout`, and `setInterval`)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
  - `ReadableStream`
  - `WritableStream`
  - `TransformStream`
- [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [Import Maps](https://docs.deno.com/runtime/manual/basics/import_maps/)
  - Note: `import maps` are currently only available via
    [deployctl](https://github.com/denoland/deployctl) or
    [deployctl GitHub Action](https://github.com/denoland/deployctl/blob/main/action/README.md)
    workflows.

### Deno APIs

> Note: only stable APIs of Deno are made available in Deploy.

- [`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env) - Interact with
  environment variables (secrets).
  - `get(key: string): string | undefined` - get the value of an environment
    variable.
  - `toObject(): { [key: string]: string }` - get all environment variables as
    an object.
- [`Deno.connect`](https://docs.deno.com/api/deno/~/Deno.connect) - Connect to
  TCP sockets.
- [`Deno.connectTls`](https://docs.deno.com/api/deno/~/Deno.connectTls) -
  Connect to TCP sockets using TLS.
- [`Deno.startTls`](https://docs.deno.com/api/deno/~/Deno.startTls) - Start TLS
  handshake from an existing TCP connection.
- [`Deno.resolveDns`](https://docs.deno.com/api/deno/~/Deno.resolveDns) - Make
  DNS queries
- File system API
  - [`Deno.cwd`](https://docs.deno.com/api/deno/~/Deno.cwd) - Get the current
    working directory
  - [`Deno.readDir`](https://docs.deno.com/api/deno/~/Deno.readDir) - Get
    directory listings
  - [`Deno.readFile`](https://docs.deno.com/api/deno/~/Deno.readFile) - Read a
    file into memory
  - [`Deno.readTextFile`](https://docs.deno.com/api/deno/~/Deno.readTextFile) -
    Read a text file into memory
  - [`Deno.open`](https://docs.deno.com/api/deno/~/Deno.open) - Open a file for
    streaming reading
  - [`Deno.stat`](https://docs.deno.com/api/deno/~/Deno.stat) - Get file system
    entry information
  - [`Deno.lstat`](https://docs.deno.com/api/deno/~/Deno.lstat) - Get file
    system entry information without following symlinks
  - [`Deno.realPath`](https://docs.deno.com/api/deno/~/Deno.realPath) - Get the
    real path of a file after resolving symlinks
  - [`Deno.readLink`](https://docs.deno.com/api/deno/~/Deno.readLink) - Get the
    target path for the given symlink

## Future support

In the future, these APIs will also be added:

- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- UDP API:
  - `Deno.connectDatagram` for outbound UDP sockets
- Customizable `fetch` options using `Deno.createHttpClient`

## Limitations

Just like the Deno CLI, we do not implement the `__proto__` object field as
specified in ECMA Script Annex B.
