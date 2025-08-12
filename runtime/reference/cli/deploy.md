---
title: "`deno deploy`"
command: deploy
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno deploy"
description: "Manage and publish your projects on the web"
---

## Overview

The `deno deploy` command provides a command line interface for managing and
deploying applications to [Deno Deploy EA](https://deno.com/deploy), Deno's
platform for hosting for JavaScript, TypeScript, and WebAssembly applications.

When called without any subcommands, `deno deploy` will deploy your local
directory to the specified application.

## Authentication

The deploy command uses secure token-based authentication stored in your
system's keyring:

- **Automatic Authentication**: The CLI will prompt for authentication when
  needed
- **Token Storage**: Deploy tokens are securely stored using the system keyring
- **Token Management**: The CLI provides operations to get, set, and delete
  authentication tokens.

## Global Options

- `-h, --help` - Show help information
- `--org <name>` - Specify the organization name
- `--app <name>` - Specify the application name
- `--prod` - Deploy directly to production

## Subcommands

### Create Application

Creates a new application in Deno Deploy.

```bash
deno deploy create [root-path]
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization to create the application for

```bash
deno deploy create --org my-organization
```

### Environment Variables Management

Manage environmental variables for your deployed applications.

```bash
deno deploy env
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization
- `--app <name>` - The name of the application

#### List Environment Variables

```bash
deno deploy env list
```

Lists all environmental variables in an application.

#### Add Environment Variable

```bash
deno deploy env add <variable> <value>
```

Adds an environmental variable to the application.

```bash
deno deploy env add DATABASE_URL "postgresql://user:pass@localhost/db"
```

#### Update Environment Variable Value

```bash
deno deploy env update-value <variable> <value>
```

Updates the value of an existing environmental variable.

```bash
deno deploy env update-value API_KEY "new-api-key-value"
```

#### Specifying Environment Variable Contexts

Environmnent variables can be made avialable to specific contexts such as
Production, Preview, Local and Build context

```bash
deno deploy env update-contexts <variable> [contexts...]
```

Updates the contexts of an environmental variable in the application:

#### Delete Environment Variable

```bash
deno deploy env delete <variable>
```

Deletes an environmental variable from the application.

```bash
deno deploy env delete OLD_API_KEY
```

#### Load Environment Variables from File

```bash
deno deploy env load <file>
```

Loads environmental variables from a `.env` file into the application.

```bash
deno deploy env load .env.production
```

### Application Logs

Stream logs from a deployed application.

```bash
deno deploy logs
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization
- `--app <name>` - The name of the application
- `--start <date>` - The starting timestamp of the logs
- `--end <date>` - The ending timestamp of the logs (requires --start)

```bash
deno deploy logs --org my-org --app my-app --start "2024-01-01T00:00:00Z"
```

### Configure Cloud Connections

`deploy` includes tools to assit you in configuring integrations to use as
[Cloud Conections](/deploy/early-access/reference/cloud-connections/)

#### AWS Integration Setup

[Configure AWS integration](/deploy/early-access/reference/cloud-connections/#aws%3A-easy-setup-with-deno-deploy-setup-aws)
to use be used as a Cloud Connection in your application.

```bash
deno deploy setup-aws --org <name> --app <name>
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization (required)
- `--app <name>` - The name of the application (required)

```bash
deno deploy setup-aws --org my-org --app my-app
```

### Google Cloud Platform Integration Setup

[Configure Google Cloud Platform integration](/deploy/early-access/reference/cloud-connections/#setting-up-gcp)
to use be used as a Cloud Connection in your application.

```bash
deno deploy setup-gcp --org <name> --app <name>
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization (required)
- `--app <name>` - The name of the application (required)

```bash
deno deploy setup-gcp --org my-org --app my-app
```

## Usage Examples

### Basic Deployment

```bash
# Deploy current directory to production
deno deploy --prod

# Deploy with specific org and app
deno deploy --org my-company --app my-api --prod
```

### Environment Setup

```bash
# Create a new application
deno deploy create --org my-company

# Set up environment variables
deno deploy env add DATABASE_URL "postgresql://..."
deno deploy env add API_KEY "your-api-key"

# Load from .env file
deno deploy env load .env.production
```

### Monitoring

```bash
# View recent logs
deno deploy logs --org my-company --app my-api

# View logs for specific time range
deno deploy logs --org my-company --app my-api \
  --start "2024-01-01T00:00:00Z" \
  --end "2024-01-01T23:59:59Z"
```

### Cloud Integration

```bash
# Set up AWS integration
deno deploy setup-aws --org my-company --app my-api

# Set up GCP integration
deno deploy setup-gcp --org my-company --app my-api
```

## Getting Help

- Use `deno deploy --help` for general help
- Use `deno deploy <subcommand> --help` for specific subcommand help
- Check the
  [Deno Deploy EA documentation](https://docs.deno.com/deploy/early-access/) for
  platform-specific information
