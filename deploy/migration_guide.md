---
title: "Migrating from Deploy Classic to Deno Deploy"
description: "Guide to migrating your applications from Deno Deploy Classic (dash.deno.com) to the new Deno Deploy (console.deno.com), including subhosting API migration."
---

Deno Deploy Classic (dash.deno.com) and the subhosting v1 API
(apidocs.deno.com) will be shut down on **July 20, 2026**. This guide covers
migrating your applications and API integrations to the new
[Deno Deploy](https://console.deno.com) platform.

## Create a new organization

The new Deno Deploy uses a separate account system. To get started:

1. Go to [console.deno.com](https://console.deno.com) and sign in
2. Create a new organization — this is required before you can deploy
   any applications
3. Invite team members to your organization as needed

Your Deploy Classic projects at dash.deno.com are not automatically
transferred. You will need to create new apps and redeploy.

## Create and deploy your app

In the new Deno Deploy dashboard, create a new app within your organization.
You can deploy via GitHub integration or the CLI.

### GitHub integration

Connect your GitHub repository from the app settings in the dashboard. The
new Deploy has fully integrated builds — no more GitHub Actions YAML
configuration. Build logs stream directly in the dashboard.

### CLI deployment

The `deployctl` CLI is also being sunset. Use the `deno deploy` subcommand
instead:

```sh
deno deploy
```

See the [getting started guide](/deploy/getting_started/) for detailed setup
instructions.

## Environment variables

Deploy Classic used a single set of environment variables for all
deployments. The new Deploy supports separate **production**, **development**,
and **build** contexts.

Review your environment variables and set them up in the new dashboard
under your app's settings. See
[environment variables and contexts](/deploy/reference/env_vars_and_contexts/)
for details.

## Custom domains

To migrate a custom domain:

1. Add the domain to your new Deploy app in the dashboard
2. Configure the `_acme-challenge` CNAME record for TLS certificate
   provisioning
3. Update your DNS records (CNAME or ANAME) to point to the new Deploy
4. Allow up to 48 hours for DNS propagation before removing the domain
   from Deploy Classic

See the
[custom domain migration tutorial](/examples/migrate_custom_domain_tutorial/)
for a step-by-step walkthrough.

## Cron jobs

The `Deno.cron()` API works the same way on the new Deploy. Your existing
cron job code should work without modification. See the
[cron reference](/deploy/reference/cron/) for details.

## Queues

Deno queues (`Deno.Kv.enqueue()` / `Deno.Kv.listenQueue()`) are **not
supported** on the new Deno Deploy. If your application relies on queues,
you will need to adopt an alternative approach — for example, an external
message queue service or a database-backed job queue.

## KV database

Deno KV is available on the new Deploy, but your existing KV data is not
automatically migrated. Contact [support@deno.com](mailto:support@deno.com)
for assistance migrating your KV database.

See [Deno KV on Deploy](/deploy/reference/deno_kv/) for information about
how KV works on the new platform, including per-timeline database isolation.

## Subhosting API migration

The subhosting v1 API at `apidocs.deno.com` will be shut down alongside
Deploy Classic on July 20, 2026. Migrate your integrations to the
[v2 API](https://api.deno.com/v2/docs).

The v2 API has significant architectural changes — projects become apps,
deployments become revisions, and each app should represent a single
function. See the
[subhosting API migration guide](/deploy/api_migration_guide/) for
detailed endpoint mappings, request/response changes, and new features
like labels and layers.

Official SDKs for the v2 API:

- **TypeScript/JavaScript**:
  [@deno/sandbox](https://www.npmjs.com/package/@deno/sandbox)
- **Python**:
  [sandbox-py](https://github.com/denoland/sandbox-py)

## Regions

Deploy Classic serves from 6 regions. The new Deploy currently has 2
regions, with the ability to self-host additional regions on your own
infrastructure. If your application is latency-sensitive and depends on
specific regions, plan accordingly.

## What's new

The new Deploy includes several features not available in Deploy Classic:

- **Full Deno 2.0 runtime** — FFI, subprocesses, file system write access,
  and improved NPM compatibility
- **First-class framework support** — Next.js, Astro, SvelteKit, Fresh,
  and more work out of the box
- **CDN caching** — built-in edge caching with `Cache-Control` headers and
  programmatic cache invalidation
- **Observability** — logs, traces, and metrics in the dashboard
- **Static site support** — deploy static sites directly
- **Separate dev/prod environments** — different environment variables and
  databases per context

## Timeline

| Date | Event |
| --- | --- |
| Now | Create your organization at [console.deno.com](https://console.deno.com) and begin migration |
| July 20, 2026 | Deploy Classic (dash.deno.com) and subhosting v1 API shut down |

Start your migration early to allow time for testing. If you have questions
or need help, contact [support@deno.com](mailto:support@deno.com).
