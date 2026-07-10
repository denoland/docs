---
last_modified: 2026-06-25
title: "Error reporting"
description: "Capture uncaught errors, unhandled rejections, and Rust panics, showing a native alert and POSTing a JSON report to your server."
---

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

`deno desktop` apps automatically catch:

- Uncaught JavaScript exceptions (in both Deno-side and renderer-side code).
- Unhandled promise rejections.
- Rust panics inside the runtime or the rendering backend.

When one of these happens, the runtime shows a native alert with the error
message, and, if you have configured a reporting URL, `POST`s a JSON report.

## Configuration

Set `desktop.errorReporting.url` in your `deno.json`:

```jsonc
{
  "desktop": {
    "errorReporting": {
      "url": "https://errors.example.com/report"
    }
  }
}
```

The URL must use `https://` or `file://`. Plain `http://` is rejected, since
reports carry stack traces and runtime context that anyone on-path could read. A
`file://` URL is useful for local testing: the runtime appends the JSON to that
path instead of making an HTTP request.

If `errorReporting.url` is not set, the alert still appears but no report is
sent.

## Report format

```json
{
  "version": 1,
  "message": "TypeError: Cannot read properties of null",
  "stack": "TypeError: Cannot read properties of null (reading 'foo')\n    at handler (file:///main.ts:12:14)\n    at …",
  "appVersion": "1.4.0",
  "timestamp": "2026-04-08T12:00:00.000Z",
  "platform": "darwin",
  "arch": "aarch64"
}
```

| Field        | Type                               | Notes                                                                                              |
| ------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `version`    | `1`                                | Schema version. Check this on the server side.                                                     |
| `message`    | `string`                           | The error's `message`.                                                                             |
| `stack`      | `string`                           | The error's `stack`. Source-mapped where possible.                                                 |
| `appVersion` | `string \| null`                   | [`Deno.desktop.desktopVersion`](/api/deno/~/Deno.desktop.desktopVersion) at the time of the error. |
| `timestamp`  | ISO 8601 string                    | UTC timestamp of when the error was caught.                                                        |
| `platform`   | `"darwin" \| "windows" \| "linux"` | [`Deno.build.os`](/api/deno/~/Deno.build.os).                                                      |
| `arch`       | string                             | [`Deno.build.arch`](/api/deno/~/Deno.build.arch).                                                  |

The `Content-Type` header is `application/json`. Reports are sent as a single
POST with no retry. If your server is down, the report is lost. For
high-importance reports, queue them locally and resend on next launch.

## What gets reported

| Source                                       | Captured?                                     |
| -------------------------------------------- | --------------------------------------------- |
| Uncaught exception in Deno-side code         | Yes.                                          |
| Unhandled rejection in Deno-side code        | Yes.                                          |
| Uncaught exception in renderer-side JS       | Yes; caught via the renderer's `error` event. |
| Rust panic in the Deno runtime               | Yes.                                          |
| Rust panic in the rendering backend (CEF, …) | Yes; the backend bridges these.               |
| `console.error` / `console.warn`             | No; these are not errors.                     |
| Exceptions you `try`/`catch` yourself        | No.                                           |

Errors thrown inside a [binding](/runtime/desktop/bindings/) handler propagate
to the webview side and reject the calling promise. They are **not** reported as
uncaught errors; the webview catches them. To report them anyway, log them
yourself in the binding handler.

## Suppressing the alert

The alert is meant to keep the user informed when something goes wrong. It fires
for every uncaught error, unhandled rejection, and panic, and there is currently
no way to suppress it from user code: the runtime registers its `error` and
`unhandledrejection` handlers before your code runs, so a `preventDefault()` in
a listener you add later does not stop the alert or the report.

To keep an error from triggering the alert, prevent it from becoming uncaught:
handle it with `try`/`catch` (or local error handling) in your code and binding
implementations:

```ts
win.bind("readFile", async (path) => {
  try {
    return await Deno.readTextFile(path);
  } catch (e) {
    reportToOwnTelemetry(e);
    return null; // handled, no alert
  }
});
```

You can still add your own `error` / `unhandledrejection` listeners for extra
telemetry; they run after the built-in handler, alongside the alert and report:

```ts
addEventListener("error", (e) => reportToOwnTelemetry(e.error));
addEventListener("unhandledrejection", (e) => reportToOwnTelemetry(e.reason));
```

## Server-side example

A minimal reporter receiver:

```ts title="server/report.ts"
Deno.serve({ port: 8080 }, async (req) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });

  const report = await req.json();
  if (report.version !== 1) {
    return new Response("unsupported version", { status: 400 });
  }

  await Deno.writeTextFile(
    `./reports/${report.timestamp}.json`,
    JSON.stringify(report, null, 2),
  );
  return new Response(null, { status: 204 });
});
```

In production you would write to a database or forward to a proper
crash-collection service.

## Privacy considerations

The default report includes `stack` traces, which may contain user data embedded
in error messages (filenames, URLs, query parameters, serialized object fields).
If your app handles sensitive data, consider:

- Stripping arguments from stack frames before sending.
- Redacting URLs of [`Deno.readTextFile`](/api/deno/~/Deno.readTextFile) calls
  and similar.
- Asking the user before sending the first report (a one-time consent prompt).

These are app-level decisions; the built-in reporter sends what it has and its
payload can't be filtered from user code. For full control over what leaves the
machine, leave `errorReporting.url` unset and send your own reports from `error`
/ `unhandledrejection` handlers instead.
