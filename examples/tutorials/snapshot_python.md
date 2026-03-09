---
title: "Boot a Python environment with snapshots"
description: "Create a sandbox, preload Python + scientific packages, snapshot it, and boot zero-setup sandboxes that run a Mandelbrot explorer."
url: /examples/snapshot_python_tutorial/
---

In this tutorial we will use the Deno Sandbox SDK to create a bootable volume,
set up a development environment on that volume and snapshot it for future use.
This workflow is ideal for languages like Python where environment setup can be
slow, but the resulting filesystem can be reused across many sandboxes.

To use the Deno Sandbox SDK, you will need a Deno Deploy account and an access
token. You can [sign up for free](https://console.deno.com/deploy) and create an
access token in the dashboard under **Sandboxes** → **Overview** → **+ Create
Token**.

## Create a basic Deno application and install the @deno/sandbox SDK

First, create a new directory for this project and initialize a Deno
application:

```sh
deno init my-snapshot-project
cd my-snapshot-project
deno add jsr:@deno/sandbox
```

## 1. Bake Python into a bootable volume

Create a new file `setup_python.ts`. This script will create a new volume, boot
it, install Python and some popular libraries, then snapshot the volume for
future use. The idea is to do the slow setup work once, then reuse the snapshot
to boot new sandboxes in seconds.

In this file we will import the Sandbox SDK, create a client and set up a
function to initialize a volume with Python:

```ts title="setup_python.ts"
import { SandboxClient } from "@deno/sandbox";
const client = new SandboxClient();

async function initSandbox() {
  // ... we'll fill this in next
}
```

Inside that function, we'll create a new volume with 10GB of space, give it a
slug for easy reference and specify the region:

```ts title="setup_python.ts (cont.)"
const volume = await client.volumes.create({
  region: "ord",
  slug: "fun-with-python",
  capacity: "10GB",
});
```

Next we boot a sandbox with that volume as its root filesystem. The
`await using` pattern ensures that the sandbox is automatically cleaned up when
we're done with it:

```ts title="setup_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
});
```

We install Python and some common scientific libraries using `apt` and `pip`.
Note the use of `--break-system-packages` with pip -- since this sandbox owns
the whole system, we can safely bypass pip's usual protections against messing
with system files:

```ts title="setup_python.ts (cont.)"
await sandbox.sh`sudo apt-get update -qq`;
await sandbox
  .sh`sudo apt-get install -y python3 python3-pip python3-venv python3-dev build-essential`;

await sandbox.sh`sudo pip3 install --break-system-packages \
    requests \
    httpx \
    numpy \
    pandas \
    python-dotenv`;

console.log("Verifying Python installation...");

await sandbox.sh`python3 --version`;
await sandbox.sh`pip3 --version`;
```

The final step of this function is to return the `volume.id` so that we can pass
it to the snapshot step:

```ts title="setup_python.ts (cont.)"
return volume.id;
```

(Remember to close the function with a `}` after this return.)

Next we call this function and snapshot the resulting volume. This will create a
new snapshot with the slug `fun-with-python-snapshot` that we can boot from
later:

```ts title="setup_python.ts (cont.)"
const volumeId = await initSandbox();

console.log("Snapshotting the volume...");

const snapshot = await client.volumes.snapshot(volumeId, {
  slug: "fun-with-python-snapshot",
});

console.log("Created Python snapshot " + snapshot.id);
```

Run the script with network and environment access so it can reach the Sandbox
API:

```sh
deno run -N -E setup_python.ts
```

Snapshots are read-only. Any sandbox that mounts this slug now sees a filesystem
with Python and the listed packages ready to go.

## Boot directly from the snapshot

Create a new file called `use_python.ts`. This script will boot a new sandbox
directly from the snapshot we created in the previous step, without running any
setup commands. This demonstrates how you can reuse a snapshot to skip setup and
get straight to running your code.

We start by importing the SDK and creating a client, just like before:

```ts title="use_python.ts"
import { Client } from "@deno/sandbox";

const client = new Client();
```

Then we create a new sandbox, but this time we specify the snapshot slug in the
`root` field instead of a volume:

```ts title="use_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "fun-with-python-snapshot",
  port: 8000,
  timeout: "30m",
});
```

We've given this sandbox a 30-minute timeout and exposed port 8000, which our
Python app will use later.

For now, we'll put in a placeholder string, which we'll replace with our actual
Python app code in a moment, and set it up to be written into the sandbox
filesystem at `/tmp/app.py`:

```ts title="use_python.ts (cont.)"
const appCode = `# Python app code goes here`;

await sandbox.fs.writeTextFile("/tmp/app.py", appCode);
```

Finally we spawn the Python app in the background and print the public URL where
it's reachable. The `await p.output()` line keeps the script running so the
sandbox doesn't immediately shut down:

```ts title="use_python.ts (cont.)"
const p = await sandbox.sh`python3 /tmp/app.py`.spawn();

console.log("\nMandelbrot Explorer running at", sandbox.url);

await p.output();
```

Now let's fill in `appCode` with a simple Python HTTP server that renders a
colorful ASCII Mandelbrot fractal using numpy. This is just an example to
showcase the scientific libraries we installed in the snapshot -- you can
replace it with any Python code you like!

Grab the python code from
[the github repo](https://github.com/denoland/tutorial-with-snapshot/blob/7b8e5331ab22968a7fc52dc84e1613072c7494d1/use_python.ts#L18-L131)
and paste it into the `appCode` string in `use_python.ts`.

Now we're ready to run this script:

```sh
$ deno run -A use_python.ts
```

Open the logged URL in your browser and start zooming; every tile is powered by
the numpy installation you baked into the snapshot earlier!

## Iterate, branch, or clean up

- Need to tweak the environment? Create a writable fork from the snapshot, boot
  it, change packages, then snapshot again:

  ```ts
  const fork = await client.volumes.create({
    region: "ord",
    slug: "python-sandbox-fork",
    capacity: "10GB",
    from: "fun-with-python-snapshot",
  });
  ```

- Done with a snapshot? Remove it to free space:

  ```ts
  await client.snapshots.delete("fun-with-python-snapshot");
  ```

🦕 With this workflow you can hand teammates, AI agents or CI jobs a slug that
boots a fully stocked development environment in seconds. Install once,
snapshot, and skip setup forever.
