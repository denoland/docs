---
title: "Deno Deploy<sup>EA</sup> changelog"
description: "Listing notable progress in the development and evolution of Deno Deploy Early Access"
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

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
