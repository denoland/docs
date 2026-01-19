---
title: "Management via CLI"
description: "Overview of how to manage sandboxes using the Deno CLI."
---

The Deno CLI includes built-in commands for managing sandboxes, allowing you to
create, control, and interact with them from your terminal.

This integration makes sandbox management feel natural within your existing Deno
workflow.

## Creating Your First Sandbox

The simplest way to get started is with `deno sandbox create`. By default, this
creates an interactive session-based sandbox that automatically opens an SSH
connection when ready:

```bash
deno sandbox create
```

If SSH isn't available on your system, it will display connection information
instead. The sandbox cleans itself up when you exit the session.

For development work, you'll often want to copy your project files into the
sandbox. The `--copy` option uploads files to the `/app` directory inside the
sandbox:

```bash
deno sandbox create --copy ./my-project
```

You can copy multiple directories during creation:

```bash
deno sandbox create --copy ./src --copy ./config
```

If you need the sandbox to run longer than a single session, specify a timeout
with `--timeout`:

```bash
deno sandbox create --timeout 2m
```

You can also create a sandbox with a custom memory limit:

```bash
deno sandbox create --memory 2gib
```

To expose HTTP ports for web applications:

```bash
deno sandbox create --expose-http 3000
```

You can mount persistent volumes to your sandbox using the `--volume` flag:

```bash
deno sandbox create --volume my-volume:/data
```

To create a sandbox and run a command immediately:

```bash
deno sandbox create ls /
```

This is especially useful for building and testing projects. You can copy files
and run your build process in one command:

```bash
deno sandbox create --copy ./app --cwd /app "npm i && npm start"
```

For web applications, you can expose ports to access running services:

```bash
deno sandbox create --expose-http 3000 --copy ./web-app --cwd /app "npm i && npm run dev"
```

Complex workflows can be expressed as quoted command chains:

```bash
deno sandbox create --copy ./app --cwd /app "npm install && npm test && npm run build"
```

## Viewing Your Sandboxes

Use `deno sandbox list` (or `deno sandbox ls`) to see all sandboxes in your
organization:

```bash
$ deno sandbox list
ID                                    CREATED                 STATUS   UPTIME
550e8400-e29b-41d4-a716-446655440000  2024-01-15 10:30:00.00  running  5m
6ba7b810-9dad-11d1-80b4-00c04fd430c8  2024-01-15 09:45:00.00  stopped  15m
```

This shows each sandbox's unique ID (which you'll use with other commands), when
it was created, whether it's currently running, and how long it's been active.
The sandbox ID is a UUID that uniquely identifies each instance.

## Running Commands Remotely

The `deno sandbox exec` command lets you run individual commands in any running
sandbox without opening an interactive session. This is perfect for automation,
CI/CD pipelines, or quick one-off tasks:

```bash
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 ls -la
```

Most of the time, you'll want to work in the `/app` directory where your copied
files live. Use `--cwd` to set the working directory:

```bash
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --cwd /app npm install
```

For scripting or automation, use `--quiet` to suppress command output:

```bash
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --quiet --cwd /app npm test
```

You can also run complex command chains by quoting the entire command:

```bash
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --cwd /app "npm install && npm test"
```

The exec command works naturally with Unix pipes and standard input/output. You
can pipe the output of sandbox commands to local tools:

```bash
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 'ls -lh /' | wc -l
```

Or pipe local data into sandbox processes for processing:

```bash
cat large-dataset.csv | deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --cwd /app "deno run -A main.ts"
```

This makes it easy to integrate sandbox processing into larger Unix workflows
and data pipelines.

## Transferring Files

While you can copy files during sandbox creation, you might need to update or
retrieve files later. The `deno sandbox copy` command (also available as
`deno sandbox cp`) transfers files in any direction: from your local machine to
sandboxes, from sandboxes back to your machine, or even between different
sandboxes.

Copy files from your local machine to a sandbox:

```bash
deno sandbox copy ./app.js 550e8400-e29b-41d4-a716-446655440000:/app/
```

Retrieve files from a sandbox to your local machine:

```bash
deno sandbox copy 550e8400-e29b-41d4-a716-446655440000:/app/results.json ./output/
```

Copy files between different sandboxes:

```bash
deno sandbox copy 550e8400-e29b-41d4-a716-446655440000:/app/data.csv 6ba7b810-9dad-11d1-80b4-00c04fd430c8:/app/input/
```

You can use glob patterns to copy multiple files from sandboxes:

```bash
deno sandbox copy 550e8400-e29b-41d4-a716-446655440000:/app/*.json ./config/
deno sandbox copy 550e8400-e29b-41d4-a716-446655440000:/app/logs/*.log ./logs/
```

You can copy multiple files and directories at once:

```bash
deno sandbox copy ./src/ ./package.json 550e8400-e29b-41d4-a716-446655440000:/app/
```

The target path can be customized to organize files within the sandbox:

```bash
deno sandbox copy ./frontend 550e8400-e29b-41d4-a716-446655440000:/app/web/
```

## Deploying Sandboxes

You can deploy a running sandbox to a Deno Deploy app using the
`deno sandbox deploy` command:

```bash
deno sandbox deploy 550e8400-e29b-41d4-a716-446655440000 my-app
```

By default, this deploys to a preview deployment. To deploy directly to
production:

```bash
deno sandbox deploy --prod 550e8400-e29b-41d4-a716-446655440000 my-app
```

You can specify a custom working directory and entrypoint:

```bash
deno sandbox deploy --cwd /app --entrypoint main.ts 550e8400-e29b-41d4-a716-446655440000 my-app
```

To pass arguments to the entrypoint script:

```bash
deno sandbox deploy --args --port 8080 550e8400-e29b-41d4-a716-446655440000 my-app
```

## Managing Volumes

The sandbox system supports persistent volumes for data that needs to survive
across sandbox instances. Use the `deno sandbox volumes` command to manage them.

### Creating Volumes

Create a new volume with a specific name, capacity, and region:

```bash
deno sandbox volumes create my-volume --capacity 10gb --region ord
```

### Listing Volumes

List all volumes in your organization:

```bash
deno sandbox volumes list
```

You can also search for specific volumes:

```bash
deno sandbox volumes list my-volume
```

### Deleting Volumes

Remove a volume when you no longer need it:

```bash
deno sandbox volumes delete my-volume
```

## Managing Snapshots

Snapshots allow you to preserve the current state of a volume as a point-in-time
copy.

### Creating Snapshots

Create a new snapshot from an existing volume:

```bash
deno sandbox snapshots create my-volume my-snapshot
```

You can also use the `volumes snapshot` command:

```bash
deno sandbox volumes snapshot my-volume my-snapshot
```

### Listing Snapshots

List all snapshots in your organization:

```bash
deno sandbox snapshots list
```

You can also search for specific snapshots:

```bash
deno sandbox snapshots list my-snapshot
```

### Deleting Snapshots

Remove a snapshot when you no longer need it:

```bash
deno sandbox snapshots delete my-snapshot
```

## Switching Organizations

The `deno sandbox switch` command allows you to switch between different
organizations in your configuration:

```bash
deno sandbox switch
```

This is useful when working with multiple organizations.

## Interactive Access

When you need to work interactively within a sandbox; be it editing files,
debugging issues, or exploring the environment, you can use `deno sandbox ssh`:

```bash
deno sandbox ssh 550e8400-e29b-41d4-a716-446655440000
```

This gives you a full Linux shell inside the sandbox where you can use any
command-line tools, edit files with vim or nano, monitor processes, or install
additional software as needed. The sandbox continues running after you
disconnect, so you can reconnect later or use other commands to interact with it
remotely.

## Managing Sandbox Timeout

### Extending Sandbox Duration

Sometimes you'll need more time to complete your work in a running sandbox. The
`deno sandbox extend` command allows you to extend the timeout of any running
sandbox without interrupting ongoing processes:

```bash
deno sandbox extend 550e8400-e29b-41d4-a716-446655440000 30m
```

The extend command works seamlessly with any sandbox state; whether you're SSH'd
into it, running remote commands, or have background processes running. All
active connections and processes continue uninterrupted while the sandbox's
expiration time is updated.

### Cleanup and Termination

When you're finished with a sandbox, use `deno sandbox kill` (or
`deno sandbox rm`) to terminate it and free up resources:

```bash
deno sandbox kill 550e8400-e29b-41d4-a716-446655440000
```

This immediately stops all processes in the sandbox and releases its resources.
Be sure to save any important work before terminating a sandbox, as all data
inside will be lost.

## Common Workflows

### Development and Testing

A typical development workflow involves creating a sandbox with your code,
setting up dependencies, and running tests:

```bash
deno sandbox create --copy ./my-app
```

Once created, use the returned sandbox ID to set up and test your project:

```bash
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --cwd /app npm install
deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --cwd /app npm test
```

As you make changes locally, you can update the sandbox, and retrieve any
generated files when done:

```bash
deno sandbox copy ./src/ 550e8400-e29b-41d4-a716-446655440000:/app/src/
deno sandbox copy 550e8400-e29b-41d4-a716-446655440000:/app/build/ ./dist/
deno sandbox kill 550e8400-e29b-41d4-a716-446655440000
```

### Data Processing

For data processing workflows where you need to retrieve results, use a
combination of remote execution and SSH access:

```bash
SANDBOX_ID=$(deno sandbox create --timeout 20m --copy ./data)
deno sandbox exec $SANDBOX_ID --cwd /app "deno run -A main.ts"
```

You can also stream data directly into sandbox processes using pipes, which is
particularly useful for large datasets or real-time processing:

```bash
SANDBOX_ID=$(deno sandbox create --timeout 20m --copy ./processing-scripts)
curl -s https://api.example.com/data.json | deno sandbox exec $SANDBOX_ID --cwd /app jq '.items[] | select(.active)'
```

Or combine local and remote processing in a pipeline:

```bash
grep "ERROR" /var/log/app.log | deno sandbox exec $SANDBOX_ID --cwd /app "deno run -A main.ts" | sort | uniq -c
```

To retrieve results, copy the generated files back to your local machine, then
clean up:

```bash
deno sandbox copy $SANDBOX_ID:/app/results/*.csv ./output/
deno sandbox kill $SANDBOX_ID
```
