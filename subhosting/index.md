---
last_modified: 2026-11-12
title: "Deno Subhosting"
description: "Run your customers' code on Deno Deploy through the Deno Deploy API: what Subhosting is, how it maps onto organizations and apps, and where the API reference and SDKs live."
oldUrl:
  - /deploy/manual/subhosting/
---

Deno Subhosting lets Software as a Service (SaaS) providers securely run code
written by their customers. Instead of working in the dashboard, you drive Deno
Deploy programmatically through the
[Deno Deploy API](https://api.deno.com/v2/docs), so untrusted code can be
deployed at scale.

## Key features

- **Ease of use:** Developers can write code in generic JavaScript or TypeScript
  without needing specific knowledge of Deno.
- **Standards compliance:** Deno supports standard JavaScript and TypeScript and
  integrates widely-used web APIs like `fetch` and `web cache`.
- **Deno-specific advanced features:** Offers advanced features like `KV`
  (Key-Value stores) which extend beyond typical browser capabilities.
- **Rapid deployment:** Deno's cloud products are designed to support extremely
  short deployment times that range from less than a second for simple
  applications, to around ten seconds for complex websites with numerous
  dependencies.
- **Improved developer experience:** Subhosting manages the extensive effort of
  setting up secure infrastructure to run untrusted code in a public cloud for
  you.

## Deno Deploy and Deno Subhosting

Both run on the same infrastructure and expose the same features; they differ in
who writes the code and how it gets there.

- **Deno Deploy** is optimized for individual developers and teams hosting their
  own websites and applications, typically deployed from GitHub or the CLI.
- **Deno Subhosting** is Deno Deploy driven through its API: a SaaS platform
  creates apps and deployments on behalf of its end-users, who contribute the
  code. It is designed for a large volume of projects and deployments of
  untrusted code.

## How it works

1. Create an [organization](/deploy/reference/organizations/) in the
   [Deno Deploy console](https://console.deno.com) and create an access token
   for it from the organization's settings page.
2. Use the API to create an [app](/deploy/reference/apps/) per customer project
   and upload its code as a deployment. Each deployment runs on a
   Deno-provisioned URL or on a [custom domain](/deploy/reference/domains/) you
   configure.
3. Everything else works as documented for Deno Deploy:
   [environment variables and contexts](/deploy/reference/env_vars_and_contexts/),
   [databases](/deploy/reference/databases/),
   [observability](/deploy/reference/observability/) and
   [caching](/deploy/reference/caching/).

## API reference and SDKs

- **API reference:** [api.deno.com/v2/docs](https://api.deno.com/v2/docs)
- **TypeScript/JavaScript:**
  [@deno/sandbox](https://www.npmjs.com/package/@deno/sandbox)
- **Python:** [sandbox-py](https://github.com/denoland/sandbox-py)
