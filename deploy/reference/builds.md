---
title: Builds
description: "Detailed explanation of the build process in Deno Deploy, covering build triggers, stages, configuration options, caching, and the build environment."
---

In Deno Deploy, each version of your application code is represented as a
revision (or build). When deploying from GitHub, revisions generally map
one-to-one to git commits in your repository.

## Build triggers

Builds can be triggered in three ways:

- **Automatically from GitHub**: When a new commit is pushed to a GitHub
  repository linked to your app.

- **Manually from the CLI**: Using the `deno deploy` command.

- **Manually from the UI**: Using the "Deploy Default Branch" button on the
  builds page, which deploys the default git branch (usually `main`). The
  dropdown menu lets you select a different branch.

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

There are two places you can set app configuration:

- **In source code**: Using a `deno.json` or `deno.jsonc` file in the
  application directory.
- **In the Deno Deploy dashboard**: Using the app configuration settings.

If you specify both options, settings in the source code take precedence over
those in the dashboard. You will be unable to edit any of the app configuration
values in the dashboard if the most recent successful build used configuration
from source code.

The application directory must be configured through the dashboard. This setting
is not configurable from source code, as it determines where to find the source
code itself.

### Editing app configuration in the dashboard

You can modify app configuration in three places:

- During app creation by clicking "Edit app config"
- In app settings by clicking "Edit" in the app configuration section
- In the retry drawer on a failed build's page

When creating an app, app configuration may be automatically detected from your
repository if you're using a recognized framework or common build setup.

#### Configuration options

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
    - **Runtime memory limit** (optional): The maximum amount of memory the
      application can use at runtime. Defaults to 768 MB, can be increased to 4
      GB on the Pro plan.
  - **Static**: For static websites serving pre-rendered content
    - **Directory**: Folder containing static assets (e.g., `dist`, `.output`)
    - **Single page app mode** (optional): Serves `index.html` for paths that
      don't match static files instead of returning 404 errors
  - **Automatic**: When using a framework preset, the runtime configuration is
    set automatically.
    - **Runtime memory limit** (optional): The maximum amount of memory the
      application can use at runtime. Defaults to 768 MB, can be increased to 4
      GB on the Pro plan.

- **Build timeout**: Maximum time allowed for the build process. Defaults to 5
  minutes, can be increased to 15 minutes on the Pro plan.

- **Build memory**: Amount of memory allocated to the build process. Defaults to
  3 GB, can be increased to 4 GB on the Pro plan.

### Editing app configuration from source code

To configure your application from source code, add a `deno.json` or
`deno.jsonc` file to the root of your application directory with a `deploy` key.
If any of the following app configuration options are specified under this key,
the entire configuration will be sourced from the file instead of the dashboard
(any configuration specified in the dashboard will be ignored).

#### `deno.json` options

- `deploy.framework` (required unless `deploy.runtime` is set): The framework
  preset to use, such as `nextjs` or `fresh`. Setting this option automatically
  configures defaults for the framework. Available presets are listed in the
  [framework integrations docs](./frameworks/).
- `deploy.install` (optional): Shell command to install dependencies.
- `deploy.build` (optional): Shell command to build the project.
- `deploy.predeploy` (optional): Shell command to run after the build is
  complete but before deployment, typically for tasks like database migrations.
- `deploy.runtime` (required unless `deploy.framework` is set): Configuration
  for how the app serves traffic. The app can either be static or dynamic, as
  defined below:
  - For dynamic apps:
    - `deploy.runtime.type`: Must be set to `"dynamic"`, or omitted (dynamic is
      the default).
    - `deploy.runtime.entrypoint`: The JavaScript or TypeScript file to execute.
    - `deploy.runtime.args` (optional): Command-line arguments to pass to the
      application.
    - `deploy.runtime.cwd` (optional): The working directory for the application
      at runtime.
    - `deploy.runtime.memory_limit` (optional): The maximum amount of memory the
      application can use at runtime. Defaults to 768 MB, can be increased to 4
      GB on the Pro plan.
  - For static apps:
    - `deploy.runtime.type`: Must be set to `"static"`.
    - `deploy.runtime.cwd`: Folder containing static assets (e.g., `dist`,
      `.output`).
    - `deploy.runtime.spa` (optional): If `true`, serves `index.html` for paths
      that don't match static files instead of returning 404 errors.
  - For apps using a framework preset:
    - `deploy.runtime.memory_limit` (optional): The maximum amount of memory the
      application can use at runtime. Defaults to 768 MB, can be increased to 4
      GB on the Pro plan.

#### Examples

**Example dynamic app configuration from `deno.json`:**

```jsonc
{
  "deploy": {
    "install": "npm install",
    "build": "npm run build",
    "predeploy": "deno run --allow-net --allow-env migrate.ts",
    "runtime": {
      "type": "dynamic",
      "entrypoint": "./app/server.js",
      "args": ["--port", "8080"],
      "cwd": "./app"
    }
  }
}
```

**Example static app configuration from `deno.jsonc`:**

```jsonc
{
  "deploy": {
    "install": "npm install",
    "build": "npm run build",
    "runtime": {
      "type": "static",
      "cwd": "./public",
      "spa": true
    }
  }
}
```

**Example framework preset configuration with Next.js from `deno.json`:**

```jsonc
{
  "deploy": {
    "framework": "nextjs",
    "install": "npm install",
    "build": "npm run build"
  }
}
```

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

The following environment variables are additionally always available during
builds:

- `CI`: `true`
- `DENO_DEPLOY`: `true` - Indicates that the code is running in Deno Deploy.
- `DENO_DEPLOY_ORGANIZATION_ID`: The ID of the organization that owns the
  application. This is a UUID.
- `DENO_DEPLOY_ORGANIZATION_SLUG`: The slug of the organization that owns the
  application. This is the human-readable identifier used in URLs that was set
  when creating the organization.
- `DENO_DEPLOY_APPLICATION_ID`: The ID of the application. This is a UUID.
- `DENO_DEPLOY_APPLICATION_SLUG`: The slug of the application. This is the
  human-readable identifier used in URLs that was set when creating the
  application, or changed later in the application settings.
- `DENO_DEPLOY_BUILD_ID`: The ID of the currently running build.

Builders have the following resources available during the build process:

- 2 vCPUs
- 3 GB of RAM (can be increased to 4 GB on Pro plan)
- 8 GB of storage
