---
title: "Deploy a React app with Vite"
oldUrl:
  - /deploy/docs/vite/
  - /deploy/manual/vite
---

This tutorial covers how to deploy a Vite Deno and React app on Deno Deploy.

## Step 1: Create a Vite app

Let's use [Vite](https://vitejs.dev/) to quickly scaffold a Deno and React app:

```sh
deno run -RWE npm:create-vite-extra@latest
```

We'll name our project `vite-project`. Be sure to select `deno-react` in the
project configuration.

Then, `cd` into the newly created project folder.

## Step 2: Run the repo locally

To see and edit your new project locally you can run:

```sh
deno task dev
```

## Step 3: Deploy your project with Deno Deploy

Now that we have everything in place, let's deploy your new project!

1. In your browser, visit [Deno Deploy](https://dash.deno.com/new_project) and
   link your GitHub account.
2. Select the repository which contains your new Vite project.
3. You can give your project a name or allow Deno to generate one for you.
4. Select **Vite** from the **Framework Preset** dropdown. This will populate
   the **Entrypoint** form field.
5. Leave the **Install step** empty.
6. Set the **Build step** to `deno task build`.
7. Set the **Root directory** to `dist`
8. Click **Deploy Project**

> NB. The entrypoint that is set will be `jsr:@std/http/file-server`. Note that
> this is not a file that exists in the Vite repo itself. Instead, it is an
> external program. When run, this program uploads all the static asset files in
> your current repo (`vite-project/dist`) to Deno Deploy. Then when you navigate
> to the deployment URL, it serves up the local directory.

### `deployctl`

Alternatively, you can use `deployctl` directly to deploy `vite-project` to Deno
Deploy.

```console
cd /dist
deployctl deploy --project=<project-name> --entrypoint=jsr:@std/http/file-server
```
