---
title: "About Early Access"
description: "Guide to Deno Deploy Early Access features, comparison with Deploy Classic, and getting started instructions for deployment."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Deno Deploy Early Access (Deno Deploy<sup>EA</sup>) is a complete revamp of the
original Deploy, featuring:

- Improved NPM compatibility and web framework support
- Built-in OpenTelemetry integration
- Integrated build system
- Significantly enhanced underlying infrastructure

<a href="https://app.deno.com" class="docs-cta runtime-cta">Try out Deno
Deploy<sup>EA</sup></a>

:::note

Deno Deploy<sup>EA</sup> is in private beta. To use Deno Deploy
<sup>EA</sup> you must join the Early Access program from the
[Deploy Classic account settings page](https://dash.deno.com/account#early-access).

:::

Deno Deploy<sup>EA</sup> comes with a new dashboard at
[app.deno.com](https://app.deno.com). In this dashboard, you can create new Deno
Deploy<sup>EA</sup> organizations that contain Deno Deploy<sup>EA</sup> apps.

Within a single organization, you cannot mix and match Deno Deploy<sup>EA</sup>
apps and Deploy Classic projects. You can switch between Deno
Deploy<sup>EA</sup> organizations and Deploy Classic organizations through the
organization picker in the top left of the dashboard.

## What is Deno Deploy<sup>EA</sup>?

Deno Deploy is a serverless platform for running JavaScript and TypeScript
applications in the cloud (or self-hosted on your own infrastructure). Deno
Deploy acts as a management plane for deploying and running applications, for
example through a GitHub integration.

## Comparison to Deploy Classic

Deno Deploy<sup>EA</sup> is a complete rework of Deploy Classic. It has a new
dashboard, and a new execution environment that uses Deno 2.0 and is much more
powerful than Deploy Classic. The below table compares the two versions of Deno
Deploy.

| Feature                         | Deno Deploy<sup>EA</sup>       | Deploy Classic                                                                                                                          |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web interface                   | app.deno.com                   | dash.deno.com                                                                                                                           |
| Dark mode                       | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Builds                          | ✅ Fully integrated            | 🟠 Runs in GitHub Actions, no live streamed logs in the dashboard, caching requires manual setup, changing config requires editing YAML |
| Can run Deno apps               | ✅ Full support                | 🟠 Limited (no FFI, subprocesses, write permission)                                                                                     |
| Can run Node apps               | ✅ Full support                | 🟠 Limited (no FFI, native addons, subprocesses, write permission, and degraded NPM compatibility)                                      |
| Can run Next.js/Astro/SvelteKit | ✅ First-class support         | 🟠 Framework dependent, requires manual setup                                                                                           |
| First class static sites        | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Environment Variables           | ✅ Different dev/prod env vars | 🟠 One set of env vars for all deployments                                                                                              |
| CDN caching                     | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Web Cache API                   | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Databases                       | ⏳ Coming soon                 | 🟠 Deno KV                                                                                                                              |
| Queues                          | ❌ Not supported               | ✅ Supported                                                                                                                            |
| Cron                            | ❌ Not supported               | ✅ Supported                                                                                                                            |
| Deploy from GitHub              | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Deploy from CLI                 | ⏳ Coming soon                 | ✅ Supported                                                                                                                            |
| Instant Rollback                | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Logs                            | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Tracing                         | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Metrics                         | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| OpenTelemetry export            | ⏳ Work in progress            | ❌ Not supported                                                                                                                        |
| Regions                         | 2                              | 6                                                                                                                                       |
| Self hostable regions           | ✅ Supported                   | ❌ Not supported                                                                                                                        |

## How to access EA

To begin using Deno Deploy<sup>EA</sup>:

1. Visit [app.deno.com](https://app.deno.com) to access the new dashboard
2. Create a new Deno Deploy<sup>EA</sup> organization
3. Create your first app within the organization
4. Connect your GitHub repository or deploy directly from the dashboard

For detailed documentation on deploying specific frameworks or configuring your
application, view the reference documentation.
