---
title: "About Deno Deploy Early Access"
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

<a href="https://app.deno.com" class="docs-cta deploy-cta">Go to the Deno
Deploy<sup>EA</sup> dashboard</a>

Deno Deploy<sup>EA</sup> comes with a new dashboard at
[app.deno.com](https://app.deno.com). In this dashboard, you can create new Deno
Deploy<sup>EA</sup> organizations that contain Deno Deploy<sup>EA</sup> apps.

Within a single organization, you cannot mix Deno Deploy<sup>EA</sup> apps with
Deploy Classic projects. You can switch between different organizations using
the organization picker in the top left of the dashboard.

## What is Deno Deploy<sup>EA</sup>?

Deno Deploy is a serverless platform for running JavaScript and TypeScript
applications in the cloud (or self-hosted on your own infrastructure). It
provides a management plane for deploying and running applications through
integrations like GitHub deployment.

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
| Databases                       | ✅ Supported                   | 🟠 Deno KV                                                                                                                              |
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
3. Create your first application within this organization
4. Deploy from your GitHub repository or directly from the dashboard

For detailed configuration instructions and framework-specific guides, please
refer to our reference documentation.
