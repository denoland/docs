---
title: "Persistent Volumes"
description: "Mount block storage into sandboxes to keep state between sessions"
---

Persistent volumes let you attach regional block storage to a sandbox so data
survives process restarts and new connections. They are ideal for package
caches, build artifacts, SQLite databases, or any workflow that needs a small
amount of durable storage without promoting code to a full Deploy app.

## Provision storage with `Client.volumes`

Use the same `Client` class that manages Deploy apps. The SDK targets the
`/api/v2/volumes` endpoints, so all calls authenticate with `DENO_DEPLOY_TOKEN`.

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

| Field      | Required | Details                                                                                                                    |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `slug`     | ✅       | Unique per organization. Slugs become part of the mount metadata, so pick something descriptive.                           |
| `region`   | ✅       | Must match an available sandbox region (`"ord"` or `"ams"` today). Only sandboxes in the same region can mount the volume. |
| `capacity` | ✅       | Between 300 MB and 20 GB. Pass a number of bytes or a string with `GB/MB/KB` (decimal) or `GiB/MiB/KiB` (binary) units.    |

## Inspect and search volumes

`client.volumes.list()` returns paginated results plus a helper iterator, while
`client.volumes.get()` fetches a single record by slug or UUID.

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

The `used` field reports the most recent estimate the control plane received
from the underlying cluster. It can lag a few seconds behind reality, so always
size volumes with headroom.

## Mount volumes inside a sandbox

Pass a `volumes` map when calling `Sandbox.create()`. Keys are mount paths and
values are either the volume slug or ID. The sandbox and volume **must live in
the same region**—the SDK simply forwards volume IDs to that region’s sandbox
API endpoint.

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

  await sandbox.writeTextFile("/data/dataset/hello.txt", "Persist me!\n");
}

// A new sandbox—possibly started hours later—can read the same file
{
  await using sandbox = await Sandbox.create({
    region: "ord",
    volumes: {
      "/data/dataset": volume.id, // IDs work too
    },
  });

  const contents = await sandbox.readTextFile("/data/dataset/hello.txt");
  console.log(contents); // "Persist me!"
}
```

Mounts behave like regular directories. You can create subfolders, write binary
files, or execute programs directly from the volume. Keep paths consistent so
automation can find them reliably.

## Delete volumes safely

```tsx
await client.volumes.delete("training-cache");
```

Deletion is a two-step process:

1. The API marks the volume as deleted immediately, which detaches it from new
   sandbox requests and frees the slug for future reuse.
2. A background job waits 24 hours before removing the underlying block storage
   from the cluster. This grace period allows you to contact support if a volume
   was removed accidentally.

During the grace period you cannot mount or read the volume.

## REST examples

All SDK calls map to documented REST endpoints. You can interact with them
directly from CI scripts or tools that cannot install the SDK.

```bash
curl -X POST https://console.deno.com/api/v2/volumes \
  -H "Authorization: Bearer $DENO_DEPLOY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ml-cache",
    "region": "ams",
    "capacity": "4GB"
  }'
```

List and search volumes:

```bash
curl "https://console.deno.com/api/v2/volumes?limit=50&search=cache" \
  -H "Authorization: Bearer $DENO_DEPLOY_TOKEN"
```

## Operational tips

- Keep separate volumes for unrelated data so you can delete them independently.
- Always create sandboxes in the same region as the volume to avoid connection
  errors during boot.
- Treat `used` as informational. Alert on capacity before it approaches 100 %.
- Mount volumes read-only by convention (never writing) when sharing data
  between concurrent sandboxes to avoid application-level races.
- Snapshot important data elsewhere—volumes are redundant but not a substitute
  for backups.

---
title: "Persistent Volumes"
description: "Mount block storage into sandboxes to keep state between sessions"
---
