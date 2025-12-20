---
title: "Management via CLI"
description: "Overview of how to manage sandboxes using the Deno CLI."
---

The Deno CLI includes built-in commands for managing sandboxes, allowing you to
create, control, and interact with them from your terminal.

This integration makes sandbox management feel natural within your existing Deno
workflow.

## Creating Your First Sandbox

The simplest way to get started is with `deno sandbox create` (or the shorter
`deno sandbox new`). By default, this creates an interactive session-based
sandbox that automatically opens an SSH connection when ready:

```bash
deno sandbox create
```

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

If you need the sandbox to run longer than a single session, specify a lifetime
with `--lifetime`:

```bash
deno sandbox create --lifetime 2m
```

When you create a session-based sandbox (the default), Deno automatically
attempts to open an SSH connection. If SSH isn't available on your system, it
will display connection information instead. The sandbox cleans itself up when
you exit the SSH session.

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
cat large-dataset.csv | deno sandbox exec 550e8400-e29b-41d4-a716-446655440000 --cwd /app python analyze.py
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

You can also rename files during the copy process:

```bash
deno sandbox copy ./config.dev.json 550e8400-e29b-41d4-a716-446655440000:/app/config.json
```

## One-Shot Execution

For quick tasks where you want to create a sandbox, run a command, and clean up
automatically, use `deno sandbox run`. This combines sandbox creation and
command execution into a single step:

```bash
deno sandbox run ls /
```

This is especially useful for building and testing projects. You can copy files
and run your build process in one command:

```bash
deno sandbox run --copy ./app --cwd /app npm start
```

For web applications, you can expose ports to access running services:

```bash
deno sandbox run --expose-http 3000 --copy ./web-app --cwd /app npm run dev
```

When working with tasks that take significant time, specify a lifetime to
prevent premature shutdown:

```bash
deno sandbox run --lifetime 2m --copy ./project --cwd /app python process.py
```

Complex workflows can be expressed as quoted command chains:

```bash
deno sandbox run --copy ./app --cwd /app "npm install && npm test && npm run build"
```

## Interactive Access

When you need to work interactively within a sandbox—editing files, debugging
issues, or exploring the environment—use `deno sandbox ssh`:

```bash
deno sandbox ssh 550e8400-e29b-41d4-a716-446655440000
```

This gives you a full Linux shell inside the sandbox where you can use any
command-line tools, edit files with vim or nano, monitor processes, or install
additional software as needed. The sandbox continues running after you
disconnect, so you can reconnect later or use other commands to interact with it
remotely.

## Managing Sandbox Lifetime

### Extending Sandbox Duration

Sometimes you'll need more time to complete your work in a running sandbox. The
`deno sandbox extend` command allows you to extend the lifetime of any running
sandbox without interrupting ongoing processes:

```bash
deno sandbox extend 550e8400-e29b-41d4-a716-446655440000 30m
```

The extend command works seamlessly with any sandbox state—whether you're SSH'd
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

### Quick Script Execution

For one-time scripts or deployment tasks, the run command handles everything
automatically:

```bash
deno sandbox run --copy ./scripts --cwd /app ./deploy.sh
```

### Interactive Development

When you need to work interactively for extended periods, create a long-lived
sandbox:

```bash
deno sandbox create --lifetime 5m --copy ./project
```

Then drop into an interactive shell using the returned ID:

```bash
deno sandbox ssh 550e8400-e29b-41d4-a716-446655440000
```

### Data Processing

For data processing workflows where you need to retrieve results, use a
combination of remote execution and SSH access:

```bash
SANDBOX_ID=$(deno sandbox create --lifetime 20m --copy ./data)
deno sandbox exec $SANDBOX_ID --cwd /app python process.py
```

You can also stream data directly into sandbox processes using pipes, which is
particularly useful for large datasets or real-time processing:

```bash
SANDBOX_ID=$(deno sandbox create --lifetime 20m --copy ./processing-scripts)
curl -s https://api.example.com/data.json | deno sandbox exec $SANDBOX_ID --cwd /app jq '.items[] | select(.active)'
```

Or combine local and remote processing in a pipeline:

```bash
grep "ERROR" /var/log/app.log | deno sandbox exec $SANDBOX_ID --cwd /app python classify-errors.py | sort | uniq -c
```

To retrieve results, copy the generated files back to your local machine, then
clean up:

```bash
deno sandbox copy $SANDBOX_ID:/app/results/*.csv ./output/
deno sandbox kill $SANDBOX_ID
```
