---
title: Builds
description: "Detailed explanation of the build process in Deno Deploy, covering build triggers, stages, configuration options, caching, and the build environment."
---

In Deno Deploy, each version of your application code is represented as a
revision (or build). When deploying from GitHub, revisions generally map
one-to-one to git commits in your repository.

## Build triggers

Builds can be triggered in two ways:

- **Manually**: Using the "Deploy Default Branch" button on the builds page,
  which deploys the default git branch (usually `main`). The dropdown menu lets
  you select a different branch.

- **Automatically**: When a new commit is pushed to a GitHub repository linked
  to your app.

## Build stages

A revision goes through these stages before becoming available:

1. **Queuing**: The revision waits to be assigned to a builder.
2. **Preparing**: A builder downloads the source code and restores any available
   build caches.
3. **Install**: The install command executes (if specified), typically
   downloading dependencies.
4. **Build**: The build command executes (if specified), creating a build
   artifact that is uploaded to the runtime infrastructure.
5. **Warm up**: A `GET /` request tests that the application boots correctly and
   can handle HTTP requests.
6. **Route**: The global infrastructure is configured to route requests to the
   new revision based on its timelines.

If any step fails, the build enters a "Failed" state and does not receive
traffic.

Build logs are streamed live to the dashboard during the build process and
remain available on the build page after completion.

Build caching speeds up builds by reusing files that haven't changed between
builds. This happens automatically for framework presets and the `DENO_DIR`
dependency cache.

You can cancel a running build using the "Cancel" button in the top-right corner
of the build page. Builds automatically cancel after running for 5 minutes.

## Build configuration

Build configuration defines how to convert source code into a deployable
artifact. You can modify build configuration in three places:

- During app creation by clicking "Edit build config"
- In app settings by clicking "Edit" in the build configuration section
- In the retry drawer on a failed build's page

When creating an app, build configuration may be automatically detected from
your repository if you're using a recognized framework or common build setup.

### Configuration options

- **Framework preset**: Optimized configuration for supported frameworks like
  Next.js or Fresh. [Learn more about framework integrations](./frameworks/).

- **Install command**: Shell command for installing dependencies, such as
  `npm install` or `deno install`.

- **Build command**: Shell command for building the project, often a task from
  `package.json` or `deno.json`, such as `deno task build` or `npm run build`.

- **Runtime configuration**: Determines how the application serves traffic:
  - **Dynamic**: For applications that respond to requests using a server (API
    servers, server-rendered websites, etc.)
    - **Entrypoint**: The JavaScript or TypeScript file to execute
    - **Arguments** (optional): Command-line arguments to pass to the
      application
  - **Static**: For static websites serving pre-rendered content
    - **Directory**: Folder containing static assets (e.g., `dist`, `.output`)
    - **Single page app mode** (optional): Serves `index.html` for paths that
      don't match static files instead of returning 404 errors

## Build environment

The build environment runs on Linux using either x64 or ARM64 architecture.
Available tools include:

- `deno` (same version as at runtime)
- `node`
- `npm`
- `npx`
- `yarn` (v1)
- `pnpm`
- `git`
- `tar`
- `gzip`

:::info

All JavaScript inside of the builder is executed using Deno.

The `node` command is actually a shim that translates Node.js invocations to
`deno run`. Similarly, `npm`, `npx`, `yarn`, and `pnpm` run through Deno rather
than Node.js.

:::

Environment variables configured for the "Build" context are available during
builds, but variables from "Production" or "Development" contexts are not.
[Learn more about environment variables](/deploy/reference/env_vars_and_contexts/).

Builders have 8 GB of storage available during the build process.
