---
last_modified: 2026-06-10
title: "Notifications"
description: "Show native OS notifications from deno desktop apps with the standard Web Notifications API — permission flow, options, and events."
---

`deno desktop` implements the standard
[Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notification).
The same `Notification` constructor you would use in a browser shows a **native
OS notification** — macOS User Notifications, Windows toast notifications, or
the Linux desktop notification service — from your Deno-side code.

```ts
const n = new Notification("Build complete", {
  body: "Your binary is ready.",
});

n.addEventListener("click", () => win.focus()); // bring the app to front
```

`Notification` is only defined in apps compiled with `deno desktop`. In a plain
`deno run` script it does not exist.

## Permissions

Notifications are gated by an OS-level permission, exactly as on the web. Check
the current state with `Notification.permission` and request it with
`Notification.requestPermission()`:

```ts
if (Notification.permission !== "granted") {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    // The user declined — don't try to notify.
    return;
  }
}

new Notification("All set", { body: "Notifications are enabled." });
```

`Notification.permission` is a **cached** synchronous getter holding the result
of the most recent query or request. `requestPermission()` triggers a system
prompt the first time the user has not yet decided, and resolves to `"granted"`,
`"denied"`, or `"default"`.

For the live OS state — including whether the platform has a permission model at
all — query the Permissions API:

```ts
const status = await navigator.permissions.query({ name: "notifications" });
console.log(status.state); // "granted" | "denied" | "prompt"
```

On a platform or backend with no permission concept (an unbundled macOS process,
some Linux notification daemons), the query reports `"prompt"` and notifications
are shown without an explicit grant.

:::note macOS requires a code-signed bundle

macOS only hands out notification permission to an app with a stable code
identity. `deno desktop` ad-hoc-signs every bundle it produces (and re-signs the
cached runtime in `--hmr` mode) so this works out of the box. See
[Distribution](/runtime/desktop/distribution/#code-signing) for configuring a
real signing identity.

:::

## Options

The constructor takes the standard `NotificationOptions`:

```ts
new Notification("New message", {
  body: "Alice: are we still on for 3pm?",
  icon: "data:image/png;base64,iVBORw0KGgo…",
  tag: "chat-alice",
  requireInteraction: true,
  silent: false,
});
```

| Option               | Type                       | Notes                                                                     |
| -------------------- | -------------------------- | ------------------------------------------------------------------------- |
| `body`               | `string`                   | The notification's body text.                                             |
| `icon`               | `string`                   | Icon URL. Only `data:` URLs are shown (see below).                        |
| `tag`                | `string`                   | Replaces any existing notification with the same tag instead of stacking. |
| `requireInteraction` | `boolean`                  | Keep the notification visible until the user dismisses it.                |
| `silent`             | `boolean \| null`          | Suppress the notification sound.                                          |
| `badge`              | `string`                   | Badge URL (platform-dependent).                                           |
| `dir`                | `"auto" \| "ltr" \| "rtl"` | Text direction.                                                           |
| `lang`               | `string`                   | BCP 47 language tag.                                                      |
| `data`               | `any`                      | Arbitrary data attached to the notification; read it back from `data`.    |

### Icons

The Web Notifications spec types `icon` as a URL string. The desktop runtime can
only resolve `data:` URLs synchronously, so an inline `data:image/png;base64,…`
icon is rendered. Other URL schemes (`https:`, `file:`) are accepted and
round-trip through the `icon` property, but the OS notification is shown without
an icon. To use a file on disk, read it and encode it as a `data:` URL:

```ts
const bytes = await Deno.readFile("./icons/alert.png");
const dataUrl = "data:image/png;base64," + encodeBase64(bytes);
new Notification("Heads up", { icon: dataUrl });
```

## Events

A `Notification` is an `EventTarget`. Listen with `addEventListener` or the
`on<event>` properties:

```ts
const n = new Notification("Download finished");

n.onshow = () => console.log("shown");
n.onclick = () => openDownloadsFolder();
n.onclose = () => console.log("dismissed");
n.onerror = () => console.warn("the OS rejected the notification");
```

| Event   | When it fires                                         |
| ------- | ----------------------------------------------------- |
| `show`  | The OS displayed the notification.                    |
| `click` | The user clicked the notification body.               |
| `close` | The user dismissed it, or it expired.                 |
| `error` | The OS could not display it (e.g. permission denied). |

## Dismissing

Call `close()` to dismiss a notification programmatically:

```ts
const n = new Notification("Connecting…");
// later, once connected:
n.close();
```

Notifications are otherwise fire-and-forget — the OS owns them once shown, and
`close()` is a best-effort request.
