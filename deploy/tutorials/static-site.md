---
title: "Deploy a static site"
---

This tutorial will cover how to deploy a static site (no JavaScript) on Deno
Deploy.

## Step 1: Create the static site

```sh
mkdir static-site
cd static-site
touch index.html
```

Inside your `index.html`, paste the following html:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello</h1>
    <img src="image.png" alt="image" />
  </body>
</html>
```

Make sure that there a `image.png` inside `static-site`.

You have now a html page that says "Hello" and has a logo.

## Step 2: Deploy the static site using `deployctl`

To deploy this repo on Deno Deploy, from the `static-site` repository, run:

```console
deployctl deploy --project=<your-preferred-project-name> https://deno.land/std@0.220.0/http/file_server.ts
```

To give a little more explanation of these commands: Because this is a static
site, there is no JavaScript to execute. Instead of giving Deno Deploy a
particular JavaScript or TypeScript file to run as the entrypoint file, you give
it this external `file_server.ts` program, which simply uploads all the static
files in the `static-site` repo, including the image and the html page, to Deno
Deploy. These static assets are then served up.

## Step 3: Voila!

Your static site should now be live! Its url will be output in the terminal, or
you can manage your new static site project in your
[Deno dashboard](https://dash.deno.com/projects/). If you click through to your
new project you will be able to view the site, configure its name, environment
variables, custom domains and more.
