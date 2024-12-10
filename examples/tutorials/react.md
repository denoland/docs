---
title: "Build a React app with a starter template"
url: /examples/react_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/react/
  - /runtime/manual/basics/react/
  - /runtime/tutorials/how_to_with_npm/react/
---

[React](https://reactjs.org) is the most widely used JavaScript frontend
library.

In this tutorial we'll build a simple React app with Deno. The app will display
a list of dinosaurs. When you click on one, it'll take you to a dinosaur page
with more details. You can see the
[finished app repo on GitHub](https://github.com/denoland/tutorial-with-react-denojson)

![demo of the app](../images/how-to/react/react-dinosaur-app-demo.gif)

This tutorial will use [Vite](https://vitejs.dev/) to serve the app locally.
Vite is a build tool and development server for modern web projects. It pairs
well with React and Deno, leveraging ES modules and allowing you to import React
components directly.

## Starter app

We've set up a
[starter template for you to use](https://github.com/denoland/react-vite-ts-template).
This will set up a basic starter app with React, Vite and a deno.json file for
you to configure your project. Visit the GitHub repository at
[https://github.com/denoland/react-vite-ts-template](https://github.com/denoland/react-vite-ts-template)
and click the "Use this template" button to create a new repository.

Once you have created a new repository from the template, clone it to your local
machine and navigate to the project directory.

## Clone the repository locally

```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

## Install the dependencies

Install the project dependencies by running:

```sh
deno install
```

## Run the dev server

Now you can serve your new react app by running:

```sh
deno run dev
```

This will start the Vite server, click the output link to localhost to see your
app in the browser.

## About the template

The template repository you cloned comes with a basic React app. The app uses
Vite as a dev server and provides a static file server built with
[oak](https://jsr.io/@oak/oak) which will serve the built app when deployed. The
React app is in the `client` folder and the backend server is in the `server`
folder.

The `deno.json` file is used to configure the project and specify the
permissions required to run the app, it contains the `tasks` field which defines
the tasks that can be run with `deno run`. It has a `dev` task which runs the
Vite server and a `build` task which builds the app with Vite, and a `serve`
task which runs the backend server to serve the built app.

## Add a backend API

We'll build an API into the server provided by the template. This will be where
we get our dinosaur data.

In the `server` directory of your new project, create an `api` folder. In that
folder, create a `data.json`, which will contain the hard coded dinosaur data.

Copy and paste
[this json file](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)
into the `api/data.json` file. (If you were building a real app, you would
probably fetch this data from a database or an external API.)

We're going to build out some API routes that return dinosaur information into
the server that came with the template, we'll need the
[`cors` middleware](https://jsr.io/@tajpouria/cors) to enable
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Use the `deno install` command to add the cors dependency to your project:

```shell
deno install jsr:@tajpouria/cors
```

Next, update `server/main.ts` to import the required modules and create a new
`Router` instance to define some routes:

```ts title="main.ts"
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./api/data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

After this, in the same file, we'll define two routes. One at `/api/dinosaurs`
to return all the dinosaurs, and `/api/dinosaurs/:dinosaur` to return a specific
dinosaur based on the name in the URL:

```ts title="main.ts"
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
application. We also must include the the static file server from the template,
and finally we'll start the server listening on port 8000:

```ts title="main.ts"
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
```

You can run the API server with
`deno run --allow-env --allow-net server/main.ts`. We'll create a task to run
this command in the background and update the dev task to run both the React app
and the API server.

In your `package.json` file, update the `scripts` field to include the
following:

```diff title="deno.json"
{
  "tasks": {
+   "dev": "deno run -A --node-modules-dir=auto npm:vite & deno run server:start",
    "build": "deno run -A --node-modules-dir=auto npm:vite build",
    "server:start": "deno run -A --node-modules-dir --watch ./server/main.ts",
    "serve": "deno run build && deno run server:start"
}
```

If you run `deno run dev` now and visit `localhost:8000/api/dinosaurs`, in your
browser you should see a JSON response of all of the dinosaurs.

## Update the entrypoint

The entrypoint for the React app is in the `client/src/main.tsx` file. Ours is
going to be very basic:

```tsx title="main.tsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Add a router

The app will have two routes: `/` and `/:dinosaur`.

We'll use [`react-router-dom`](https://reactrouter.com/en/main) to build out
some routing logic, so we'll need to add the `react-router-dom` dependency to
your project. In the project root run:

```shell
deno install npm:react-router-dom
```

Update the `/src/App.tsx` file to import and use the
[`BrowserRouter`](https://reactrouter.com/en/main/router-components/browser-router)
component from `react-router-dom` and define the two routes:

```tsx title="App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:selectedDinosaur" element={<Dinosaur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Proxy to forward the api requests

Vite will be serving the application on port `3000` while our api is running on
port `8000`. Therefore, we'll need to set up a proxy to allow the `api/` paths
to be reachable by the router. Add a proxy setting to the `vite.config.ts`:

```diff title="vite.config.ts"
export default defineConfig({
  root: "./client",
  server: {
    port: 3000,
+   proxy: {
+     "/api": {
+       target: "http://localhost:8000",
+       changeOrigin: true,
+     },
+   },
```

## Create the pages

We'll create two pages: `Index` and `Dinosaur`. The `Index` page will list all
the dinosaurs and the `Dinosaur` page will show details of a specific dinosaur.

Create a `pages` folder in the `src` directory and inside that create two files:
`index.tsx` and `Dinosaur.tsx`.

### Types

Both pages will use the `Dino` type to describe the shape of data they're
expecting from the API, so let's create a `types.ts` file in the `src`
directory:

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### index.tsx

This page will fetch the list of dinosaurs from the API and render them as
links:

```tsx title="index.tsx"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = await response.json() as Dino[];
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main>
      <h1>Welcome to the Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <Link
            to={`/${dinosaur.name.toLowerCase()}`}
            key={dinosaur.name}
            className="dinosaur"
          >
            {dinosaur.name}
          </Link>
        );
      })}
    </main>
  );
}
```

### Dinosaur.tsx

This page will fetch the details of a specific dinosaur from the API and render
it in a paragraph:

```tsx title="Dinosaur.tsx"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dino } from "../types";

export default function Dinosaur() {
  const { selectedDinosaur } = useParams();
  const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
      const dino = await resp.json() as Dino;
      setDino(dino);
    })();
  }, [selectedDinosaur]);

  return (
    <div>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <Link to="/">🠠 Back to all dinosaurs</Link>
    </div>
  );
}
```

### Styling the list of dinosaurs

Since we are displaying the list of dinosaurs on the main page, let's do some
basic formatting. Add the following to the bottom of `src/App.css` to display
our list of dinosaurs in an orderly fashion:

```css title="src/App.css"
.dinosaur {
  display: block;
}
```

## Run the app

To run the app use the task you set up earlier

```sh
deno run dev
```

Navigate to the local Vite server in your browser (`localhost:5173`) and you
should see the list of dinosaurs displayed which you can click through to find
out about each one.

![demo of the app](../images/how-to/react/react-dinosaur-app-demo.gif)

## Build and deploy

The template you cloned comes with a `serve` task that builds the app and serves
it with the backend server. Run the following command to build and serve the
app:

```sh
deno run serve
```

If you visit `localhost:8000` in your browser you should see the app running!

You can deploy this app to your favourite cloud provider. We recommend using
[Deno Deploy](https://deno.com/deploy) for a simple and easy deployment
experience.

To deploy to Deno Deploy, visit the
[Deno Deploy dashboard](https://dash.deno.com) and create a new project. You can
then deploy the app by connecting your GitHub repository and selecting the
branch you want to deploy.

Give the project a name, and make sure that the `build step` is set to
`deno run build` and the `Entrypoint` is `./server.main.ts`.

Click the `Deploy Project` button and your app will be live!

🦕 Now you can scaffold and develop a React app with Vite and Deno! You’re ready
to build blazing-fast web applications. We hope you enjoy exploring these
cutting-edge tools, we can't wait to see what you make!
