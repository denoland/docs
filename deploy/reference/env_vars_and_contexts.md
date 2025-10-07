---
title: Environment Variables and Contexts
description: "Guide to managing environment variables and contexts in Deno Deploy, including variable types, creation, editing, and accessing them in your code."
oldUrl: /deploy/reference/env-vars-and-contexts/
---

Environment variables in Deno Deploy allow you to configure your application
with static values such as API keys or database connection strings.

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

<!--
## Exposing an environment variable as a file

Environment variables can be exposed as a file instead of a regular environment
variable by toggling the "Expose as file" option.

When this option is enabled, the environment variable's value is stored in a
temporary file in the application's file system. The environment variable then
contains the file path to this temporary file instead of the value itself.

To read the value, you can use the `Deno.readTextFile` API in combination with
`Deno.env.get`:

```ts
// Assuming MY_ENV_VAR is set to expose as a file
const value = await Deno.readTextFile(Deno.env.get("MY_ENV_VAR"));
```

This is useful for values that are too large for environment variables or when
you want to avoid exposing sensitive data in the environment variable list.

Additionally it is useful for preexisting applications that expect certain
environment variables to point to files, such as `PGSSLROOTCERT` for Postgres CA
certificates. -->

## Limits

Environment variables have the following limits:

- Environment variable keys can be at most 128 bytes long.\
- Environment variable keys can not start with:
  - `DENO_`, except for `DENO_AUTH_TOKENS`, `DENO_COMPAT`, `DENO_CONDITIONS`,
    `DENO_DEPLOY_ENDPOINT`, or `DENO_DEPLOY_TOKEN`
  - `LD_`
  - `OTEL_`
- Environment variable values can be at most 16 KB (16,384 bytes) long.
- Environment variable keys can not be any of these keys. Instead, use
  [Cloud Connections](/deploy/reference/cloud_connections)
  - `AWS_ROLE_ARN`
  - `AWS_WEB_IDENTITY_TOKEN_FILE`
  - `GCP_WORKLOAD_PROVIDER_ID`
  - `GCP_SERVICE_ACCOUNT_EMAIL`
  - `GCP_PROJECT_ID`
  - `AZURE_CLIENT_ID`
  - `AZURE_TENANT_ID`
  - `AZURE_FEDERATED_TOKEN_FILE`

## Predefined environment variables

Deno Deploy provides these predefined environment variables in all contexts:

- `DENO_DEPLOY=1`: Indicates that the application is running in the Deno Deploy
  environment.

- `DENO_DEPLOYMENT_ID`: A unique identifier representing the entire
  configuration set (application ID, revision ID, context, and environment
  variables). Changes if any of these components change.

- `DENO_DEPLOY_ORG_ID`: The ID of the organization the application belongs to.

- `DENO_DEPLOY_ORG_SLUG`: The slug of the organization the application belongs
  to.

- `DENO_DEPLOY_APP_ID`: The ID of the application.

- `DENO_DEPLOY_APP_SLUG`: The slug of the application.

- `DENO_DEPLOY_BUILD_ID`: The ID of the currently running revision.

During builds, the environment variable `CI=1` is additionally set.
