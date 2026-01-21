---
title: "Share your local server with Tunnel"
description: "Expose a public URL instantly with the --tunnel option"
url: /examples/tunnel/
---

The `--tunnel` flag in Deno allows you to expose your local server to the
internet instantly. This is particularly useful for testing webhooks, sharing
your work with colleagues, or accessing your local server from different
devices - for example testing your app on mobile devices.

Because Deno's Tunnel feature creates a secure tunnel to your local server, you
don't need to worry about configuring firewalls or port forwarding.

We'll set up a simple Svelte App and show how to expose it publicly using the
tunnel feature.

## Set up an app

You can use any application that runs a local server. For this tutorial, we'll
use a simple Svelte app.

First, set up a new Svelte project:

```sh
npx sv create svelte-app
```

Select the default options for the prompts, then navigate into your new project
directory:

```sh
cd svelte-app
deno run dev
```

You should now have a Svelte app running locally at `http://localhost:5173` (or
another port if 5173 is already in use).

## Deploy your app with the Deno Deploy subcommand

We're going to deploy this project with Deno Deploy using the `deno deploy`
subcommand. This is only necessary to set us up a project url, which we'll be
able to use later to share our local server.

In your terminal, run:

```sh
deno deploy
```

Follow the prompts in your terminal to create a new Deno Deploy application, you
may need to log in to your Deno Deploy console, and select an organization if
you belong to more than one.

Deploy will automatically recognize that this is a Svelte project and set the
appropriate settings, so all we need to do is click **Create App** in the Deno
Deploy console.

## Set up vite, to allow tunneling

To allow the tunnel to work correctly with our Svelte app, we need to make a
small change to our `vite.config.js` file. Open `vite.config.js` and add a
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

## Tunnel to your local server

The tunnel feature is built into the Deno CLI. It unlocks some of the powerful
features of Deno deploy, but for your local server!

To start a tunnel to your local server, run the following command in your
project directory:

```sh
deno run --tunnel dev
```

If redirected to the browser, authenticate with your Deno Deploy account.

This command will start your local server and create a secure tunnel to it.
After a few moments, you should see output similar to this:

```sh
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
You are connected to https://my-app-name.myusername.deno.net
```

That public url (`https://my-app-name.myusername.deno.net` in this example) is
now accessible from anywhere on the internet! You can share this URL with others
to access your local Svelte app, (much like ngrok or other tunneling services).

You can make changes to your local code as normal, and the changes will be
reflected at the public URL in real-time.

## Configuring environment variables

The tunnel feature allows your pull in environment variables from your Deno
Deploy project. This is useful for testing features that rely on environment
variables locally, without sharing sensitive information.

Lets edit our Svelte app to display some environment variables and then set them
in the Deno Deploy console and use them locally.

First, lets add some TypeScript code to read environment variables in our Svelte
app. Make a new file called `src/routes/+page.server.ts` with the following
code:

```ts title="src/routes/+page.server.ts"
import type { PageServerLoad } from "./$types.d.ts";

export const load: PageServerLoad = async () => {
  return {
    message: Deno.env.get("TUTORIAL_MESSAGE") ?? "set TUTORIAL_MESSAGE",
    username: Deno.env.get("TUTORIAL_USERNAME") ?? "Svelte developer",
    accent: Deno.env.get("TUTORIAL_ACCENT") ?? "#ff3e00",
  };
};
```

This will load three environment variables: `TUTORIAL_MESSAGE`,
`TUTORIAL_USERNAME`, and `TUTORIAL_ACCENT`, or default values if they are not
set.

Then we'll modify our Svelte page to display these values:

```svelte title="src/routes/+page.svelte"
<script lang="ts">
	export let data: {
		message: string;
		username: string;
		accent: string;
	};

	const { message, username, accent } = data;
</script>

<h1>Environment variable demo</h1>
<p>
    This message is read from <code>PUBLIC_TUTORIAL_MESSAGE</code>:<br />
    <strong style="color: {accent}">{message}</strong>
</p>
<p>
    Hi <strong style="color: {accent}">{username}</strong>! Try editing your env variables and refresh the page to see the value change at build-time.
</p>
```

Finally, we need to set these environment variables in the Deno Deploy console.

Go to your Deno Deploy project dashboard, click on the **Settings** tab, then
under the **Environment Variables** section, click **Create a new Environment
Variable**.

Click **+ Add Variable** three times to add the following variables:

| Name              | Value                              |
| ----------------- | ---------------------------------- |
| TUTORIAL_MESSAGE  | This message is set in Deno Deploy |
| TUTORIAL_USERNAME | [Your Name]                        |
| TUTORIAL_ACCENT   | #0099ff                            |

Click the **Save** button to save your environment variables.

Now you can run your Svelte app with the tunnel again:

```sh
deno run --tunnel dev
```

And when you visit either the local or public URL, you should see your
environment variables reflected in the app!

You may have noticed, when creating the Environment Variables in the Deno Deploy
console, that there was a **Contexts** dropdown. This allows you to set
different environment variables for different deployment contexts, such as
Production and local.

Try creating different values for the `local` context, then run your app with
the `---tunnel` flag to see the local context values in action.
