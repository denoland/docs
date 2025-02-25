---
title: "Web Platform APIs"
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
  `Request` object.
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
relying on `--location`. You can manually base a relative URL using the `URL`
constructor if needed.

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
You can instead use the `URL` constructor and `import.meta.url` to easily create
a specifier for some nearby script. Dedicated workers, however, have a location
and this capability by default.

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

## Deviations of other APIs from spec

### Cache API

Only the following APIs are implemented:

- [CacheStorage::open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)
- [Cache::match()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete)

A few things that are different compared to browsers:

1. You cannot pass relative paths to the APIs. The request can be an instance of
   Request or URL or a url string.
2. `match()` & `delete()` don't support query options yet.
