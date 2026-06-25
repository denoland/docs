---
last_modified: 2026-06-25
title: "Auto-update"
description: "Ship binary-diff updates to deno desktop apps with Deno.autoUpdate(): bsdiff patches, manifest polling, automatic rollback on failed launch."
---

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) polls a release server for
new versions, downloads binary-diff patches, applies them to the runtime dylib,
and stages the result for the next launch. If the next launch fails, the runtime
rolls back to the previous version automatically. Updates ship as small `bsdiff`
patches instead of full binary downloads, with rollback baked into the launcher.

:::note Platform support

Applying staged updates and rolling back on a failed launch currently run on
**macOS and Linux only**. On Windows, patches are still downloaded and staged,
but the launcher does not yet swap them in (a loaded DLL can't be replaced in
place), so updates do not take effect. Treat Windows auto-update as not yet
supported.

:::

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
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) is a no-op: the runtime warns
once and returns. This is also what happens under `deno run`, since a
non-compiled program has no baked-in version.
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) does not throw there, so you
can leave the call in your code and run the same entry point with `deno run`
during development.

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

The `sha256` is **required**: the runtime refuses to apply a patch whose bytes
don't hash to the declared value, so a tampered or truncated download can never
be applied.

Old versions you no longer want to support can be omitted from `patches`. Users
on those versions log a "no patch available for X" message and stay on their
current version.

The update URL **must** be `https://`: the runtime refuses to poll a plaintext
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
   `{ name, sha256 }`.
4. **Download the patch.** `GET <url>/<name>`. The whole patch is buffered into
   memory; for typical bsdiff outputs (a few MB) this is fine.
5. **Verify and apply.** The runtime checks the downloaded bytes against the
   manifest's `sha256` and refuses to continue on a mismatch, then applies the
   binary diff to the app's runtime dylib using the
   [`qbsdiff`](https://crates.io/crates/qbsdiff) crate. The patched bytes are
   sanity-checked to look like a native binary before staging.
6. **Stage the result.** Write the patched dylib as `<dylib>.update` next to the
   original. The running dylib is left untouched.
7. **Fire `onUpdateReady`.**

The running dylib is untouched until the next launch. When the app restarts, the
launcher swaps the staged update into place before anything else runs.

## Rollback on failed launch

The launcher resolves staged updates and rollback state at startup, before
anything else runs, using three files next to the runtime dylib:
`<dylib>.update` (a staged patch), `<dylib>.backup` (the previous dylib), and
`<dylib>.update-ok` (a success sentinel).

- If `<dylib>.update` exists, the launcher copies the current dylib aside to
  `<dylib>.backup` (leaving the original in place), swaps the staged update into
  the dylib path, and starts the new version. Once it boots successfully, the
  runtime calls an internal "confirm update" op that writes `<dylib>.update-ok`.
- On a later launch, if `<dylib>.backup` and `<dylib>.update-ok` both exist, the
  previous update is confirmed good and both files are cleaned up.
- If `<dylib>.backup` exists but `<dylib>.update-ok` does not, the last update
  started but never confirmed, meaning it crashed during startup. The launcher
  restores `<dylib>.backup` over the dylib, rolling back. The next
  [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) call then fires
  `onRollback` with the reason.

This makes broken updates self-healing. Users do not need to know anything
happened beyond seeing the same version they had before.

## Generating patches

A patch is a `bsdiff` of the app's runtime dylib between two releases, the file
the updater patches, which lives inside your built app. `qbsdiff` reads the
`bsdiff` 4.x format, so the classic `bsdiff` CLI produces compatible output:

```sh
bsdiff old-dylib new-dylib patch-1.4.0-to-1.5.0.bin
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

## Best practices

- **Sign your manifests.** TLS plus the required per-patch `sha256` already stop
  a tampered patch from being applied, but anyone able to serve from your URL
  could still push a validly-hashed malicious patch. For defense in depth, sign
  the manifest with an Ed25519 key and configure `publicKey` (see
  [Signed manifests](#signed-manifests)). Keep the private key off the release
  host.
- **Test patches against a real install.** A patch that applies cleanly but
  produces a non-bootable binary triggers rollback, but only after a failed
  launch, so your users see a brief startup failure once. Run the patched binary
  in CI before publishing the manifest.
- **Choose a sensible interval.** Hourly is fine for most apps. Polling more
  often than every few minutes is wasteful for both you and your users.
- **Handle `onRollback`.** A rollback is a signal that a recent release was
  broken on at least one machine. Log it to your telemetry so you notice broken
  releases quickly.
