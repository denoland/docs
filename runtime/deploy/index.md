---
last_modified: 2026-06-18
title: "Deploying your app"
description: "Ways to run a Deno app in production: the managed Deno Deploy platform, containers and Docker, cloud and serverless providers, and self-hosting a standalone binary."
---

Once your app runs locally, you have a few ways to get it into production.
Broadly, you either let a managed platform run it for you, or you run it
yourself on infrastructure you control. This page maps the options and points to
the guide for each.

## Choosing an option

- **Want the least operational overhead?** Use
  [Deno Deploy](#deno-deploy-managed-platform), the managed platform built for
  Deno.
- **Already have container infrastructure, or want portability across clouds?**
  Ship a [container image](#containers-and-docker).
- **Targeting a specific cloud or serverless provider?** Jump to the
  [platform guides](#cloud-and-serverless-platforms).
- **Want a single self-contained artifact with no runtime to install?**
  [Compile to a standalone binary](#self-hosting-the-runtime) and run it on any
  machine.

## Deno Deploy (managed platform)

[Deno Deploy](/deploy/) is Deno's serverless platform. You push code and it
handles builds, TLS, global distribution, and scaling, with first-class support
for Deno and Node apps and frameworks like Next.js, Astro, and SvelteKit. It
also offers integrated observability, cron, and a built-in key-value database.

- [Get started with Deno Deploy](/deploy/getting_started/)
- [Deploy with the `deno deploy` command](/examples/deploy_command_tutorial/)

## Containers and Docker

Containers give you a portable artifact you can run on any host, orchestrator,
or cloud. Deno publishes official images in several variants.

- [Deno and Docker](/runtime/reference/docker/) covers Dockerfiles, multi-stage
  builds, Docker Compose, workspaces, and production best practices.

## Cloud and serverless platforms

Step-by-step guides for deploying a Deno app to specific providers:

- [AWS Lambda](/examples/aws_lambda_tutorial/) for serverless functions
- [AWS Lightsail](/examples/aws_lightsail_tutorial/) for container-based VM
  hosting
- [AWS ECS Fargate](/examples/aws_ecs_fargate_tutorial/) for serverless
  containers
- [Google Cloud Run](/examples/google_cloud_run_tutorial/) for serverless
  containers
- [DigitalOcean](/examples/digital_ocean_tutorial/) for container hosting
- [Kinsta](/examples/kinsta_tutorial/) for managed app hosting
- [Cloudflare Workers](/examples/cloudflare_workers_tutorial/), or
  [with Wrangler](/examples/cloudflare_workers_wrangler_tutorial/), for the edge

Browse all of these under
[Deploying Deno projects](/examples/#deploying-deno-projects) in the examples.

## Self-hosting the runtime

To run on a VM or bare metal yourself, you have two paths:

- [Compile a standalone binary](/runtime/reference/cli/compile/) with
  `deno compile`. The result bundles your code and the runtime into a single
  executable with no external dependencies, which you can copy to a server and
  run directly.
- [Install Deno](/runtime/getting_started/installation/) on the host and run
  your app with [`deno serve`](/runtime/reference/cli/serve/) for a
  production-ready HTTP server, typically behind a process manager such as
  systemd.

## Production considerations

Whichever option you choose, a few things carry across:

- **[Permissions](/runtime/fundamentals/security/).** Grant only the access your
  app needs (`--allow-net`, `--allow-read`, and friends) rather than running
  with all permissions.
- **[Environment variables](/runtime/reference/env_variables/).** Configure
  secrets and per-environment settings through the environment rather than
  hard-coding them.
- **[Observability](/runtime/fundamentals/open_telemetry/).** Deno has built-in
  OpenTelemetry support for traces, metrics, and logs.
- **[Continuous integration](/runtime/reference/continuous_integration/).** Run
  tests, linting, and formatting checks before you deploy.
