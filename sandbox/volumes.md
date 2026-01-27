---
title: "Persistent Volumes"
description: "Mount block storage into Deno Sandbox to keep state between sessions"
---

Persistent volumes let you attach regional block storage to a sandbox so data
survives process restarts and new connections. They are ideal for package
caches, build artifacts, SQLite databases, or any workflow that needs a small
amount of durable storage without promoting code to a full Deno Deploy app.

:::note

Persistent volumes are currently in private beta. Contact
[support](mailto:support@deno.com) to request access to this feature

:::

## Provision storage

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

## Inspect and search volumes

The volumes API returns paginated results and can fetch a single record by slug
or UUID.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const page = await client.volumes.list({ search: "training" });
for (const info of page.items) {
  console.log(
    info.slug,
    formatBytes(info.used),
    "of",
    formatBytes(info.capacity),
  );
}

const latest = await client.volumes.get("training-cache");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
page = sdk.volumes.list(search="training")
for info in page.items:
  print(f"{info['slug']} {info['used']} of {info['capacity']}")

latest = sdk.volumes.get("training-cache")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
page = await sdk.volumes.list(search="training")
async for info in page:
  print(f"{info['slug']} {info['used']} of {info['capacity']}")

latest = await sdk.volumes.get("training-cache")
```

</deno-tab>
</deno-tabs>

The `used` field reports the most recent estimate the control plane received
from the underlying cluster. It can lag a few minutes behind reality, so always
size volumes with headroom.

## Mount volumes inside a sandbox

Pass a volumes mapping when creating a sandbox. Keys are mount paths and values
are either the volume slug or ID. The sandbox and volume **must live in the
same region**.

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

## Delete volumes safely

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
