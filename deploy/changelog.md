---
title: "Deno Deploy changelog"
description: "Listing notable progress in the development and evolution of Deno Deploy"
---

## August 27th, 2025

### Features

- Deno KV can now be used with the database integration:
  - Provision a Deno KV database through the "Databases" tab, and link it to an
    app or playground.
  - Access the Deno KV database from your code by using `Deno.openKv()`.
  - KV queues, read-replication, manual backups, and choosing a primary region
    are not available at this time.
- Playgrounds now support dragging in individual files and folders.
- The playground file explorer now supports inline rename and delete of files.
- New built-in environment variables have been added to enable detection of Deno
  Deploy EA, and the app that is running, and the organization it is running in:
  `DENO_DEPLOY=1`, `DENO_DEPLOY_ORG_ID`, `DENO_DEPLOY_ORG_SLUG`,
  `DENO_DEPLOY_APP_ID`, `DENO_DEPLOY_APP_SLUG`, `DENO_DEPLOY_REVISION_ID`.
- Users can now create personal access tokens from their account page.
- The Deno Deploy EA dashboard has migrated from https://app.deno.com to
  https://console.deno.com. All existing URLs will automatically redirect to the
  new URL.

### Bug Fixes

- Check that Postgres database instances support dynamic provisioning of
  databases before allowing them to be linked to an organization.
- Ensure that deleted Deno Deploy apps will never trigger GitHub status checks
  on push to the previously linked repo.
- The playground HTTP explorer now correctly sends the set headers when making
  requests.
- Playgrounds do not error on top level `await` anymore.
- You can now add environment variables named `GOOGLE_APPLICATION_CREDENTIALS`
  to your Deno Deploy app.
- When bulk importing environment variables in the app settings, we now
  correctly import them into that app, rather than mistakenly importing them
  into the organization environment variables.
- Some versions of Next.js, that do not support `using` declarations, now
  correctly build again.
- `npm install` in the build step now works more reliably, and does not fail
  with certificate related issues anymore.

## July 23rd, 2025

### Features

- New: Database support for Deno Deploy apps, allowing you to easily connect to
  and use Postgres databases in your applications.
  - Provision a Postgres database instance on AWS RDS, Neon, Supabase, or any
    other provider and then link it to your Deno Deploy organization.
  - Assign the database instance to an application, making it available in the
    application's environment.
  - Every timeline (production, each git branch, and previews) has their own
    isolated database with a separate schema and data, allowing you to test
    migrations and changes without affecting production data.
  - Use any Postgres client library to connect, including `npm:pg`,
    `npm:drizzle`, or `npm:kysely`.
- Applications and playgrounds can now be renamed. Note, old `deno.net` URLs
  will no longer work after renaming, but custom domains will continue to
  function.
- Applications and playgrounds can now be deleted.
- Playgrounds now have an HTTP Explorer tab that allows you to make arbitrary
  HTTP requests to any URL served by the playground. This is useful for testing
  APIs or other services that do not serve a web page.
- You can now delete entire folders in the playground file explorer by pressing
  the delete button next to the folder name.
- You can now drag a zip file onto the playground file explorer to upload all
  files in the zip file to the playground.
- You can now enable auto-format on save in the playground, which will
  automatically format your code when you save a file.

### Bug fixes

- `DENO_` prefixed environment variables such as `DENO_CONDITIONS`,
  `DENO_COMPAT`, and `DENO_AUTH_TOKENS` can now be set without error.
- The `DENO_REVISION_ID` environment variable is now correctly exposed to
  applications and playgrounds.
- The custom domain assignment drawer now shows custom domains that are already
  assigned to another application or playground as disabled.
- The network usage graph on the metrics page now correctly shows incoming and
  outgoing traffic. Previously, the data shown was incorrect.
- For newly created organizations the first build now waits until the
  `<org>.deno.net` domain is provisioned before the routing step.
- Pressing `Ctrl-S` / `Cmd-S` in the playground now saves the current file and
  triggers a build, instead of opening the browser's save dialog.
- Viewing some specific traces previously hung the trace viewer. These now show
  correctly.

## July 9th, 2025

### Features

- New: Cloud Connect allows you to securely connect your Deno Deploy apps to AWS
  and GCP, enabling you to use services like AWS S3, Google Cloud Storage,
  without needing to manage credentials.
  - This is done without storing any long-lived static credentials, but rather
    using short-lived tokens and OIDC (OpenID Connect) to establish a trust
    relationship between Deno Deploy and your cloud provider.
  - A setup flow in the app settings page, or a drawer in playgrounds, guides
    you through the process of connecting your app to AWS or GCP.
  - You can use the standard AWS and GCP SDKs to access the services - no need
    to re-write any code to use a different API.
  - [Learn more in the documentation.](/deploy/reference/cloud_connections/)
- The application metrics page now shows more metrics, including V8 memory
  metrics such as heap size and garbage collection stats, as well as process
  level metrics such as CPU usage and overall memory usage.
- There is now a new "Metrics" tab in the organization overview that shows
  overall metrics for all applications in the organization, including the number
  of requests, CPU usage, and memory usage.
- You can now edit the URL you are viewing in the playground preview iframe by
  editing the "address bar" that is displayed above the preview.
- Environment variables now default to being a secret when the key contains
  `SECRET`, `KEY`, `TOKEN`, `PRIVATE`, or `PASSWORD`. You can still manually
  switch them to plain text if needed.
- The maximum length limit for environment variable values has been increased to
  4096 characters, up from 1024 characters.

### Bug fixes

- Playgrounds do not get stuck when attempting to deploy an empty file anymore.
- Playground drawer resizing now works more reliably, especially when some
  drawers are collapsed.
- Builds now take significantly less time to complete, especially for larger
  projects. The "Warmup" and "Routing" steps, which previously took more than 10
  seconds respectively, now usually take less than 1 second each.
- Builds can now be cancelled while they are in the "Queueing" and "Routing"
  steps.
- The organization creation page now correctly displays whether an organization
  slug is taken or not, prior to submitting the form.
- `npm install` can now install `esbuild` again - previously it would fail with
  a generic error.

## June 24th, 2025

### Features

- The playground now has live-streaming logs and traces panels
  - Logs and traces for the current revision are displayed for the past hour
  - Logs and traces can be filtered, just like in the dedicated observability
    pages
- Framework auto-detection now works for more projects out of the box, including
  many Vite-based projects
- The organization dropdown now highlights the currently selected organization
  more clearly

### Bug fixes

- The sparklines in the metrics overview are now working correctly
- The error rate metric now functions properly
- GitHub-triggered builds no longer run multiple times
- Next.js builds now work more reliably on older Next.js versions

## June 12th, 2025

### Features

- Deno Deploy now supports playgrounds!
  - Playgrounds can be created and accessed from the playgrounds tab in the
    organizations overview
  - Playgrounds can contain multiple files and include build steps
  - The playground UI features an iframe to preview your deployed app
  - Three templates are currently available: hello world, Next.js, and Hono
- On mobile devices, there is now a floating navbar that doesn't intrude into
  page content

## June 9th, 2025

### Features

- Deno Deploy has a new logo!
- Anyone can now join by signing up at
  [console.deno.com](https://console.deno.com)
- Builds
  - Builds can now use up to 8 GB of storage, up from 2 GB
  - Builds can now use environment variables and secrets configured in the
    organization or app settings (in the new "Build" context)
  - Builds now have a maximum runtime of 5 minutes
- The metrics page has had a complete overhaul by rewriting the chart rendering:
  - Dragging on a graph now zooms in on the selected area
  - Much more data can now be shown without the page becoming slow to load
  - The tooltip now follows the mouse cursor, together with a new crosshair that
    allows for precise analysis
  - Font sizes and colors have been improved for better readability

### Bug fixes

- Builds should not get stuck in a pending state anymore
- Dashboard pages now load significantly faster
- Correctly shows spans in traces that have parents that are not exported (yet)
- The metrics page correctly refreshes now when switching time ranges
- The "Clear search" button in the telemetry search bar now works correctly
- Older Next.js versions (such as Next.js 13) build correctly now
- The environment variable drawer is now used everywhere, fixing a bug where
  multiple env vars with the same name but different contexts would conflict
- Running `node <path>` in the builder does not fail anymore when the path is
  absolute
- `npx` is now available in the builder
- Astro builds will not sporadically fail with `--unstable-vsock` errors anymore
- Svelte projects now deploy correctly when a project explicitly specifies
  `@deno/svelte-adapter`

## May 26th, 2025

### Features

- When triggering a manual build you can now choose which branch to deploy
- You can now deploy Astro static sites without having to manually install the
  Deno adapter
- There are now [reference docs for you to peruse](/deploy/).

### Bug fixes

- SvelteKit auto-detection now works when using `npm` as the package manager
- Prewarming does not trigger random POST requests to your app anymore
- Visiting a page with a trailing slash will not 404 anymore
- Drawers will no longer close if you click inside, hold and drag over the
  backdrop, and release

## May 22nd, 2025

### Features

- You can now bulk import env vars during app creation by pasting a `.env` file
  into the env var drawer
- SvelteKit now works out of the box without manually installing the Deno
  adapter
- A preset for the Lume static site generator is now available

### Bug fixes

- Environment variables now show up correctly on the timelines page
- The production timeline page now correctly shows all builds
- console.deno.com works on older versions of Firefox now
- Page titles across console.deno.com now reflect the page you are on
- The "Provision certificate" button does not lock up after DNS verification
  failures anymore
- Domains that had a provisioned certificate or attached application can now be
  deleted
