# Projects and deployments

In the [domain model for subhosting](./index.md), a **project** is a container
for **deployments**. You can track aggregate analytics for a project (like how
many requests are being processed, KV database usage, etc). But actual code that
runs and serves requests is contained in a **deployment**. Depending on the data
model for your application, you might choose to map projects and deployments in
different ways.

## Planning your implementation

For example - let's say that you were building a SaaS CRM platform like
Salesforce, and you wanted to empower your customers to write JavaScript code
that would be executed every time a new lead was captured.

If you were going to implement this feature using Deno Deploy, here's how you
might think about building it:

- Create a **project** and associate that project with a customer account in
  your database. This would allow you to track usage incurred by each customer,
  and potentially bill them for that usage, using analytics information about
  the project.
- Create a **deployment** that contains the code your end user provided, which
  should be run when a new lead is created.
- Using multiple deployments in the same project, you could implement "staging"
  or "production" versions of the event handling logic.
- Your CRM software would communicate with your end user's code by sending an
  HTTP request to a deployment and awaiting a response.
- In the future, if you wanted to support writing code for other events in your
  CRM (like creating a new contact, or to send automated reports every night),
  you could create a project for each of those events, and use a flow like the
  one described above for each.

Let's look at an example of the API endpoint required to make this happen.

## Creating a deployment for a project

In the [previous chapter](./getting_started.md), you created a new project and
noted its `id` property. In the example in the previous chapter, the ID was:

```
f084712a-b23b-4aba-accc-3c2de0bfa26a
```

You can use a project identifier to
[create a deployment](../../api/rest/deployments.md) for that project. Create a
new file called `create_deployment.ts` and include the following code to create
a new "hello world" deployment for your project.

```ts title="create_deployment.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const API = "https://api.deno.com/v1";

// Replace with your desired project ID
const projectId = "f084712a-b23b-4aba-accc-3c2de0bfa26a";

// Create a new deployment
const res = await fetch(`${API}/projects/${projectId}/deployments`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content": `Deno.serve(() => new Response("Hello, World!"));`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  }),
});

console.log(res.status);
```

If you run this script with the following command:

```bash
deno run -A --env create_deployment.ts
```

You should soon have a simple "Hello World!" server live on a public URL,
visible from your Deno Deploy dashboard.

## Parts of a deployment

The example above showed a very simple example of a deployment. A more complex
deployment might include some or all of these components, fully described
[here in the API docs](../../api/rest/deployments.md).

- **Assets:** TypeScript or JavaScript source files, images, JSON documents -
  code and static files that make your deployment run. These files can be
  encoded in the JSON you upload to the server using `utf-8` (for plain source
  files) or `base64` for images and other text files. In addition to actual
  files, you can also include symbolic links to other files.
- **Entry point URL:** A file path to an asset (a TypeScript or JavaScript file)
  from the collection above that should be executed to start a server in your
  deployment.
- **Environment variables:** You can specify values that should exist in the
  system environment, to be retrieved by `Deno.env.get`.
- **Database ID:** The identifier for a Deno KV database that should be made
  available to this deployment.
- **Compiler options:** A set of options that should be used to interpret
  TypeScript code.

## Custom domains

After a deployment is created, it is assigned a generated URL. That may be fine
for some scenarios, but often you'll want to associate a custom domain with your
deployments as well.
[Check out the API reference for domains](../../api/rest/domains.md).
