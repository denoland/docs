---
title: Environment Variables and Contexts
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

In Deno Deploy<sup>EA</sup>, environment variables can be used to configure an
application using some static values, such as API keys or database connection
strings.

Environment variables can either be stored as a plain text value, or as a
secret. Plain text values are visible from the UI and should be used for
non-sensitive values such as feature flags. Secrets are never visible from the
UI and can only be read in plain text from the application code. Secrets should
be used for sensitive values such as API keys.

Environment variables can be set either at the application level or at the
organization level. Application-level environment variables are set for a
specific application, while organization-level environment variables are set for
the entire organization. Organization-level environment variables are inherited
by all applications in the organization, but can be overridden by
application-level environment variables.

Each environment variable applies to one or more contexts. Contexts are the
logical "environments" in which your code runs. Each context has its own set of
environment variables and secrets. By default, there are two contexts:

- **Production**: The production context is used for the production timeline,
  which serves production traffic.

- **Development**: The development context is used for the development timeline,
  which serves all non-production traffic. This is used for preview URLs and
  branch URLs.

:::info

Need more contexts? Please reach out to [support](../support).

:::

Inside of an application or organization, you can not have multiple environment
variables with the same name that apply to the same context. It is possible to
have multiple environment variables with the same name that apply to different
contexts, as long as the contexts do not overlap.

## Adding, editing and removing environment variables

There are multiple places to add environment variables:

- On the "New App" page while creating a new application, by clicking on the
  "Add/Edit Environment Variables" button.

- In the application settings page in the "Environment Variables" section, by
  clicking on the "Edit" button.

- In the organization settings page in the "Environment Variables" section, by
  clicking on the "Edit" button.

The environment variables drawer will open, where you can add or remove
environment variables. Any changes made in the environment variables drawer will
be applied only once you click on the "Save" button. If you want to discard your
changes, you can click on the "Cancel" button to close the drawer without
saving.

To add a new environment variable, click on the "Add Environment Variable"
button and fill in the name, value, whether it is a secret, and the contexts in
which it should be applied.

It is also possible to bulk add multiple environment variable by importing a
`.env` file. To do this, click on the "+ Add from .env file" in the environment
variable drawer, paste in the `.env` file contents, and click "Import
variables". Lines starting with `#` are ignored as comments.

To remove an environment variable, click on the "Remove" button next to the
environment variable you want to remove.

To edit an environment variable, click on the "Edit" button next to the
environment variable you want to edit. You can change the name, value, make a
plain text variable a secret, and edit the contexts in which it should be
applied.

To save your changes, click on the "Save" button. If you want to discard your
changes, you can click on the "Cancel" button to close the drawer without
saving.

## Using environment variables in your code

Environment variables can be accessed in your code using the `Deno.env.get` API.

For example, to access the `MY_ENV_VAR` environment variable, you can use the
following code:

```ts
const myEnvVar = Deno.env.get("MY_ENV_VAR");
```

## Predefined environment variables

Deno Deploy<sup>EA</sup> provides a set of predefined environment variables that
are automatically set for each application. These environment variables are
available in all contexts and can be used to access information about the
application and the environment in which it is running.

- `DENO_DEPLOYMENT_ID` - A unique identifier that represents the entire set of
  configuration that the application is running in. This includes the
  application ID, the revision ID, the context, and any applicable environment
  variables. This value changes if any of the above change.

- `DENO_REVISION_ID` - The revision ID that is currently running.

More predefined environment variables will be added in the future.

It is not possible to manually set any environment variables that start with
`DENO_*`. These environment variables are set by Deno Deploy<sup>EA</sup> and
are read-only.
