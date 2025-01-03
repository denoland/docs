---
title: "Build Qwik with Deno"
url: /examples/qwik_tutorial/
---

[Qwik](https://qwik.dev/) is a JavaScript framework that delivers
instant-loading web applications by leveraging resumability instead of
hydration. In this tutorial, we'll build a simple Qwik application and run it
with Deno. The app will display a list of dinosaurs. When you click on one,
it'll take you to a dinosaur page with more details.

We'll go over how to build a simple Qwik app using Deno:

- [Scaffold a Qwik app](#scaffold-a-qwik-app)
- [Setup data and type definitions](#setup-data-and-type-definitions)
- [Build the frontend](#build-the-frontend)
- [Next steps](#next-steps)

Feel free to skip directly to
[the source code](https://github.com/denoland/examples/tree/main/with-qwik) or
follow along below!

## Scaffold a Qwik app

We can create a new Qwik project using deno like this:

```bash
deno init --npm qwik@latest
```

This will run you through the setup process for Qwik and Qwik City. Here, we
chose the simplest “Empty App” deployment with npm dependencies.

When complete, you’ll have a project structure that looks like this:

```
.
├── node_modules/
├── public/
└── src/
    ├── components/
    │   └── router-head/
    │       └── router-head.tsx
    └── routes/
        ├── index.tsx
        ├── layout.tsx
        ├── service-worker.ts
        ├── entry.dev.tsx
        ├── entry.preview.tsx
        ├── entry.ssr.tsx
        ├── global.css
        └── root.tsx
├── .eslintignore
├── .eslintrc.cjs
├── .gitignore
├── .prettierignore
├── package-lock.json
├── package.json
├── qwik.env.d.ts
├── README.md
├── tsconfig.json
└── vite.config.ts
```

Most of this is boilerplate configuration that we won’t touch. A few of the
important files to know for how Qwik works are:

- `src/components/router-head/router-head.tsx`: Manages the HTML head elements
  (like title, meta tags, etc.) across different routes in your Qwik
  application.
- `src/routes/index.tsx`: The main entry point and home page of your application
  that users see when they visit the root URL.
- `src/routes/layout.tsx`: Defines the common layout structure that wraps around
  pages, allowing you to maintain consistent UI elements like headers and
  footers.
- `src/routes/service-worker.ts`: Handles Progressive Web App (PWA)
  functionality, offline caching, and background tasks for your application.
- `src/routes/entry.ssr.tsx`: Controls how your application is server-side
  rendered, managing the initial HTML generation and hydration process.
- `src/routes/root.tsx`: The root component that serves as the application's
  shell, containing global providers and the main routing structure.

Now we can build out our own routes and files within the application.

## Setup data and type definitions

We’ll start by adding our
[dinosaur data](https://github.com/denoland/examples/blob/main/with-qwik/src/data/dinosaurs.json)
to a new `./src/data` directory as `dinosaurs.json`:

```jsonc
// ./src/data/dinosaurs.json

{
  "dinosaurs": [
    {
      "name": "Tyrannosaurus Rex",
      "description": "A massive carnivorous dinosaur with powerful jaws and tiny arms."
    },
    {
      "name": "Brachiosaurus",
      "description": "A huge herbivorous dinosaur with a very long neck."
    },
    {
      "name": "Velociraptor",
      "description": "A small but fierce predator that hunted in packs."
    }
    // ...
  ]
}
```

This is where our data will be pulled from. In a full application, this data
would come from a database.

> ⚠️️ In this tutorial we hard code the data. But you can connect
> to [a variety of databases](https://docs.deno.com/runtime/tutorials/connecting_to_databases/) and [even use ORMs like Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) with
> Deno.

Next, let's add type definitions for our dinosaur data. We'll put it in
`types.ts` in `./src/`:

```tsx
// ./src/types.ts

export type Dino = {
  name: string;
  description: string;
};
```

Next, let's add API routes to server this data.

## Add API routes

First, let's create the route to load all dinosaurs for the index page. This API
endpoint uses Qwik City's
[`RequestHandler`](https://qwik.dev/docs/advanced/request-handling/) to create a
`GET` endpoint that loads and returns our dinosaur data using the json helper
for proper response formatting. We'll add the below to a new file in
`./src/routes/api/dinosaurs/index.ts`:

```tsx
// ./src/routes/api/dinosaurs/index.ts

import { RequestHandler } from "@builder.io/qwik-city";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const onGet: RequestHandler = async ({ json }) => {
  const dinosaurs = data;
  json(200, dinosaurs);
};
```

Next, let's create the API route to get the information for a single dinosaur.
This takes the parameter from the URL and uses it to search through our dinosaur
data. We'll add the below code to `./src/routes/api/dinosaurs/[name]/index.ts`:

```tsx
// ./src/routes/api/dinosaurs/[name]/index.ts

import { RequestHandler } from "@builder.io/qwik-city";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const onGet: RequestHandler = async ({ params, json }) => {
  const { name } = params;
  const dinosaurs = data;

  if (!name) {
    json(400, { error: "No dinosaur name provided." });
    return;
  }

  const dinosaur = dinosaurs.find(
    (dino) => dino.name.toLowerCase() === name.toLowerCase(),
  );

  if (!dinosaur) {
    json(404, { error: "No dinosaur found." });
    return;
  }

  json(200, dinosaur);
};
```

Now that the API routes are wired up and serving data, let's create the two
frontend pages: the index page and the individual dinosaur detail pages.

## Build the frontend

We'll create our homepage by updating our `./src/routes/index.tsx` file using
Qwik's [`routeLoader$`](https://qwik.dev/docs/route-loader/) for server-side
data fetching. This `component$` loads and renders the dinosaur data during SSR
via `useDinosaurs()`:

```tsx
// ./src/routes/index.tsx

import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Dino } from "~/types";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const useDinosaurs = routeLoader$(() => {
  return data;
});

export default component$(() => {
  const dinosaursSignal = useDinosaurs();

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Welcome to the Dinosaur app</h1>
      <p class="mb-4">Click on a dinosaur below to learn more.</p>
      <ul class="space-y-2">
        {dinosaursSignal.value.dinosaurs.map((dinosaur: Dino) => (
          <li key={dinosaur.name}>
            <Link
              href={`/${dinosaur.name.toLowerCase()}`}
              class="text-blue-600 hover:underline"
            >
              {dinosaur.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});
```

Now that we have our main index page, let's add a page for the individual
dinosaur information. We'll use Qwik's
[dynamic routing](https://qwik.dev/docs/routing/), with `[name]` as the key for
each dinosaur. This page leverages `routeLoader$` to fetch individual dinosaur
details based on the URL parameter, with built-in error handling if the dinosaur
isn't found.

The component uses the same SSR pattern as our index page, but with
parameter-based data loading and a simpler display layout for individual
dinosaur details:

```tsx
// ./src/routes/[name]/index.tsx

import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Dino } from "~/types";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const useDinosaurDetails = routeLoader$(({ params }): Dino => {
  const { dinosaurs } = data;
  const dinosaur = dinosaurs.find(
    (dino: Dino) => dino.name.toLowerCase() === params.name.toLowerCase(),
  );

  if (!dinosaur) {
    throw new Error("Dinosaur not found");
  }

  return dinosaur;
});

export default component$(() => {
  const dinosaurSignal = useDinosaurDetails();

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">{dinosaurSignal.value.name}</h1>
      <p class="mb-4">{dinosaurSignal.value.description}</p>
      <Link href="/" class="text-blue-600 hover:underline">
        Back to all dinosaurs
      </Link>
    </div>
  );
});
```

Now that we have built our routes and the frontend components, we can run our
application:

```bash
deno task dev
```

This will start the app at `localhost:5173`:

<figure>

<video class="w-full" alt="Build a qwik app with Deno." autoplay muted loop playsinline src="./images/how-to/qwik/demo.mp4"></video>

</figure>

Tada!

## Next steps

🦕 Now you can build and run a Qwik app with Deno! Here are some ways you could
enhance your dinosaur application:

Next steps for a Qwik app might be to use Qwik's lazy loading capabilities for
dinosaur images and other components, or add client-side state management for
complex features.

- Add persistent data store
  [using a database like Postgres or MongoDB](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
  and an ORM like [Drizzle](https://docs.deno.com/examples/drizzle_tutorial/) or
  [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/)
- use Qwik's lazy loading capabilities for dinosaur images and components
- add client-side state management
- self-host your app to
  [AWS](https://docs.deno.com/runtime/tutorials/aws_lightsail/),
  [Digital Ocean](https://docs.deno.com/runtime/tutorials/digital_ocean/), and
  [Google Cloud Run](https://docs.deno.com/runtime/tutorials/google_cloud_run/)
