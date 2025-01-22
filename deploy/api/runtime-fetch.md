---
title: "HTTP requests (fetch)"
oldUrl:
  - /deploy/docs/runtime-fetch/
---

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
allows you to make outbound HTTP requests in Deno Deploy. It is a web standard
and has the following interfaces:

- `fetch()` - The method that allows you to make outbound HTTP requests
- [`Request`](./runtime-request) - represents a request resource of fetch()
- [`Response`](./runtime-response) - represents a response resource of fetch()
- [`Headers`](./runtime-headers) - represents HTTP Headers of requests and
  responses.

This page shows usage for the fetch() method. You can click above on the other
interfaces to learn more about them.

Fetch also supports fetching from file URLs to retrieve static files. For more
info on static files, see the [filesystem API documentation](./runtime-fs).

## `fetch()`

The `fetch()` method initiates a network request to the provided resource and
returns a promise that resolves after the response is available.

```ts
function fetch(
  resource: Request | string,
  init?: RequestInit,
): Promise<Response>;
```

#### Parameters

| name     | type                                                          | optional | description                                                        |
| -------- | ------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| resource | [`Request`](./runtime-request) <br/> [`USVString`][usvstring] | `false`  | The resource can either be a request object or a URL string.       |
| init     | [`RequestInit`](./runtime-request#requestinit)                | `true`   | The init object lets you apply optional parameters to the request. |

The return type of `fetch()` is a promise that resolves to a
[`Response`](./runtime-response).

## Examples

The Deno Deploy script below makes a `fetch()` request to the GitHub API for
each incoming request, and then returns that response from the handler function.

```ts
async function handler(req: Request): Promise<Response> {
  const resp = await fetch("https://api.github.com/users/denoland", {
    // The init object here has an headers object containing a
    // header that indicates what type of response we accept.
    // We're not specifying the method field since by default
    // fetch makes a GET request.
    headers: {
      accept: "application/json",
    },
  });
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

Deno.serve(handler);
```

[usvstring]: https://developer.mozilla.org/en-US/docs/Web/API/USVString
