---
title: "Deploy an app with Deno Deploy"
description: "A step-by-step tutorial for deploying your first Deno application to Deno Deploy."
url: /examples/deno_deploy_tutorial/
---

Deno Deploy allows you to host your Deno applications on a global edge network,
with built in telemetry and CI/CD tooling.

This tutorial guides you through creating and deploying a simple Deno
application using Deno Deploy.

## Prerequisites

1. A [GitHub](https://github.com) account
2. [Deno installed](https://docs.deno.com/runtime/manual/getting_started/installation)
   on your local machine
3. A [Deno Deploy](https://console.deno.com/account) account

## Create a simple Deno application with Vite

First, let's create a basic application with Vite, initialize a new
[Vite](https://vite.dev/guide/) project:

```sh
deno init --npm vite
```

Give your project a name and select your framework and variant. For this
tutorial, we'll create a vanilla TypeScript app.

Change directory to your newly created project name with `cd my-project-name`
then run:

```sh
deno install
deno run dev
```

You should see a basic app running at
[http://127.0.0.1:5173/](http://127.0.0.1:5173/).

You can edit the `main.ts` file to see changes in the browser.

## Create a GitHub repository

1. Go to [GitHub](https://github.com) and create a new repository.

2. Initialize your local directory as a Git repository:

```sh
git init
git add .
git commit -m "Initial commit"
```

3. Add your GitHub repository as a remote and push your code:

```sh
git remote add origin https://github.com/your-username/my-first-deno-app.git
git branch -M main
git push -u origin main
```

## Create a Deno Deploy organization

1. Navigate to [console.deno.com](https://console.deno.com)
2. Click "+ New Organization"
3. Select the 'Standard Deploy' organization type
4. Enter an organization name and slug (this cannot be changed later)
5. Click "Create Standard Deploy organization"

## Create and deploy your application

1. Click "+ New App"
2. Select the GitHub repository you created earlier
3. The app configuration should be automatically detected, but you can verify
   these settings by clicking the "Edit build config" button:
   - Framework preset: No preset
   - Runtime configuration: Static Site
   - Install command: `deno install`
   - Build command: `deno task build`
   - Static Directory: `dist`

4. Click "Create App" to start the deployment process

## Monitor your deployment

1. Watch the build logs as your application is deployed
2. Once deployment completes, you'll see a preview URL (typically
   `https://your-app-name.your-org-name.deno.net`)
3. Click the URL to view your deployed application!

## Make changes and redeploy

Let's update the application and see how changes are deployed:

Update your `main.ts` file locally:

```ts title="main.ts"
import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Hello from Deno Deploy!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
```

2. Commit and push your changes:

```sh
git add .
git commit -m "Update application"
git push
```

Return to your Deno Deploy dashboard to see a new build automatically start.
Once the build completes, visit your application URL to see the update.

## Explore observability features

Deno Deploy provides comprehensive observability tools:

1. From your application dashboard, click "Logs" in the sidebar
   - You'll see console output from your application
   - Use the search bar to filter logs (e.g., `context:production`)

2. Click "Traces" to view request traces
   - Select a trace to see detailed timing information
   - Examine spans to understand request processing

3. Click "Metrics" to view application performance metrics
   - Monitor request counts, error rates, and response times

🦕 Now that you've deployed your first application, you might want to:

1. [Add a custom domain](/deploy/reference/domains/) to your application
2. Explore [framework support](/deploy/reference/frameworks/) for Next.js,
   Astro, and other frameworks
3. Learn about [caching strategies](/deploy/reference/caching/) to improve
   performance
4. Set up different [environments](/deploy/reference/env-vars-and-contexts/) for
   development and production
