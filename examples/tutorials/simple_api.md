---
title: "Simple API server"
url: /examples/simple_api_tutorial/
oldUrl:
  - /deploy/tutorials/simple-api/
  - /deploy/docs/simple-api/
---

Deno makes it easy to build lightweight, standards-based HTTP APIs using just
the Web Platform primitives (Request, Response, fetch) with built‑in data
storage in KV. In this tutorial you'll build and deploy a small link shortener
backed by Deno KV, then push it to production on Deno Deploy.

We'll implement a simple link shortener service using
[Deno KV](/deploy/kv/manual). The modern Deno runtime provides `Deno.serve()`
which starts an HTTP server with zero configuration.

## Create a local API server

Make a new directory for your project and run `deno init` to create a basic Deno
project.

Update the `main.ts` file with the following code:

```ts title="main.ts"
const kv = await Deno.openKv();

interface CreateLinkBody {
  slug: string;
  url: string;
}

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-_]{1,40}$/.test(slug);
}

export function handler(req: Request): Promise<Response> | Response {
  return (async () => {
    // Basic CORS support (optional – remove if not needed)
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    if (req.method === "POST") {
      let body: CreateLinkBody;
      try {
        body = await req.json();
      } catch {
        return json({ error: "Invalid JSON body" }, { status: 400 });
      }

      const { slug, url } = body;
      if (!slug || !url) {
        return json({ error: "'slug' and 'url' are required" }, {
          status: 400,
        });
      }
      if (!isValidSlug(slug)) {
        return json({ error: "Invalid slug format" }, { status: 422 });
      }
      try {
        new URL(url);
      } catch {
        return json({ error: "'url' must be an absolute URL" }, {
          status: 422,
        });
      }

      // Prevent overwriting an existing slug using an atomic check
      const key = ["links", slug];
      const txResult = await kv.atomic().check({ key, versionstamp: null }).set(
        key,
        url,
      ).commit();
      if (!txResult.ok) {
        return json({ error: "Slug already exists" }, { status: 409 });
      }
      return json({ slug, url }, { status: 201 });
    }

    // Redirect short links – extract slug from pathname
    const slug = new URL(req.url).pathname.slice(1); // remove leading '/'
    if (!slug) {
      return json({
        message: "Provide a slug in the path or POST to create one.",
      }, { status: 400 });
    }
    const result = await kv.get<[string] | string>(["links", slug]);
    const target = result.value as string | null;
    if (!target) {
      return json({ error: "Slug not found" }, { status: 404 });
    }
    return Response.redirect(target, 301);
  })();
}

export function startServer(port = 8000) {
  return Deno.serve({ port }, handler);
}

startServer();
```

## Run and test your server locally

Update the `dev` task in the `deno.json` file to allow network permissions and
add the `--unstable-kv` flag to allow using Deno KV locally:

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --unstable-kv -N main.ts"
  }
}
```

Now you can run your server with:

```sh
deno task dev
```

> For rapid iteration you could grant all permissions (`-A`) instead of just
> network (`-N`), but we do not recommend this for production environments.

### Test your API server

This server will respond to HTTP `GET` and `POST` requests. The `POST` handler
expects to receive a JSON document in request the body with `slug` and `url`
properties. The `slug` is the short URL component, and the `url` is the full URL
you want to redirect to.

Here's an example of creating a short link with cURL (expects a 201 Created
response):

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/","slug":"denodocs"}' \
  http://localhost:8000/
```

In response, the server returns JSON describing the stored link:

```json
{ "slug": "denodocs", "url": "https://docs.deno.com/" }
```

If you try to run the curl to create the same slug again you'll get a 409
Conflict:

```json
{ "error": "Slug already exists" }
```

A `GET` request to our server will take a URL slug as a path parameter, and
redirect to the provided URL. You can visit this URL in the browser, or make
another cURL request to see this in action!

```shell
curl -v http://localhost:8000/denodocs
```

## Deploy your API server

::: Deno Deploy account required

You will need an account on Deno Deploy to complete this section. If you haven't
already, [sign up for a free Deno Deploy account](https://console.deno.com/).

:::

### Provision a KV database on Deno Deploy

First, we will 'provision' a KV database in Deno Deploy for our deployed app to
use.

1. Visit [Deno Deploy](https://console.deno.com/) and click on the "Databases"
   tab.
2. Click the "+ Provision database" button.
3. Click the "Provision" button to create a free KV database.
4. Give your database an identifying slug, select a region and click "Provision
   Database".

### Deploy your server

Deploy your server with the following command:

```sh
deno deploy
```

This will briefly redirect you to a browser to authenticate with your Deno
Deploy account, once authenticated, return to your terminal.

1. Select an organization (if you belong to more than one).
2. Select 'Create a new application'.
3. Return to the browser to see your new project and give it a name.
4. Click "Create App".
5. Once created, click on the "Timelines" menu item on the left side.
6. Click "Manage" next to the Databases section.
7. Find the KV database you created earlier and click "Assign".
8. Select your newly created app.
9. Click on the app name in the "Assignments" column to return to your app.
10. Click on the recent deployment link (which will have failed because it has
    no KV assigned).
11. Click the "Retry Build" button to redeploy your app with the KV database
    assigned.

Once successfully built, in the "Overview" tab, you will see your Production
URL, you can now use this with your curl commands to test your deployed API.

## Test out your new link shortener

Without any additional configuration (Deno KV just works on Deploy), your app
should run the same as it did on your local machine.

You can add new links using the `POST` handler as you did before. Just replace
the `localhost` URL with your live production URL on Deno Deploy:

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/runtime/","slug":"denodocs"}' \
  https://your-project.yourusername.deno.net/
```

Similarly, you can visit your shortened URLs in the browser, or view the
redirect coming back with a cURL command:

```shell
curl -v https://your-project.yourusername.deno.net/denodocs
```

🦕 Now you know how to make a basic API with Deno and how to deploy it to Deno
Deploy. Now that you have a working url shortener, you could consider making a
frontend for it to allow users to create and manage their short links. Take a
look at our (web
frameworks)[/frameworks](/examples/#web-frameworks-and-libraries) page for some
ideas on how to get started!
