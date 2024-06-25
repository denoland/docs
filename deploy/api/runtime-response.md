---
title: "HTTP Response"
---

The [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
interface is part of the Fetch API and represents a response resource of
fetch().

- [Constructor](#constructor)
  - [Parameters](#parameters)
- [Properties](#properties)
- [Methods](#methods)
- [Example](#example)

## Constructor

The Response() constructor creates a new Response instance.

```ts
let response = new Response(body, init);
```

#### Parameters

| name | type                                                                                    | optional | description                                                                |
| ---- | --------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| body | `Blob`, `BufferSource`, `FormData`, `ReadableStream`, `URLSearchParams`, or `USVString` | `true`   | The body of the response. The default value is `null`.                     |
| init | `ResponseInit`                                                                          | `true`   | An optional object that allows setting status and headers of the response. |

The return type is a `Response` instance.

##### `ResponseInit`

| name         | type                                                  | optional | description                                           |
| ------------ | ----------------------------------------------------- | -------- | ----------------------------------------------------- |
| `status`     | `number`                                              | `true`   | The status code of the response.                      |
| `statusText` | `string`                                              | `true`   | The status message representative of the status code. |
| `headers`    | `Headers` or `string[][]` or `Record<string, string>` | `false`  | The HTTP headers of the response.                     |

## Properties

| name                       | type             | read only | description                                                 |
| -------------------------- | ---------------- | --------- | ----------------------------------------------------------- |
| [`body`][body]             | `ReadableStream` | `true`    | The getter exposes a `ReadableStream` of the body contents. |
| [`bodyUsed`][bodyused]     | `boolean`        | `true`    | Indicates whether the body content is read.                 |
| [`url`][url]               | `USVString`      | `true`    | The URL of the response.                                    |
| [`headers`][headers]       | `Headers`        | `true`    | The headers associated with the response.                   |
| [`ok`][ok]                 | `boolean`        | `true`    | Indicates if the response is successful (200-299 status).   |
| [`redirected`][redirected] | `boolean`        | `true`    | Indicates if the response is the result of a redirect.      |
| [`status`][status]         | `number`         | `true`    | The status code of the response                             |
| [`statusText`][statustext] | `string`         | `true`    | The status message of the response                          |
| [`type`][type]             | `string`         | `true`    | The type of the response.                                   |

## Methods

| name                                                 | description                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer]                       | Reads the body stream to its completion and returns an `ArrayBuffer` object.                |
| [`blob()`][blob]                                     | Reads the body stream to its completion and returns a `Blob` object.                        |
| [`formData()`][formdata]                             | Reads the body stream to its completion and returns a `FormData` object.                    |
| [`json()`][json]                                     | Reads the body stream to its completion, parses it as JSON and returns a JavaScript object. |
| [`text()`][text]                                     | Reads the body stream to its completion and returns a USVString object (text).              |
| [`clone()`][clone]                                   | Clones the response object.                                                                 |
| [`error()`][error]                                   | Returns a new response object associated with a network error.                              |
| [`redirect(url: string, status?: number)`][redirect] | Creates a new response that redirects to the provided URL.                                  |

## Example

```ts
function handler(_req) {
  // Create a response with html as its body.
  const response = new Response("<html> Hello </html>", {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });

  console.log(response.status); // 200
  console.log(response.headers.get("content-type")); // text/html

  return response;
}

Deno.serve(handler);
```

[clone]: https://developer.mozilla.org/en-US/docs/Web/API/Response/clone
[error]: https://developer.mozilla.org/en-US/docs/Web/API/Response/error
[redirect]: https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect
[body]: https://developer.mozilla.org/en-US/docs/Web/API/Body/body
[bodyused]: https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed
[url]: https://developer.mozilla.org/en-US/docs/Web/API/Request/url
[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
[ok]: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
[redirected]: https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected
[status]: https://developer.mozilla.org/en-US/docs/Web/API/Response/status
[statustext]: https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
[type]: https://developer.mozilla.org/en-US/docs/Web/API/Response/type
[method]: https://developer.mozilla.org/en-US/docs/Web/API/Request/method
[readablestream]: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
[arraybuffer]: https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer
[blob]: https://developer.mozilla.org/en-US/docs/Web/API/Body/blob
[json]: https://developer.mozilla.org/en-US/docs/Web/API/Body/json
[text]: https://developer.mozilla.org/en-US/docs/Web/API/Body/text
[formdata]: https://developer.mozilla.org/en-US/docs/Web/API/Body/formdata
