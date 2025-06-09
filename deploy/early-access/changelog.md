---
title: "Deno Deploy<sup>EA</sup> changelog"
description: "Listing notable progress in the development and evolution of Deno Deploy Early Access"
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

## June 9th, 2025

### Features

- Deno Deploy<sup>EA</sup> has a new logo!
- Anyone can join Early Access now by signing up at
  [dash.deno.com](https://dash.deno.com/account#early-access)
- Builds
  - Builds can now use up to 8 GB of storage, up from 2 GB
  - Builds can now use environment variables and secrets configured in the
    organization or app settings (in the new "Build" context)
  - Builds now have a maximum runtime of 5 minutes
- The metrics page has had a complete overhaul, by rewriting the chart
  rendering:
  - Dragging on a graph now zooms in on the selected area
  - Much more data can now be shown without the page becoming slow to load
  - The tooltip now follows the mouse cursor, together with a new crosshair that
    allows for precise analysis
  - Font sizes and colors have been improved for better readability

### Bug fixes

- Builds should not get stuck in a pending state anymore
- Dashboard pages now load significantly faster
- Correctly show spans in traces that have parents that are not exported (yet)
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
- There are now
  [reference docs for you to peruse](https://docs.deno.com/deploy/early-access/).

### Bug fixes

- SvelteKit auto detection now works when using `npm` as the package manager
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
- app.deno.com works on older versions of Firefox now
- Page titles across app.deno.com now reflect the page you are on
- The "Provision certificate" button does not lock up after DNS verification
  failures anymore
- Domains that had a provisioned certificate or attached application can now be
  deleted
