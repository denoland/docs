---
last_modified: 2026-06-24
title: "Web Platform APIs"
description: "A guide to the Web Platform APIs available in Deno. Learn about fetch, events, workers, storage, and other web standard APIs, including implementation details and deviations from browser specifications."
oldUrl:
  - /runtime/manual/runtime/navigator_api/
  - /runtime/manual/runtime/web_platform_apis/
  - /runtime/manual/runtime/location_api/
  - /runtime/manual/runtime/web_storage_api/
  - /runtime/manual/runtime/workers/
---

One way Deno simplifies web and cloud development is by using standard Web
Platform APIs (like `fetch`, WebSockets and more) over proprietary APIs. This
means if you've ever built for the browser, you're likely already familiar with
Deno, and if you're learning Deno, you're also investing in your knowledge of
the web.

<a href="/api/web/" class="docs-cta runtime-cta">Explore supported Web APIs</a>

Below we'll highlight some of the standard Web APIs that Deno supports.

To check if a Web Platform API is available in Deno, you can click on
[the interface on MDN](https://developer.mozilla.org/en-US/docs/Web/API#interfaces)
and refer to
[its Browser Compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#browser_compatibility).

## fetch

The [`fetch`](/api/web/~/fetch) API can be used to make HTTP requests. It is
implemented as specified in the
[WHATWG `fetch` spec](https://fetch.spec.whatwg.org/).

### Spec deviations

- The Deno user agent does not have a cookie jar. As such, the `set-cookie`
  header on a response is not processed, or filtered from the visible response
  headers.
- Deno does not follow the same-origin policy, because the Deno user agent
  currently does not have the concept of origins, and it does not have a cookie
  jar. This means Deno does not need to protect against leaking authenticated
  data cross origin. Because of this Deno does not implement the following
  sections of the WHATWG `fetch` specification:
  - Section `3.1. 'Origin' header`.
  - Section `3.2. CORS protocol`.
  - Section `3.5. CORB`.
  - Section `3.6. 'Cross-Origin-Resource-Policy' header`.
  - `Atomic HTTP redirect handling`.
  - The `opaqueredirect` response type.
- A `fetch` with a `redirect` mode of `manual` will return a `basic` response
  rather than an `opaqueredirect` response.
- The specification is vague on how
  [`file:` URLs are to be handled](https://fetch.spec.whatwg.org/#scheme-fetch).
  Firefox is the only mainstream browser that implements fetching `file:` URLs,
  and even then it doesn't work by default. As of Deno 1.16, Deno supports
  fetching local files. See the next section for details.
- The `request` and `response` header guards are implemented, but unlike
  browsers do not have any constraints on which header names are allowed.
- The `referrer`, `referrerPolicy`, `mode`, `credentials`, `cache`, `integrity`,
  `keepalive`, and `window` properties and their relevant behaviours in
  `RequestInit` are not implemented. The relevant fields are not present on the
  [`Request`](/api/web/~/Request) object.
- Request body upload streaming is supported (on HTTP/1.1 and HTTP/2). Unlike
  the current fetch proposal, the implementation supports duplex streaming.
- The `set-cookie` header is not concatenated when iterated over in the
  `headers` iterator. This behaviour is in the
  [process of being specified](https://github.com/whatwg/fetch/pull/1346).

### Fetching local files

Deno supports fetching `file:` URLs. This makes it easier to write code that
uses the same code path on a server as local, as well as easier to author code
that works both with the Deno CLI and Deno Deploy.

Deno only supports absolute file URLs, this means that `fetch("./some.json")`
will not work. It should be noted though that if [`--location`](#location) is
specified, relative URLs use the `--location` as the base, but a `file:` URL
cannot be passed as the `--location`.

To be able to fetch a resource, relative to the current module, which would work
if the module is local or remote, you should to use `import.meta.url` as the
base. For example:

```js
const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
```

Notes on fetching local files:

- Permissions are applied to reading resources, so an appropriate `--allow-read`
  permission is needed to be able to read a local file.
- Fetching locally only supports the `GET` method, and will reject the promise
  with any other method.
- A file that does not exist simply rejects the promise with a vague
  `TypeError`. This is to avoid the potential of fingerprinting attacks.
- No headers are set on the response. Therefore it is up to the consumer to
  determine things like the content type or content length.
- Response bodies are streamed from the Rust side, so large files are available
  in chunks, and can be cancelled.

## Structured Clone & Transferable Objects

Deno supports [`structuredClone()`](/api/web/~/structuredClone) and
[`postMessage()`](/api/web/~/Worker) for cloning and transferring objects across
contexts (e.g. between the main thread and Web Workers).

### Serializable types

These types can be cloned with `structuredClone()` and sent via `postMessage()`:

| Type                                      | Notes                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| Primitives                                | `string`, `number`, `boolean`, `null`, `undefined`, `bigint`                                 |
| `Array`, `Object`, `Map`, `Set`           | Including nested structures and circular references                                          |
| `Date`, `RegExp`                          |                                                                                              |
| `ArrayBuffer`, `TypedArray`, `DataView`   | Copied by default, or transferred (see below)                                                |
| `Error` types                             | `Error`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, `URIError` |
| [`Blob`](/api/web/~/Blob)                 | Requires Deno 2.8+                                                                           |
| [`File`](/api/web/~/File)                 | Requires Deno 2.8+                                                                           |
| [`DOMException`](/api/web/~/DOMException) |                                                                                              |
| [`CryptoKey`](/api/web/~/CryptoKey)       |                                                                                              |

### Transferable types

These types can be _transferred_ (not copied) via the `transfer` option in
`structuredClone()` or the `transfer` list in `postMessage()`. After transfer,
the original object becomes unusable:

| Type                                            | Notes                                    |
| ----------------------------------------------- | ---------------------------------------- |
| [`ArrayBuffer`](/api/web/~/ArrayBuffer)         | Moves the backing memory to the receiver |
| [`MessagePort`](/api/web/~/MessagePort)         | Transfers the port to another context    |
| [`ReadableStream`](/api/web/~/ReadableStream)   | Transfers the stream to another context  |
| [`WritableStream`](/api/web/~/WritableStream)   | Transfers the stream to another context  |
| [`TransformStream`](/api/web/~/TransformStream) | Transfers the stream to another context  |

```ts
// Clone a Blob
const blob = new Blob(["hello"], { type: "text/plain" });
const cloned = structuredClone(blob);
console.log(await cloned.text()); // "hello"

// Transfer an ArrayBuffer through a MessageChannel
const buffer = new ArrayBuffer(1024);
const ch = new MessageChannel();
ch.port1.postMessage(buffer, [buffer]);
// buffer.byteLength is now 0 (transferred)
```

## CustomEvent and EventTarget

The [DOM Event API](/api/web/~/Event) can be used to dispatch and listen to
events happening in an application. It is implemented as specified in the
[WHATWG DOM spec](https://dom.spec.whatwg.org/#events).

### Spec deviations

- Events do not bubble, because Deno does not have a DOM hierarchy, so there is
  no tree for Events to bubble/capture through.
- `timeStamp` property is always set to `0`.

## Typings

The TypeScript definitions for the implemented web APIs can be found in the
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.shared_globals.d.ts)
and
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.window.d.ts)
files.

Definitions that are specific to workers can be found in the
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.worker.d.ts)
file.

## Location

Deno supports the [`location`](/api/web/~/Location) global from the web.

### Location flag

There is no "web page" whose URL we can use for a location in a Deno process. We
instead allow users to emulate a document location by specifying one on the CLI
using the `--location` flag. It can be a `http` or `https` URL.

```ts
// deno run --location https://example.com/path main.ts

console.log(location.href);
// "https://example.com/path"
```

You must pass `--location <href>` for this to work. If you don't, any access to
the `location` global will throw an error.

```ts
// deno run main.ts

console.log(location.href);
// error: Uncaught ReferenceError: Access to "location", run again with --location <href>.
```

Setting `location` or any of its fields will normally cause navigation in
browsers. This is not applicable in Deno, so it will throw in this situation.

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// error: Uncaught NotSupportedError: Cannot set "location.pathname".
```

### Extended usage

On the web, resource resolution (excluding modules) typically uses the value of
`location.href` as the root on which to base any relative URLs. This affects
some web APIs adopted by Deno.

#### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// Fetches "https://api.github.com/orgs/denoland".
```

The `fetch()` call above would throw if the `--location` flag was not passed,
since there is no web-analogous location to base it onto.

#### Worker modules

```ts
// deno run --location https://example.com/index.html --allow-net main.ts

const worker = new Worker("./workers/hello.ts", { type: "module" });
// Fetches worker module at "https://example.com/workers/hello.ts".
```

:::note

For the above use cases, it is preferable to pass URLs in full rather than
relying on `--location`. You can manually base a relative URL using the
[`URL`](/api/web/~/URL) constructor if needed.

:::

The `--location` flag is intended for those who have a specific purpose in mind
for emulating a document location and are aware that this will only work at
application-level. However, you may also use it to silence errors from a
dependency which is frivolously accessing the `location` global.

## Web Storage

The [Web Storage API](/api/web/storage) provides an API for storing string keys
and values. Persisting data works similar to a browser, and has a 10MB storage
limit. The global `sessionStorage` object only persists data for the current
execution context, while `localStorage` persists data from execution to
execution.

In a browser, `localStorage` persists data uniquely per origin (effectively the
protocol plus hostname plus port). As of Deno 1.16, Deno has a set of rules to
determine what is a unique storage location:

- When using the `--location` flag, the origin for the location is used to
  uniquely store the data. That means a location of `http://example.com/a.ts`
  and `http://example.com/b.ts` and `http://example.com:80/` would all share the
  same storage, but `https://example.com/` would be different.
- If there is no location specifier, but there is a `--config` configuration
  file specified, the absolute path to that configuration file is used. That
  means `deno run --config deno.jsonc a.ts` and
  `deno run --config deno.jsonc b.ts` would share the same storage, but
  `deno run --config tsconfig.json a.ts` would be different.
- If there is no configuration or location specifier, Deno uses the absolute
  path to the main module to determine what storage is shared. The Deno REPL
  generates a "synthetic" main module that is based off the current working
  directory where `deno` is started from. This means that multiple invocations
  of the REPL from the same path will share the persisted `localStorage` data.

To set, get and remove items from `localStorage`, you can use the following:

```ts
// Set an item in localStorage
localStorage.setItem("myDemo", "Deno App");

// Read an item from localStorage
const cat = localStorage.getItem("myDemo");

// Remove an item from localStorage
localStorage.removeItem("myDemo");

// Remove all items from localStorage
localStorage.clear();
```

## Web Workers

Deno supports the [`Web Worker API`](/api/web/workers).

Workers can be used to run code on multiple threads. Each instance of `Worker`
is run on a separate thread, dedicated only to that worker.

Currently Deno supports only `module` type workers; thus it's essential to pass
the `type: "module"` option when creating a new worker.

Use of relative module specifiers in the main worker are only supported with
`--location <href>` passed on the CLI. This is not recommended for portability.
You can instead use the [`URL`](/api/web/~/URL) constructor and
`import.meta.url` to easily create a specifier for some nearby script. Dedicated
workers, however, have a location and this capability by default.

```ts
// Good
new Worker(import.meta.resolve("./worker.js"), { type: "module" });

// Bad
new Worker(import.meta.resolve("./worker.js"));
new Worker(import.meta.resolve("./worker.js"), { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

As with regular modules, you can use top-level `await` in worker modules.
However, you should be careful to always register the message handler before the
first `await`, since messages can be lost otherwise. This is not a bug in Deno,
it's just an unfortunate interaction of features, and it also happens in all
browsers that support module workers.

```ts
import { delay } from "jsr:@std/async@1/delay";

// First await: waits for a second, then continues running the module.
await delay(1000);

// The message handler is only set after that 1s delay, so some of the messages
// that reached the worker during that second might have been fired when no
// handler was registered.
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

### Sending messages back to the main thread

Communication goes both ways. The main thread sends data to the worker with
`worker.postMessage()` and listens for replies with `worker.onmessage`. Inside
the worker, `self.onmessage` receives messages and `self.postMessage()` sends
results back:

```ts title="main.ts"
const worker = new Worker(import.meta.resolve("./worker.ts"), {
  type: "module",
});

// Receive results from the worker
worker.onmessage = (evt) => {
  console.log("result from worker:", evt.data);
};

// Send work to the worker
worker.postMessage(41);
```

```ts title="worker.ts"
self.onmessage = (evt) => {
  const result = evt.data + 1;
  // Send the result back to the main thread
  self.postMessage(result);
};
```

Running `deno run --allow-read main.ts` prints `result from worker: 42`.

### Instantiation permissions

Creating a new `Worker` instance is similar to a dynamic import; therefore Deno
requires appropriate permission for this action.

For workers using local modules; `--allow-read` permission is required:

```ts title="main.ts"
new Worker(import.meta.resolve("./worker.ts"), { type: "module" });
```

```ts title="worker.ts"
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: read access to "./worker.ts", run again with the --allow-read flag

$ deno run --allow-read main.ts
hello world
```

For workers using remote modules; `--allow-net` permission is required:

```ts title="main.ts"
new Worker("https://example.com/worker.ts", { type: "module" });
```

```ts title="worker.ts"
// This file is hosted at https://example.com/worker.ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
hello world
```

### Using Deno in a worker

```js title="main.js"
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});

worker.postMessage({ filename: "./log.txt" });
```

```js title="worker.js"
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

```text title="log.txt"
hello world
```

```shell
$ deno run --allow-read main.js
hello world
```

### Specifying worker permissions

:::caution

This is an unstable Deno feature. Learn more about
[unstable features](/runtime/fundamentals/stability_and_releases/#unstable-apis).

:::

The permissions available for the worker are analogous to the CLI permission
flags, meaning every permission enabled there can be disabled at the level of
the Worker API. You can find a more detailed description of each of the
permission options [here](/runtime/fundamentals/security/).

By default a worker will inherit permissions from the thread it was created in,
however in order to allow users to limit the access of this worker we provide
the `deno.permissions` option in the worker API.

For permissions that support granular access you can pass in a list of the
desired resources the worker will have access to, and for those who only have
the on/off option you can pass true/false respectively:

```ts
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: [
        "deno.land",
      ],
      read: [
        new URL("./file_1.txt", import.meta.url),
        new URL("./file_2.txt", import.meta.url),
      ],
      write: false,
    },
  },
});
```

Granular access permissions receive both absolute and relative routes as
arguments, however take into account that relative routes will be resolved
relative to the file the worker is instantiated in, not the path the worker file
is currently in:

```ts
const worker = new Worker(
  new URL("./worker/worker.js", import.meta.url).href,
  {
    type: "module",
    deno: {
      permissions: {
        read: [
          "/home/user/Documents/deno/worker/file_1.txt",
          "./worker/file_2.txt",
        ],
      },
    },
  },
);
```

Both `deno.permissions` and its children support the option `"inherit"`, which
implies it will borrow its parent permissions:

```ts
// This worker will inherit its parent permissions
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "inherit",
  },
});
```

```ts
// This worker will inherit only the net permissions of its parent
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      env: false,
      hrtime: false,
      net: "inherit",
      ffi: false,
      read: false,
      run: false,
      write: false,
    },
  },
});
```

Not specifying the `deno.permissions` option or one of its children will cause
the worker to inherit by default:

```ts
// This worker will inherit its parent permissions
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});
```

```ts
// This worker will inherit all the permissions of its parent BUT net
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: false,
    },
  },
});
```

You can disable the permissions of the worker all together by passing `"none"`
to the `deno.permissions` option:

```ts
// This worker will not have any permissions enabled
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "none",
  },
});
```

## OffscreenCanvas

Starting in Deno 2.8, the
[`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
API is available. `OffscreenCanvas` is a canvas that lives outside any DOM and
can be used anywhere (including Web Workers) for off-thread rendering and image
generation.

### Supported rendering contexts

`OffscreenCanvas#getContext` accepts two of the spec-defined context ids:

- `"bitmaprenderer"`: returns an
  [`ImageBitmapRenderingContext`](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapRenderingContext)
  for displaying an `ImageBitmap` produced via `createImageBitmap`.
- `"webgpu"`: returns a
  [`GPUCanvasContext`](https://developer.mozilla.org/en-US/docs/Web/API/GPUCanvasContext)
  for rendering with WebGPU.

Calling `getContext` with `"2d"`, `"webgl"`, or `"webgl2"` returns `null`; these
contexts are not implemented in Deno.

### Example: encoding an image to PNG

Decode an image into an `ImageBitmap`, place it on an `OffscreenCanvas` via the
`bitmaprenderer` context, and write the result to disk:

```ts
const data = await Deno.readFile("./input.jpg");
const bitmap = await createImageBitmap(new Blob([data]));

const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
const ctx = canvas.getContext("bitmaprenderer")!;
ctx.transferFromImageBitmap(bitmap);

const blob = await canvas.convertToBlob({ type: "image/png" });
await Deno.writeFile(
  "./output.png",
  new Uint8Array(await blob.arrayBuffer()),
);
```

Typical uses:

- producing thumbnails, format conversions, or social-card images at request
  time without spinning up a headless browser,
- running off-thread image work inside a Web Worker,
- driving WebGPU rendering targets that don't need a window.

## Geometry Interfaces

Starting in Deno 2.8, the
[Geometry Interfaces Module Level 1](https://drafts.fxtf.org/geometry/) types
are available as globals. These are the same types you'd find in a browser:

- [`DOMMatrix`](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) /
  [`DOMMatrixReadOnly`](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly):
  4×4 transform matrices for 2D and 3D operations.
- [`DOMPoint`](https://developer.mozilla.org/en-US/docs/Web/API/DOMPoint) /
  [`DOMPointReadOnly`](https://developer.mozilla.org/en-US/docs/Web/API/DOMPointReadOnly):
  points in 2D / 3D space.
- [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) /
  [`DOMRectReadOnly`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRectReadOnly):
  axis-aligned rectangles.
- [`DOMQuad`](https://developer.mozilla.org/en-US/docs/Web/API/DOMQuad): a
  quadrilateral defined by four points.

```ts
const m = new DOMMatrix().translateSelf(10, 20).scaleSelf(2);
const p = new DOMPoint(1, 1).matrixTransform(m);
console.log(p.x, p.y); // 12 22
```

These types are useful for graphics work; applying transforms to canvas
drawings, computing layout math, or porting browser code that depends on
geometry types.

## navigator

Deno implements a subset of the
[`navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
global. The following properties are available:

- `navigator.userAgent` — always `"Deno/<version>"`
- `navigator.platform` — the underlying OS platform (e.g. `"Linux x86_64"`,
  `"MacIntel"`, `"Win32"`). Added in Deno 2.7.
- `navigator.hardwareConcurrency` — number of logical CPU cores
- `navigator.userAgentData` — a
  [`NavigatorUAData`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData)
  object implementing the User-Agent Client Hints API. The low-entropy
  properties `brands`, `mobile`, and `platform` are read synchronously, while
  `getHighEntropyValues(hints)` resolves with additional details such as
  `architecture`, `model`, and `platformVersion`.

```ts
console.log(navigator.userAgent); // "Deno/2.7.0"
console.log(navigator.platform); // e.g. "Linux x86_64", "MacIntel", "Win32"
console.log(navigator.hardwareConcurrency); // e.g. 8
console.log(navigator.userAgentData.brands); // e.g. [{ brand: "Deno", version: "2" }]
```

## Temporal

The [Temporal API](https://tc39.es/proposal-temporal/docs/) is a modern
date/time library that replaces `Date` for most use cases. It was stabilized in
Deno 2.7 and is available as a global without any flags.

```ts
// Current date/time in local timezone
const now = Temporal.Now.plainDateTimeISO();
console.log(now.toString()); // e.g. "2025-03-12T10:30:00"

// Parse a date
const date = Temporal.PlainDate.from("2025-03-12");
console.log(date.month); // 3

// Timezone-aware
const zonedNow = Temporal.Now.zonedDateTimeISO("America/New_York");
console.log(zonedNow.timeZoneId); // "America/New_York"
```

Prior to Deno 2.7, Temporal required the `--unstable-temporal` flag.

## CompressionStream and DecompressionStream

Deno supports
[`CompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)
and
[`DecompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)
for streaming compression and decompression.

### Supported formats

| Format      | String          | Notes              |
| ----------- | --------------- | ------------------ |
| gzip        | `"gzip"`        | RFC 1952           |
| deflate     | `"deflate"`     | zlib (RFC 1950)    |
| deflate-raw | `"deflate-raw"` | raw DEFLATE (1951) |
| Brotli      | `"brotli"`      | Added in Deno 2.7  |

```ts
// Compress with Brotli
const input = new TextEncoder().encode("Hello, Deno!");
const cs = new CompressionStream("brotli");
const writer = cs.writable.getWriter();
writer.write(input);
writer.close();
const compressed = await new Response(cs.readable).arrayBuffer();

// Decompress
const ds = new DecompressionStream("brotli");
const writer2 = ds.writable.getWriter();
writer2.write(new Uint8Array(compressed));
writer2.close();
const result = await new Response(ds.readable).text();
console.log(result); // "Hello, Deno!"
```

## Web Crypto

Deno supports the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
via `crypto.subtle`.

### Feature detection

`SubtleCrypto.supports()` is a static method for synchronously checking whether
a given algorithm and operation combination is available, without running the
operation or catching an error. It takes the operation name, the algorithm, and
an optional third argument, and returns a boolean. Added in Deno 2.9.

```ts
SubtleCrypto.supports("digest", "SHA3-256"); // true
SubtleCrypto.supports("generateKey", "ChaCha20-Poly1305"); // true
SubtleCrypto.supports("sign", "ML-DSA-65"); // true
```

The operation is one of `"encrypt"`, `"decrypt"`, `"sign"`, `"verify"`,
`"digest"`, `"generateKey"`, `"deriveKey"`, `"deriveBits"`, `"importKey"`,
`"exportKey"`, `"wrapKey"`, `"unwrapKey"`, `"encapsulateKey"`,
`"encapsulateBits"`, `"decapsulateKey"`, `"decapsulateBits"`, or
`"getPublicKey"`.

The optional third argument is interpreted by operation: a length in bits for
`"deriveBits"`, and a related algorithm otherwise, such as the derived-key
algorithm for `"deriveKey"` or the shared-key algorithm for `"encapsulateKey"`
and `"decapsulateKey"`.

```ts
// Will deriveKey produce an AES-GCM key from HKDF?
SubtleCrypto.supports("deriveKey", "HKDF", { name: "AES-GCM", length: 256 });
```

`SubtleCrypto.supports()` is part of the WICG
[Modern Algorithms in the Web Cryptography API](https://wicg.github.io/webcrypto-modern-algos/)
draft.

### SHA-3 hash algorithms

Starting with Deno 2.7, the SHA-3 family of hash algorithms is supported by
`crypto.subtle.digest`:

- `SHA3-256`
- `SHA3-384`
- `SHA3-512`

```ts
const data = new TextEncoder().encode("Hello, Deno!");
const hash = await crypto.subtle.digest("SHA3-256", data);
console.log(new Uint8Array(hash));
```

An `HMAC` key can also use a SHA-3 hash. Pass the algorithm name as the `hash`
when you generate or import the key:

```ts
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA3-256" },
  true,
  ["sign", "verify"],
);
const signature = await crypto.subtle.sign("HMAC", key, data);
```

### Extendable-output functions

Deno 2.9 adds the SHAKE, cSHAKE, TurboSHAKE, and KangarooTwelve
extendable-output functions (XOFs). Unlike a fixed-size hash, an XOF can produce
a digest of any length, so `crypto.subtle.digest` requires an `outputLength`
option giving the output size in bits. `outputLength` must be a positive
multiple of 8. The supported names are:

- `SHAKE128`, `SHAKE256`
- `cSHAKE128`, `cSHAKE256`
- `TurboSHAKE128`, `TurboSHAKE256`
- `KT128` (also accepted as `KangarooTwelve`) and `KT256`

```ts
const data = new TextEncoder().encode("Hello, Deno!");

// 256-bit (32-byte) SHAKE256 digest.
const digest = await crypto.subtle.digest(
  { name: "SHAKE256", outputLength: 256 },
  data,
);
console.log(new Uint8Array(digest).length); // 32
```

`cSHAKE128` and `cSHAKE256` accept two optional `BufferSource` parameters that
customize the function: `functionName`, a NIST-defined function name, and
`customization`, a caller-defined domain separation string.

```ts
const digest = await crypto.subtle.digest(
  {
    name: "cSHAKE128",
    outputLength: 256,
    customization: new TextEncoder().encode("my-app"),
  },
  data,
);
```

`TurboSHAKE128` and `TurboSHAKE256` accept an optional `domainSeparation` byte,
which must be in the range `0x01` to `0x7F`:

```ts
const digest = await crypto.subtle.digest(
  { name: "TurboSHAKE256", outputLength: 512, domainSeparation: 0x1f },
  data,
);
```

`KT128` and `KT256` are KangarooTwelve XOFs. They accept an optional
`customization` `BufferSource`:

```ts
const digest = await crypto.subtle.digest(
  { name: "KT128", outputLength: 256 },
  data,
);
```

### KMAC

`KMAC128` and `KMAC256` are keyed message authentication codes built on cSHAKE.
Added in Deno 2.9. Generate a key with a `length` in bits, then sign and verify
with an `outputLength` in bits and an optional `customization` `BufferSource`:

```ts
const key = await crypto.subtle.generateKey(
  { name: "KMAC128", length: 128 },
  true,
  ["sign", "verify"],
);

const data = new TextEncoder().encode("Hello, Deno!");
const params = {
  name: "KMAC128",
  outputLength: 256,
  customization: new TextEncoder().encode("Deno"),
};
const mac = await crypto.subtle.sign(params, key, data);
const valid = await crypto.subtle.verify(params, key, mac, data);
```

KMAC keys can be imported and exported in the `"raw"`, `"raw-secret"`, and
`"jwk"` formats.

### Argon2

`Argon2d`, `Argon2i`, and `Argon2id` are password-hashing key-derivation
functions. Added in Deno 2.9. Import the password as a key in the `"raw-secret"`
format with the `deriveBits` usage, then call `deriveBits`. The parameters are
`memory` (memory cost in kibibytes), `passes` (iterations), `parallelism`
(degree of parallelism), and a `nonce` `BufferSource` (the salt). `secretValue`
and `associatedData` are optional `BufferSource` values:

```ts
const password = new TextEncoder().encode("correct horse battery staple");
const key = await crypto.subtle.importKey(
  "raw-secret",
  password,
  "Argon2id",
  false,
  ["deriveBits"],
);

const derived = await crypto.subtle.deriveBits(
  {
    name: "Argon2id",
    memory: 65536,
    passes: 3,
    parallelism: 4,
    nonce: crypto.getRandomValues(new Uint8Array(16)),
  },
  key,
  256, // output length in bits
);
```

### ChaCha20-Poly1305

Deno 2.9 supports the `ChaCha20-Poly1305` authenticated encryption algorithm
through `generateKey`, `encrypt`, and `decrypt`. Keys are always 256 bits:

```ts
const key = await crypto.subtle.generateKey(
  { name: "ChaCha20-Poly1305" },
  true,
  ["encrypt", "decrypt"],
);
```

Each `encrypt` and `decrypt` call takes a 12-byte `nonce` and optional
`additionalData` that is authenticated but not encrypted. Use a fresh nonce for
every message encrypted under the same key:

```ts
const nonce = crypto.getRandomValues(new Uint8Array(12));
const data = new TextEncoder().encode("Hello, Deno!");

const ciphertext = await crypto.subtle.encrypt(
  { name: "ChaCha20-Poly1305", nonce },
  key,
  data,
);

const plaintext = await crypto.subtle.decrypt(
  { name: "ChaCha20-Poly1305", nonce },
  key,
  ciphertext,
);
console.log(new TextDecoder().decode(plaintext)); // "Hello, Deno!"
```

The returned ciphertext includes the 16-byte Poly1305 authentication tag.

### Post-quantum cryptography

Deno 2.9 implements the NIST post-quantum algorithms from the WICG
[Modern Algorithms in the Web Cryptography API](https://wicg.github.io/webcrypto-modern-algos/)
draft: ML-DSA and SLH-DSA signatures, and ML-KEM key encapsulation.

#### ML-DSA signatures

`ML-DSA` (FIPS 204) is a lattice-based digital signature scheme. Three parameter
sets are available, in increasing security level: `ML-DSA-44`, `ML-DSA-65`, and
`ML-DSA-87`. Generate a key pair, then sign with the private key and verify with
the public key:

```ts
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "ML-DSA-65" },
  true,
  ["sign", "verify"],
);

const data = new TextEncoder().encode("Hello, Deno!");
const signature = await crypto.subtle.sign(
  { name: "ML-DSA-65" },
  privateKey,
  data,
);
const valid = await crypto.subtle.verify(
  { name: "ML-DSA-65" },
  publicKey,
  signature,
  data,
);
console.log(valid); // true
```

`sign` and `verify` accept an optional `context`, a `BufferSource` that binds
the signature to an application-specific value. The same `context` must be
supplied to both calls:

```ts
const context = new TextEncoder().encode("v1");
const signature = await crypto.subtle.sign(
  { name: "ML-DSA-65", context },
  privateKey,
  data,
);
```

ML-DSA keys can be imported and exported in the `"pkcs8"`, `"spki"`, `"jwk"`,
`"raw-public"`, `"raw-private"`, and `"raw-seed"` formats.

#### SLH-DSA signatures

`SLH-DSA` (FIPS 205) is a stateless hash-based signature scheme. All twelve
parameter sets are available, combining a hash family (`SHA2` or `SHAKE`), a
security level (`128`, `192`, or `256`), and a `s` (small signature) or `f`
(fast) tradeoff:

- `SLH-DSA-SHA2-128s`, `SLH-DSA-SHA2-128f`, `SLH-DSA-SHA2-192s`,
  `SLH-DSA-SHA2-192f`, `SLH-DSA-SHA2-256s`, `SLH-DSA-SHA2-256f`
- `SLH-DSA-SHAKE-128s`, `SLH-DSA-SHAKE-128f`, `SLH-DSA-SHAKE-192s`,
  `SLH-DSA-SHAKE-192f`, `SLH-DSA-SHAKE-256s`, `SLH-DSA-SHAKE-256f`

SLH-DSA uses the same `generateKey`, `sign`, and `verify` flow as ML-DSA,
including the optional `context`:

```ts
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "SLH-DSA-SHAKE-128f" },
  true,
  ["sign", "verify"],
);

const data = new TextEncoder().encode("Hello, Deno!");
const signature = await crypto.subtle.sign(
  { name: "SLH-DSA-SHAKE-128f" },
  privateKey,
  data,
);
```

SLH-DSA keys can be imported and exported in the `"pkcs8"`, `"spki"`, `"jwk"`,
`"raw-public"`, and `"raw-private"` formats.

#### ML-KEM key encapsulation

`ML-KEM` (FIPS 203) is a key-encapsulation mechanism: one party encapsulates a
fresh shared secret to a recipient's public key, and the recipient decapsulates
the resulting ciphertext to recover the same secret. The parameter sets are
`ML-KEM-512`, `ML-KEM-768`, and `ML-KEM-1024`.

The recipient generates a key pair and publishes the public (encapsulation) key.
The sender calls `encapsulateKey`, which returns both the `ciphertext` to send
back and a `sharedKey` `CryptoKey` for the algorithm named by its third
argument. The recipient passes the ciphertext to `decapsulateKey` to derive the
same key:

```ts
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "ML-KEM-768" },
  true,
  ["encapsulateKey", "decapsulateKey"],
);

// Sender: encapsulate a shared AES-GCM key to the recipient's public key.
const { ciphertext, sharedKey } = await crypto.subtle.encapsulateKey(
  { name: "ML-KEM-768" },
  publicKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"],
);

// Recipient: decapsulate the ciphertext to recover the same key.
const recovered = await crypto.subtle.decapsulateKey(
  { name: "ML-KEM-768" },
  privateKey,
  ciphertext,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"],
);
```

`encapsulateBits` and `decapsulateBits` are the lower-level variants: they
return the raw shared secret as an `ArrayBuffer` instead of importing it as a
`CryptoKey`. A decapsulation (private) key also exposes `getPublicKey()`, which
returns its matching encapsulation (public) key.

## createImageBitmap

Deno supports
[`createImageBitmap()`](https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap)
for decoding images into `ImageBitmap` objects that can be used with
[`OffscreenCanvas`](#offscreencanvas).

### Supported input formats

| Format | Notes             |
| ------ | ----------------- |
| PNG    |                   |
| JPEG   |                   |
| BMP    |                   |
| GIF    | Added in Deno 2.7 |
| WebP   | Added in Deno 2.7 |

```ts
const data = await Deno.readFile("./image.gif");
const bitmap = await createImageBitmap(new Blob([data]));
console.log(bitmap.width, bitmap.height);
```

## File locking

[`Deno.FsFile`](/api/deno/~/Deno.FsFile) supports advisory file locking to
coordinate access between processes:

- [`lock(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.lock) — acquires a
  lock. Shared (read) by default; pass `true` for exclusive (write). Blocks if
  an incompatible lock is held.
- [`lockSync(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.lockSync) —
  synchronous variant of `lock()`.
- [`tryLock(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.tryLock) —
  non-blocking. Returns `true` if the lock was acquired, `false` otherwise.
  Added in Deno 2.7.
- [`tryLockSync(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.tryLockSync) —
  synchronous variant of `tryLock()`.

```ts
const file = await Deno.open("./data.txt", { read: true, write: true });

const locked = await file.tryLock(true); // exclusive
if (locked) {
  await file.write(new TextEncoder().encode("hello"));
  await file.unlock();
} else {
  console.log("File is locked by another process, skipping.");
}
file.close();
```

## Deviations of other APIs from spec

### Cache API

Only the following APIs are implemented:

- [CacheStorage::open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)
- [CacheStorage::keys()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/keys)
  (Deno 2.8+)
- [Cache::match()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete)
- [Cache::keys()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys)
  (Deno 2.8+)

A few things that are different compared to browsers:

1. You cannot pass relative paths to the APIs. The request can be an instance of
   Request or URL or a url string.
2. `match()` & `delete()` don't support query options yet.
