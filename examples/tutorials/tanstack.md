---
title: "Build an app with Tanstack and Deno"
---

[Tanstack](https://tanstack.com/) is a set of framework-agnostic data management
tools. With Tanstack, developers can manage server state efficiently with
[Query](https://tanstack.com/query/latest), create powerful tables with
[Table](https://tanstack.com/table/latest), handle complex routing with
[Router](https://tanstack.com/router/latest), and build type-safe forms with
[Form](https://tanstack.com/form/latest). These tools work seamlessly across
[React](/examples/react_tutorial), [Vue](/examples/vue_tutorial),
[Solid](/examples/solidjs_tutorial), and other frameworks while maintaining
excellent TypeScript support.

In this tutorial, we’ll build a simple app using
[Tanstack Query](https://tanstack.com/query/latest) and
[Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/quick-start).
The app will display a list of dinosaurs. When you click on one, it'll take you
to a dinosaur page with more details.

- [Start with the backend API](#start-with-the-backend-api)
- [Create a Tanstack-driven frontend](#create-tanstack-driven-frontend)
- [Next steps](#next-steps)

Feel free to skip directly to
[the source code](https://github.com/denoland/examples/tree/main/with-tanstack)
or follow along below!

## Start with the backend API

Within our main directory, let's setup an `api/` directory and create our
dinosaur data file, `api/data.json`:

```jsonc
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

Secondly, let's create our [Hono](https://hono.dev/) server. We start by
installing Hono from [JSR](https://jsr.io) with `deno add`:

```shell
deno add jsr:@hono/hono
```

Next, let's create an `api/main.ts` file and populate it with the below. Note
we'll need to import
[`@hono/hono/cors`](https://hono.dev/docs/middleware/builtin/cors) and define
key attributes to allow the frontend to access the API routes.

```ts
// api/main.ts

import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import data from "./data.json" with { type: "json" };

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  }),
);

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

  if (dinosaur) {
    return c.json(dinosaur);
  } else {
    return c.notFound();
  }
});

Deno.serve(app.fetch);
```

The Hono server provides two API endpoints:

- `GET /api/dinosaurs` to fetch all dinosaurs, and
- `GET /api/dinosaurs/:dinosaur` to fetch a specific dinosaur by name

Before we start working on the frontend, let's update our `deno tasks` in our
`deno.json` file. Yours should look something like this:

```json
{
  "tasks": {
    "dev": "deno --allow-env --allow-net api/main.ts"
  }
  // ...
}
```

Now, the backend server will be started on `localhost:8000` when we run
`deno task dev`.

## Create Tanstack-driven frontend

Let's create the frontend that will use this data. First, we'll quickly scaffold
a new React app with Vite using the TypeScript template in the current
directory:

```shell
deno init --npm vite@latest --template react-ts ./
```

Then, we'll install our Tanstack-specific dependencies:

```shell
deno install npm:@tanstack/react-query npm:@tanstack/react-router
```

Let's update our `deno tasks` in our `deno.json` to add a command to start the
Vite server:

```jsonc
// deno.json
{
  "tasks": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno --allow-env --allow-net api/main.ts",
    "dev:vite": "deno -A npm:vite"
  }
  // ...
}
```

We can move onto building our components. We'll need two main pages for our app:

- `DinosaurList.tsx`: the index page, which will list out all the dinosaurs, and
- `Dinosaur.tsx`: the leaf page, which displays information about a single
  dinosaur

Let's create a new `./src/components` directory and, within that, the file
`DinosaurList.tsx`:

```ts
// ./src/components/DinosaurList.tsx

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

async function fetchDinosaurs() {
  const response = await fetch("http://localhost:8000/api/dinosaurs/");
  if (!response.ok) {
    throw new Error("Failed to fetch dinosaurs");
  }
  return response.json();
}

export function DinosaurList() {
  const {
    data: dinosaurs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dinosaurs"],
    queryFn: fetchDinosaurs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dinosaur List</h2>
      <ul className="space-y-2">
        {dinosaurs?.map((dino: { name: string; description: string }) => (
          <li key={dino.name}>
            <Link
              to="/dinosaur/$name"
              params={{ name: dino.name }}
              className="text-blue-500 hover:underline"
            >
              {dino.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

This uses
[`useQuery`](https://tanstack.com/query/v4/docs/framework/react/guides/queries)
from **Tanstack Query** to fetch and cache the dinosaur data automatically, with
built-in loading and error states. Then it uses
[`Link`](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent)
from **Tanstack Router** to create client-side navigation links with type-safe
routing parameters.

Next, let's create the `DinosaurDetail.tsx` component in the `./src/components/`
folder, which will show details about a single dinosaur:

```ts
// ./src/components/DinosaurDetail.tsx

import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

async function fetchDinosaurDetail(name: string) {
  const response = await fetch(`http://localhost:8000/api/dinosaurs/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dinosaur detail");
  }
  return response.json();
}

export function DinosaurDetail() {
  const { name } = useParams({ from: "/dinosaur/$name" });
  const {
    data: dinosaur,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dinosaur", name],
    queryFn: () => fetchDinosaurDetail(name),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{name}</h2>
      <p>{dinosaur?.description}</p>
    </div>
  );
}
```

Again, this uses `useQuery` from **Tanstack Query** to fetch and cache
individual dinosaur details, with
[`queryKey`](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
including the dinosaur name to ensure proper caching. Additionally, we use
[`useParams`](https://tanstack.com/router/v1/docs/framework/react/api/router/useParamsHook)
from **Tanstack Router** to safely extract and type the URL parameters defined
in our route configuration.

Before we can run this, we need to encapsulate these components into a layout.
Let's create another file in the `./src/components/` folder called `Layout.tsx`:

```ts
// ./src/components/Layout.tsx

export function Layout() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dinosaur Encyclopedia</h1>
      <nav className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

You may notice the
[`Outlet`](https://tanstack.com/router/v1/docs/framework/react/guide/outlets)
component towards the bottom of our newly created layout. This component is from
**Tanstack Router** and renders the child route's content, allowing for nested
routing while maintaining a consistent layout structure.

Next, we'll have to wire up this layout with `./src/main.tsx`, which an
important file that sets up the Tanstack Query client for managing server state
and the Tanstack Router for handling navigation:

```ts
// ./src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

You'll notice we import
[`QueryClientProvider`](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider),
which wraps the entire application to allow for query caching and state
management. We also import `RouterProvider`, which connects our defined routes
to React's rendering system.

Finally, we'll need to define a
[`routeTree.tsx`](https://tanstack.com/router/v1/docs/framework/react/guide/route-trees)
file in our `./src/` directory. This file defines our application's routing
structure using Tanstack Router's type-safe route definitions:

```ts
// ./src/routeTree.tsx

import { RootRoute, Route } from "@tanstack/react-router";
import { DinosaurList } from "./components/DinosaurList";
import { DinosaurDetail } from "./components/DinosaurDetail";
import { Layout } from "./components/Layout";

const rootRoute = new RootRoute({
  component: Layout,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DinosaurList,
});

const dinosaurRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dinosaur/$name",
  component: DinosaurDetail,
});

export const routeTree = rootRoute.addChildren([indexRoute, dinosaurRoute]);
```

In `./src/routeTree.tsx`, we create a hierarchy of routes with `Layout` as the
root component. Then we set two child routes, their paths and components — one
for the dinosaur list, `DinosaurList`, and the other for the individual dinosaur
details with a dynamic parameter, `DinosaurDetail`.

With all that complete, we can run this project:

```shell
deno task dev
```

<figure>

<video class="w-full" alt="Build an app with Deno and Tanstack." autoplay muted loop playsinline src="./images/how-to/tanstack/demo.mp4"></video>

</figure>

## Next steps

This is just the beginning of building with Deno and Tanstack. You can add
persistent data storage like
[using a database like Postgres or MongoDB](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
and an ORM like [Drizzle](https://deno.com/blog/build-database-app-drizzle) or
[Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/). Or
deploy your app to
[AWS](https://docs.deno.com/runtime/tutorials/aws_lightsail/),
[Digital Ocean](https://docs.deno.com/runtime/tutorials/digital_ocean/), or
[Google Cloud Run](https://docs.deno.com/runtime/tutorials/google_cloud_run/)

You could also add real-time updates using
[Tanstack Query's refetching capabilities](https://tanstack.com/query/latest/docs/framework/react/examples/auto-refetching),
[implement infinite scrolling](https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll)
for large dinosaur lists, or
[add complex filtering and sorting](https://tanstack.com/table/v8/docs/guide/column-filtering)
using **[Tanstack Table](https://tanstack.com/table/latest)**. The combination
of Deno's built-in web standards, tooling, and native TypeScript support, as
well as Tanstack's powerful data management opens up numerous possibilities for
building robust web applications.
