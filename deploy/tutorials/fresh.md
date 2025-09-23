---
title: "Basic Fresh site"
oldUrl:
  - /deploy/docs/fresh/
---

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
   [https://console.deno.com/](https://console.deno.com/).
2. Sign in with your GitHub account click "+ New app".
3. Choose the repository you created in Step 2.
4. Fill in the values on the form:
   - Give your project a name
   - Select `main.ts` as the entrypoint in the app configuration settings
5. Click "Deploy Project" to kick off Deno Deploy.
6. Once deployed, you can view your new project at url provided in your project
   dashboard.
