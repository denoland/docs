---
title: "Build a SolidJS app with Deno"
url: /examples/solidjs_tutorial/
---

[SolidJS](https://www.solidjs.com/) is a declarative JavaScript library for
creating user interfaces that emphasizes fine-grained reactivity and minimal
overhead. When combined with Deno's modern runtime environment, you get a
powerful, performant stack for building web applications. In this tutorial,
we'll build a simple dinosaur catalog app that demonstrates the key features of
both technologies.

We'll go over how to build a simple SolidJS app using Deno:

- [Scaffold a SolidJS app](#scaffold-a-solidjs-app-with-vite)
- [Set up on Hono backend](#set-up-our-hono-backend)
- [Create our SolidJS frontend](#create-our-solidjs-frontend)
- [Next steps](#next-steps)

Feel free to skip directly to
[the source code](https://github.com/denoland/examples/tree/main/with-solidjs)
or follow along below!

## Scaffold a SolidJS app with Vite

Let's set up our SolidJS application using [Vite](https://vite.dev/), a modern
build tool that provides an excellent development experience with features like
hot module replacement and optimized builds.

```bash
deno init --npm vite@latest solid-deno --template solid-ts
```

Our backend will be powered by [Hono](https://hono.dev/), which we can install
via [JSR](https://jsr.io). Let's also add `solidjs/router` for client-side
routing and navigation between our dinosaur catalog pages.

<figure>

```bash
deno add jsr:@hono/hono npm:@solidjs/router
```

<figcaption>
<a href="https://docs.deno.com/runtime/reference/cli/add/">
Learn more about <code>deno add</code> and using Deno as a package manager.
</a>
</figcaption>
</figure>

We'll also have to update our `deno.json` to include a few tasks and
`compilerOptions` to run our app:

<figure>

```json
{
  "tasks": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net --allow-read api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    "build": "deno run -A npm:vite build",
    "serve": {
      "command": "deno task dev:api",
      "description": "Run the build, and then start the API server",
      "dependencies": ["deno task build"]
    }
  },
  "imports": {
    "@hono/hono": "jsr:@hono/hono@^4.6.12",
    "@solidjs/router": "npm:@solidjs/router@^0.14.10"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "solid-js",
    "lib": ["DOM", "DOM.Iterable", "ESNext"]
  }
}
```

<figcaption>
<a href="https://docs.deno.com/runtime/reference/cli/task/">You can write your <code>tasks</code> as objects</a>. Here our <code>serve</code> command includes a <code>description</code> and <code>dependencies</code>.
</figcaption>
</figure>

Great! Next, let's setup our API backend.

## Set up our Hono backend

Within our main directory, we will set up an `api/` directory and create two
files. First, our dinosaur data file,
[`api/data.json`](https://github.com/denoland/examples/blob/main/with-solidjs/api/data.json):

```json
// api/data.json

[
  {
    "name": "Aardonyx",
    "description": "An early stage in the evolution of sauropods."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel's lizard\" has been reconstructed from a single skull."
  },
  {
    "name": "Abrictosaurus",
    "description": "An early relative of Heterodontosaurus."
  },
  ...
]
```

This is where our data will be pulled from. In a full application, this data
would come from a database.

> ⚠️️ In this tutorial we hard code the data. But you can connect
> to [a variety of databases](https://docs.deno.com/runtime/tutorials/connecting_to_databases/) and [even use ORMs like Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) with
> Deno.

Secondly, we need our Hono server, `api/main.ts`:

```tsx
// api/main.ts

import { Hono } from "@hono/hono";
import data from "./data.json" with { type: "json" };

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to the dinosaur API!");
});

app.get("/api/dinosaurs", (c) => {
  return c.json(data);
});

app.get("/api/dinosaurs/:dinosaur", (c) => {
  if (!c.req.param("dinosaur")) {
    return c.text("No dinosaur name provided.");
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === c.req.param("dinosaur").toLowerCase()
  );

  console.log(dinosaur);

  if (dinosaur) {
    return c.json(dinosaur);
  } else {
    return c.notFound();
  }
});

Deno.serve(app.fetch);
```

This Hono server provides two API endpoints:

- `GET /api/dinosaurs` to fetch all dinosaurs, and
- `GET /api/dinosaurs/:dinosaur` to fetch a specific dinosaur by name

This server will be started on `localhost:8000` when we run `deno task dev`.

Finally, before we start building out the frontend, let's update our
`vite.config.ts` file with the below, especially the `server.proxy`, which
informs our SolidJS frontend where to locate the API endpoint.

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

## Create our SolidJS frontend

Before we begin building out the frontend components, let's quickly define the
`Dino` type in `src/types.ts`:

```tsx
// src/types.ts
export type Dino = {
  name: string;
  description: string;
};
```

The `Dino` type interface ensures type safety throughout our application,
defining the shape of our dinosaur data and enabling TypeScript's static type
checking.

Next, let's set up our frontend to receive that data. We're going to have two
pages:

- `Index.tsx`
- `Dinosaur.tsx`

Here's the code for the `src/pages/Index.tsx` page:

```tsx
// src/pages/Index.tsx

import { createSignal, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = createSignal<Dino[]>([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/dinosaurs");
      const allDinosaurs = (await response.json()) as Dino[];
      setDinosaurs(allDinosaurs);
      console.log("Fetched dinosaurs:", allDinosaurs);
    } catch (error) {
      console.error("Failed to fetch dinosaurs:", error);
    }
  });

  return (
    <main>
      <h1>Welcome to the Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
      <For each={dinosaurs()}>
        {(dinosaur) => (
          <A href={`/${dinosaur.name.toLowerCase()}`} class="dinosaur">
            {dinosaur.name}
          </A>
        )}
      </For>
    </main>
  );
}
```

When using SolidJS, there are a few key differences to React to be aware of:

1. We use SolidJS-specific primitives:
   - `createSignal` instead of `useState`
   - `createEffect` instead of `useEffect`
   - `For` component instead of `map`
   - `A` component instead of `Link`
2. SolidJS components use fine-grained reactivity, so we call signals as
   functions, e.g. `dinosaur()` instead of just `dinosaur`
3. The routing is handled by `@solidjs/router` instead of `react-router-dom`
4. Component imports use Solid's
   [`lazy`](https://docs.solidjs.com/reference/component-apis/lazy) for code
   splitting

The `Index` page uses SolidJS's `createSignal` to manage the list of dinosaurs
and `onMount` to fetch the data when the component loads. We use the `For`
component, which is SolidJS's efficient way of rendering lists, rather than
using JavaScript's map function. The `A` component from `@solidjs/router`
creates client-side navigation links to individual dinosaur pages, preventing
full page reloads.

Now the individual dinosaur data page at `src/pages/Dinosaur.tsx`:

```tsx
// src/pages/Dinosaur.tsx

import { createSignal, onMount } from "solid-js";
import { A, useParams } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Dinosaur() {
  const params = useParams();
  const [dinosaur, setDinosaur] = createSignal<Dino>({
    name: "",
    description: "",
  });

  onMount(async () => {
    const resp = await fetch(`/api/dinosaurs/${params.selectedDinosaur}`);
    const dino = (await resp.json()) as Dino;
    setDinosaur(dino);
    console.log("Dinosaur", dino);
  });

  return (
    <div>
      <h1>{dinosaur().name}</h1>
      <p>{dinosaur().description}</p>
      <A href="/">Back to all dinosaurs</A>
    </div>
  );
}
```

The `Dinosaur` page demonstrates SolidJS's approach to dynamic routing by using
`useParams` to access the URL parameters. It follows a similar pattern to the
`Index` page, using `createSignal` for state management and `onMount` for data
fetching, but focuses on a single dinosaur's details. This `Dinosaur` component
also shows how to access signal values in the template by calling them as
functions (e.g., `dinosaur().name`), which is a key difference from React's
state management.

Finally, to tie it all together, we'll update the `App.tsx` file, which will
serve both the `Index` and `Dinosaur` pages as components. The `App` component
sets up our routing configuration using `@solidjs/router`, defining two main
routes: the index route for our dinosaur list and a dynamic route for individual
dinosaur pages. The `:selectedDinosaur` parameter in the route path creates a
dynamic segment that matches any dinosaur name in the URL.

```tsx
// src/App.tsx

import { Route, Router } from "@solidjs/router";
import Index from "./pages/Index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/:selectedDinosaur" component={Dinosaur} />
    </Router>
  );
};

export default App;
```

Finally, this `App` component will be called from our main index:

```tsx
// src/index.tsx

import { render } from "solid-js/web";
import App from "./App.tsx";
import "./index.css";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

render(() => <App />, wrapper);
```

The entry point of our application mounts the App component to the DOM using
SolidJS's `render` function. It includes a safety check to ensure the root
element exists before attempting to render, providing better error handling
during initialization.

Now, let's run `deno task dev` to start both the frontend and backend together:

<figure>

<video class="w-full" alt="Build an http server tutorial in Deno Deploy." autoplay muted loop playsinline src="./images/how-to/solidjs/demo.mp4"></video>

</figure>

## Next steps

🦕 Now you can build and run a SolidJS app with Deno! Here are some ways you
could enhance your dinosaur application:

- Add persistent data store
  [using a database like Postgres or MongoDB](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
  and an ORM like [Drizzle](https://deno.com/blog/build-database-app-drizzle) or
  [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/)
- Implement global state using SolidJS's
  [`createContext`](https://docs.solidjs.com/reference/component-apis/create-context)
  for sharing data between components
- Add loading states using
  [`createResource`](https://docs.solidjs.com/reference/basic-reactivity/create-resource)'s
  loading property
- Implement route-based code splitting with
  [`lazy`](https://docs.solidjs.com/reference/component-apis/lazy) imports
- Use `Index` component for more efficient list rendering
- Deploy your app to
  [AWS](https://docs.deno.com/runtime/tutorials/aws_lightsail/),
  [Digital Ocean](https://docs.deno.com/runtime/tutorials/digital_ocean/), or
  [Google Cloud Run](https://docs.deno.com/runtime/tutorials/google_cloud_run/)

The combination of SolidJS's unique reactive primitives, true DOM
reconciliation, and Deno's modern runtime provides an incredibly efficient
foundation for web development. With no Virtual DOM overhead and granular
updates only where needed, your application can achieve optimal performance
while maintaining clean, readable code.
