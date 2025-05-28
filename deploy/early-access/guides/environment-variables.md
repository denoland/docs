---
title: "Working with Environment Variables"
description: "Guide to managing environment variables in Deno Deploy Early Access, including best practices for development and production contexts, organization-level variables, and secrets management."
---

:::info

You are viewing the documentation for Deploy Early Access. Looking for Deploy
Classic documentation? [View it here](/deploy/).

:::

# Working with Environment Variables

Environment variables allow you to configure your application with dynamic
values without hardcoding them in your source code. This guide covers best
practices for managing environment variables in Deno Deploy<sup>EA</sup>.

## Understanding Contexts

In Deno Deploy<sup>EA</sup>, environment variables are applied to specific
contexts:

- **Production**: Used for the production timeline serving production traffic
- **Development**: Used for development timelines, including preview URLs and
  branch deployments

This separation allows you to use different configurations for your production
and development environments.

## Adding Environment Variables

### During Application Creation

1. On the "New App" page, click "Add/Edit Environment Variables"
2. In the drawer, click "Add Environment Variable"
3. Enter a name and value
4. Choose whether it should be a plain text variable or a secret
5. Select which contexts the variable should apply to
6. Click "Save"

### For Existing Applications

1. Navigate to the application settings page
2. Find the "Environment Variables" section
3. Click "Edit"
4. Add, modify, or remove variables as needed
5. Click "Save" to apply your changes

### At the Organization Level

Organization-level environment variables apply to all applications in the
organization:

1. Navigate to the organization settings page
2. Find the "Environment Variables" section
3. Click "Edit"
4. Add, modify, or remove variables as needed
5. Click "Save" to apply your changes

> **Note**: Application-level environment variables override organization-level
> variables with the same name.

## Plain Text vs. Secrets

- **Plain Text Variables**: Visible in the UI, suitable for non-sensitive
  configuration
- **Secrets**: Never displayed in the UI after creation, suitable for API keys,
  tokens, and other sensitive data

To convert a plain text variable to a secret, edit the variable and toggle the
"Secret" option.

## Bulk Import from .env Files

When creating a new application, you can bulk import environment variables:

1. Click "Add/Edit Environment Variables"
2. In the drawer, click in the text area
3. Paste the contents of your .env file
4. Configure context settings for the imported variables
5. Click "Save"

## Using Environment Variables in Your Code

Access environment variables in your code with `Deno.env.get`:

```typescript
// Reading an environment variable
const apiKey = Deno.env.get("API_KEY");

// Using it with a default value
const port = parseInt(Deno.env.get("PORT") || "8000");
```

## Best Practices

1. **Use contexts appropriately**:
   - Development variables for feature flags, debug settings, and test endpoints
   - Production variables for live API endpoints, production database URLs, etc.

2. **Store sensitive information as secrets**:
   - API keys
   - Authentication tokens
   - Database credentials
   - Private keys

3. **Use organization-level variables** for common configuration shared across
   applications

4. **Use descriptive names** that indicate the purpose of the variable

5. **Document your environment variables** for other team members

## Predefined Environment Variables

Deno Deploy<sup>EA</sup> automatically provides these environment variables:

- `DENO_DEPLOYMENT_ID`: Unique identifier for the current deployment
  configuration
- `DENO_REVISION_ID`: The ID of the currently running revision

> **Note**: You cannot manually set any environment variables that start with
> `DENO_*`.

## Troubleshooting

- **Variable not available in runtime**: Check that it's assigned to the correct
  context
- **Organization variable not working**: Check for an application-level variable
  with the same name that's overriding it
- **Value changes not taking effect**: Environment variable changes require a
  new deployment to take effect

For additional help with environment variables,
[contact Deno support](../../support).
