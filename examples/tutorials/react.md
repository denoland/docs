---
title: "Build a React app with a starter template"
description: "Complete guide to building React applications with Deno and Vite. Learn how to set up a project from a template, implement routing, add API endpoints, and deploy your full-stack TypeScript application."
url: /examples/react_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/react/
  - /runtime/manual/basics/react/
  - /runtime/tutorials/how_to_with_npm/react/
  - /runtime/tutorials/create_react_tutorial/
---

[React](https://reactjs.org) is the most widely used JavaScript frontend
library.

In this tutorial we'll build a simple React app with Deno. The app will display
a list of dinosaurs. When you click on one, it'll take you to a dinosaur page
with more details. You can see the
[finished app repo on GitHub](https://github.com/denoland/tutorial-with-react)
and a
[demo of the app on Deno Deploy](https://tutorial-with-react.deno.deno.net/)

## Create a basic react app with Vite

This tutorial will use [Vite](https://vitejs.dev/) to serve the app locally.
Vite is a build tool and development server for modern web projects. It pairs
well with React and Deno, leveraging ES modules and allowing you to import React
components directly.

In your terminal run the following command to create a new React app with Vite
using the typescript template:

```sh
deno run -A npm:create-vite@latest --template react-ts
```

## Run the dev server

Change directory to your new react app and install the dependencies:

```sh
cd <your_new_react_app>
deno install
```

Now you can serve your new react app by running:

```sh
deno run dev
```

This will start the Vite server, click the output link to localhost to see your
app in the browser.

## Configure the project

We're going to build a full-stack React app with a Deno backend. We'll need to
configure both vite and Deno to work together.

Install the deno plugin for Vite, the React types and the Vite React plugin:

```sh
deno add npm:deno-vite-plugin@latest npm:@types/react@latest npm:@vitejs/plugin-react@latest
```

We'll also need to install the Oak web framework for Deno to handle our API
requests, and CORS middleware to allow cross-origin requests from the React app:

```sh
deno add jsr:@oak/oak@ jsr:@tajpouria/cors
```

This will add these dependencies to a new `deno.json` file.

In that file, we'll also add some tasks to make it easier to run the app in
development and production modes and some configuration to set up Deno with
React and Vite. Add the following to your `deno.json` file:

```json
"tasks": {
    "dev": "deno run -A npm:vite & deno run server:start",
    "build": "deno run -A npm:vite build",
    "server:start": "deno run -A --watch ./api/main.ts",
    "serve": "deno run build && deno run server:start"
},
"nodeModulesDir": "auto",
"compilerOptions": {
    "types": [
        "react",
        "react-dom",
        "@types/react"
    ],
    "lib": [
        "dom",
        "dom.iterable",
        "deno.ns"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "react"
}
```

We can use both `package.json` and `deno.json` for dependency and configuration,
but if you'd rather you can remove the `package.json` file and use only
`deno.json` for your project configuration, be sure to move across the
dependencies from `package.json` to `deno.json` imports first.

## Add a backend API

Our project will have a backend API that serves dinosaur data. This API will be
built using Deno and Oak, and will provide endpoints to fetch a list of
dinosaurs and details about a specific dinosaur from a JSON file. In a
production app this data would likely come from a database, but for this
tutorial we'll use a static JSON file.

In the root of your project, create a new directory called `api`. In this
directory, create a file called `data.json` and copy across
[the dinosaur data](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json).

Next make a file called `main.ts` in the `api` directory. This file will contain
the Oak server code to handle API requests. In this file we will set up the Oak
server, define API routes, and serve static files for the React app. First set
up the imports and create the Oak application and router:

```ts title="api/main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

Then we'll define the two main API routes:

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

Finally, we'll configure the server with middleware and start it listening:

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

The server handles CORS, serves the API routes, and also serves static files
from the `dist` (built app) and `public` directories.

## Serve static files

The Oak server will also serve the built React app. To do this, we need to
configure it to serve static files from the `dist` directory where Vite outputs
the built app. We can use the `routeStaticFilesFrom` utility function to set
this up. Create a new file called `util/routeStaticFilesFrom.ts` in the `api`
directory with the following code:

```ts title="api/util/routeStaticFilesFrom.ts"
import { Context, Next } from "jsr:@oak/oak";

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

This utility function attempts to serve static files from the provided paths,
falling back to the next middleware if no file is found. It will serve the
`index.html` file from the `dist` directory, which is the entry point for the
React app.

You can test the API by running `deno run dev` and visiting
`localhost:8000/api/dinosaurs` in your browser to see the JSON response with all
dinosaurs.

## React app setup

### Entry point

The React app entry point is in `src/main.tsx`. We don't need to change anything
here, but it's worth noting that this is where the React app is rendered into
the DOM. The `createRoot` function from `react-dom/client` is used to render the
`App` component into the `root` element in `index.html`. Here's the code in
`src/main.tsx`:

```tsx title="src/main.tsx"
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

We'll set up the routing in `src/App.tsx`:

```tsx title="src/App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";

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

Vite serves the React application on port `3000` while the API runs on port
`8000`. We'll need to set up proxy configuration in `vite.config.ts` to forward
API requests:

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
  plugins: [react(), deno()],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
```

## Create the pages

Create a new directory called `pages`, and inside we'll make two new files
`src/pages/index.tsx` and `src/pages/Dinosaur.tsx`. The `Index` page lists all
dinosaurs and the `Dinosaur` page shows details of a specific dinosaur.

### index.tsx

This page fetches the list of dinosaurs from the API and renders them as links:

```tsx title="src/pages/index.tsx"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = await response.json();
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main id="content">
      <h1>🦕 Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
      {dinosaurs.map((dinosaur: { name: string; description: string }) => {
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

```tsx title="src/pages/Dinosaur.tsx"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Dinosaur() {
  const { selectedDinosaur } = useParams();
  const [dinosaur, setDino] = useState({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
      const dino = await resp.json();
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

### Styling your app

We've written
[some basic styles for you](https://raw.githubusercontent.com/denoland/tutorial-with-react/refs/heads/main/src/index.css),
which can be copied into `src/index.css`.

## Run the app

To run the app, use the dev task defined in `deno.json`:

```sh
deno run dev
```

This command will:

1. Start the Vite development server on port 3000
2. Start the API server on port 8000
3. Set up the proxy to forward `/api` requests from the frontend to the backend

Navigate to `localhost:3000` in your browser and you should see the dinosaur app
with a list of dinosaurs that you can click through to learn about each one.

## Understanding the project structure

Let's walk through the key files and folders in this project:

```text
tutorial-with-react/
├── api/                    # Backend API
│   ├── data.json          # Dinosaur data (700+ dinosaurs)
│   ├── main.ts            # Oak server with API routes
│   └── util/
│       └── routeStaticFilesFrom.ts
├── src/                    # React frontend
│   ├── main.tsx           # React app entry point
│   ├── App.tsx            # Main app with routing
│   ├── index.css          # Global styles
│   └── pages/
│       ├── index.tsx      # Homepage with dinosaur list
│       └── Dinosaur.tsx   # Individual dinosaur page
├── public/                 # Static assets
├── deno.json              # Deno configuration and tasks
├── package.json           # npm dependencies for Vite
├── vite.config.ts         # Vite configuration with proxy
└── index.html             # HTML template
```

### Key concepts

1. **Hybrid dependency management**: The project uses both Deno and npm
   dependencies. Deno handles server-side dependencies like Oak, while npm
   handles frontend dependencies through Vite.

2. **Development vs Production**: In development, Vite serves the React app on
   port 3000 and proxies API requests to the Oak server on port 8000. In
   production, the Oak server serves both the built React app and the API from
   port 8000.

3. **Modern React patterns**: The app uses React 19, functional components,
   hooks, and React Router for navigation.

4. **Type safety**: While this example doesn't use a separate types file, in a
   larger app you'd typically create TypeScript interfaces for your data
   structures.

You can see a version of the
[app running on Deno Deploy](https://tutorial-with-react.deno.deno.net/)

## Build and deploy

We set up the project with a `serve` task that builds the React app and serves
it with the Oak backend server. Run the following command to build and serve the
app in production mode:

```sh
deno run build
deno run serve
```

This will:

1. Build the React app using Vite (output goes to `dist/`)
2. Start the Oak server which serves both the API and the built React app

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
git commit -am 'my react app'
git push -u origin main
```

### Deploy to Deno Deploy

Once your app is on GitHub, you can deploy it on the Deno Deploy<sup>EA</sup>
dashboard.
<a href="https://app.deno.com/" class="docs-cta deploy-cta deploy-button">Deploy
my app</a>

For a walkthrough of deploying your app, check out the
[Deno Deploy tutorial](/examples/deno_deploy_tutorial/).

🦕 Now you can scaffold and develop a React app with Vite and Deno! You’re ready
to build blazing-fast web applications. We hope you enjoy exploring these
cutting-edge tools, we can't wait to see what you make!
