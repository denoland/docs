---
title: "Auto-update"
description: "Ship binary-diff updates to deno desktop apps with Deno.autoUpdate() — bsdiff patches, manifest polling, automatic rollback on failed launch."
---

[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) polls a release server for
new versions, downloads binary-diff patches, applies them to the runtime dylib,
and stages the result for the next launch. If the next launch fails, the runtime
rolls back to the previous version automatically.

The update mechanism is inspired by Electrobun: small `bsdiff` patches instead
of full binary downloads, and rollback baked into the launcher.

## Prerequisites

Two pieces of configuration are required:

1. A `version` in your `deno.json`:
   ```jsonc
   { "version": "1.4.0" }
   ```
2. A `desktop.release.baseUrl` in your `deno.json`:
   ```jsonc
   {
     "desktop": {
       "release": { "baseUrl": "https://releases.example.com/my-app" }
     }
   }
   ```

Both are baked into the compiled binary. The version is exposed at runtime as
[`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion):

```ts
console.log(Deno.desktopVersion); // "1.4.0", or null if no version was set
```

If [`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion) is `null`,
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) is a no-op — the runtime
warns once and returns.

## Calling `autoUpdate()`

```ts
Deno.autoUpdate({
  url: "https://releases.example.com/my-app",
  interval: 60 * 60 * 1000, // hourly
  onUpdateReady(version) {
    console.log("Update", version, "ready; will apply on next launch");
  },
  onRollback(reason) {
    console.warn("Previous launch failed; rolled back:", reason);
  },
});
```

Or pass a URL string for a single one-shot check on startup:

```ts
Deno.autoUpdate("https://releases.example.com/my-app");
```

| Option          | Type                        | Notes                                                           |
| --------------- | --------------------------- | --------------------------------------------------------------- |
| `url`           | `string`                    | Required if no `desktop.release.baseUrl` is set in `deno.json`. |
| `interval`      | `number` (milliseconds)     | Poll interval. If omitted, only a single check is performed.    |
| `onUpdateReady` | `(version: string) => void` | Called once a patch is applied and staged for next launch.      |
| `onRollback`    | `(reason: string) => void`  | Called shortly after this call if the previous launch failed.   |

## Manifest format

The runtime fetches `<url>/latest.json` and parses it as JSON:

```json
{
  "version": "1.5.0",
  "patches": {
    "1.4.0": "patch-1.4.0-to-1.5.0.bin",
    "1.4.1": "patch-1.4.1-to-1.5.0.bin",
    "1.3.9": "patch-1.3.9-to-1.5.0.bin"
  }
}
```

| Field     | Meaning                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `version` | The latest available version. Compared with [`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion). |
| `patches` | Map of from-version → patch filename relative to the manifest's URL.                                  |

Old versions you no longer want to support can be omitted from `patches`. Users
on those versions log a "no patch available for X" message and stay on their
current version.

## Update flow

1. **Fetch manifest.** `GET <url>/latest.json`. On a non-2xx response, the check
   silently returns and waits for the next interval.
2. **Compare versions.** If `manifest.version === Deno.desktopVersion`, nothing
   to do.
3. **Look up a patch.** `manifest.patches[Deno.desktopVersion]` → patch
   filename.
4. **Download the patch.** `GET <url>/<filename>`. The whole patch is buffered
   into memory; for typical bsdiff outputs (a few MB) this is fine.
5. **Apply with `bspatch`.** The runtime applies the binary diff to the current
   executable / dylib using the [`qbsdiff`](https://crates.io/crates/qbsdiff)
   crate.
6. **Stage the result.** Write the patched binary as `<binary>.update` next to
   the original. Do not overwrite the running binary in place.
7. **Fire `onUpdateReady`.**

The original binary is untouched until the next launch. If the user closes the
app and reopens it, the launcher swaps `<binary>.update` into place and starts
the new version.

## Rollback on failed launch

When `<binary>.update` exists at startup, the launcher:

1. Renames the **current** binary to `<binary>.previous`.
2. Renames `<binary>.update` to the current binary path.
3. Runs the new binary with a `--first-launch-after-update` marker.

If the new binary completes its first launch successfully (the runtime calls an
internal "confirm update" op shortly after startup), the `<binary>.previous` is
deleted and a sentinel file (`<binary>.update-ok`) is created.

If the new binary fails to launch — crashes during startup, returns a non-zero
exit before confirming, or never confirms — the launcher:

1. Restores `<binary>.previous` as the current binary.
2. Deletes the failed `<binary>.update`.
3. Records the rollback so the next launch's
   [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) call fires `onRollback`
   with the reason.

This makes broken updates self-healing. Users do not need to know anything
happened beyond seeing the same version they had before.

## Generating patches

The patches are produced with `bsdiff`. Any tool that produces compatible output
works; the simplest is the `bsdiff` CLI:

```sh
bsdiff old-binary new-binary patch-1.4.0-to-1.5.0.bin
```

Then upload `patch-1.4.0-to-1.5.0.bin` and the new `latest.json` to your release
server.

For shipping multiple architectures (macOS arm64, x86_64; Windows x86_64; Linux
arm64, x86_64), generate patches per-architecture. Either serve the right
manifest based on user-agent, or include all patches under architecture-specific
keys and pick on the client:

```jsonc
// release/macos-arm64/latest.json
{ "version": "1.5.0", "patches": { "1.4.0": "patch-1.4.0-to-1.5.0.bin" } }
```

```ts
const arch = Deno.build.os + "-" + Deno.build.arch;
Deno.autoUpdate({
  url: "https://releases.example.com/" + arch,
  interval: 60 * 60 * 1000,
});
```

## Events

In addition to the callbacks, the runtime dispatches DOM-style events on the
global `EventTarget`:

```ts
addEventListener("desktop-update-ready", (e) => {
  const version = (e as CustomEvent<{ version: string }>).detail.version;
  // …
});

addEventListener("desktop-update-rollback", (e) => {
  const reason = (e as CustomEvent<{ reason: string }>).detail.reason;
  // …
});
```

The events fire alongside `onUpdateReady` / `onRollback`, so use whichever style
fits your code better.

## Best practices

- **Sign your manifests.** The runtime does not currently verify a signature on
  `latest.json` — anyone able to MITM the connection (or serve from your URL)
  could push an arbitrary patch. Use HTTPS with certificate pinning at the
  network level, host the manifest on a domain you control, and consider adding
  a signature field once the runtime supports verification.
- **Test patches against a real install.** A patch that applies cleanly but
  produces a non-bootable binary triggers rollback, but only after a failed
  launch — your users see a brief startup failure once. Run the patched binary
  in CI before publishing the manifest.
- **Choose a sensible interval.** Hourly is fine for most apps. Polling more
  often than every few minutes is wasteful for both you and your users.
- **Handle `onRollback`.** A rollback is a signal that a recent release was
  broken on at least one machine. Log it to your telemetry so you notice broken
  releases quickly.
