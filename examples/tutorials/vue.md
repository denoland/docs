---
title: "Build a Vue.js App"
description: "A tutorial on building Vue.js applications with Deno. Learn how to set up a Vite project, implement component architecture, add routing, manage state, and create a full-stack TypeScript application."
url: /examples/vue_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/vue/
  - /runtime/tutorials/how_to_with_npm/vue/
---

[Vue.js](https://vuejs.org/) is a progressive front-end JavaScript framework. It
provides tools and features for creating dynamic and interactive user
interfaces.

In this tutorial we'll build a simple Vue.js app with Vite and Deno. The app
will display a list of dinosaurs. When you click on one, it'll take you to a
dinosaur page with more details. You can see the
[finished app on GitHub](https://github.com/denoland/tutorial-with-vue).

You can see a live version of the app on
[Deno Deploy](https://tutorial-with-vue.deno.deno.net/).

:::info Deploy your own

Want to skip the tutorial and deploy the finished app right now? Click the
button below to instantly deploy your own copy of the complete SvelteKit
dinosaur app to Deno Deploy. You'll get a live, working application that you can
customize and modify as you learn!

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-vue&mode=dynamic&entrypoint=api/main.ts&build=deno+task+build&install=deno+install)

:::

## Create a Vue.js app with Vite and Deno

We'll use [Vite](https://vitejs.dev/) to scaffold a basic Vue.js app. In your
terminal, run the following command to create a new .js app with Vite:

```shell
deno run -A npm:create-vite
```

When prompted, give your app a name and select `Vue` from the offered frameworks
and `TypeScript` as a variant.

Once created, `cd` into your new project and run the following command to
install dependencies:

```shell
deno install
```

Then, run the following command to serve your new Vue.js app:

```shell
deno task dev
```

Deno will run the `dev` task from the `package.json` file which will start the
Vite server. Click the output link to localhost to see your app in the browser.

## Configure the formatter

`deno fmt` supports Vue files with the
[`--unstable-component`](https://docs.deno.com/runtime/reference/cli/fmt/#formatting-options-unstable-component)
flag. To use it, run this command:

```sh
deno fmt --unstable-component
```

To configure `deno fmt` to always format your Vue files, add this at the top
level of your `deno.json` file:

```json
"unstable": ["fmt-component"]
```

## Add a backend API

We'll build an API server using Deno and Oak. This will be where we get our
dinosaur data.

In the root directory of your project, create an `api` folder. In that folder,
create a `data.json`, which will contain the hard coded dinosaur data.

Copy and paste
[this json file](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)
into the `api/data.json` file. (If you were building a real app, you would
probably fetch this data from a database or an external API.)

We're going to build out some API routes that return dinosaur information. We'll
need Oak for the HTTP server and
[CORS middleware](https://jsr.io/@tajpouria/cors) to enable
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Add the dependencies to your `deno.json` file by updating the imports section:

```json title="deno.json"
{
  "imports": {
    "@oak/oak": "jsr:@oak/oak@^17.1.5",
    "@tajpouria/cors": "jsr:@tajpouria/cors@^1.2.1",
    "vue-router": "npm:vue-router@^4.5.1"
  }
}
```

Next, create `api/main.ts` and import the required modules and create a new
`Router` instance to define some routes:

```ts title="api/main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

After this, in the same file, we'll define two routes. One at `/api/dinosaurs`
to return all the dinosaurs, and `/api/dinosaurs/:dinosaur` to return a specific
dinosaur based on the name in the URL:

```ts title="api/main.ts"
router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "No dinosaur name provided.";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ?? "No dinosaur found.";
});
```

At the bottom of the same file, attach the routes we just defined to the
application. We also must include the static file server, and finally we'll
start the server listening on port 8000:

```ts title="api/main.ts"
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
```

You'll also need to create the `api/util/routeStaticFilesFrom.ts` file to serve
static files:

```ts title="api/util/routeStaticFilesFrom.ts"
import { Context, Next } from "@oak/oak";

// Configure static site routes so that we can serve
// the Vite build output and the public folder
export default function routeStaticFilesFrom(staticPaths: string[]) {
  return async (context: Context<Record<string, object>>, next: Next) => {
    for (const path of staticPaths) {
      try {
        await context.send({ root: path, index: "index.html" });
        return;
      } catch {
        continue;
      }
    }

    await next();
  };
}
```

You can run the API server with
`deno run --allow-env --allow-net --allow-read api/main.ts`. We'll create a task
to run this command in the background and update the dev task to run both the
Vue app and the API server.

Update your `package.json` scripts to include the following:

```json title="package.json"
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    "build": "deno run -A npm:vite build",
    "server:start": "deno run -A --watch ./api/main.ts",
    "serve": "deno run build && deno run server:start",
    "preview": "vite preview"
  }
}
```

Make sure your `vite.config.ts` includes the Deno plugin and proxy configuration
for development:

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import deno from "@deno/vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [vue(), deno()],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
```

If you run `npm run dev` now and visit `localhost:8000/api/dinosaurs`, in your
browser you should see a JSON response of all of the dinosaurs.

## Build the frontend

### The entrypoint and routing

In the `src` directory, you'll find a `main.ts` file. This is the entry point
for the Vue.js app. Our app will have multiple route, so we'll need a router to
do our client-side routing. We'll use the official
[Vue Router](https://router.vuejs.org/) for this.

Update `src/main.ts` to import and use the router:

```ts
import { createApp } from "vue";
import router from "./router/index.ts";

import "./style.css";
import App from "./App.vue";

createApp(App)
  .use(router)
  .mount("#app");
```

Add the Vue Router module to the project by updating your `deno.json` imports:

```json title="deno.json"
{
  "imports": {
    "@oak/oak": "jsr:@oak/oak@^17.1.5",
    "@tajpouria/cors": "jsr:@tajpouria/cors@^1.2.1",
    "vue-router": "npm:vue-router@^4.5.1"
  }
}
```

Next, create a `router` directory in the `src` directory. In it, create an
`index.ts` file with the following content:

```ts title="router/index.ts"
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import Dinosaur from "../components/Dinosaur.vue";

export default createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/:dinosaur",
      name: "Dinosaur",
      component: Dinosaur,
      props: true,
    },
  ],
});
```

This will set up a router with two routes: `/` and `/:dinosaur`. The `HomePage`
component will be rendered at `/` and the `Dinosaur` component will be rendered
at `/:dinosaur`.

Finally, you can delete all of the code in the `src/App.vue` file to and update
it to include only the `<RouterView>` component:

```html title="App.vue"
<template>
  <RouterView />
</template>
```

### The components

Vue.js splits the frontend UI into components. Each component is a reusable
piece of code. We'll create three components: one for the home page, one for the
list of dinosaurs, and one for an individual dinosaur.

Each component file is split into three parts: `<script>`, `<template>`, and
`<style>`. The `<script>` tag contains the JavaScript logic for the component,
the `<template>` tag contains the HTML, and the `<style>` tag contains the CSS.

In the `/src/components` directory, create three new files: `HomePage.vue`,
`Dinosaurs.vue`, and `Dinosaur.vue`.

#### The Dinosaurs component

The `Dinosaurs` component will fetch the list of dinosaurs from the API we set
up earlier and render them as links using the
[`RouterLink` component from Vue Router](https://router.vuejs.org/guide/).
(Because we are making a TypeScript project, don't forget to specify the
`lang="ts"` attribute on the script tag.) Add the following code to the
`Dinosaurs.vue` file:

```html title="Dinosaurs.vue"
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    async setup() {
      const res = await fetch("/api/dinosaurs");
      const dinosaurs = await res.json() as Dinosaur[];
      return { dinosaurs };
    },
  });
</script>

<template>
  <span v-for="dinosaur in dinosaurs" :key="dinosaur.name">
    <RouterLink
      :to="{ name: 'Dinosaur', params: { dinosaur: `${dinosaur.name.toLowerCase()}` } }"
    >
      {{ dinosaur.name }}
    </RouterLink>
  </span>
</template>
```

This code uses the Vue.js
[v-for](https://vuejs.org/api/built-in-directives.html#v-for) directive to
iterate over the `dinosaurs` array and render each dinosaur as a `RouterLink`
component. The `:to` attribute of the `RouterLink` component specifies the route
to navigate to when the link is clicked, and the `:key` attribute is used to
uniquely identify each dinosaur.

#### The Homepage component

The homepage will contain a heading and then it will render the `Dinosaurs`
component. Add the following code to the `HomePage.vue` file:

```html title="HomePage.vue"
<script setup lang="ts">
  import Dinosaurs from "./Dinosaurs.vue";
</script>
<template>
  <h1>Welcome to the Dinosaur App! 🦕</h1>
  <p>Click on a dinosaur to learn more about them</p>
  <Suspense>
    <template #default>
      <Dinosaurs />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

Because the `Dinosaurs` component fetches data asynchronously, use the
[`Suspense` component](https://vuejs.org/guide/built-ins/suspense.html) to
handle the loading state.

#### The Dinosaur component

The `Dinosaur` component will display the name and description of a specific
dinosaur and a link to go back to the full list.

First, we'll set up some types for the data we'll be fetching. Create a
`types.ts` file in the `src` directory and add the following code:

```ts title="types.ts"
type Dinosaur = {
  name: string;
  description: string;
};

type ComponentData = {
  dinosaurDetails: null | Dinosaur;
};
```

Then update the `Dinosaur.vue` file:

```html title="Dinosaur.vue"
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: { dinosaur: String },
    data(): ComponentData {
      return {
        dinosaurDetails: null,
      };
    },
    async mounted() {
      const res = await fetch(
        `/api/dinosaurs/${this.dinosaur}`,
      );
      this.dinosaurDetails = await res.json();
    },
  });
</script>

<template>
  <h1>{{ dinosaurDetails?.name }}</h1>
  <p>{{ dinosaurDetails?.description }}</p>
  <RouterLink to="/">🠠 Back to all dinosaurs</RouterLink>
</template>
```

This code uses the `props` option to define a prop named `dinosaur` that will be
passed to the component. The `mounted` lifecycle hook is used to fetch the
details of the dinosaur based on the `dinosaur` prop and store them in the
`dinosaurDetails` data property. This data is then rendered in the template.

## Run the app

Now that we've set up the frontend and backend, we can run the app. In your
terminal, run the following command:

```shell
npm run dev
```

This will start both the Deno API server on port 8000 and the Vite development
server on port 3000. The Vite server will proxy API requests to the Deno server.

Visit `http://localhost:3000` in your browser to see the app. Click on a
dinosaur to see more details!

You can see a live version of the app on
[Deno Deploy](https://tutorial-with-vue.deno.deno.net/).

[The vue app in action](./images/how-to/vue/vue.gif)

```shell
deno run serve
```

This will build the Vue app and serve everything from the Deno server on
port 8000.

## Build and deploy

We set up the project with a `serve` task that builds the React app and serves
it with the Oak backend server. Run the following command to build and serve the
app in production mode:

```sh
deno run build
deno run serve
```

This will:

1. Build the Vue app using Vite (output goes to `dist/`)
2. Start the Oak server which serves both the API and the built Vue app

Visit `localhost:8000` in your browser to see the production version of the app!

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
git commit -am 'my vue app'
git push -u origin main
```

### Deploy to Deno Deploy

Once your app is on GitHub, you can
[deploy it to Deno Deploy<sup>EA</sup>](https://console.deno.com/).

For a walkthrough of deploying your app, check out the
[Deno Deploy tutorial](/examples/deno_deploy_tutorial/).

🦕 Now that you can run a Vue app in Deno with Vite you're ready to build real
world applications!
