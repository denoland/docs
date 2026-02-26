---
title: "Safe Cloud Code Execution with Snapshots"
description: "Deno Sandbox lets you spin up isolated cloud VMs programmatically.  With the snapshots feature, you can pre-install an entire environment once and boot it without waiting for installs every time after."
url: /examples/snapshot_python_video/
videoUrl: https://youtu.be/mASEjxpuDTM
layout: video.tsx
---

## Video description

Deno Sandbox lets you spin up isolated cloud VMs programmatically. With the
snapshots feature, you can pre-install an entire environment once and boot it
without waiting for installs every time after.

In this video we show you the snapshot workflow end to end:

- Create a cloud volume and boot a sandbox
- Install Python, and required packages and build tools
- Snapshot the volume — your environment is now frozen and reusable
- Boot fresh sandboxes from that snapshot instantly, with everything
  pre-installed

As a demo we run a live interactive Mandelbrot fractal explorer. An HTTP server
deployed entirely inside the sandbox, the code never touching the host machine.

This is the foundation for safe execution of AI-generated code, user-submitted
scripts, or any workload you want fully isolated and reproducible.

## Transcript and code

Python is everywhere - data science, AI, scripting, web apps, it's the language
everyone reaches for. But there's a problem that you tend to hit fast. Python
environments can be a mess; you've got system Python fighting with virtual
environments, packages that need native build tools. It can be a whole thing.

Now, imagine you want to run Python code that you didn't write yourself. Maybe
it is AI generated. Maybe it's from a user. Maybe it's just experimental. You
really don't want that touching your machine.

Today, I'm going to show you how to spin up a fully isolated cloud sandbox with
Python pre-installed. We're going to run a Numpy powered Mandelbrot fractal
explorer in it and serve it as a live web app, all with about 60 lines of
TypeScript, and your machine will never run a single line of Python. Let's get
into it.

### Initialize a basic Deno project

```sh
deno init my-snapshot-project
cd my-snapshot-project
deno add jsr:@deno/sandbox
```

This is a really basic Deno project. The only dependency that we're going to use
is the Deno Sandbox SDK from JSR. That's the SDK for creating and managing cloud
sandboxes programmatically. We're going to write two TypeScript files.

`setup_python.ts`: We're going to run this one time to create our sandbox,
install Python, and a bunch of useful packages, and then snapshot.

`use_python.ts`: The script that we're going to run any time we want to actually
use the Python environment inside our sandbox.

This two-step pattern is the whole point. We do the heavy lifting once, then we
reuse that result forever. It's kind of the same idea as a Docker image or a VM
snapshot. They can be expensive and slow to build, but they're cheap and quick
to use.

### Setting up a Snapshot

So, let's take a look at Setting up a Snapshot our setup python.ts file. We
create a client with the Deno Sandbox SDK.

```ts title="setup_python.ts"
import { SandboxClient } from "@deno/sandbox";
const client = new SandboxClient();

async function initSandbox() {
  // ... we'll fill this in next
}
```

Then we create a volume with 10 gigs of space. And I'm using the `ord` region,
but you can pick any region. The region just determines where the sandbox runs.
The closer to you, the lower the latency.

```ts title="setup_python.ts (cont.)"
const volume = await client.volumes.create({
  region: "ord",
  slug: "fun-with-python",
  capacity: "10GB",
});
```

We're then going to boot a sandbox with that volume as its root file system.
Notice the await using syntax here. That's JavaScript's explicit resource
management. When this scope exits, the sandbox automatically tears itself down
and we never have to think about the cleanup ourselves.

```ts title="setup_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
});
```

Inside the sandbox, we're going to run our setup commands. Firstly, we've got
apt-get update, followed by installing Python 3, Python 3 pip, Python 3 VMv,
Python 3D dev, and build essential. That last one is important. It gives us the
compiler that we're going to need for the packages that ship native extensions.

Then we're going to install our packages. We've got requests, httpx, numpy,
pandas, python.m and we use the break system packages flag because inside this
sandbox, we own the whole system. So there's no reason to fight pip's usual
guard rails. Finally, we can verify that everything is in place by printing the
Python and pip version.

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

return volume.id;
```

Once that's all done, we snapshot the volume with `client.volumes.snapshot`,
giving it the volume ID and the slug for our snapshot.

```ts title="setup_python.ts (cont.)"
const volumeId = await initSandbox();

console.log("Snapshotting the volume...");

const snapshot = await client.volumes.snapshot(volumeId, {
  slug: "fun-with-python-snapshot",
});

console.log("Created Python snapshot " + snapshot.id);
```

To run this script, we're going to use the dino run command with the allow net
and allow env permissions set. And then we're done. We never need to run that
again.

```sh
deno run -N -E setup_python.ts
```

### Booting from a Snapshot

Now, let's take a look at our `use_python.ts`. First of all, we're going to
create a sandbox from the snapshot that we just set up. We don't need any
installation step here. The snapshot already has everything. We're going to
expose port 8000 and we'll give it a 30 minute timeout.

```ts title="use_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "fun-with-python-snapshot",
  port: 8000,
  timeout: "30m",
});
```

Then we're going to use `sandbox.fs.writeTextFile` to drop our Python app
directly into the sandbox file system at a temporary location. This is a nice
clean way to get code into a sandbox without messing with shell escaping. We are
just passing it a TypeScript string.

```ts title="use_python.ts (cont.)"
const appCode = `# Python app code goes here`;

await sandbox.fs.writeTextFile("/tmp/app.py", appCode);
```

The
[Python app itself](https://github.com/denoland/tutorial-with-snapshot/blob/7b8e5331ab22968a7fc52dc84e1613072c7494d1/use_python.ts#L18-L131)
is a self-contained HTTP server. You can take the code from the repo and paste
it into the `appCode` string.

```ts title="use_python.ts (cont.)"
const p = await sandbox.sh`python3 /tmp/app.py`.spawn();

console.log("\nMandelbrot Explorer running at", sandbox.url);

await p.output();
```

`sandbox.url` gives us a public URL where port 8000 is reachable. `p.output()`
keeps the script alive for the duration.

Now, let's take a look at what we're actually running inside the sandbox. The
Python app uses NumPy to compute the Mandelbrot set. That's just a classic
fractal where you interactively apply z= z^ 2 + c across a grid of complex
numbers and then you count how many steps it takes each point to escape to
infinity. NumPy can do this really fast and the result is rendered as colored
block characters based on their escape time ranging from electric blue through
to green through to deep red. And points that never escape are colored in solid
black.

Run the `use_python.ts` script with

```sh
deno run -A use_python.ts
```

and open the URL in your browser.

If we take a look at what's actually rendered in the browser, we can see we've
got a nice interactive app here. Each nav button is just a link with query
parameters that shift the viewpoint. When we click zoom in, the server
recomputes the fractal for the new region and returns a new page. No JavaScript,
no websockets, just HTTP. And the whole time we're running this whole thing on a
throwaway Linux VM in the cloud. We're using Python, NumPy, and a web server,
and none of it is running on our own machine.

This pattern is useful well beyond fractals.

- If you're building a tool where Claude or another model is writing Python for
  you, you can execute that code in a sandbox and it won't be able to touch your
  system or read your files and it won't be able to exfiltrate your secret API
  keys.

- If you're building a data analysis tool where users are able to upload their
  own Python, same idea. Each user gets an isolated environment with the
  packages that they need pre-baked into a snapshot.

- The snapshot is a fixed point in time. Every sandbox that you boot from it is
  identical. So we're not going to have to worry about any it works on my
  machine or any drift.

- And finally, because NumPy and all the other packages are already in the
  snapshot, the snapshot is ready to run in under 200 milliseconds, that's fast
  enough to use on demand per request.

All of the code used in this demo is also available as a
[walk through tutorial](/examples/snapshot_python_tutorial/). You'll need a Dino
deploy account to use the sandbox SDK.

If you want to go further, you could of course swap out the fractal for your own
Python script or try adding different packages to the setup.

🦕 The snapshot approach means that you can build up exactly the environment you
want and reuse it as many times as you like.
