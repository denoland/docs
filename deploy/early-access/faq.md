---
title: "Deno Deploy Early Access FAQ"
description: "Frequently asked questions about Deno Deploy Early Access, covering common issues, best practices, and troubleshooting."
---

:::info

You are viewing the documentation for Deploy Early Access. Looking for Deploy
Classic documentation? [View it here](/deploy/).

:::

# Frequently Asked Questions

## General Questions

### What is Deno Deploy Early Access?

Deno Deploy Early Access (EA) is a complete revamp of the original Deno Deploy
platform, featuring improved NPM compatibility, integrated builds, better
framework support, OpenTelemetry integration, and significant infrastructure
enhancements.

### Is Deno Deploy<sup>EA</sup> production-ready?

While Deno Deploy<sup>EA</sup> is still in beta, the Deno company is using it to
host our own production websites. However, during the beta phase, it is not
covered by regular service level agreements.

### Can I use both Deploy Classic and Deno Deploy<sup>EA</sup> simultaneously?

Yes, you can use both platforms simultaneously, but you cannot mix Deno
Deploy<sup>EA</sup>s apps and Deploy Classic projects within the same
organization. You will have separate organizations for each platform.

### When will Deno Deploy<sup>EA</sup> be generally available?

We are currently in a private beta phase, rolling out access in waves. We don't
have a specific general availability date yet, but are continuously improving
the platform based on user feedback.

## Account and Access

### How do I get access to Deno Deploy<sup>EA</sup>?

You need to join the Early Access program from the
[Deploy Classic account settings page](https://dash.deno.com/account#early-access).
After joining, access is granted in waves as we expand the beta program.

### Can I invite team members to my Deno Deploy<sup>EA</sup> organization?

Yes, you can invite team members to your Deno Deploy<sup>EA</sup> organization.
Go to the organization settings page and use the **+ Invite User** button to add
members.

### Are there usage limits during the beta?

While Deno Deploy<sup>EA</sup> is in closed beta, we are not charging for usage
of the platform. However, our Acceptable Use Policy and Terms and Conditions
still apply.

## Technical Questions

### Which frameworks are officially supported?

Deno Deploy<sup>EA</sup> has native support for several frameworks including
Next.js, Astro, Nuxt, SolidStart, SvelteKit, Fresh, and Lume. Remix is currently
experimental.

### Does Deno Deploy<sup>EA</sup> support databases?

Database features such as Deno KV are not yet available in Deno Deploy
<sup>**EA**</sup> but are coming soon.

### What about queues and cron jobs?

Queues and Cron are not currently available in Deno Deploy<sup>EA</sup>.

### Can I deploy from the CLI or GitHub Actions?

CLI deployment and deployment from GitHub Actions are not yet available in Deno
Deploy<sup>EA</sup> but are on the roadmap.

### How do I handle cold starts effectively?

To optimize cold starts:

1. Minimize dependencies
2. Load infrequently accessed code lazily using dynamic `import()`
3. Minimize I/O operations during startup
4. Avoid top-level `await` for network requests

### How long are logs and traces retained?

Currently, logs and traces are retained for 7 days. We're working on
configurable retention periods for the future.

## Troubleshooting

### My build is failing, what should I do?

Check the build logs for specific error messages. Common issues include:

- Misconfigured build or install commands
- Missing dependencies
- Framework configuration issues

If you can't identify the issue, [contact Deno support](../support).

### How do I roll back to a previous version?

You can roll back to a previous version by going to the timelines page,
selecting the desired timeline, and locking it to a previous revision.

### My domain verification is failing

Ensure that:

1. You've added all the required DNS records
2. If using Cloudflare, you've disabled the proxying feature (orange cloud) for
   the `_acme-challenge` CNAME record
3. DNS propagation has completed (this can take up to 48 hours in some cases)

### I need additional help that's not covered here

For assistance, join [the Deno Discord](https://discord.gg/deno) and check the
`#deploy-ea` channel, or email [deploy@deno.com](mailto:deploy@deno.com).
