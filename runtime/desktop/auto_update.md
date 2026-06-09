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

| Option          | Type                        | Notes                                                                                                         |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `url`           | `string`                    | Required if no `desktop.release.baseUrl` is set in `deno.json`.                                               |
| `interval`      | `number` (milliseconds)     | Poll interval. If omitted, only a single check is performed.                                                  |
| `onUpdateReady` | `(version: string) => void` | Called once a patch is applied and staged for next launch.                                                    |
| `onRollback`    | `(reason: string) => void`  | Called shortly after this call if the previous launch failed.                                                 |
| `publicKey`     | `string`                    | Base64 Ed25519 public key. When set, the manifest must be signed (see [Signed manifests](#signed-manifests)). |

## Manifest format

The runtime fetches `<url>/latest.json` and parses it as JSON. Each patch entry
is an object carrying the patch filename and its **SHA-256 hash**:

```json
{
  "version": "1.5.0",
  "patches": {
    "1.4.0": { "name": "patch-1.4.0-to-1.5.0.bin", "sha256": "<64-hex-chars>" },
    "1.4.1": { "name": "patch-1.4.1-to-1.5.0.bin", "sha256": "<64-hex-chars>" },
    "1.3.9": { "name": "patch-1.3.9-to-1.5.0.bin", "sha256": "<64-hex-chars>" }
  }
}
```

| Field     | Meaning                                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version` | The latest available version. Compared with [`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion).                                                            |
| `patches` | Map of from-version → `{ name, sha256 }`. `name` is the patch filename relative to the manifest's URL; `sha256` is the lowercase hex SHA-256 of the patch bytes. |

The `sha256` is **required** — the runtime refuses to apply a patch whose bytes
don't hash to the declared value, so a tampered or truncated download can never
be applied.

Old versions you no longer want to support can be omitted from `patches`. Users
on those versions log a "no patch available for X" message and stay on their
current version.

The update URL **must** be `https://` — the runtime refuses to poll a plaintext
endpoint.

### Signed manifests

For tamper protection beyond TLS, sign the manifest with an Ed25519 key and pass
the public key to [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate). When a
`publicKey` is configured, the manifest must be an envelope:

```json
{
  "signed": "{\"version\":\"1.5.0\",\"patches\":{ … }}",
  "signature": "<base64 Ed25519 signature over the `signed` string>"
}
```

The runtime verifies `signature` over the exact bytes of the `signed` string
using your `publicKey`, then parses `signed` as the trusted manifest. To avoid
depending on a canonical-JSON implementation, the real manifest is embedded
verbatim as the `signed` string and only its contents are trusted.

```ts
Deno.autoUpdate({
  url: "https://releases.example.com/my-app",
  publicKey: "<base64-encoded 32-byte Ed25519 public key>",
});
```

## Update flow

1. **Fetch manifest.** `GET <url>/latest.json`. On a non-2xx response, the check
   silently returns and waits for the next interval.
2. **Compare versions.** If `manifest.version === Deno.desktopVersion`, nothing
   to do.
3. **Look up a patch.** `manifest.patches[Deno.desktopVersion]` →
   `{ name,
   sha256 }`.
4. **Download the patch.** `GET <url>/<name>`. The whole patch is buffered into
   memory; for typical bsdiff outputs (a few MB) this is fine.
5. **Verify and apply.** The runtime checks the downloaded bytes against the
   manifest's `sha256` and refuses to continue on a mismatch, then applies the
   binary diff to the current executable / dylib using the
   [`qbsdiff`](https://crates.io/crates/qbsdiff) crate. The patched bytes are
   sanity-checked to look like a native binary before staging.
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
shasum -a 256 patch-1.4.0-to-1.5.0.bin # the sha256 for the manifest entry
```

Then add the patch's `name` and `sha256` to `latest.json` and upload both the
patch and the manifest to your release server.

For shipping multiple architectures (macOS arm64, x86_64; Windows x86_64; Linux
arm64, x86_64), generate patches per-architecture. Either serve the right
manifest based on user-agent, or include all patches under architecture-specific
keys and pick on the client:

```jsonc
// release/macos-arm64/latest.json
{
  "version": "1.5.0",
  "patches": {
    "1.4.0": { "name": "patch-1.4.0-to-1.5.0.bin", "sha256": "<64-hex-chars>" }
  }
}
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

- **Sign your manifests.** TLS plus the required per-patch `sha256` already stop
  a tampered patch from being applied, but anyone able to serve from your URL
  could still push a validly-hashed malicious patch. For defense in depth, sign
  the manifest with an Ed25519 key and configure `publicKey` (see
  [Signed manifests](#signed-manifests)). Keep the private key off the release
  host.
- **Test patches against a real install.** A patch that applies cleanly but
  produces a non-bootable binary triggers rollback, but only after a failed
  launch — your users see a brief startup failure once. Run the patched binary
  in CI before publishing the manifest.
- **Choose a sensible interval.** Hourly is fine for most apps. Polling more
  often than every few minutes is wasteful for both you and your users.
- **Handle `onRollback`.** A rollback is a signal that a recent release was
  broken on at least one machine. Log it to your telemetry so you notice broken
  releases quickly.
