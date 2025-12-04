---
title: "Persistent Volumes"
description: "Mount shared block storage into sandboxes to keep state between sessions or collaborate across microVMs."
---

Volumes act like detachable drives that can be mounted into one or more
sandboxes. Use them to persist build artifacts, cache packages, or pass files
between agent runs without uploading from scratch.

## Create and attach a volume

```tsx
import { Sandbox } from "@deno/sandbox";

const volume = await Sandbox.createVolume({
  name: "agent-cache",
  sizeGb: 5,
});

await using sandbox = await Sandbox.create({
  volumes: [
    {
      id: volume.id,
      mountPath: "/mnt/cache",
      accessMode: "rw",
    },
  ],
});

await sandbox.sh`ls /mnt/cache`;
```

### Options

| Field        | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `name`       | Friendly identifier for the volume.                                  |
| `sizeGb`     | Allocated storage in gigabytes. Useful for large models or caches.   |
| `mountPath`  | Absolute path inside the sandbox where the volume becomes available. |
| `accessMode` | `"rw"` for read/write or `"ro"` for read-only sharing.               |

## Share between sandboxes

Volumes are independent resources. Mount the same volume into multiple sandboxes
to coordinate work:

```tsx
const shared = await Sandbox.createVolume({
  name: "team-workspace",
  sizeGb: 2,
});

await using sb1 = await Sandbox.create({
  volumes: [{ id: shared.id, mountPath: "/workspace" }],
});
await using sb2 = await Sandbox.create({
  volumes: [{ id: shared.id, mountPath: "/workspace", accessMode: "ro" }],
});

await sb1.sh`echo "artifact" > /workspace/build.txt`;
await sb2.sh`cat /workspace/build.txt`;
```

This pattern makes it easy for agents to hand off work, or for a CI sandbox to
produce files that a second sandbox inspects.

## Lifecycle and cleanup

- Volumes remain until you explicitly delete them via
  `await Sandbox.deleteVolume(id)`.
- Detach volumes from a sandbox by omitting them in the `volumes` array or
  calling `sandbox.detachVolume(id)` (coming soon).
- Keep mounts organized by using consistent `mountPath` conventions, such as
  `/mnt/data` or `/workspace/<team>`.

## Best practices

- Use read-only mounts when a sandbox should consume but not modify shared
  assets.
- Pair volumes with `allowNet` rules to ensure data written to disk cannot be
  exfiltrated to untrusted hosts.
- Monitor volume usage in the Sandboxes dashboard; stale volumes can be removed
  to reclaim capacity.

Volumes bring statefulness to an otherwise ephemeral environment, letting you
mix fast-booting compute with durable storage when the workflow demands it.
