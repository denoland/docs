# Basic Fresh site

This tutorial will cover how to deploy a Fresh application on Deno Deploy.

Fresh is a web framework built for Deno, akin to Express for Node.

## **Step 1:** Create Fresh application

```sh
deno run -A -r https://fresh.deno.dev fresh-site
```

To run this application locally:

```sh
deno task start
```

You can edit `routes/index.js` to modify the application.

## **Step 2:** Create a new Github repo and link your local Fresh application.

1. Create a new Github repo and record the git repo remote URL
2. From your local `fresh-site`, initialize git and push to the new remote repo:

   ```sh
   git init
   git add .
   git commit -m "First commit"
   git remote add <remote-url>
   git push origin main
   ```

## **Step 3:** Deploy to Deno Deploy

1. Navigate to https://dash.deno.com/new and click the **+New Project** button.
2. On the next page, choose the **Deploy from Github repository** card.
3. To fill in the values on the form, choose:
   - the new `fresh-site` Github repo that you just created
     - automatic (fastest)
   - `main` branch
   - `main.ts` as the entrypoint file
