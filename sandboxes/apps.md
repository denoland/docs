---
title: "Programmatic management of Deno Deploy Apps"
description: "Use @deno/sandbox to create, list, update, and delete Deno Deploy apps programmatically."
---

Deno Deploy apps can be created and managed programmatically with the
`@deno/sandbox` SDK. Automating these workflows helps when you need to

- spin up isolated apps for previews or QA
- keep multiple environments in sync
- integrate Deploy provisioning directly into your CI/CD
- clean up stale or unused apps on a schedule

Pass the `DENO_DEPLOY_TOKEN` environment variable, scoped to your organization,
when instantiating the client or creating a sandbox to manage apps. The `Client`
class exposes create, list, retrieve, update, and delete methods for every app
that belongs to the organization the token is scoped to.

You can find your token in the Deno Deploy console under **Sandboxes** >
**Integrate into your app**.

Click the **+ Create Token** button to generate a new token if you don't have
one yet.

## Initialize the client

Set the `DENO_DEPLOY_TOKEN` in your environment (or pass it explicitly through
the constructor options) before instantiating the client, then import and create
a new `Client` instance:

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

## Create an app

```tsx
const app = await client.apps.create({
  slug: "my-app-from-sdk",
});

console.log(app);
// {
//   id: "4416a358-4a5f-45b2-99b5-3ebcb4b63b5f",
//   slug: "my-app-from-sdk",
//   updated_at: "2025-11-25T05:29:08.777Z",
//   created_at: "2025-11-25T05:29:08.777Z"
// }
```

The `slug` is required and must be unique inside the organization. You will also
be able to provide optional metadata such as `name` and `description` as the API
evolves.

## Publish to a Deploy app from a sandbox

The `sandbox.deno.deploy()` method can be used to publish resources from a
sandbox to an existing Deno Deploy app. This allows you to use a sandbox as a
deployment pipeline for an application hosted on Deno Deploy.

```tsx
await using sandbox = await Sandbox.create();

// ... build your application ...

const app = await sandbox.deno.deploy("my-app", {
  options: {
    path: "build-output", // optional: path to the directory containing the application to deploy
    production: true, // optional: deploy to production
    build: {
      entrypoint: "server.ts", // optional: entrypoint to deploy
    },
  },
});

console.log(`${app.slug} deployed.`);
```

## List apps

```tsx
const list = await client.apps.list();
console.log(list.items); // first page (30 newest apps)

for await (const app of list) {
  console.log(app.slug); // paginated iterator
}
```

`list()` returns an async iterator that hides pagination for you. Walk the
iterator whenever you need a full inventory of apps (for example, to enforce
naming policies or find stale services). The first page contains the 30 most
recent apps.

## Retrieve an app

```tsx
const appBySlug = await client.apps.get("my-app-from-sdk");
const appById = await client.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

Fetching supports either the slug or the UUID, making it easy to use whichever
identifier you have on hand.

## Update app metadata

```tsx
const updated = await client.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  { slug: "my-cool-app" },
);
console.log(updated.slug); // "my-cool-app"
```

This is handy when a team renames a service or you want to enforce consistent
slug patterns across organizations.

## Delete an app

```tsx
await client.apps.delete("legacy-chaotic-app");
await client.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

Deleting accepts either identifier. Once removed, associated builds and routes
are cleaned up automatically.

## Handle errors in automation

When you embed these calls into CI, surface failures clearly so the pipeline can
retry or alert the team.

```tsx
try {
  await client.apps.delete("stale-feature-preview");
} catch (error) {
  if (error instanceof Sandbox.APIError && error.status === 404) {
    console.warn("App already removed, continuing");
  } else {
    throw error; // bubble up unexpected issues (auth, network, etc.)
  }
}
```

This pattern keeps scripts idempotent without hiding real problems such as
permission issues or invalid payloads.
