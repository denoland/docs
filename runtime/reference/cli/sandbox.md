---
title: "deno sandbox"
command: sandbox
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno sandbox"
description: "Spin up a secure Linux microVM"
---

The `deno sandbox` command allows you to spin up a secure Linux microVM,
designed for running untrusted code in a sandboxed environment.

## Authentication

In order to use the `deno sandbox` command, you need to have a Deno Deploy
account and a valid authentication token. Follow the instructions in the
[Getting started with Deno Sandbox](/sandbox/getting_started/) documentation.

## Global options

- `-h`, `--help` - Show this help.
- `--token` <token> - Auth token to use
- `--config` <config> - Path for the config file
- `--org` <name> - The name of the organization

## Subcommands

### Create a new sandbox

Creates a new sandbox in an organization. Accepts the aliases `create` and
`new`.

```bash
deno sandbox create
```

### List your sandboxes

Lists all sandboxes in an organization. Accepts the aliases `list` and `ls`.

```bash
deno sandbox list
```

### Kill a sandbox

Terminates a running sandbox immediately. Accepts the aliases `kill`, `remove`,
and `rm`.

```bash
deno sandbox kill <sandbox-id>
```

### Copy files

Copies files between your local machine and a running sandbox. Use `copy` or its
shorter alias `cp`.

```bash
deno sandbox copy <paths...>
```

### Execute a command

Runs an arbitrary command inside an existing sandbox.

```bash
deno sandbox exec <sandbox-id> <command...>
```

Example:

```bash
deno sandbox exec sbx-1234 uptime
```

### Extend timeout

Extends how long a sandbox stays active before timing out.

```bash
deno sandbox extend <sandbox-id> <timeout>
```

Accepts time durations in the format of a number followed by a unit, where the
unit can be `s` for seconds, `m` for minutes, or `h` for hours.

Example:

```bash
deno sandbox extend <sandbox-id> 30m
```

### SSH into a sandbox

Opens an interactive SSH session to the sandbox.

```bash
deno sandbox ssh <sandbox-id>
```

### Deploy a sandbox

Turns the state of a running sandbox into a Deno Deploy application.

```bash
deno sandbox deploy <sandbox-id> <app>
```

### Manage volumes

Creates, lists, and attaches persistent block volumes.

```bash
deno sandbox volumes --help
```

#### Create a volume

Creates a new volume. Accepts the alias `volumes create` or `volumes new`.

```bash
deno sandbox volumes create <name>
```

#### List volumes

Lists all volumes in an organization. Accepts the alias `volumes list` or
`volumes ls`.

```bash
deno sandbox volumes list
```

#### Delete a volume

Deletes a volume. Accepts the alias `volumes delete`, `volumes rm` or
`volumes remove`.

```bash
deno sandbox volumes delete <volume-id-or-slug>
```

or

```bash
deno sandbox volumes delete <volume-slug>
```

#### Snapshot a volume

Creates a snapshot of a volume. Accepts a volume ID or slug and a snapshot slug

```bash
deno sandbox volumes snapshot <volume-id-or-slug> <snapshot-slug>
```

or

```bash
deno sandbox volumes snapshot <volume-slug> <snapshot-slug>
```

### Manage snapshots

Creates and restores filesystem snapshots for sandboxes.

```bash
deno sandbox snapshots --help
```

#### Create a snapshot

Creates a new snapshot of a sandbox. Accepts the alias `snapshots create` or
`snapshots new`. It requires a volume ID or volume slug and a snapshot slug.

```bash
deno sandbox snapshots create <volume-id-or-slug> <snapshot-slug>
```

#### List snapshots

Lists all snapshots in an organization. Accepts the alias `snapshots list` or
`snapshots ls`.

```bash
deno sandbox snapshots list
```

#### Delete a snapshot

Deletes a snapshot. Accepts the alias `snapshots delete`, `snapshots rm` or
`snapshots remove`. It requires a snapshot ID or snapshot slug.

```bash
deno sandbox snapshots delete <id-or-slug>
```

### Switch organizations or apps

Switches your current Deploy organization or application context, which the
sandbox command uses for authentication.

```bash
deno sandbox switch
```
