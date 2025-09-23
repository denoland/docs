---
title: "Deploy a static site"
oldUrl:
  - /deploy/docs/static-site/
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

## Step 2: Deploy the static site using `deno deploy`

To deploy this repo on Deno Deploy, from the `static-site` repository, run:

```console
deno deploy
```

You will be prompted to login to Deno Deploy if you haven't already, check your browser for a login prompt. 

Once logged in, return to your terminal and select an organization to deploy to, then choose "Create a new project".

Return to your browser to give your app a name, and set up the build configuration.

Click "Edit build config" and then under the "Static Site" tab, set the "Static Directory" to `static-site` (the current directory).

Close the config modal, and then click "Create App" to start the deployment process. Your site will deploy and you should see a new deployment url to visit your new static site in the browser.

## Step 3: Voila!

Your static site should now be live! Its url will be output in the terminal, or
you can manage your new static site project in your
[Deno dashboard](https://console.deno.com/). If you click through to your
new project you will be able to view the site, configure its name, environment
variables, custom domains and more.
