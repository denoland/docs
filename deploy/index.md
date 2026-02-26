---
title: "About Deno Deploy"
description: "Guide to Deno Deploy features, comparison with Deploy Classic, and getting started instructions for deployment."
---

<div class="lg:flex lg:flex-row lg:gap-8">
   <img src="/deno-deploy.svg" alt="Deno Deploy logo" style="max-width: 160px" />
      <p class="text-lg text-foreground-secondary mt-6">Deno's cloud services provide robust platforms for deploying and running JavaScript and TypeScript applications at global scale.<a href="https://console.deno.com" class="docs-cta deploy-cta mt-2">Go to the Deno
Deploy dashboard</a></p>

</div>

## What is Deno Deploy?

Deno Deploy is a serverless platform for running JavaScript and TypeScript
applications in the cloud (or self-hosted on your own infrastructure). It
provides a management plane for deploying and running applications with the
built-in CI or through integrations such as GitHub actions.

Deno Deploy comes with an easy to use dashboard at
[console.deno.com](https://console.deno.com). Here, you can create and host new
apps, create and manage Deno Deploy organizations and manage and view your
databases and app telemetry.

## Comparison to Deploy Classic

Deno Deploy is a complete rework of Deploy Classic. It has a new dashboard, and
a new execution environment that uses Deno 2.0 and is much more powerful than
Deploy Classic. The below table compares the two versions of Deno Deploy.

| Feature                         | Deno Deploy                    | Deploy Classic                                                                                                                          |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web interface                   | console.deno.com               | dash.deno.com                                                                                                                           |
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
| Deploy from CLI                 | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Instant Rollback                | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Logs                            | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Tracing                         | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Metrics                         | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| OpenTelemetry export            | ⏳ Work in progress            | ❌ Not supported                                                                                                                        |
| Regions                         | 2                              | 6                                                                                                                                       |
| Self hostable regions           | ✅ Supported                   | ❌ Not supported                                                                                                                        |

## How to access Deno Deploy

To begin using Deno Deploy:

1. Visit [console.deno.com](https://console.deno.com) to access the new
   dashboard
2. Create a new Deno Deploy organization
3. Create your first application within this organization
4. Deploy from your GitHub repository or directly from the dashboard

For detailed configuration instructions and framework-specific guides, please
refer to our reference documentation.
