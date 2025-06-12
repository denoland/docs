---
title: Builds
description: "Detailed explanation of the build process in Deno Deploy Early Access, covering build triggers, stages, configuration options, caching, and the build environment."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

In Deno Deploy<sup>EA</sup> an app's code can have multiple historical
revisions. These revisions (or builds) generally map one to one to git commits
in the linked GitHub repository when deploying from GitHub.

Builds can be triggered in two ways:

- **manually**, using the "Deploy Default Branch" button on the builds page. By
  default this will trigger a build on the "default" git branch (usually
  `main`). The dropdown menu on this button on this page can be used to select a
  different branch to deploy from.
- **automatically**, whenever a new commit is pushed to a GitHub repository that
  is linked to an app

A revision goes through multiple stages before finally being routed and
available to users:

1. **Queuing:** the revision is waiting to be assigned to a build.
1. **Preparing:** a builder is assigned to process the build, the source code of
   the revision gets downloaded to the builder, and any available build caches
   are being restored to the builder
1. **Install:** the install command is executed if there is one. This will
   usually download any dependencies that are not already in the build cache,
   and check that the lockfile is up to date.
1. **Build:** the build command is executed if there is one. Once the build
   command has executed, the build artifact is created from the build output and
   is uploaded to the distributed runtime infrastructure.
1. **Warm up:** a `GET /` request is sent to the revision to check that it boots
   correctly and listens for incoming HTTP requests.
1. **Route:** the global infrastructure is being configured to route requests to
   the new revision based on the timelines they are part of.

If any of these steps fail, the build goes into the “Failed” state. Failed
builds do not receive traffic.

Build logs are available in the dashboard. They are streamed live to the
dashboard while the build is running. After the build is finished the builds are
still available on the build page.

Build caching is a way to speed up builds by reusing files that have not changed
between builds. This is configured automatically for some framework presets, and
for the `DENO_DIR` dependency cache. Other directories can not manually be added
to the cache at this time.

A build can be cancelled while it is running using the "Cancel" button in the
top-right of the build page.

Builds can run for at most 5 minutes. After 5 minutes a build will be cancelled
automatically.

## Build configuration

Builds can be configured through build configuration. The build configuration
determines how to get from the source code (that is stored in a GitHub
repository), to a build artifact that can be deployed.

Build configuration can be changed in three places:

- during app creation by pressing the "Edit build config" button
- after creation in the app settings by pressing the “Edit” in the build
  configuration section
- in the retry drawer on the page of a failed build

During app creation a build configuration may be automatically detected from the
files in your repository, if you are using a framework or a common build setup.

The following build configuration options are available:

- **Framework preset:** a configuration preset for certain natively supported
  frameworks and tools. When a framework preset is configured, Deno Deploy
  <sup>EA</sup> will automatically configure the builder to build the given
  framework in the most optimal possible way.
  [Learn more about Framework integrations.](./frameworks/)
- **Install command:** a shell command that is executed to install dependencies.
  In projects with a `package.json` this is often `npm install`, or
  `deno install`. In Deno-first projects without a `package.json` this is often
  not needed, as Deno can granularly install only used dependencies.
- **Build command**: a shell command that is executed to build the project. This
  is often a build task in a `package.json` or `deno.json`, which can be invoked
  through `deno task build` or `npm run build`.
- **Runtime configuration:** the configuration for how to run the application to
  serve traffic. If a framework preset is set, this often does not have to be
  set, because Deno Deploy<sup>EA</sup> will automatically pick the best
  strategy for you. Otherwise you have two options:
  - **Dynamic:** an application that dynamically responds to every request using
    a Node or Deno server. This is the case for API servers (Express, Hono,
    etc), or a server-side-rendered website (e.g. Fresh).
    - For a dynamic application you must configure an **entrypoint**. This is
      the JavaScript or TypeScript file you would pass to `deno run` or `node`
      to execute.
    - You can optionally configure **arguments** to pass to the application
      after the entrypoint, accessible to the app using `Deno.args` or
      `process.args`.
  - **Static:** a static website that serves the same (pre-rendered) content to
    all users. This is the case for static site generators (Lume, 11ty, etc),
    and single page apps (e.g. Vite React template, create-react-app).
    - For a static application you must configure the static **directory** that
      contains the static assets, such as `_dist`, `.output`, or `site`.
    - You can optionally enable **single page app** mode, which changes the
      behaviour of the app such that all requests that do not match a static
      file are served the root `index.html` file instead of a 404 status code.

## Build environment

The build environment is a Linux-based environment running either x64 or ARM64
architecture. The following tools are available in the build environment:

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

Because of this, the `node` available in the build environment is not really
Node.js. It is a shim that translates Node.js invocations to `deno run`. `npm`,
`npx`, `yarn`, and `pnpm` also run with Deno rather than Node.js.

:::

Environment variables configured for the "Build" context in the organization or
app settings are available in the build environment. Environment variables that
are only available in the "Production" or "Development" contexts are not
available in the build environment.
[Learn more about environment variables.](./env-vars-and-contexts/)

Builders have 8 GB of storage available during the build process.
