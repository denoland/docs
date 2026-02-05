---
title: "Deno Sandbox Volumes Tutorial"
description: "Add read-write block storage to your Deno sandbox."
url: "/examples/volumes_tutorial/"
---

Volumes are durable, regional block storage devices that you can attach to Deno
sandboxes. They behave like regular directories, letting you read and write
files which persist across sandbox sessions.

In this tutorial we'll build a reproducible data-prep workflow: one sandbox
downloads training artifacts once, writes them to a persistent volume, and every
later sandbox run reuses that cache instantly.

We will:

1. Create a regional volume called `training-cache`.
2. Spin up a “prepare” sandbox that writes files into `/data/cache` on that
   volume.
3. Start a “serve” sandbox hours later and read the exact same files for a mock
   training job.
4. Inspect usage and tear everything down when we’re done.

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

## Provision storage for the cache

Pick a region (`ord` or `ams`) that matches the sandboxes you plan to run.

We're going to provide 2 GB of storage for our training cache volume:

```tsx
const volume = await client.volumes.create({
  slug: "training-cache",
  region: "ord",
  capacity: "2GB",
});

console.log(`Created volume ${volume.slug} (${volume.capacity} bytes)`);
```

Volume slugs must be unique per org; the response returns both the slug and the
stable UUID. The capacity string can be any decimal (`GB/MB/KB`) or binary
(`GiB/MiB/KiB`) unit between 300 MB and 20 GB.

## Populate the cache once

Lets imagine that your training job needs to download large datasets or
binaries.

Rather than pull it on every run, the `prepare` sandbox writes it to the shared
volume.

We'll mount the volume at `/data/cache` inside the sandbox:

```tsx title="main.ts"
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();

const volume = await client.volumes.create({
  slug: "training-cache",
  region: "ord",
  capacity: "2GB",
});

console.log(`Created volume ${volume.slug} (${volume.capacity} bytes)`);

await using sandbox = await Sandbox.create({
  region: "ord",
  volumes: {
    "/data/cache": volume.slug,
  },
  labels: { job: "prepare" },
});

await sandbox.fs.mkdir("/data/cache/datasets", { recursive: true });
await sandbox.fs.writeTextFile(
  "/data/cache/datasets/embeddings.json",
  JSON.stringify({ updatedAt: Date.now(), vectors: [1, 2, 3] }, null, 2),
);

await sandbox.fs.writeTextFile(
  "/data/cache/README.txt",
  "Cached once, reused forever.\n",
);
```

We're creating a sandbox and mounting a volume inside it at `/data/cache`. Then
we write some mock dataset files into that directory.

Run this script with `deno run -A main.ts` to create the volume and populate it.

## Reuse the cache later

Hours (or deployments) later we can spin up a fresh sandbox, mount the same
volume by the slug, and read the files. This mimics a reproducible training run
that skips the expensive download step.

```tsx title="main2.ts"
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({
  region: "ord",
  volumes: {
    "/data/cache": "training-cache",
  },
});

const metadata = await sandbox.fs.readTextFile(
  "/data/cache/datasets/embeddings.json",
);

console.log("Loaded cached dataset:", metadata);
```

Run this script with `deno run -A main2.ts` to start a new sandbox and read the
cached files.

Because volumes behave like regular directories, you can stream logs, run
executables, or store SQLite databases directly inside the mount.

## Inspect usage as the cache grows

You can list volumes in your org and see their current usage, helpful when
planning capacity for future workloads.

```tsx
const page = await client.volumes.list({ search: "training" });
for (const vol of page.items) {
  console.log(
    `${vol.slug} uses ${vol.estimatedFlattenedSize}/${vol.capacity} bytes`,
  );
}

const latest = await client.volumes.get(volume.slug);
console.log(
  `Most recent usage estimate: ${latest?.estimatedFlattenedSize} bytes`,
);
```

Telemetry can trail real usage by a couple of minutes, so add headroom when you
pick `capacity`.

## Clean up when the experiment ends

Once you're done with the volume, you can delete it to free up resources:

```tsx
await client.volumes.delete(volume.slug);
```

Deletion is intentional but forgiving:

1. The volume is marked deleted immediately and detached from future sandbox
   requests—its slug becomes available again.
2. The underlying block storage is destroyed after a 24-hour grace period so you
   can contact support if the deletion was accidental.

🦕 You now have a hands-on pattern for caching artifacts across sandbox runs.
Swap in your own datasets, binaries, or build outputs to accelerate any job that
needs durable storage without leaving the sandbox environment.
