---
title: "Build a SvelteKit App"
description: "A tutorial on building SvelteKit applications with Deno. Learn how to set up a SvelteKit project, implement file-based routing, manage state with load functions, and create a full-stack TypeScript application."
url: /examples/svelte_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/svelte/
  - /runtime/tutorials/how_to_with_npm/svelte/
---

[SvelteKit](https://kit.svelte.dev/) is a web framework built on top of
[Svelte](https://svelte.dev/), a modern front-end compiler that builds highly
optimized vanilla JavaScript. SvelteKit provides features like file-based
routing, server-side rendering, and full-stack capabilities.

In this tutorial we'll build a simple SvelteKit app with Deno. The app will
display a list of dinosaurs. When you click on one, it'll take you to a dinosaur
page with more details. You can see the
[finished app on GitHub](https://github.com/denoland/tutorial-with-svelte).

You can see a live version of the app on
[Deno Deploy](https://tutorial-with-svelte.deno.deno.net/).

:::info Deploy your own

You can deploy your own version of this svelte app to Deno Deploy immediately.
Just click the button!

[![Deploy on Deno](https://deno.com/button)](https://app.deno.com/new?clone=https://github.com/denoland/tutorial-with-svelte)

:::

## Create a SvelteKit app with Deno

We'll use [SvelteKit](https://kit.svelte.dev/) to create a new SvelteKit app. In
your terminal, run the following command to create a new SvelteKit app:

```shell
deno run -A npm:create-svelte
```

When prompted, give your app a name and select the "Skeleton project" template.
Choose "Yes, using TypeScript syntax" when asked about TypeScript.

Once created, `cd` into your new project and run the following command to
install dependencies:

```shell
deno install
```

Then, run the following command to serve your new SvelteKit app:

```shell
deno task dev
```

Deno will run the `dev` task from the `package.json` file which will start the
Vite development server. Click the output link to localhost to see your app in
the browser.

## Configure the formatter

`deno fmt` supports Svelte files with the
[`--unstable-component`](https://docs.deno.com/runtime/reference/cli/fmt/#formatting-options-unstable-component)
flag. To use it, run this command:

```sh
deno fmt --unstable-component
```

To configure `deno fmt` to always format your Svelte files, add this at the top
level of your `deno.json` file:

```json
"unstable": ["fmt-component"]
```

## Add a backend API

We'll build API routes using SvelteKit's built-in API capabilities. SvelteKit
allows you to create API endpoints by creating `+server.js` or `+server.ts`
files in your routes directory.

In the `src/routes` directory, create an `api` folder. In that folder, create a
`data.json`, which will contain the hard coded dinosaur data.

Copy and paste
[this json file](https://github.com/denoland/tutorial-with-svelte/blob/main/src/routes/api/data.json)
into the `src/routes/api/data.json` file. (If you were building a real app, you
would probably fetch this data from a database or an external API.)

We're going to build out some API routes that return dinosaur information.
SvelteKit provides a simple way to create API endpoints using server files.

Add the dependencies to your `deno.json` file by updating the imports section:

```json title="deno.json"
{
  "imports": {
    "@oak/oak": "jsr:@oak/oak@^17.1.5",
    "@tajpouria/cors": "jsr:@tajpouria/cors@^1.2.1"
  }
}
```

Next, create `src/routes/api/dinosaurs/+server.js` to handle the
`/api/dinosaurs` endpoint. This will return all dinosaurs:

```js title="src/routes/api/dinosaurs/+server.js"
import { json } from "@sveltejs/kit";
import data from "../data.json" with { type: "json" };

export function GET() {
  return json(data);
}
```

Then create `src/routes/api/dinosaurs/[id]/+server.ts` to handle individual
dinosaur requests at `/api/dinosaurs/:id`:

```ts title="src/routes/api/dinosaurs/[id]/+server.ts"
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import data from "../../data.json" with { type: "json" };

export const GET: RequestHandler = ({ params }) => {
  const dinosaur = data.find((item) => {
    return item.name.toLowerCase() === params.id.toLowerCase();
  });

  if (dinosaur) {
    return json(dinosaur);
  }

  return json({ error: "Not found" }, { status: 404 });
};
```

SvelteKit automatically handles routing based on the file structure. The
`+server.js` and `+server.ts` files define API endpoints, and the `[id]` folder
creates a dynamic route parameter.

## Build the frontend

### File-based routing and data loading

SvelteKit uses file-based routing, where the structure of your `src/routes`
directory determines your app's routes. Unlike Vue Router, you don't need to
configure routes manually - SvelteKit automatically creates routes based on your
file structure.

In SvelteKit, `+page.svelte` files define page components, and `+page.ts` files
define data loading functions that run before the page loads. This provides
built-in server-side rendering and data fetching capabilities.

### The pages and components

SvelteKit organizes the frontend into pages and components. Pages are defined by
`+page.svelte` files in the routes directory, while components can be reusable
pieces of code stored anywhere in your project.

Each Svelte component file contains three optional sections: `<script>`,
`<template>` (the HTML), and `<style>`. The `<script>` tag contains the
JavaScript/TypeScript logic, the template contains the HTML markup, and the
`<style>` tag contains scoped CSS.

We'll create pages for the home page and individual dinosaur details, along with
data loading functions to fetch dinosaur information from our API.

#### The home page

The home page will display a list of dinosaurs fetched from our API. First,
create `src/routes/+page.ts` to load the dinosaur data:

```ts title="src/routes/+page.ts"
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`/api/dinosaurs`);
  const dinosaurs = await res.json();

  return { dinosaurs };
};
```

This load function runs on both the server and client, and the data is passed to
the page component. The `fetch` function is provided by SvelteKit and works in
both server and client environments.

Next, update `src/routes/+page.svelte` to display the dinosaur list:

```html title="src/routes/+page.svelte"
<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let dinosaurs = data.dinosaurs;
</script>

<main>
  <h1>🦕 Dinosaur app</h1>
  <p>Click on a dinosaur below to learn more.</p>
  {#each dinosaurs as dinosaur (dinosaur.name)}
  <a href="/{dinosaur.name.toLowerCase()}" class="dinosaur">
    {dinosaur.name}
  </a>
  {/each}
</main>
```

This code uses Svelte's [each block](https://svelte.dev/docs/logic-blocks#each)
to iterate over the `dinosaurs` array and render each dinosaur as a link. The
`{#each}` block is Svelte's way of rendering lists, and the `(dinosaur.name)`
provides a unique key for each item.

#### The Dinosaur detail page

The dinosaur detail page will display information about a specific dinosaur.
SvelteKit uses folder names in square brackets to create dynamic routes. The
`[dinosaur]` folder creates a route that captures the dinosaur name from the
URL.

First, create `src/routes/[dinosaur]/+page.ts` to load individual dinosaur data:

```ts title="src/routes/[dinosaur]/+page.ts"
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(`/api/dinosaurs/${params.dinosaur}`);
  const dinosaur = await res.json() as { name: string; description: string };

  if (res.status === 404) {
    return error(404, "No dinosaur found");
  }

  return { dinosaur };
};
```

This load function uses the `params` object to access the `dinosaur` parameter
from the URL. If the API returns a 404, we use SvelteKit's `error` function to
throw a 404 error.

Next, create `src/routes/[dinosaur]/+page.svelte` to display the dinosaur
details:

```html title="src/routes/[dinosaur]/+page.svelte"
<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let dinosaur = data.dinosaur;
</script>

<div>
  <h1>{dinosaur.name}</h1>
  <p>{dinosaur.description}</p>
  <a href="/">🠠 Back to all dinosaurs</a>
</div>
```

This page displays the dinosaur's name and description, along with a link back
to the home page. The data comes from the load function and is automatically
available in the component.

## Run the app

Now that we've set up the frontend and backend API routes, we can run the app.
In your terminal, run the following command:

```shell
deno task dev
```

This will start the SvelteKit development server with Vite. SvelteKit
automatically handles both the frontend pages and the API routes we created, so
you don't need to run separate servers.

Visit `http://localhost:5173` in your browser to see the app. Click on a
dinosaur to see more details!

You can see a live version of the app on
[Deno Deploy](https://tutorial-with-svelte.deno.deno.net/).

## Build and deploy

SvelteKit comes with built-in build capabilities. We configured it to use the
Deno adapter, which optimizes the build for deployment on Deno-compatible
platforms. Run the following command to build the app in production mode:

```sh
deno task build
```

This will:

1. Build the SvelteKit app using Vite
2. Generate optimized production assets
3. Create server-side code compatible with Deno

The built app will be ready for deployment on platforms that support Deno, such
as Deno Deploy.

You can deploy this app to your favorite cloud provider. We recommend using
[Deno Deploy](https://deno.com/deploy) for a simple and easy deployment
experience. You can deploy your app directly from GitHub, simply create a GitHub
repository and push your code there, then connect it to Deno Deploy.

### Create a GitHub repository

[Create a new GitHub repository](https://github.com/new), then initialize and
push your app to GitHub:

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'my svelte app'
git push -u origin main
```

### Deploy to Deno Deploy

Once your app is on GitHub, you can deploy it on the Deno Deploy<sup>EA</sup>
dashboard.
<a href="https://app.deno.com/" class="docs-cta deploy-cta deploy-button">Deploy
my app</a>

For a walkthrough of deploying your app, check out the
[Deno Deploy tutorial](/examples/deno_deploy_tutorial/).

🦕 Now that you can run a SvelteKit app in Deno with the Deno adapter you're
ready to build real world applications!
