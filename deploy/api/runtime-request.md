---
title: "HTTP Request"
oldUrl:
  - /deploy/docs/runtime-request/
---

The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
interface is part of the Fetch API and represents the request of fetch().

- [Constructor](#constructor)
  - [Parameters](#parameters)
- [Properties](#properties)
- [Methods](#methods)
- [Example](#example)

## Constructor

The Request() constructor creates a new Request instance.

```ts
let request = new Request(resource, init);
```

#### Parameters

| name     | type                          | optional | description                                                               |
| -------- | ----------------------------- | -------- | ------------------------------------------------------------------------- |
| resource | `Request` or `USVString`      | `false`  | The resource can either be a request object or a URL string.              |
| init     | [`RequestInit`](#requestinit) | `true`   | The init object lets you set optional parameters to apply to the request. |

The return type is a `Request` instance.

##### `RequestInit`

| name                         | type                                                                                    | default        | description                                                |
| ---------------------------- | --------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------- |
| [`method`][method]           | `string`                                                                                | `GET`          | The method of the request.                                 |
| [`headers`][headers]         | `Headers` or `{ [key: string]: string }`                                                | none           | Th Headers for the request.                                |
| [`body`][body]               | `Blob`, `BufferSource`, `FormData`, `URLSearchParams`, `USVString`, or `ReadableStream` | none           | The body of the request.                                   |
| [`cache`][cache]             | `string`                                                                                | none           | The cache mode of the request.                             |
| [`credentials`][credentials] | `string`                                                                                | `same-origin`  | The credentials mode of the request.                       |
| [`integrity`][integrity]     | `string`                                                                                | none           | The crypotographic hash of the request's body.             |
| [`mode`][mode]               | `string`                                                                                | `cors`         | The request mode you want to use.                          |
| [`redirect`][redirect]       | `string`                                                                                | `follow`       | The mode of how redirects are handled.                     |
| [`referrer`][referrer]       | `string`                                                                                | `about:client` | A `USVString` specifying `no-referrer`, `client` or a URL. |

## Properties

| name                               | type                                       | description                                                                                                                  |
| ---------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [`cache`][cache]                   | `string`                                   | The cache mode indicates how the (`default`, `no-cache`, etc) request should be cached by browser.                           |
| [`credentials`][credentials]       | `string`                                   | The credentials (`omit`, `same-origin`, etc) indicate whether user agent should send cookies in case of CORs of the request. |
| [`destination`][destination]       | [`RequestDestination`][requestdestination] | The string indicates the type of content being requested.                                                                    |
| [`body`][body]                     | [`ReadableStream`][readablestream]         | The getter exposes a `ReadableStream` of the body contents.                                                                  |
| [`bodyUsed`][bodyused]             | `boolean`                                  | Indicates whether the body content is read.                                                                                  |
| [`url`][url]                       | `USVString`                                | The URL of the request.                                                                                                      |
| [`headers`][headers]               | [`Headers`](runtime-headers)               | The headers associated with the request.                                                                                     |
| [`integrity`][integrity]           | `string`                                   | The crypotographic hash of the request's body.                                                                               |
| [`method`][method]                 | `string`                                   | The request's method (`POST`, `GET`, etc).                                                                                   |
| [`mode`][mode]                     | `string`                                   | Indicates the mode of the request (e.g. `cors` ).                                                                            |
| [`redirect`][redirect]             | `string`                                   | The mode of how redirects are handled.                                                                                       |
| [`referrer`][referrer]             | `string`                                   | The referrer of the request.                                                                                                 |
| [`referrerPolicy`][referrerpolicy] | `string`                                   | The referrer policy of the request                                                                                           |

All the above properties are read only.

## Methods

| name                           | description                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer] | Reads the body stream to its completion and returns an `ArrayBuffer` object.                |
| [`blob()`][blob]               | Reads the body stream to its completion and returns a `Blob` object.                        |
| [`formData()`][formdata]       | Reads the body stream to its completion and returns a `FormData` object.                    |
| [`json()`][json]               | Reads the body stream to its completion, parses it as JSON and returns a JavaScript object. |
| [`text()`][text]               | Reads the body stream to its completion and returns a USVString object (text).              |
| [`clone()`][clone]             | Clones the Request object.                                                                  |

## Example

```ts
function handler(_req) {
  // Create a post request
  const request = new Request("https://post.deno.dev", {
    method: "POST",
    body: JSON.stringify({
      message: "Hello world!",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  console.log(request.method); // POST
  console.log(request.headers.get("content-type")); // application/json

  return fetch(request);
}

Deno.serve(handler);
```

[cache]: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
[credentials]: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
[destination]: https://developer.mozilla.org/en-us/docs/web/api/request/destination
[requestdestination]: https://developer.mozilla.org/en-US/docs/Web/API/RequestDestination
[body]: https://developer.mozilla.org/en-US/docs/Web/API/Body/body
[bodyused]: https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed
[url]: https://developer.mozilla.org/en-US/docs/Web/API/Request/url
[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
[method]: https://developer.mozilla.org/en-US/docs/Web/API/Request/method
[integrity]: https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity
[mode]: https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
[redirect]: https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect
[referrer]: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer
[referrerpolicy]: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrerpolicy
[readablestream]: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
[arraybuffer]: https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer
[blob]: https://developer.mozilla.org/en-US/docs/Web/API/Body/blob
[json]: https://developer.mozilla.org/en-US/docs/Web/API/Body/json
[text]: https://developer.mozilla.org/en-US/docs/Web/API/Body/text
[formdata]: https://developer.mozilla.org/en-US/docs/Web/API/Body/formdata
[clone]: https://developer.mozilla.org/en-US/docs/Web/API/Request/clone
