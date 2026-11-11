---
last_modified: 2026-11-11
title: Pricing and Limits
description: Overview of Deno Subhosting pricing plans, resource limits, deployment restrictions, and performance constraints for your applications.
---

:::warning Subhosting v1 API has been shut down

This section documents the retired subhosting v1 API, which was shut down on
July 20, 2026, and is kept for reference only. The current API is v2
(<a href="https://api.deno.com/v2/docs">api.deno.com/v2/docs</a>), which is
documented with <a href="/deploy/">Deno Deploy</a>.

:::

You can see an
[overview of available pricing plans and features](https://deno.com/deploy/pricing?subhosting)
for Deno Subhosting on the Deno website. If you have a use case that exceeds any
of these limits, [please reach out](mailto:deploy@deno.com).

## Deployment size

Deployments should be less than 1GB across all source code and assets in
aggregate, per deployment.

## Deployment frequency

The maximum number of deployments per hour that a subhosting user can make is
either 60 (on the free tier) or 300 (on the builder tier). Higher limits are
available for organizations on the enterprise plan.

## CPU time per request

- 50ms or 200ms, depending on tier.
- CPU time limit per request is limited on the average across many requests. It
  is not strictly enforced on a per-request basis.
- Does not include time that a deployment is waiting for I/O (e.g. while waiting
  for the remote server while making a fetch() request)

## Blocking the event loop

Programs should not block the event loop for more than 1s.

## Available memory

512MB max memory is available.
