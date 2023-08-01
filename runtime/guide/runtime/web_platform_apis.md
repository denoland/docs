# Using Web Platform APIs

Deno aims to use web platform APIs (like `fetch`) instead of inventing a new
proprietary API where it makes sense. These APIs generally follow the
specifications and should match the implementation in Chrome and Firefox. In
some cases it makes sense to deviate from the spec slightly, because of the
different security model Deno has.

Here is a list of web platform APIs Deno implements:

- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API)
- [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API)
- [Console](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [DOM APIs](https://deno.land/api@v1.26.0#DOM_APIs)
- [DOM `CustomEvent`, `EventTarget` and `EventListener`](#customevent-eventtarget-and-eventlistener)
- [Encoding API](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API)
- [Fetch API](#fetch-api)
- [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Location API](./location_api.md)
- [`navigator.language` API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [`setTimeout`, `setInterval`, `clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Web File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Web Storage API](./web_storage_api.md)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
- [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

You can find the Deno reference for these APIs
[here](https://deno.land/api).

## `fetch` API

## Overview

The `fetch` API can be used to make HTTP requests. It is implemented as
specified in the [WHATWG `fetch` spec](https://fetch.spec.whatwg.org/).

You can find documentation about this API on
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Spec deviations

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

## Fetching local files

As of Deno 1.16, Deno supports fetching `file:` URLs. This makes it easier to
write code that uses the same code path on a server as local, as well as easier
to author code that works both with the Deno CLI and Deno Deploy.

Deno only supports absolute file URLs, this means that `fetch("./some.json")`
will not work. It should be noted though that if
[`--location`](./location_api.md) is specified, relative URLs use the
`--location` as the base, but a `file:` URL cannot be passed as the
`--location`.

To be able to fetch some resource, relative to the current module, which would
work if the module is local or remote, you would want to use `import.meta.url`
as the base. For example, something like:

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

## `CustomEvent`, `EventTarget` and `EventListener`

## Overview

The DOM Event API can be used to dispatch and listen to events happening in an
application. It is implemented as specified in the
[WHATWG DOM spec](https://dom.spec.whatwg.org/#events).

You can find documentation about this API on
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget).

## Spec deviations

- Events do not bubble, because Deno does not have a DOM hierarchy, so there is
  no tree for Events to bubble/capture through.

---

## Typings

The TypeScript definitions for the implemented web APIs can be found in the
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/dts/lib.deno.shared_globals.d.ts)
and
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/dts/lib.deno.window.d.ts)
files.

Definitions that are specific to workers can be found in the
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/dts/lib.deno.worker.d.ts)
file.

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
