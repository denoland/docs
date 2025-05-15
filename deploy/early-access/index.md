---
title: "Deno Deploy Early Access"
description: "Guide to Deno Deploy Early Access features, comparison with Deno Deploy Classic, and getting started instructions for deployment."
---

:::info

You are viewing the documentation for Deploy Early Access. Looking for Deploy
Classic documentation? [View it here](/deploy/).

:::

Deno Deploy Early Access is a complete revamp of the original Deno Deploy,
featuring:

- Improved NPM compatibility and web framework support
- Built-in OpenTelemetry integration
- Integrated build system
- Significantly enhanced underlying infrastructure

<a href="https://app.deno.com" class="docs-cta runtime-cta">Try out Deploy Early
Access</a>

Deno Deploy EA comes with a new dashboard at
[app.deno.com](https://app.deno.com). In this dashboard, you can create new Deno
Deploy EA organizations that contain Deno Deploy EA apps. Note that within a
single organization, you cannot mix and match Deno Deploy EA apps and Deno
Deploy Classic projects. You can switch between Deno Deploy EA organizations and
Deno Deploy Classic organizations through the organization picker in the top
left of the dashboard.

## Comparison to Deno Deploy Classic

| Feature                         | Deno Deploy EA                 | Deno Deploy Classic                                                                                                                     |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web interface                   | app.deno.com                   | dash.deno.com                                                                                                                           |
| Builds                          | ✅ Fully integrated            | 🟠 Runs in GitHub Actions, no live streamed logs in the dashboard, caching requires manual setup, changing config requires editing YAML |
| Can run Deno apps               | ✅ Full support                | 🟠 Limited (no FFI, subprocesses, write permission)                                                                                     |
| Can run Node apps               | ✅ Full support                | 🟠 Limited (no FFI, native addons, subprocesses, write permission, and degraded NPM compatibility)                                      |
| Can run Next.js/Astro/SvelteKit | ✅ First-class support         | 🟠 Framework dependent, requires manual setup                                                                                           |
| First class static sites        | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Environment Variables           | ✅ Different dev/prod env vars | 🟠 One set of env vars for all deployments                                                                                              |
| CDN caching                     | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Web Cache API                   | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Automatic Deno KV               | ⏳ Coming soon                 | ✅ Supported                                                                                                                            |
| Queues                          | ⏳ Coming soon                 | ✅ Supported                                                                                                                            |
| Cron                            | ⏳ Coming soon                 | ✅ Supported                                                                                                                            |
| Deploy from GitHub              | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Deploy from CLI                 | ⏳ Coming soon            | ✅ Supported                                                                                                                            |
| Instant Rollback                | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Logs                            | ✅ Supported                   | ✅ Supported                                                                                                                            |
| Tracing                         | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| Metrics                         | ✅ Supported                   | ❌ Not supported                                                                                                                        |
| OpenTelemetry export            | ⏳ Work in progress            | ❌ Not supported                                                                                                                        |
| Regions                         | 2                              | 6                                                                                                                                       |
| Self hostable regions           | ✅ Supported                   | ❌ Not supported                                                                                                                        |

Coming soon

## Getting Started

To begin using Deno Deploy Early Access:

1. Visit [app.deno.com](https://app.deno.com) to access the new dashboard
2. Create a new Deno Deploy EA organization
3. Create your first app within the organization
4. Connect your GitHub repository or deploy directly from the dashboard

For detailed documentation on deploying specific frameworks or configuring your
application, visit our
[guides and resources](/deploy/early-access).
