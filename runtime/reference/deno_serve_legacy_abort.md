---
last_modified: 2026-07-02
title: "Deno.serve request abort behavior"
description: "Understand the legacy request.signal abort behavior in Deno.serve, why it is changing, and how to detect request completion with the --unstable-no-legacy-abort flag."
---

[`Deno.serve`](/api/deno/~/Deno.serve) historically fired the `abort` event on a
request's
[`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
(`request.signal`) whenever the request finished, **including when your handler
returned a successful response**. The signal was meant to indicate that the
client went away (for example, the connection was closed before the response was
sent), but in practice it also fired on every successful response.

This is the "legacy abort" behavior, and it is enabled by default today. The
[`--unstable-no-legacy-abort`](/runtime/reference/cli/unstable_flags/#--unstable-no-legacy-abort)
flag opts in to the corrected behavior, which will become the default in an
upcoming release.

## Why the behavior is changing

Because the signal aborted on success, code that watches `request.signal` could
not tell the difference between "the client disconnected" and "the response was
delivered normally". This breaks a number of common libraries, most visibly
Node-style HTTP proxies such as
[`http-proxy`](https://www.npmjs.com/package/http-proxy) and
[`http-proxy-middleware`](https://www.npmjs.com/package/http-proxy-middleware)
(used by Vite, among others), which treat the upstream abort as a genuine
failure and surface a spurious error.

See issues [#28850](https://github.com/denoland/deno/issues/28850) and
[#29111](https://github.com/denoland/deno/issues/29111) for background.

## The new behavior

With `--unstable-no-legacy-abort` enabled, `request.signal` aborts **only** when
the client actually cancels the request or the connection is lost before the
response has been fully sent. A successful response no longer triggers an abort.

```ts
Deno.serve((req) => {
  req.signal.addEventListener("abort", () => {
    // With --unstable-no-legacy-abort this only runs on a real client
    // disconnect, not on every successful response.
    console.log("client went away");
  });

  return new Response("hello");
});
```

## Detecting when a request has been fully delivered

If you relied on the legacy abort to know that a response had been fully sent,
use the `completed` promise on the second argument to the handler
([`ServeHandlerInfo`](/api/deno/~/Deno.ServeHandlerInfo)) instead. It is the
intended, mode-independent way to observe delivery:

```ts
Deno.serve((req, info) => {
  info.completed
    .then(() => {
      // The response, including a streaming body, was sent successfully.
      console.log("response fully delivered");
    })
    .catch((err) => {
      // Delivery failed partway through (client disconnected, write error, ...).
      console.error("response was not sent successfully:", err);
    });

  return new Response(someStream);
});
```

`info.completed`:

- **resolves** once the response (including any streaming body) has been sent to
  the client, and
- **rejects** if delivery failed before completing.

The promise is lazily created, so handlers that never read `info.completed` pay
no extra cost.

## Migrating

1. Enable the flag while you test:

   ```sh
   deno run --unstable-no-legacy-abort main.ts
   ```

   or in `deno.json`:

   ```json title="deno.json"
   {
     "unstable": ["no-legacy-abort"]
   }
   ```

2. Use `request.signal` only for cancellation, and move completion/cleanup logic
   onto `info.completed` (or onto the handler's return path).

Once you have adopted the new behavior, your code will continue to work
unchanged when it becomes the default.
