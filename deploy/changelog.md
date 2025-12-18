---
title: "Deno Deploy changelog"
description: "Listing notable progress in the development and evolution of Deno Deploy"
---

## December 18th, 2025

### Features

- Deno Deploy can now detect Deno and NPM workspace / monorepo configurations,
  allowing you to deploy applications located in subdirectories of a larger
  repository.
  - During app creation, we'll now scan the repository for workspace
    configurations, and allow you to select which workspace member to deploy.
  - During builds, the working directory is set to the workspace member's
    directory.
  - The app directory can be customized after app creation in the app config
    settings.
- The build logs now have a dedicated "Deploy" section that replaces the
  previous "Warmup" and "Routing" steps, providing more clarity on what is
  happening during deployment.
  - Inside of the "Deploy" section, you'll find sub-sections for each timeline
    that the revision is being deployed to, including production, git branches,
    and preview deployments.
  - The "Warmup" sub-section shows logs related to prewarming the application.
  - The "Pre-deploy" sub-section shows logs related to running the user-defined
    pre-deploy command, for example to run migrations.
  - The "Database creation" sub-section shows logs related to creating any
    linked databases for the timeline.
- The top navigation bar has been redesigned to include a breadcrumb dropdown
  for the current section of the dashboard. This allows you to quickly navigate
  between, for example, apps and domains.
- You can now skip deploying a specific commit using the GitHub integration by
  including the string `[skip ci]` or `[skip deploy]` in the commit message.
- Revisions that have not received traffic for more than 30 days are now
  automatically disabled, and deleting after a further 7 days of inactivity.
  - Disabled revisions can be re-enabled before deletion from the revisions
    page.
- The `deno deploy` CLI and `--tunnel` flag for `deno run` and `deno task` now
  support using organization tokens for authentication, in addition to user
  tokens.
  - To use an organization token, pass it as usual in the `DENO_DEPLOY_TOKEN`
    environment variable.
- We have rolled out several runtime security patches to address recently
  disclosed vulnerabilities in React and Next.js:
  [CVE-2025-55182](https://deno.com/blog/react-server-functions-rce) (Remote
  Code Execution) and
  [CVE-2025-55184/CVE-2025-67779](https://deno.com/blog/cve-2025-55184) (Denial
  of Service).
- And one more thing at the end: we've quietly enabled our new sandboxes
  infrastructure for all Deno Deploy users to try.
  - Sandboxes provide fully isolated Linux microVMs for you to run untrusted
    code in.
  - This is particularly useful for running third-party code, such as plugins,
    extensions, or user-generated or LLM-generated code, without risking the
    security of your application.
  - We'll announce more details about sandboxes in the new year, so stay tuned!
  - Try it out from the "Sandboxes" tab in the organization overview.
  - [Learn more about sandboxes.](https://deno.com/deploy/sandboxes)

### Bug fixes

- Fixed an issue where some Next.js and Astro builds would fail when installing
  dependencies with a frozen lockfile.
- Fixed an issue the `_acme-challenge` CNAME DNS records was displayed without a
  trailing dot, causing confusion when copying the record value for DNS
  verification.

## November 25th, 2025

### Features

- Deno Deploy can now securely expose locally running applications on a public
  domain using the `deno run --tunnel` / `deno task --tunnel`.
  - This is particularly useful for testing webhooks from third-party services,
    or sharing work-in-progress applications with colleagues or clients.
  - The tunnel creates a secure connection from your local machine to Deno
    Deploy's infrastructure, and provisions a temporary public domain that
    routes traffic to your local application.
  - In addition, `--tunnel` automatically pulls down "Local" environment
    variables from the Deno Deploy dashboard, making configuration and secrets
    management much easier.
  - Open Telemetry metrics, logs, and traces are also collected from local
    applications and can be viewed in the Deno Deploy dashboard, the same way as
    deployed applications.
  - [Learn more in the documentation.](/deploy/reference/tunnel/)
- Postgres databases can now be directly provisioned from the Deno Deploy
  dashboard, hosted by our friends at Prisma.
  - Like other externally linked databases, each timeline (production, git
    branches, and previews) in every app, gets its own isolated database schema
    and data.
  - You can manage your database directly from the Deno Deploy dashboard, with
    options to export your database to your own Prisma account for further
    management.
  - [Learn more in the documentation.](/deploy/reference/databases/)
- Builds have been improved further with:
  - Customizable build timeouts (defaulting to 5 minutes, up to 15 minutes on
    Pro plan)
  - Customizable memory allocation for the builder (defaulting to 3GB, up to 4GB
    on Pro plan)
  - The directory that builds run in can now be customized, enabling deployment
    of applications inside of a monorepo
  - Applications can now set the runtime working directory that is used when
    booting up the application after a successful build
- Users can now sign in to Deno Deploy using Google, in addition to GitHub.
  - From the account settings page, you can link both Google and GitHub to your
    account, allowing you to sign in with either provider.
- The playgrounds list on the organization overview page has been merged into
  the apps list, allowing you to see and manage all your deployed code from a
  single place.
  - Playgrounds now have an overview page, similar to apps, showing metrics,
    builds, logs, and traces.
  - Playgrounds can now be assigned custom domains through the settings.
- The domain and database dropdowns in the assignment drawers now support
  searching, making it easier to find the domain or database you want to assign
  when you have many.
- Billing and metering has moved to a new dedicated page per organization,
  showing detailed usage breakdowns, invoice history, and payment methods, plan
  details, and more.
- Applications now have a dedicated databases page, showing all linked
  databases, their status, and options to manage them.
- The .env import field in the environment variable drawer is now more visible,
  and now supports drag-and-drop of .env files

### Bug fixes

- Fixed a bug where the percentage in usage alert emails was off by 100x (e.g.
  showing 100% instead of 1%). This was caused by a decimal vs percentage mixup.
- The package managers `npm`, `yarn`, and `pnpm` now more reliably install
  dependencies during the build step.
- The environment variable value input field now handles multiline values
  correctly, and does not strip out newlines anymore.
- Fix some organizations not being unsuspended immediately after verifying with
  a credit card.
- Fix some builds hanging when a user provided install or build command does not
  terminate quickly on SIGTERM.
- Changing the slug of a database instance now correctly updates the slug in the
  URL bar, ensuring that the page can be refreshed without error.
- Build timeouts are now displayed as timeouts, rather than generic
  cancellations, in the build logs, and build history.
- A timeline does not have to be unlocked anymore before being able to be locked
  to a new revision, if already locked to a revision.

## September 26th, 2025

### Features

- Metering and billing is now enabled for all organizations on Deno Deploy.
  - After creation, all organizations default to the Free plan, which includes
    generous free usage limits each month. To learn more about the Free and Pro
    plans, [see the pricing page](https://deno.com/deploy/pricing).
  - Free organizations that exceed their usage on requests, bandwidth, or CPU or
    memory time will have their applications paused until the next billing
    cycle, while Pro organizations will be billed for the overage at the end of
    the month.
  - Organizations can only make use of restricted Free plan limits until they
    verify their organization by linking a credit card.
  - The Pro plan enables features such as wildcard custom domains, priority
    support, and increased included limits.
  - Spend limits are available to Pro organizations, allowing you to cap your
    monthly spend to avoid unexpected charges.
- Deno Deploy now supports issuing OIDC tokens for all applications at runtime,
  allowing you to securely authenticate to third-party services and APIs without
  needing to manage long-lived static credentials.
  - OIDC tokens can be retrieved with the
    [`@deno/oidc` module on JSR](https://jsr.io/@deno/oidc).
  - When authenticating to AWS or GCP, you can make use of the Cloud Connections
    feature instead, which will guide you through set up and automatically
    handle token retrieval and rotation for you.
    [Learn more about Cloud Connections](https://docs.deno.com/deploy/reference/cloud_connections/).
  - [Learn more about OIDC on Deno Deploy in the documentation](/deploy/reference/oidc/).
- In addition to TLS certificates provisioned automatically through Let's
  Encrypt by Deno Deploy, you can now upload and manage custom TLS certificates
  for your domains. This is useful for organizations that use EV or OV
  certificates, or have specific compliance requirements.
  - If a certificate nears expiration, we'll send email reminders to the
    organization owners to renew the certificate.
  - This feature is only available to organizations on the Pro plan.
- Applications that are linked to GitHub repositories now dispatch GitHub
  `repository_dispatch` events every time a build is started, or completed
  (successfully or failed). These events can be picked up by GitHub Actions
  workflows to trigger additional actions, such as notifying a Slack channel, or
  running additional tests.
  [See the documentation for more details.](https://docs.deno.com/deploy/reference/apps/#github-events-integration)
- Domains can now be unassigned from an application through the organization
  domains page, without needing to go to the application settings.

### Bug fixes

- When bulk importing environment variables, the heuristic to detect whether a
  variable is a secret or plain text has been improved. Now, variables with keys
  containing `PUBLIC_` are always treated as plain text.
- Some metrics on the organization and app metrics pages were displaying second
  values as milliseconds, causing them to appear 1000x too low. This has been
  fixed.

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

### Bug fixes

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
