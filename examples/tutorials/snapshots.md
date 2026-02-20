---
title: "Deno Sandbox Snapshots Tutorial"
description: "Use read only images to create isolated and reproducible environments."
url: "/examples/snapshots_tutorial/"
---

Snapshots are useful for creating read-only images that can be used to
instantiate multiple sandboxes with the same base environment. Useful if you are
frequently creating sandboxes that need the same set of dependencies or tools
installed, or have particularly long setup times.

Let’s build a “boot-in-seconds” sandbox: we’ll bake Node.js, TypeScript, and a
CLI into a bootable volume, snapshot it, then spin up multiple sandboxes that
inherit the same environment without running installers again.

We will:

1. Start from the `builtin:debian-13` base image.
2. Install Node.js and some global tooling exactly once.
3. Snapshot the prepared volume into `my-toolchain-snapshot`.
4. Boot new sandboxes from that snapshot and verify the tools are ready the
   moment the sandbox starts.

## Authenticate and bootstrap the client

In order to use the Deno Sandbox API, we first need to set up a Deno Sandbox
access token.

1. In your Deno Deploy dashboard, navigate to the **Sandboxes** section.
2. Create a new token, copy the token value.
3. Set this token as a `DENO_DEPLOY_TOKEN` environment variable in your local
   environment.

Then we can bootstrap the client with the SDK:

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

## Create a bootable workspace

For the this tutorial we will use the `ord` region and stick with it for the
volume, snapshot, and sandboxes.

Create a new volume based on the `builtin:debian-13` image:

```tsx
const volume = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain",
  capacity: "10GB",
});

console.log(`Bootable volume ready: ${volume.slug}`);
```

Setting `from` makes the volume bootable. The sandbox can mount it as the root
filesystem and write changes directly onto it.

## Customize the image

Lets install Node.js, npm and TypeScript into the volume.

```tsx
await using build = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
  labels: { job: "toolchain-build" },
});

await build.sh`sudo apt-get update`;
await build.sh`sudo apt-get install -y nodejs npm`;
await build.sh`npm install -g typescript`;
await build.fs.writeTextFile(
  "/opt/banner.txt",
  "This sandbox boots with Node.js, npm, and TypeScript pre-installed.\n",
);
```

Everything in this session persists back to the bootable volume.

## Snapshot the result

Now that the volume is customized, we can snapshot it for fast reuse:

```tsx
const snapshot = await client.volumes.snapshot(volume.id, {
  slug: "my-toolchain-snapshot",
});

console.log(`Snapshot ready: ${snapshot.slug} (${snapshot.region})`);
```

Run the script with `deno run -A main.ts` to execute the setup steps inside a
sandbox that mounts the bootable volume.

You could also create the snapshot in the CLI with the following command:

```bash
deno sandbox snapshots create my-toolchain my-toolchain-snapshot
```

Snapshots are read-only copies. They can back many sandboxes simultaneously, and
boot time is dramatically faster because the filesystem is already baked.

## Boot from the snapshot and use it

Now that the snapshot is ready, we can spin up new sandboxes that use it as the
root filesystem:

```tsx
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();

await using dev = await client.sandboxes.create({
  region: "ord",
  root: snapshot.slug,
  labels: { job: "dev-shell" },
});

const nodeVersion = await dev.sh`node --version`;
const tscVersion = await dev.sh`tsc --version`;
const banner = await dev.fs.readTextFile("/opt/banner.txt");

console.log({ nodeVersion: nodeVersion.stdout, tscVersion: tscVersion.stdout });
console.log(banner);
```

Writes inside this sandbox are ephemeral—they vanish when the session ends—but
reads pull directly from the snapshot's filesystem, so every sandbox sees the
same curated environment instantly.

## Iterate or retire snapshots

Need an updated toolchain? You can fork the snapshot into a writable volume,
make changes, then snapshot again.

```tsx
const fork = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain-fork",
  capacity: "10GiB",
  from: snapshot.slug,
});
```

When a snapshot is obsolete you can remove it:

```tsx
await client.snapshots.delete(snapshot.slug);
```

🦕 You now have a concrete workflow for shipping reproducible environments:
build once, snapshot, and hand teammates a slug that boots fully configured
sandboxes in seconds.
