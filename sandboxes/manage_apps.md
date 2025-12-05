---
title: "Manage Deploy Apps"
description: "Use the @deno/sandbox Client to create, list, update, and delete Deploy apps programmatically."
---

Beyond provisioning microVMs, the `@deno/sandbox` SDK exposes a `Client` class
for managing Deploy apps inside your organization. This is useful when you need
automation around onboarding teams, cloning environments, or cleaning up unused
apps without visiting the dashboard.

## Getting started

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

The client uses the same `DENO_DEPLOY_TOKEN` environment variable as
`Sandbox.create()`. Provide tokens scoped to the organization you want to
manage.

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

Provide additional fields (e.g., `name`, `description`) as the API evolves.

## List apps

```tsx
const list = await client.apps.list();
console.log(list.items); // first page (30 newest apps)

for await (const app of list) {
  console.log(app.slug); // paginated iterator
}
```

Use the async iterator to walk every app in the organization without managing
cursors yourself.

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

## Publish to a Deploy app from a sandbox

The `sandbox.deploy()` method can be used to publish resources from a sandbox to
an existing Deno Deploy app. This allows you to use a sandbox as a deployment
pipeline for an application hosted on Deno Deploy.

```tsx
await using sandbox = await Sandbox.create();

// ... build your application ...

const app = await sandbox.deploy({
  name: "my-app",
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

## Tips

- Maintain a dedicated automation token with least privilege for management
  scripts.
- Pair these APIs with `sandbox.deploy()` to seed apps from sandbox experiments
  and then continue managing them over time.
- Log every change (slug renames, deletions) so you have an audit trail outside
  of the dashboard.
