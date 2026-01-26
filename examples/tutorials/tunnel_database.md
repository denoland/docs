---
title: "title: Connect a Database to your local dev"
description: "Connect a Postgres database to your local development server with Deno Deploy and Deno's tunnel feature"
url: /examples/tunnel_database_tutorial/
---

In this tutorial, we'll show you how to connect a database to your local
development server using Deno's tunnel feature and Deno Deploy. This allows you
to work with databases in your local environment without complicated
configuration.

## Set up an app

If you don't already have a local server application, you can create a simple
with Svelte. We'll set up a basic notes app with Svelte for this tutorial:

```sh
npx sv create svelte-app
```

Select the default options for the prompts, then navigate into your new project
directory:

```sh
cd svelte-app
deno run dev
```

## Install a postgres driver and types

To connect to a Postgres database, we'll use the popular
[pg](https://www.npmjs.com/package/pg) client. Install the `pg` package and its
types using with npm specifiers:

```sh
deno add npm:pg npm:@types/pg
```

This will add the necessary dependencies to your `deno.json` file.

## Create a database migration script

Next, create a new file called `migrate.ts` in your project directory. This
script will connect to the Postgres database and create a sample table.

```ts title="migrate.ts"
import { Client } from "pg";
const client = new Client();
await client.connect();
await client.query(
  `CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, note TEXT)`,
);
await client.query(
  `INSERT INTO notes (note) VALUES ('hello, this is seed data')`,
);
await client.end();
```

### Update vite.config.ts

The Svelte app will need to make a small configuration update in the
`vite.config.js` to allow tunneling to the local server to work correctly. Add a
`server` section to set `allowedHosts: "true"`:

```js title="vite.config.js"
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    allowedHosts: "true",
  },
});
```

## Deploy your app to Deno Deploy

Next we'll deploy the Svelte app to Deno Deploy using the `deno deploy`
subcommand. This will set us up a project to which we can connect our database.

In your terminal, run:

```sh
deno deploy
```

Follow the prompts in your terminal to create a new Deno Deploy application, you
may need to log in to your Deno Deploy console, and select an organization if
you belong to more than one and create a new application for this project.

## Provision a database on Deno Deploy

Now it is time to provision a database for our application. Log in to you
[Deno Deploy console](https://console.deno.com/) and click on the **Databases**
tab. From there

1. Click on the **+ Provision database** button.
2. Select a Prisma Postgres database and click **Provision**.
3. Give the database a name slug (eg `my-test-db`)
4. Select the location closest to your users.
5. Click **Provision database**.

Once you have provisioned your database, click on it in the Databases tab, you
can assign it to the app that you just deployed. Click on the _Assign_ button
and select your app from the dropdown.

If you click on the name of the database you will see its configuration page.
This will list out the assigned apps and three database 'contexts', one for each
environment (local, preview, production). These contexts allow you to test your
database connection without affecting your production data.

## Run the migration script

Now that we have our database provisioned, we can run the migration script to
create the sample table. We can do this simply with the `--tunnel` flag.

```sh
deno run --tunnel -A migrate.ts
```

This will automatically pull down the database connection information and run
the migration script against the local database context.

You can verify that the table was created and the seed data was inserted with
the database explorer built into the Deno Deploy console. Navigate to your
database's page in Deno Deploy and click on the **Explore** button on the local
database context. You should see a single table with one entry in it.

## Display the data from the database in your app

Next, we can update our Svelte app to display the data from the database. Open
the `src/routes/+page.svelte` file and update it to fetch the notes from the
database.

```svelte title="src/routes/+page.svelte"
import { Client } from "pg";

export const load = async () => {
  const client = new Client();
  await client.connect();
  const res = await client.query(` SELECT note from notes; `);
  await client.end();
  return { notes: res.rows };
};
```

Then, update the HTML to display the notes:

```svelte title="src/routes/+page.svelte"
<script>
  let { data } = $props();
</script>
<h1>Welcome to SvelteKit</h1>
<ul>
  {#each data.notes as row}
    <li>{row.note}</li>
  {/each}
</ul>
```

## Run your app with the tunnel

Now, you can use the `--tunnel` flag to run your Svelte app locally and see the
data from the local database context:

```sh
deno run --tunnel dev
```

You should see a basic web page with your seed data displayed.

## Run your migrations with a pre-deploy command

When deploying your app to Deno Deploy, you don't want to run your migrations
manually, instead you may want to ensure that your database migrations are run
automatically before each deployment.

We will edit our app's configuration in the Deno Deploy console to add a
pre-deploy command that will run our migration script before each deployment.

1. Go to your Deno Deploy project dashboard.
2. Click on the **Settings** tab.
3. Scroll down to the **App Configuration** section, click on the **Edit**
   button.
4. In the **Pre-deploy Command** field, enter the following command:

```sh
deno run -A migrate.ts
```

Now each time you deploy your app, the migration script will run first, ensuring
that your database schema is up to date.

You can test this by running the deployment command:

```sh
deno deploy --prod
```

To directly deploy to production. Once the deployment is complete you should be
able to explore the production database context in the Deno Deploy console and
see that the table has been created and the seed data inserted.

## Update the data in the database

You can now update the data in the databases using the database explorer in the
Deno Deploy console (or by updating and running your migration script again with
new data). In the database explorer, click on the notes table and edit the text.
Click **save** and refresh the tab with your Svelte app to see the updated data.

Try updating the data in the local, preview, and production database contexts to
see how they are all separate.

🦕 Now you can connect a database to your local development environment using
the tunnel feature, making it easy to develop and test your app with real data
without complex configuration!
