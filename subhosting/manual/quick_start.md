---
title: Subhosting Quick Start
oldUrl:
- /deploy/manual/subhosting/projects_and_deployments/
---

Looking for the smallest possible example that shows how to deploy code to
Deno's isolate cloud? We've got you covered below, or you can skip to the
[more detailed getting started guide](#getting-started-with-subhosting).

```ts
// 1.) Get API access info ready
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

// 2.) Create a new project
const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: null, // randomly generates project name
  }),
});

const project = await pr.json();

// 3.) Deploy a "hello world" server to the new project
const dr = await fetch(`${API}/projects/${project.id}/deployments`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content":
          `export default { async fetch(req) { return new Response("Hello, World!"); } }`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  }),
});

const deployment = await dr.json();

console.log(dr.status);
console.log(
  "Visit your site here:",
  `https://${project.name}-${deployment.id}.deno.dev`,
);
```

## Getting started with subhosting

To get started with subhosting, you will need to create an organization in the
[Deno Deploy dashboard](https://dash.deno.com/orgs/new). Follow the on-screen
instructions to create a new organization for subhosting.

Going through the onboarding flow, you will likely also generate an **access
token**, which you will use to access the [REST API](../api/index.md). If you
didn't do this (or your token has expired), you can
[generate a new one here](https://dash.deno.com/account#access-tokens).

:::caution Save your token in a safe place

Once you generate an access token, **it will not be displayed again within the
Deploy dashboard UI**. Make sure you store this token in a safe place.

:::

## Set up a test environment

In the tutorial pages to follow, we will assume you are interacting with the
Deploy REST API through Deno scripts (TypeScript code), and will show examples
of interacting with the API in this way. However, the techniques shown here will
also work in any other environment capable of executing HTTP requests.

The example code shown here and in future chapters assume that you have
[Deno 1.38 or higher](/runtime/getting_started/installation) installed.

When working with a REST API, it is useful to store authentication credentials
in the [system environment](/runtime/reference/env_variables), to prevent
you from accidentally checking them in to source control.

For this tutorial, we'll use the new `--env` flag
[introduced in Deno 1.38](https://deno.com/blog/v1.38#deno-run---env) to manage
environment variables. On your local computer, create a new directory to store
our management scripts in, and create three files:

- `.env` - to hold our API access info
- `.gitignore` - to ignore our `.env` file so we don't put it in source control
  by mistake
- `create_project.ts` - a file we'll use in a moment to make our first request
  to the REST API

### Configure a `.env` file and `.gitignore` file

First, store your [access token](https://dash.deno.com/account#access-tokens)
and organization ID in the `.env` file you created earlier.

```bash title=".env"
DEPLOY_ACCESS_TOKEN=your_token_here
DEPLOY_ORG_ID=your_org_id_here
```

Replace the values in the file with the values from your own Deploy account.

Next, create a `.gitignore` file just to ensure we don't accidentally check our
`.env` file into source control:

```bash title=".gitignore"
# Ignore this file in git
.env

# Optional: ignore this junk file often generated on mac OS
.DS_Store
```

Now that we have our credentials set up, let's write some code to access the
REST API.

## Creating our first project

In order to do anything interesting with subhosting or the REST API, we'll need
to
[create a project](https://apidocs.deno.com/#get-/projects/-projectId-/deployments).
Copy the code below into a file named `create_project.ts` in the same file as
your `.env` and `.gitignore` file.

```ts title="create_project.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";

// Create a new project
const res = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: null, // randomly generates project name
  }),
});

const project = await res.json();
console.log(project);
```

Execute this code with the following command in a terminal:

```bash
deno run -A --env create_project.ts
```

If everything goes according to plan, you should see output that looks something
like this:

```console
{
  id: "f084712a-b23b-4aba-accc-3c2de0bfa26a",
  name: "strong-fox-44",
  createdAt: "2023-11-07T01:01:14.078730Z",
  updatedAt: "2023-11-07T01:01:14.078730Z"
}
```

Note the `id` of the project that was returned with this response - this is the
project ID we'll use in the next step.

Now that we have REST API access configured and a project set up, we can move on
to [creating our first deployment](./planning_your_implementation).
