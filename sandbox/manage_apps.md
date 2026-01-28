---
title: "Manage Deploy Apps"
description: "Use the @deno/sandbox Client to create, list, update, and delete Deploy apps programmatically."
---

Beyond provisioning microVMs, the SDK provides APIs for managing Deploy apps
inside your organization. This is useful when you need automation around
onboarding teams, cloning environments, or cleaning up unused apps without
visiting the dashboard.

## Getting started

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()
```

</deno-tab>
</deno-tabs>

The SDK uses the same `DENO_DEPLOY_TOKEN` environment variable for
authentication. Provide tokens scoped to the organization you want to manage.

## Create an app

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

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

</deno-tab>
<deno-tab value="python" label="Python">

```py
app = sdk.apps.create(slug="my-app-from-sdk")

print(app)
# {
#   "id": "4416a358-4a5f-45b2-99b5-3ebcb4b63b5f",
#   "slug": "my-app-from-sdk",
#   "updated_at": "2025-11-25T05:29:08.777Z",
#   "created_at": "2025-11-25T05:29:08.777Z"
# }
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
app = await sdk.apps.create(slug="my-app-from-sdk")

print(app)
# {
#   "id": "4416a358-4a5f-45b2-99b5-3ebcb4b63b5f",
#   "slug": "my-app-from-sdk",
#   "updated_at": "2025-11-25T05:29:08.777Z",
#   "created_at": "2025-11-25T05:29:08.777Z"
# }
```

</deno-tab>
</deno-tabs>

Provide additional fields (e.g., `name`, `description`) as the API evolves.

## List apps

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const list = await client.apps.list();
console.log(list.items); // first page (30 newest apps)

for await (const app of list) {
  console.log(app.slug); // paginated iterator
}
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
page = sdk.apps.list()
print(page.items)  # first page (30 newest apps)

for item in page.items:
  print(item["slug"])
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
page = await sdk.apps.list()
print(page.items)  # first page (30 newest apps)

async for item in page:
  print(item["slug"])  # paginated iterator
```

</deno-tab>
</deno-tabs>

Use iteration to walk every app in the organization without managing cursors
yourself.

## Retrieve an app

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const appBySlug = await client.apps.get("my-app-from-sdk");
const appById = await client.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
app_by_slug = sdk.apps.get("my-app-from-sdk")
app_by_id = sdk.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
app_by_slug = await sdk.apps.get("my-app-from-sdk")
app_by_id = await sdk.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
</deno-tabs>

Fetching supports either the slug or the UUID, making it easy to use whichever
identifier you have on hand.

## Update app metadata

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const updated = await client.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  { slug: "my-cool-app" },
);
console.log(updated.slug); // "my-cool-app"
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
updated = sdk.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  slug="my-cool-app"
)
print(updated["slug"])  # "my-cool-app"
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
updated = await sdk.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  slug="my-cool-app"
)
print(updated["slug"])  # "my-cool-app"
```

</deno-tab>
</deno-tabs>

This is handy when a team renames a service or you want to enforce consistent
slug patterns across organizations.

## Delete an app

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await client.apps.delete("legacy-chaotic-app");
await client.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk.apps.delete("legacy-chaotic-app")
sdk.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
await sdk.apps.delete("legacy-chaotic-app")
await sdk.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
</deno-tabs>

Deleting accepts either identifier. Once removed, associated builds and routes
are cleaned up automatically.

## Publish to a Deploy app from a sandbox

The `sandbox.deno.deploy()` method can be used to publish resources from a
sandbox to an existing Deno Deploy app. This allows you to use a sandbox as a
deployment pipeline for an application hosted on Deno Deploy.

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

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

console.log(`Deployed to ${app.slug}`);
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create() as sandbox:
  # ... build your application ...

  build = sandbox.deno.deploy(
    "my-app",
    path="build-output",  # optional: path to the directory containing the application to deploy
    production=True,  # optional: deploy to production
    entrypoint="server.ts",  # optional: entrypoint to deploy
  )

  print(f"Deployed revision ID: {build.id}")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create() as sandbox:
  # ... build your application ...

  build = await sandbox.deno.deploy(
    "my-app",
    path="build-output",  # optional: path to the directory containing the application to deploy
    production=True,  # optional: deploy to production
    entrypoint="server.ts",  # optional: entrypoint to deploy
  )

  print(f"Deployed revision ID: {build.id}")
```

</deno-tab>
</deno-tabs>

## Tips

- Maintain a dedicated automation token with least privilege for management
  scripts.
- Pair these APIs with `sandbox.deno.deploy()` to seed apps from sandbox
  experiments and then continue managing them over time.
- Log every change (slug renames, deletions) so you have an audit trail outside
  of the dashboard.
