---
title: "Build a Fresh App"
description: "Complete guide to building Full-stack applications with Fresh and Deno. Learn how to set up a project, implement server-side rendering with islands architecture, add API routes, and deploy your TypeScript application."
url: /examples/fresh_tutorial/
---

[Fresh](https://fresh.deno.dev/) is a full-stack web framework for Deno that
emphasizes server-side rendering with islands of interactivity. It sends no
JavaScript to the client by default, making it incredibly fast and efficient.
Fresh uses a file-based routing system and leverages Deno's modern runtime
capabilities.

In this tutorial, we'll build a simple dinosaur catalog app that demonstrates
Fresh's key features. The app will display a list of dinosaurs, allow you to
view individual dinosaur details, and include interactive components using
Fresh's islands architecture.

You can see the
[finished app repo on GitHub](https://github.com/denoland/tutorial-with-fresh)
and a [demo of the app on Deno Deploy](https://tutorial-with-fresh.deno.dev/).

:::info Deploy your own

Want to skip the tutorial and deploy the finished app right now? Click the
button below to instantly deploy your own copy of the complete Fresh dinosaur
app to Deno Deploy. You'll get a live, working application that you can
customize and modify as you learn!

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-fresh)

:::

## Create a Fresh project

Fresh provides a convenient scaffolding tool to create a new project. In your
terminal, run the following command:

```sh
deno run -Ar jsr:@fresh/init
```

This command will:

- Download the latest Fresh scaffolding script
- Create a new directory called `my-fresh-app`
- Set up a basic Fresh project structure
- Install all necessary dependencies

Navigate into your new project directory:

```sh
cd my-fresh-app
```

Start the development server:

```sh
deno task start
```

Open your browser to `http://localhost:5173` to see your new Fresh app running!

## Understanding the project structure

The project contains the following key directories and files:

```text
my-fresh-app/
├── assets/           # Static assets (images, CSS, etc.)
├── components/        # Reusable UI components
├── islands/           # Interactive components (islands)
├── routes/            # File-based routing
│  └── api/             # API routes
├── static/            # Static assets (images, CSS, etc.)
├── main.ts            # Entry point of the application
├── deno.json          # Deno configuration file
└── README.md          # Project documentation
```

## Adding dinosaur data

To add dinosaur data to our app, we'll create a simple data file which contains
some information about dinosaurs in json. In a real application, this data might
come from a database or an external API, but for simplicity, we'll use a static
file.

In the `routes/api` directory, create a new file called `data.json` and copy the
content from
[here](https://github.com/denoland/tutorial-with-fresh/blob/main/routes/api/data.json).

## Displaying the dinosaur list

The homepage will display a list of dinosaurs that the user can click on to view
more details. Lets update the `routes/index.tsx` file to fetch and display the
dinosaur data.

First update the `<title>` in the head of the file to read "Dinosaur
Encyclopedia". Then we'll add some basic HTML to introduce the app.

```tsx title="index.tsx"
<main>
  <h1>🦕 Welcome to the Dinosaur Encyclopedia</h1>
  <p>Click on a dinosaur below to learn more.</p>
  <div class="dinosaur-list">
    {/* Dinosaur list will go here */}
  </div>
</main>;
```

We'll make a new component which will be used to display each dinosaur in the
list.

## Creating a component

Create a new file at `components/LinkButton.tsx` and add the following code:

```tsx title="LinkButton.tsx"
import type { ComponentChildren } from "preact";

export interface LinkButtonProps {
  href?: string;
  class?: string;
  children?: ComponentChildren;
}

export function LinkButton(props: LinkButtonProps) {
  return (
    <a
      {...props}
      class={"btn " +
        (props.class ?? "")}
    />
  );
}
```

This component renders a styled link that looks like a button. It accepts
`href`, `class`, and `children` props.

finally, update the `routes/index.tsx` file to import and use the new
`LinkButton` component to display each dinosaur in the list.

```tsx title="index.tsx"
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import data from "./api/data.json" with { type: "json" };
import { LinkButton } from "../components/LinkButton.tsx";

export default define.page(function Home() {
  return (
    <>
      <Head>
        <title>Dinosaur Encyclopedia</title>
      </Head>
      <main>
        <h1>🦕 Welcome to the Dinosaur Encyclopedia</h1>
        <p>Click on a dinosaur below to learn more.</p>
        <div class="dinosaur-list">
          {data.map((dinosaur: { name: string; description: string }) => (
            <LinkButton
              href={`/dinosaurs/${dinosaur.name.toLowerCase()}`}
              class="btn-primary"
            >
              {dinosaur.name}
            </LinkButton>
          ))}
        </div>
      </main>
    </>
  );
});
```

## Creating dynamic routes

Fresh allows us to create dynamic routes using file-based routing. We'll create
a new route to display individual dinosaur details.

Create a new file at `routes/dinosaurs/[name].tsx`. In this file, we'll fetch
the dinosaur data based on the name parameter and display it.

```tsx title="[dinosaur].tsx"
import { PageProps } from "$fresh/server.ts";
import data from "../api/data.json" with { type: "json" };
import { LinkButton } from "../../components/LinkButton.tsx";

export default function DinosaurPage(props: PageProps) {
  const name = props.params.dinosaur;
  const dinosaur = data.find((d: { name: string }) =>
    d.name.toLowerCase() === name.toLowerCase()
  );

  if (!dinosaur) {
    return (
      <main>
        <h1>Dinosaur not found</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <LinkButton href="/" class="btn-secondary">← Back to list</LinkButton>
    </main>
  );
}
```

## Adding interactivity with islands

Fresh's islands architecture allows us to add interactivity to specific
components without sending unnecessary JavaScript to the client. Let's create a
simple interactive component that allows users to "favorite" a dinosaur.

Create a new file at `islands/FavoriteButton.tsx` and add the following code:

```tsx title="FavoriteButton.tsx"
import { useState } from "preact/hooks";

export default function FavoriteButton() {
  const [favorited, setFavorited] = useState(false);

  return (
    <button
      type="button"
      className={`btn fav ${favorited ? "btn-favorited" : "btn-primary"}`}
      onClick={() => setFavorited((f) => !f)}
    >
      {favorited ? "★ Favorited!" : "☆ Add to Favorites"}
    </button>
  );
}
```

This is just a simple button that toggles its state when clicked. You could
update it to store the favorite state in a database or local storage for a more
complete feature.

Now we need to import and use this `FavoriteButton` island in our dinosaur
detail page. Add the import at the top of `routes/dinosaurs/[dinosaur].tsx`:

```tsx title="[dinosaur].tsx"
import FavoriteButton from "../../islands/FavoriteButton.tsx";
```

and then include the `<FavoriteButton />` component in the JSX where you want it
to appear, for example, before the back button:

```tsx title="[dinosaur].tsx"
<FavoriteButton />;
```

## Styling the app

We've created some basic styles to add to your app, but of course you can add
your own css in the `assets/styles.css` file. Add a link to our provided
stylesheet in the `<head>` of `routes/_app.tsx`:

```tsx title="_app.tsx"
<link rel="stylesheet" href="https://demo-styles.deno.deno.net/styles.css" />;
```

## Running the app

Make sure your development server is running with:

```sh
deno task start
```

Open your browser to `http://localhost:5173` to see your dinosaur catalog app in
action! You should be able to view the list of dinosaurs, click on one to see
its details, and use the "Favorite" button to toggle its favorite status.

## Build and deploy

The default Fresh app comes with a `build` task that builds the app with Vite.
You can run the following command to build the app for production mode:

```sh
deno run build
```

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
git commit -am 'my fresh app'
git push -u origin main
```

### Deploy to Deno Deploy

Once your app is on GitHub, you can
[deploy it to Deno Deploy<sup>EA</sup>](https://console.deno.com/).

For a walkthrough of deploying your app, check out the
[Deno Deploy tutorial](/examples/deno_deploy_tutorial/).

🦕 Now you have a starter Fresh app! Here are some ideas to extend your dinosaur
catalog:

- Add a database (try [Deno KV](https://docs.deno.com/runtime/fundamentals/kv/)
  or connect to
  [PostgreSQL](https://docs.deno.com/runtime/tutorials/connecting_to_databases/))
- Implement user authentication with
- Add more interactive features like favorites or ratings
- Connect to external APIs for more dinosaur data

Fresh's architecture makes it easy to build fast, scalable web applications
while maintaining a great developer experience. The combination of server-side
rendering by default with optional client-side interactivity gives you the best
of both worlds.
