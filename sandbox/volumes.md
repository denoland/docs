---
title: "Volumes & Snapshots"
description: "Persistent storage and bootable images for Deno Sandbox"
---

Deno Sandbox provides two storage primitives:

- **Volumes** – read-write block storage mounted at a path you choose. Ideal for
  caches, databases, and artifacts that need to persist across sessions.
- **Snapshots** – read-only images mounted at the root filesystem. Ideal for
  pre-installing software so sandboxes boot instantly with everything ready.

## Volumes

Persistent volumes let you attach regional block storage to a sandbox so data
survives process restarts and new connections. They are ideal for package
caches, build artifacts, SQLite databases, or any workflow that needs a small
amount of durable storage without promoting code to a full Deno Deploy app.

### Provision storage

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();

const volume = await client.volumes.create({
  slug: "training-cache",
  region: "ord", // ord (Chicago) or ams (Amsterdam)
  capacity: "2GB", // accepts bytes or "1GB"/"512MB" style strings
});

console.log(volume);
// {
//   id: "8a0f...",
//   slug: "training-cache",
//   region: "ord",
//   capacity: 2147483648,
//   used: 0
// }
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

volume = sdk.volumes.create(
  slug="training-cache",
  region="ord",  # ord (Chicago) or ams (Amsterdam)
  capacity="2GB"  # accepts bytes or "1GB"/"512MB" style strings
)

print(volume)
# {
#   "id": "8a0f...",
#   "slug": "training-cache",
#   "region": "ord",
#   "capacity": 2147483648,
#   "used": 0
# }
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

volume = await sdk.volumes.create(
  slug="training-cache",
  region="ord",  # ord (Chicago) or ams (Amsterdam)
  capacity="2GB"  # accepts bytes or "1GB"/"512MB" style strings
)

print(volume)
# {
#   "id": "8a0f...",
#   "slug": "training-cache",
#   "region": "ord",
#   "capacity": 2147483648,
#   "used": 0
# }
```

</deno-tab>
</deno-tabs>

| Field      | Required | Details                                                                                                                    |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `slug`     | ✅       | Unique per organization. Slugs become part of the mount metadata, so pick something descriptive.                           |
| `region`   | ✅       | Must match an available sandbox region (`"ord"` or `"ams"` today). Only sandboxes in the same region can mount the volume. |
| `capacity` | ✅       | Between 300 MB and 20 GB. Pass a number of bytes or a string with `GB/MB/KB` (decimal) or `GiB/MiB/KiB` (binary) units.    |

### Inspect and search volumes

The volumes API returns paginated results and can fetch a single record by slug
or UUID.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const page = await client.volumes.list({ search: "training" });
for (const vol of page.items) {
  console.log(vol.slug, vol.used, vol.capacity);
}

const vol = await client.volumes.get("training-cache");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
page = sdk.volumes.list(search="training")
for vol in page.items:
  print(f"{vol['slug']} {vol['used']} {vol['capacity']}")

vol = sdk.volumes.get("training-cache")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
page = await sdk.volumes.list(search="training")
async for vol in page:
  print(f"{vol['slug']} {vol['used']} {vol['capacity']}")

vol = await sdk.volumes.get("training-cache")
```

</deno-tab>
</deno-tabs>

The `used` field reports the most recent estimate the control plane received
from the underlying cluster. It can lag a few minutes behind reality, so always
size volumes with headroom.

### Mount volumes inside a sandbox

Pass a `volumes` mapping when creating a sandbox. Keys are mount paths and
values are either the volume slug or ID. The sandbox and volume **must be in the
same region**.

:::note

`Sandbox.create()` and `client.sandboxes.create()` are equivalent—use whichever
fits your code style.

:::

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();
const volume = await client.volumes.create({
  slug: "dataset",
  region: "ord",
  capacity: "1GB",
});

// First run writes a file to the volume
{
  await using sandbox = await Sandbox.create({
    region: "ord",
    volumes: {
      "/data/dataset": volume.slug,
    },
    labels: { job: "prepare" },
  });

  await sandbox.fs.writeTextFile("/data/dataset/hello.txt", "Persist me!\n");
}

// A new sandbox—possibly started hours later—can read the same file
{
  await using sandbox = await Sandbox.create({
    region: "ord",
    volumes: {
      "/data/dataset": volume.id, // IDs work too
    },
  });

  const contents = await sandbox.fs.readTextFile("/data/dataset/hello.txt");
  console.log(contents); // "Persist me!"
}
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

volume = sdk.volumes.create(
  slug="dataset",
  region="ord",
  capacity="1GB"
)

# First run writes a file to the volume
with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["slug"],
  },
  labels={"job": "prepare"}
) as sandbox:
  sandbox.fs.write_text_file("/data/dataset/hello.txt", "Persist me!\n")

# A new sandbox—possibly started hours later—can read the same file
with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["id"],  # IDs work too
  }
) as sandbox:
  contents = sandbox.fs.read_text_file("/data/dataset/hello.txt")
  print(contents)  # "Persist me!"
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

volume = await sdk.volumes.create(
  slug="dataset",
  region="ord",
  capacity="1GB"
)

# First run writes a file to the volume
async with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["slug"],
  },
  labels={"job": "prepare"}
) as sandbox:
  await sandbox.fs.write_text_file("/data/dataset/hello.txt", "Persist me!\n")

# A new sandbox—possibly started hours later—can read the same file
async with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["id"],  # IDs work too
  }
) as sandbox:
  contents = await sandbox.fs.read_text_file("/data/dataset/hello.txt")
  print(contents)  # "Persist me!"
```

</deno-tab>
</deno-tabs>

Mounts behave like regular directories. You can create subfolders, write binary
files, or execute programs directly from the volume.

### Delete volumes safely

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await client.volumes.delete("training-cache");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk.volumes.delete("training-cache")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
await sdk.volumes.delete("training-cache")
```

</deno-tab>
</deno-tabs>

Deletion is a two-step process:

1. The API marks the volume as deleted immediately, which detaches it from new
   sandbox requests and frees the slug for future reuse.
2. A background job waits 24 hours before removing the underlying block storage
   from the cluster. This grace period allows you to contact support if a volume
   was removed accidentally.

During the grace period you cannot mount or read the volume.

## Snapshots

Snapshots are read-only images created from volumes. When a sandbox boots with a
snapshot as its root, the entire filesystem is replaced with the snapshot
contents. This is ideal for pre-installing software—run `apt-get install` or
`npm install` once, snapshot the result, and every future sandbox starts
instantly with everything already installed.

### Creating a snapshot

The workflow is:

1. Create a **bootable volume** from a base image
2. Boot a sandbox with that volume as `root` (writable)
3. Install software, then `sync` to flush writes
4. Snapshot the volume

Sandboxes booted from the snapshot start instantly with everything installed.

A volume is **bootable** when created with the `from` option. Currently
`builtin:debian-13` is the only available base image.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();

// 1. Create a bootable volume
const volume = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain",
  capacity: "10GiB",
  from: "builtin:debian-13",
});

// 2. Boot a sandbox with the volume as root (writable)
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
});

// 3. Install software
await sandbox.sh`apt-get update && apt-get install -y nodejs npm`;
await sandbox.sh`npm install -g typescript`;
await sandbox.sh`sync`;

// 4. Snapshot the volume
const snapshot = await client.volumes.snapshot(volume.id, {
  slug: "my-toolchain-snapshot",
});
```

</deno-tab>
<deno-tab value="cli" label="CLI">

```bash
# Create snapshot from a volume
deno sandbox snapshots create my-toolchain my-toolchain-snapshot
```

</deno-tab>
</deno-tabs>

### Booting from a snapshot

Once you have a snapshot, use it as the `root` when creating new sandboxes. The
sandbox must be created in the same region as the snapshot:

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "my-toolchain-snapshot", // snapshot slug or ID
});

// TypeScript and Node.js are already installed
await sandbox.sh`tsc --version`;
await sandbox.sh`node --version`;
```

</deno-tab>
</deno-tabs>

The sandbox boots with the snapshot's filesystem as its root. Any writes during
the session are ephemeral—they don't modify the snapshot.

### Listing snapshots

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const page = await client.snapshots.list();
for (const snap of page.items) {
  console.log(snap.slug, snap.region, snap.bootable);
}
```

</deno-tab>
<deno-tab value="cli" label="CLI">

```bash
$ deno sandbox snapshots list
ID                             SLUG                    REGION   ALLOCATED    BOOTABLE
snp_ord_spmbe47dysccpy277ma6   my-toolchain-snapshot   ord      217.05 MiB   TRUE
```

</deno-tab>
</deno-tabs>

### Deleting snapshots

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await client.snapshots.delete("my-toolchain-snapshot");
```

</deno-tab>
<deno-tab value="cli" label="CLI">

```bash
deno sandbox snapshots delete my-toolchain-snapshot
```

</deno-tab>
</deno-tabs>

### Volumes vs Snapshots

| Feature        | Volumes                             | Snapshots                          |
| -------------- | ----------------------------------- | ---------------------------------- |
| Access         | Read-write                          | Read-only                          |
| Mount point    | Any path, or root if bootable       | Root filesystem only               |
| Use case       | Caches, databases, install software | Pre-installed software, toolchains |
| Boot speed     | Normal                              | Fast (no install step needed)      |
| Concurrent use | One sandbox at a time               | Many sandboxes simultaneously      |
| Region         | Must match sandbox region           | Must match sandbox region          |
