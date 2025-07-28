---
title: Environment Variables and Contexts
description: "Guide to managing environment variables and contexts in Deno Deploy Early Access, including variable types, creation, editing, and accessing them in your code."
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Environment variables in Deno Deploy<sup>EA</sup> allow you to configure your
application with static values such as API keys or database connection strings.

## Types of environment variables

Environment variables can be stored as:

- **Plain text**: Visible in the UI and suitable for non-sensitive values like
  feature flags
- **Secrets**: Never visible in the UI after creation, only readable from
  application code, suitable for sensitive values like API keys

Variables can be set at:

- **Application level**: Specific to a single application
- **Organization level**: Applied to all applications in the organization, but
  can be overridden by application-level variables

## Contexts

Each environment variable applies to one or more contexts. Contexts represent
the logical "environments" in which your code runs, each with its own set of
variables and secrets.

By default, there are two contexts:

- **Production**: Used for the production timeline serving production traffic
- **Development**: Used for development timelines serving non-production traffic
  (preview URLs and branch URLs)

:::info

Need additional contexts? Please contact [support](../support).

:::

Additionally, there is a **Build** context used during the build process.
Environment variables in the Build context are only available during builds and
aren't accessible in Production or Development contexts (and vice versa). This
separation enables different configuration for build-time vs. runtime.

Within a single application or organization, you cannot have multiple
environment variables with the same name in the same context. You can, however,
have variables with the same name in different non-overlapping contexts.

## Adding, editing and removing environment variables

You can manage environment variables from several locations:

- On the "New App" page while creating an application
- In the application settings under the "Environment Variables" section
- In the organization settings under the "Environment Variables" section

In each location, click the relevant edit button to open the environment
variables drawer. Changes only apply when you click "Save." Clicking "Cancel"
discards your changes.

To add a variable:

1. Click "Add Environment Variable"
2. Enter the name and value
3. Specify whether it's a secret
4. Select the contexts where it should apply

You can also bulk import variables from a `.env` file:

1. Click "+ Add from .env file"
2. Paste the contents of your `.env` file
3. Click "Import variables"

Note that lines starting with `#` are treated as comments.

To remove a variable, click the "Remove" button next to it.

To edit a variable, click the "Edit" button next to it to modify its name,
value, secret status, or applicable contexts.

## Using environment variables in your code

Access environment variables using the `Deno.env.get` API:

```ts
const myEnvVar = Deno.env.get("MY_ENV_VAR");
```

## Predefined environment variables

Deno Deploy<sup>EA</sup> provides these predefined environment variables in all
contexts:

- `DENO_DEPLOY`: `true` - Indicates that the code is running in Deno Deploy.

- `DENO_DEPLOY_ORGANIZATION_ID`: The ID of the organization that owns the
  application. This is a UUID.

- `DENO_DEPLOY_ORGANIZATION_SLUG`: The slug of the organization that owns the
  application. This is the human-readable identifier used in URLs that was set
  when creating the organization.

- `DENO_DEPLOY_APPLICATION_ID`: The ID of the application. This is a UUID.

- `DENO_DEPLOY_APPLICATION_SLUG`: The slug of the application. This is the
  human-readable identifier used in URLs that was set when creating the
  application, or changed later in the application settings.

- `DENO_DEPLOY_BUILD_ID`: The ID of the currently running build.

- `DENO_DEPLOYMENT_ID`: A unique identifier representing the entire
  configuration set (application ID, build ID, context, environment variables,
  cloud connections, database). Changes if any of these components change.

More predefined variables will be added in the future.

Note that you cannot manually set any environment variables starting with
`DENO_*` as these are reserved system variables.
