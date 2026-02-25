---
title: "Programmatic management of Deno Deploy Apps"
description: "Use the @deno/sandbox Client to create, list, update, and delete Deno Deploy apps programmatically."
---

Beyond provisioning microVMs, the SDK provides APIs for creating and managing
Deploy apps inside your organization. Automating these workflows can help when
you need to:

- spin up isolated apps for previews or QA
- keep multiple environments in sync
- integrate Deploy provisioning directly into your CI/CD
- clean up stale or unused apps on a schedule

The SDK wraps the [Deno Deploy REST API](https://console.deno.com/api/v2/docs).

## Getting started

### Authentication

You will need a Deno Deploy API token with appropriate permissions to manage
apps. You can find your token in the Deno Deploy console under **Sandboxes** >
**Integrate into your app**.

Click the **+ Create Token** button to generate a new token if you don't have
one yet.

Pass the `DENO_DEPLOY_TOKEN` environment variable, scoped to your organization,
when instantiating the client or creating a sandbox to manage apps. The `Client`
class exposes create, list, retrieve, update, and delete methods for every app
that belongs to the organization the token is scoped to.

### Initialize the client

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

The `slug` is required and must be unique inside the organization. You will also
be able to provide optional metadata such as `name` and `description` as the API
evolves.

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
