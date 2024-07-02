---
title: "Deploying Deno to Cloudflare Workers"
---

Cloudflare Workers allows you to run JavaScript on Cloudflare's edge network.

This is a short How To guide on deploying a Deno function to Cloudflare Workers.

Note: You would only be able to deploy
[Module Workers](https://developers.cloudflare.com/workers/learning/migrating-to-module-workers/)
instead of web servers or apps.

## Setup `denoflare`

In order to deploy Deno to Cloudflare, we'll use this community created CLI
[`denoflare`](https://denoflare.dev/).

[Install it](https://denoflare.dev/cli/#installation):

```shell
deno install --unstable --allow-read --allow-net --allow-env --allow-run --name denoflare --force \
https://raw.githubusercontent.com/skymethod/denoflare/v0.5.11/cli/cli.ts
```

## Create your function

In a new directory, let's create a `main.ts` file, which will contain our Module
Worker function:

```ts
export default {
  fetch(request: Request): Response {
    return new Response("Hello, world!");
  },
};
```

At the very minimum, a Module Worker function must `export default` an object
that exposes a `fetch` function, which returns a `Response` object.

You can test this locally by running:

```shell
denoflare serve main.ts
```

If you go to `localhost:8080` in your browser, you'll see the response will say:

```console
Hello, world!
```

## Configure `.denoflare`

The next step is to create a `.denoflare` config file. In it, let's add:

```json
{
  "$schema": "https://raw.githubusercontent.com/skymethod/denoflare/v0.5.11/common/config.schema.json",
  "scripts": {
    "main": {
      "path": "/absolute/path/to/main.ts",
      "localPort": 8000
    }
  },
  "profiles": {
    "myprofile": {
      "accountId": "abcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "apiToken": "abcxxxxxxxxx_-yyyyyyyyyyyy-11-dddddddd"
    }
  }
}
```

You can find your `accountId` by going to your
[Cloudflare dashboard](https://dash.cloudflare.com/), clicking "Workers", and
finding "Account ID" on the right side.

You can generate an `apiToken` from your
[Cloudflare API Tokens settings](https://dash.cloudflare.com/profile/api-tokens).
When you create an API token, be sure to use the template "Edit Cloudflare
Workers".

After you add both to your `.denoflare` config, let's try pushing it to
Cloudflare:

```console
denoflare push main
```

Next, you can view your new function in your Cloudflare account:

![New function on Cloudflare Workers](../../images/how-to/cloudflare-workers/main-on-cloudflare.png)

Boom!
