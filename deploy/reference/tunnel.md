---
title: Tunnel
description: "Learn about Deno Deploy's local tunnel feature, which allows secure access to your local development server from the internet."
---

Deno Deploy's tunnel feature allows you to securely expose your local
development server to the internet. This is particularly useful for testing
webhooks, sharing your work with collaborators, or accessing your local server
from remote locations.

In addition to providing secure access to your local server, Deno Deploy's
tunnel can also:

- Pull environment variables in the "Local" context from your Deno Deploy
  project to your local Deno process.
- Push Open Telemetry traces, metrics, and logs from your local Deno process to
  your Deno Deploy app, where you can view them in the Deno Deploy dashboard.
- Automatically connect to local development databases assigned to your Deno
  Deploy app.

## Getting started

To start using the tunnel feature, you'll need to have Deno installed on your
local machine. You can then pass the `--tunnel` flag when running your Deno
application locally, either with `deno task` or `deno run`. For example:

```sh
deno run --tunnel -A main.ts
```

The first time you run this command, you'll be prompted to authenticate with
Deno Deploy and choose which Deno Deploy app you want to connect the tunnel to.
Once authenticated, a secure tunnel will be established, and you'll receive a
public URL that forwards traffic to your local server.

You can also specify `--tunnel` for `deno task` commands defined in your
`deno.json` or `package.json` file:

```json
{
  "tasks": {
    "dev": "astro dev"
  }
}
```

Then run the task with:

```bash
deno task --tunnel dev
```

## Using the tunnel

Once the tunnel is established, any requests made to the public URL will be
forwarded to your local development server. You can use this URL to test
webhooks, share your work with others, or access your local server from remote
locations.

## Stopping the tunnel

To stop the tunnel, simply terminate the Deno process running your application.
This will close the secure connection and stop forwarding traffic to your local
server.

## View open tunnels

The "Tunnels" tab of your application dashboard on Deno Deploy shows all active
tunnels connected to your application. From this tab, you can view details about
each tunnel, including the public URL, the local address it's forwarding to, and
the time it was established.

## Environment variables

When using the tunnel feature, the "Local" context environment variables from
your Deno Deploy application are made available to your local Deno process. This
allows you to use the same configuration locally as you do in your Deno Deploy
application.

You can view and manage the environment variables for your Deno Deploy
application in the "Environment Variables" tab of your application settings. See
[the docs on adding, editing, and removing environment variables](/deploy/reference/env_vars_and_contexts/#adding%2C-editing-and-removing-environment-variables)
for more information.

## Viewing traces and logs

When using the tunnel feature, Open Telemetry traces, metrics, and logs from
your local Deno process are pushed to your Deno Deploy application. You can view
these traces and logs in the "Observability" tab of your application dashboard
on Deno Deploy.

You can filter to see only traces and logs from your local process by searching
for `context:local` in the search bar.
