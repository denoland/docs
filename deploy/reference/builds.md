---
title: Builds
description: "Detailed explanation of the build process in Deno Deploy, covering build triggers, stages, configuration options, caching, and the build environment."
---

In Deno Deploy, each version of your application code is represented as a
revision (or build). When deploying from GitHub, revisions generally map
one-to-one to git commits in your repository.

## Build triggers

Builds can be triggered in three ways:

- **Manually from the UI**: Using the "Deploy Default Branch" button on the
  builds page, which deploys the default git branch (usually `main`). The
  dropdown menu lets you select a different branch.

- **Manually from the CLI**: Using the `deno deploy` command.

- **Automatically from GitHub**: When a new commit is pushed to a GitHub
  repository linked to your app.

## Build stages

A revision goes through these stages before becoming available:

1. **Queuing**: The revision waits to be assigned to a builder.
2. **Preparing**: A builder downloads the source code and restores any available
   build caches.
3. **Install**: The install command executes (if specified), typically
   downloading dependencies.
4. **Build**: The build command executes (if specified), creating a build
   artifact that is uploaded to the runtime infrastructure.
5. **Deploy**: The revision is prepared for deployment into each timeline. For
   each timeline, the following occurs:
   1. **Create database**: If the application has an attached database, ensure
      one exists for this timeline (creating it if necessary).
   2. **Pre-deploy command**: Any pre-deploy command configured for the
      application executes, typically for tasks like database migrations.
   3. **Warmup**: Only in the "Preview" timeline, the application is started to
      ensure it boots correctly.
   4. **Routing**: Roll out the new revision to the URLs associated with this
      timeline.

If any step fails, the build enters a "Failed" state and does not receive
traffic.

Build logs are streamed live to the dashboard during the build process and
remain available on the build page after completion.

Build caching speeds up builds by reusing files that haven't changed between
builds. This happens automatically for framework presets and the `DENO_DIR`
dependency cache.

You can cancel a running build using the "Cancel" button in the top-right corner
of the build page. Builds automatically time out based on application
configuration. By default, builds time out after 5 minutes, but this can be
increased for users on the Pro plan.

## App configuration

App configuration defines how to convert source code into a deployable artifact.
You can modify app configuration in three places:

- During app creation by clicking "Edit app config"
- In app settings by clicking "Edit" in the app configuration section
- In the retry drawer on a failed build's page

When creating an app, app configuration may be automatically detected from your
repository if you're using a recognized framework or common build setup.

### Configuration options

- **App directory**: The directory within the repository to use as the
  application root. Useful for monorepos. Defaults to the repository root.

- **Framework preset**: Optimized configuration for supported frameworks like
  Next.js or Fresh. [Learn more about framework integrations](./frameworks/).

- **Install command**: Shell command for installing dependencies, such as
  `npm install` or `deno install`.

- **Build command**: Shell command for building the project, often a task from
  `package.json` or `deno.json`, such as `deno task build` or `npm run build`.

- **Pre-deploy command**: Shell command that runs after the build is complete
  but before deployment, typically for tasks like database migrations.

- **Runtime configuration**: Determines how the application serves traffic:
  - **Dynamic**: For applications that respond to requests using a server (API
    servers, server-rendered websites, etc.)
    - **Entrypoint**: The JavaScript or TypeScript file to execute
    - **Arguments** (optional): Command-line arguments to pass to the
      application
    - **Runtime working directory** (optional): The working directory for the
      application at runtime
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

Builders have the following resources available during the build process:

- 2 vCPUs
- 3 GB of RAM (can be increased to 4 GB on Pro plan)
- 8 GB of storage
