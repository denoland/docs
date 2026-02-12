---
title: "deno deploy"
command: deploy
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno deploy"
description: "Manage and publish your projects on the web"
---

The `deno deploy` command provides a command line interface for managing and
deploying applications to [Deno Deploy EA](https://deno.com/deploy), Deno's
platform for hosting JavaScript, TypeScript, and WebAssembly applications.

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

## Global options

- `-h, --help` - Show help information
- `--org <name>` - Specify the organization name
- `--app <name>` - Specify the application name
- `--prod` - Deploy directly to production

## Subcommands

### Create application

Creates a new application in Deno Deploy. When run without flags, an interactive
wizard walks you through each step. When any configuration flag is provided, the
command runs in non-interactive mode (useful for CI/CD pipelines and scripting).

```bash
deno deploy create [root-path]
```

The optional `[root-path]` argument sets the local project directory. Defaults
to the current working directory.

#### General options

- `-h, --help` - Show help information
- `--org <name>` - The organization to create the app in
- `--app <name>` - The application name (used in the default URL)
- `--allow-node-modules` - Include `node_modules` when uploading
- `--no-wait` - Skip waiting for the first build to complete
- `--dry-run` - Validate flags and run through the flow without actually
  creating anything

#### Source options

These flags control where the app code comes from:

- `--source <github|local>` - Deploy from a GitHub repo or the local filesystem
- `--owner <name>` - GitHub owner/organization (required when source is
  `github`)
- `--repo <name>` - GitHub repository name (required when source is `github`)

#### Build configuration options

- `--app-directory <path>` - Path to the app directory within the project
- `--framework-preset <preset>` - Use a framework preset for build defaults.
  Supported values: `astro`, `nextjs`, `nuxt`, `remix`, `solidstart`,
  `sveltekit`, `fresh`, `lume`, or `""` (none)
- `--do-not-use-detected-build-config` - Skip auto-detected build settings and
  use only the provided flags
- `--install-command <command>` - Install command (e.g. `"deno install"`)
- `--build-command <command>` - Build command (e.g. `"deno task build"`)
- `--pre-deploy-command <command>` - Command to run after building but before
  deploying

#### Runtime mode options

- `--runtime-mode <dynamic|static>` - Whether the app runs as a server or a
  static site

**Dynamic mode** (server):

- `--entrypoint <file>` - The entrypoint file (e.g. `main.ts`)
- `--arguments <arg>` - Arguments passed to the entrypoint (can be specified
  multiple times)
- `--working-directory <path>` - Working directory for the process

**Static mode** (static site):

- `--static-dir <dir>` - Directory containing the static files to serve
- `--single-page-app` - Serve `index.html` for routes that don't match a file
  (instead of returning 404)

#### Build resource options

- `--build-timeout <minutes>` - Build timeout. Allowed values: `5`, `10`, `15`,
  `20`, `25`, `30`
- `--build-memory-limit <megabytes>` - Build memory limit in MB. Allowed values:
  `1024`, `2048`, `3072`, `4096`
- `--region <region>` - Deployment region. Allowed values: `us`, `eu`, `global`

#### Interactive wizard

When you run `deno deploy create` without flags, an interactive wizard guides
you through each configuration step:

1. **Organization** - Select which org to create the app in
2. **App name** - Choose a name for your app
3. **Source** - Deploy from GitHub or a local directory
4. **GitHub repo** _(if source is GitHub)_ - Select the owner and repo
5. **App directory** - Pick the directory within your project (auto-detects
   workspace members)
6. **Build configuration** - Auto-detects framework settings. You can accept the
   detected config or configure manually (framework preset, install/build
   commands, runtime mode, etc.)
7. **Build timeout** - How long the build can run
8. **Build memory limit** - How much memory the build gets
9. **Region** - Where to deploy (`us`, `eu`, or `global`)
10. **Confirm** - Review and confirm before creating

#### Examples

Create an app interactively:

```bash
deno deploy create
```

Create a local dynamic app with all flags (non-interactive):

```bash
deno deploy create \
  --org my-org \
  --app my-api \
  --source local \
  --runtime-mode dynamic \
  --entrypoint main.ts \
  --install-command "deno install" \
  --build-command "deno task build" \
  --build-timeout 5 \
  --build-memory-limit 1024 \
  --region us
```

Create a static site:

```bash
deno deploy create \
  --org my-org \
  --app my-site \
  --source local \
  --runtime-mode static \
  --static-dir dist \
  --single-page-app \
  --build-command "deno task build" \
  --build-timeout 10 \
  --build-memory-limit 2048 \
  --region us
```

Use a framework preset (fewer flags needed since the preset provides defaults):

```bash
deno deploy create \
  --org my-org \
  --app my-fresh-app \
  --source local \
  --framework-preset fresh \
  --build-timeout 5 \
  --build-memory-limit 1024 \
  --region us
```

Deploy from a GitHub repo:

```bash
deno deploy create \
  --org my-org \
  --app my-app \
  --source github \
  --owner my-github-org \
  --repo my-repo \
  --framework-preset astro \
  --build-timeout 10 \
  --build-memory-limit 2048 \
  --region global
```

### Environment variables management

Manage environment variables for your deployed applications.

```bash
deno deploy env
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization
- `--app <name>` - The name of the application

#### List environment variables

```bash
deno deploy env list
```

Lists all environment variables in an application.

#### Add environment variable

```bash
deno deploy env add <variable> <value>
```

Adds an environment variable to the application.

**Options:**

- `--secret` - Mark the variable as a secret. Secret values are hidden in the
  dashboard and in `env list` output.

```bash
deno deploy env add DATABASE_URL "postgresql://user:pass@localhost/db"

# Add a secret environment variable
deno deploy env add API_KEY "sk-secret-value" --secret
```

#### Update environment variable value

```bash
deno deploy env update-value <variable> <value>
```

Updates the value of an existing environment variable.

```bash
deno deploy env update-value API_KEY "new-api-key-value"
```

#### Specifying environment variable contexts

Environment variables can be made available to specific contexts such as
Production, Preview, Local, and Build.

```bash
deno deploy env update-contexts <variable> [contexts...]
```

Updates the contexts of an environment variable in the application:

#### Delete environment variable

```bash
deno deploy env delete <variable>
```

Deletes an environment variable from the application.

```bash
deno deploy env delete OLD_API_KEY
```

#### Load environment variables from file

```bash
deno deploy env load <file>
```

Loads environment variables from a `.env` file into the application. The CLI
automatically detects which variables are likely secrets based on their names
(e.g. keys containing `SECRET`, `TOKEN`, `PASSWORD`, etc.) and marks them
accordingly.

**Options:**

- `--non-secrets <keys...>` - Keys from the `.env` file that should be treated
  as non-secrets, overriding the auto-detection

```bash
deno deploy env load .env.production

# Load and treat specific keys as non-secrets
deno deploy env load .env.production --non-secrets PUBLIC_URL SITE_NAME
```

### Database management

Manage database instances for your organization.

```bash
deno deploy database
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization

#### Provision a database

```bash
deno deploy database provision <name> --kind <denokv|prisma> [--region <region>]
```

Creates a new database instance.

**Options:**

- `--kind <denokv|prisma>` - The type of database to provision (required)
- `--region <region>` - The primary region for the database (required for
  Prisma)

```bash
# Provision a Deno KV database
deno deploy database provision my-kv-db --kind denokv

# Provision a Prisma Postgres database
deno deploy database provision my-pg-db --kind prisma --region us-east-1
```

#### Link an external database

```bash
deno deploy database link <name> [connectionString]
```

Links an external PostgreSQL database to your organization. You can provide a
connection string or use individual flags.

**Options:**

- `--hostname <host>` - Database hostname (conflicts with connection string)
- `--username <user>` - Database username (conflicts with connection string)
- `--password <pass>` - Database password (conflicts with connection string)
- `--port <number>` - Database port (conflicts with connection string)
- `--cert <cert>` - SSL certificate for the connection
- `--dry-run` - Test the connection without actually linking

```bash
# Link using a connection string
deno deploy database link my-db "postgres://user:pass@host:5432/mydb"

# Link using individual flags
deno deploy database link my-db \
  --hostname db.example.com \
  --username admin \
  --password secret \
  --port 5432

# Test the connection first
deno deploy database link my-db "postgres://user:pass@host:5432/mydb" --dry-run
```

#### Assign a database to an app

```bash
deno deploy database assign <name> [--app <name>]
```

Assigns a database instance to an application. If `--app` is not provided, you
will be prompted to select one interactively.

```bash
deno deploy database assign my-db --app my-api
```

#### Detach a database from an app

```bash
deno deploy database detach <name> [--app <name>]
```

Removes the connection between a database instance and an application.

```bash
deno deploy database detach my-db --app my-api
```

#### Query a database

```bash
deno deploy database query <name> <database> [query...]
```

Executes a SQL query against a database.

```bash
deno deploy database query my-db mydb "SELECT * FROM users LIMIT 10"
```

#### List databases

```bash
deno deploy database list [search]
```

Lists all database instances in the organization. Also available as
`database ls`.

```bash
# List all databases
deno deploy database list

# Filter by name
deno deploy database list my-db
```

#### Delete a database

```bash
deno deploy database delete <name>
```

Permanently deletes a database instance. Also available as `database remove` or
`database rm`.

```bash
deno deploy database delete my-old-db
```

### Switch organization and application

Sets the default organization and application for subsequent commands, so you
don't have to pass `--org` and `--app` every time.

```bash
deno deploy switch [--org <name>] [--app <name>]
```

When run without flags, an interactive prompt lets you select the org and app.

**Options:**

- `--org <name>` - The organization to switch to
- `--app <name>` - The application to switch to

```bash
# Switch interactively
deno deploy switch

# Switch to a specific org and app
deno deploy switch --org my-company --app my-api
```

### Logout

Removes the stored authentication token.

```bash
deno deploy logout
```

### Application logs

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

### Sandbox management

Interact with running sandboxes directly from the Deploy CLI.

```bash
deno deploy sandbox --help
```

**Options:**

- `-h, --help` - Show help information
- `--token <token>` - Override the auth token used for sandbox operations
- `--config <path>` - Custom path to a Deploy CLI config file
- `--org <name>` - Organization that owns the sandboxes

#### List sandboxes

```bash
deno deploy sandbox list --org my-org
```

Lists every sandbox in the organization along with status details.

#### Kill a sandbox

```bash
deno deploy sandbox kill <sandbox-id> --org my-org
```

Immediately terminates the specified sandbox when you no longer need it.

#### SSH into a sandbox

```bash
deno deploy sandbox ssh <sandbox-id> --org my-org
```

Starts an SSH session against a running sandbox for interactive debugging.

### Configure cloud connections

The `deploy` command includes tools to help you configure integrations for use
as [Cloud Connections](/deploy/reference/cloud_connections/) in your
applications.

#### AWS integration setup

[Configure AWS integration](/deploy/reference/cloud_connections/#aws%3A-easy-setup-with-deno-deploy-setup-aws)
for use as a Cloud Connection in your application.

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

### Google Cloud Platform integration setup

[Configure Google Cloud Platform integration](/deploy/reference/cloud_connections/#setting-up-gcp)
for use as a Cloud Connection in your application.

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

## Usage examples

### Basic deployment

```bash
# Deploy current directory to production
deno deploy --prod

# Deploy with specific org and app
deno deploy --org my-company --app my-api --prod
```

### Creating applications

```bash
# Start the interactive creation wizard
deno deploy create

# Create with a framework preset
deno deploy create --org my-company --app my-site \
  --source local --framework-preset fresh \
  --build-timeout 5 --build-memory-limit 1024 --region us

# Create a static site from a GitHub repo
deno deploy create --org my-company --app my-docs \
  --source github --owner my-github-org --repo my-docs-repo \
  --runtime-mode static --static-dir dist --single-page-app \
  --build-command "npm run build" \
  --build-timeout 10 --build-memory-limit 2048 --region global
```

### Switching context

```bash
# Set a default org and app so you don't have to pass --org/--app every time
deno deploy switch --org my-company --app my-api

# Now these commands use the saved org and app automatically
deno deploy env list
deno deploy logs
```

### Database management

```bash
# Provision a Deno KV database
deno deploy database provision my-kv --kind denokv --org my-company

# Link an external PostgreSQL database
deno deploy database link my-pg "postgres://user:pass@host:5432/db" --org my-company

# Assign a database to an app
deno deploy database assign my-kv --app my-api

# Query a database
deno deploy database query my-pg mydb "SELECT count(*) FROM users"
```

### Environment setup

```bash
# Set up environment variables
deno deploy env add DATABASE_URL "postgresql://..." --secret
deno deploy env add SITE_NAME "My App"

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

### Cloud integration

```bash
# Set up AWS integration
deno deploy setup-aws --org my-company --app my-api

# Set up GCP integration
deno deploy setup-gcp --org my-company --app my-api
```

## Getting help

- Use `deno deploy --help` for general help
- Use `deno deploy <subcommand> --help` for specific subcommand help
- Check the [Deno Deploy documentation](/deploy/) for platform-specific
  information
