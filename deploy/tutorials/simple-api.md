# Simple API server

This tutorial will cover how to deploy a simple API on Deno Deploy.

## **Step 1:** Write the API in a local file

```js
// simple_api.js

import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

serve((req: Request) => new Response("Hello World"));
```

This is a basic web server, and you can run it locally with:

```sh
deno run -A simple_api.js
```

This brings the server up on `localhost:5000`.

To deploy this server on Deno Deploy, you can use the Github integration.

```sh
git init
git add .
```

## **Step 2:** Create a new Github repo and push the local file to the Github repo

1. Create a new Github repo and record the git repo remote URL
2. From the local repo where `simple_api.js` resides, initialize git and push to
   the new remote repo:

   ```sh
   git init
   git add simple_api.js
   git commit -m "First commit"
   git remote add <remote-url>
   git push origin main
   ```

You now have a new Github repo with exactly one file in it.

## **Step 3:** Deploy to Deno Deploy

1. Navigate to https://dash.deno.com/ and click the **New Project** button.
2. On the next page, choose the **Deploy from Github repository** card.
3. To fill in the values on the form, choose:
   - the new Github repo that you just created
     - automatic (fastest)
   - `main` branch
   - `simple_api.js` as the entrypoint file

This downloads all dependencies of `simple_api.js`, caches them, and gives you
an API at `localhost:8000` that responds with "Hello World".
