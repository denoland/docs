---
title: "Build Astro with Deno"
description: "Step-by-step tutorial on building web applications with Astro and Deno. Learn how to scaffold projects, create dynamic pages, implement SSR, and deploy your Astro sites using Deno's Node.js compatibility."
url: /examples/astro_tutorial/
---

[Astro](https://astro.build/) is a modern web framework focused on
content-centric websites, which leverages islands architecture and sends zero
JavaScript to the client by default. You can see the
[finished app on GitHub](https://github.com/denoland/tutorial-with-astro).

You can see a live version of the app on
[Deno Deploy](https://tutorial-with-astro.deno.deno.net/).

## Scaffold an Astro project

Astro provides a CLI tool to quickly scaffold a new Astro project. In your
terminal, run the following command to create a new Astro project with Deno.

```sh
deno init --npm astro@latest
```

For this tutorial, we’ll select the “Empty” template so we can start from
scratch and we'll install the dependencies.

this will set us up with a basic Astro project structure, including a
`package.json` file, and a `src` directory where our application code will live.

## Start the Astro server

We can start the local Astro server with the `dev` task. In your terminal,
change directory into your new project and run run

```sh
deno task dev
```

This will start the Astro development server, which will watch for changes in
your files and automatically reload the page in your browser. You should see a
message indicating that the server is running on `http://localhost:4321`.

Upon visiting the output URL in your browser, you should see a very basic Astro
welcome page.

## Build out the app architecture

Now that we have a basic Astro project set up, let's build out the architecture
of our app. We'll create a few directories to organize our code and set up some
basic routing. Create the following directories

```text
src/
    ├── data/
    ├── lib/
    └── pages/
        └── index.astro
```

## Add dinosaur data

In the `data` directory, create a new file called `data.json` file, which will
contain the hard coded dinosaur data.

Copy and paste
[this json file](https://github.com/denoland/tutorial-with-astro/blob/main/src/routes/api/data.json)
into the `data.json` file. (If you were building a real app, you would probably
fetch this data from a database or an external API.)

## Set up the business logic

Next, we’ll create a `lib` directory to hold our business logic. In this case,
we’ll create a file called `dinosaur-service.ts` that will contain a function to
fetch the dinosaur data. Create `src/lib/dinosaur-service.ts` with the following
code:

```ts title="src/lib/dinosaur-service.ts"
// Simple utility functions for working with dinosaur data
import dinosaursData from "../data/data.json";

export interface Dinosaur {
  name?: string;
  description: string;
}

export class DinosaurService {
  private static dinosaurs: Dinosaur[] = dinosaursData;

  // Get all dinosaurs with names (filter out unnamed ones)
  static getNamedDinosaurs(): Dinosaur[] {
    return this.dinosaurs.filter((dino) => dino.name);
  }

  // Create a URL-friendly slug from dinosaur name
  static createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Get dinosaur by slug
  static getDinosaurBySlug(slug: string): Dinosaur | undefined {
    return this.dinosaurs.find((dino) => {
      if (!dino.name) return false;
      return this.createSlug(dino.name) === slug;
    });
  }

  // Get all dinosaurs with their slugs for linking
  static getDinosaursWithSlugs() {
    return this.getNamedDinosaurs().map((dino) => ({
      ...dino,
      slug: this.createSlug(dino.name!),
    }));
  }
}

export default DinosaurService;
```

This file contains a `DinosaurService` class with methods to get all dinosaurs,
create a URL-friendly slug from a dinosaur name, and get a dinosaur by its slug.

## Update the index page to use the service

Now we can update our `index.astro` page to use the `DinosaurService` to fetch
the dinosaur data and render it as a list of links. Update the
`src/pages/index.astro` file to look like this:

```jsx title="src/pages/index.astro"
---
import DinosaurService from '../lib/dinosaur-service';

// Get all dinosaurs with slugs for linking
const dinosaursWithSlugs = DinosaurService.getDinosaursWithSlugs();
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Dinosaur Directory</title>
		<link rel="stylesheet" href="/src/styles/index.css" />
	</head>
	<body>
		<h1>🦕 Dinosaur Directory</h1>
		<p>Click on any dinosaur name to learn more about it!</p>
		
		<div class="dinosaur-list">
			{dinosaursWithSlugs.map((dinosaur) => (
				<a href={`/dinosaur/${dinosaur.slug}`} class="dinosaur-link">
					{dinosaur.name}
				</a>
			))}
		</div>
	</body>
</html>
```

We import the `DinosaurService`, then map over the dinosaurs to create links to
individual dinosaur pages.

## Create individual dinosaur pages

Next, we’ll create individual pages for each dinosaur. In the `src/pages`
directory, create a directory called `dinosaurs`, and inside that directory,
create a file called `[slug].astro`. This file will be used to render the
individual dinosaur pages:

```jsx title="src/pages/dinosaurs/[slug].astro"
---
import DinosaurService from '../../lib/dinosaur-service';

export async function getStaticPaths() {
    const dinosaursWithSlugs = DinosaurService.getDinosaursWithSlugs();
    
    return dinosaursWithSlugs.map((dinosaur) => ({
        params: { slug: dinosaur.slug },
        props: { dinosaur }
    }));
}

const { dinosaur } = Astro.props;
---

<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content={Astro.generator} />
        <title>{dinosaur.name} - Dinosaur Directory</title>
        <meta name="description" content={dinosaur.description} />
        <link rel="stylesheet" href="/src/styles/index.css" />
    </head>
    <body class="dinosaur">
        <main>
            <h1>🦕 {dinosaur.name}</h1>
            
            <div class="info-card">
                <p>{dinosaur.description}</p>
            </div>
            
            <a href="/" class="back-button">← Back to Directory</a>
        </main>
    </body>
</html>
```

This file uses the `getStaticPaths` function to generate static paths for each
dinosaur based on the slugs we created earlier. The `Astro.props` object will
contain the dinosaur data for the specific slug, which we can then render in the
page.

## Add some styles

To make our app look a bit nicer, we can add some basic styles. Create a new
directory called `styles` in the `src` directory, and inside that directory,
create a file called `index.css`. Add
[styles from this css file](https://raw.githubusercontent.com/denoland/tutorial-with-astro/refs/heads/main/src/styles/index.css).

## Build and deploy

Astro has a built-in command to build your site for production:

```sh
deno run build
```

This will:

- Generate static HTML files for each page in the `dist` directory.
- Optimize your assets (CSS, JavaScript, images, etc.) for production.

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
git commit -am 'initial commit'
git push -u origin main
```

### Deploy to Deno Deploy

Once your app is on GitHub, you can deploy it on the Deno Deploy<sup>EA</sup>
dashboard.
<a href="https://app.deno.com/" class="docs-cta deploy-cta deploy-button">Deploy
my app</a>

For a walkthrough of deploying your app, check out the
[Deno Deploy tutorial](/examples/deno_deploy_tutorial/).

🦕 Now you can scaffold and develop an Astro app that will run on Deno! You
could extend this app by adding more features, such as user authentication, a
database, or even a CMS. We can’t wait to see what you build with Astro and
Deno!
