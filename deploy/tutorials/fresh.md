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
   git remote add origin <remote-url>
   git push origin main
   ```

## **Step 3:** Deploy to Deno Deploy

1. Navigate to
   [https://dash.deno.com/new_project](https://dash.deno.com/new_project).
2. Connect to your GitHub account and select your repository.
3. Fill in the values on the form:
   - Give your project a name
   - Select `Fresh` from the "Framework Preset" options
   - Set production branch to `main`
   - Select `main.ts` as the entrypoint file
4. Click "Deploy Project" to kick off Deno Deploy.
5. Once deployed, you can view your new project at url provided in your project
   dashboard.
