# Deploy a static site

This tutorial will cover how to deploy a static site (no JavaScript) on Deno
Deploy.

## **Step 1:** Create the static site

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

## **Step 2:** Create a new Deno project

1. Navigate to https://dash.deno.com/new and click the **+Empty Project** button
   under **Deploy from command line**.
2. On the next page, grab the project name, in this case `careful-goat-90`.

## **Step 3:** Deploy the static site using `deployctl`

To deploy this repo on Deno Deploy, from the `static-site` repository, run:

```console
deployctl deploy --project=careful-goat-90 jsr:@std/http@^0/file_server
```

To give a little more explanation of these commands: Because this is a static
site, there is no JavaScript to execute. Instead of giving Deno Deploy a
particular JavaScript or TypeScript file to run as the entrypoint file, you give
it this external `file_server.ts` program, which simply uploads all the static
files in the `static-site` repo, including the image and the html page, to Deno
Deploy. These static assets are then served up.

## **Step 4:** Voila!

If you go under the **Deployments** tab in the `careful-goat-90` project page,
you will see the link to this dev deployment. If you click on the url, you
should now see your html page with the "Hello" and the image.
