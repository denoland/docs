---
last_modified: 2026-06-01
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

If you are scripting `deno deploy` from CI or driving it from an AI agent rather
than running it interactively, jump to [Agent / CI usage](#agent--ci-usage) for
non-interactive auth, structured output, and exit-code conventions.

## Authentication

The deploy command supports three ways to authenticate, checked in this order:

1. **`--token <token>` flag** - Useful for one-off scripted calls.
2. **`DENO_DEPLOY_TOKEN` environment variable** - The recommended way to
   authenticate from CI / agent contexts; no browser is opened.
3. **OS keychain** - Tokens are securely stored in the system keyring after the
   first interactive sign-in. The CLI will prompt for sign-in when no token is
   found via (1) or (2).

Use `deno deploy whoami` to verify the active token without side effects.
Generate or revoke tokens at
[console.deno.com/account/tokens](https://console.deno.com/account/tokens).

## Root command options

These options apply to the top-level `deno deploy [root-path]` invocation that
deploys the current directory:

- `--org <name>` - Specify the organization name
- `--app <name>` - Specify the application name
- `--prod` - Deploy directly to production
- `--allow-node-modules` - Include `node_modules` when uploading
- `--no-wait` - Skip waiting for the build to complete

## Global options

These options are honored by every subcommand (including `deno sandbox`):

- `-h, --help` - Show help information
- `-j, --json` - Emit JSON on stdout instead of human-readable output
- `-y, --non-interactive` - Fail fast instead of prompting; required input must
  be supplied via flags or env vars
- `-q, --quiet` - Suppress non-essential output
- `--debug` - Print stack traces and verbose diagnostics on stderr
- `--token <token>` - Override the token from env / keychain
- `--endpoint <url>` - Override the API endpoint (also reads
  `DENO_DEPLOY_ENDPOINT`)
- `--config <path>` - Path to the config file (defaults to `deno.json` /
  `deno.jsonc`)
- `--ignore <path>` - Ignore particular source files (repeatable)

## Subcommands

### Create application

Creates a new application in Deno Deploy. When run without flags, an interactive
wizard walks you through each step. When any configuration flag is provided, the
command runs in non-interactive mode (useful for CI/CD pipelines and scripting).

```sh
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

```sh
deno deploy create
```

Create a local dynamic app with all flags (non-interactive):

```sh
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

```sh
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

```sh
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

```sh
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

```sh
deno deploy env
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization
- `--app <name>` - The name of the application

#### List environment variables

```sh
deno deploy env list
```

Lists all environment variables in an application.

#### Add environment variable

```sh
deno deploy env add <variable> <value>
```

Adds an environment variable to the application.

**Options:**

- `--secret` - Mark the variable as a secret. Secret values are hidden in the
  dashboard and in `env list` output.

```sh
deno deploy env add DATABASE_URL "postgresql://user:pass@localhost/db"

# Add a secret environment variable
deno deploy env add API_KEY "sk-secret-value" --secret
```

#### Update environment variable value

```sh
deno deploy env update-value <variable> <value>
```

Updates the value of an existing environment variable.

```sh
deno deploy env update-value API_KEY "new-api-key-value"
```

#### Specifying environment variable contexts

Environment variables can be made available to specific contexts such as
Production, Preview, Local, and Build.

```sh
deno deploy env update-contexts <variable> [contexts...]
```

Updates the contexts of an environment variable in the application:

#### Delete environment variable

```sh
deno deploy env delete <variable>
```

Deletes an environment variable from the application.

```sh
deno deploy env delete OLD_API_KEY
```

#### Load environment variables from file

```sh
deno deploy env load <file>
```

Loads environment variables from a `.env` file into the application. The CLI
automatically detects which variables are likely secrets based on their names
(e.g. keys containing `SECRET`, `TOKEN`, `PASSWORD`, etc.) and marks them
accordingly.

**Options:**

- `--non-secrets <keys...>` - Keys from the `.env` file that should be treated
  as non-secrets, overriding the auto-detection

```sh
deno deploy env load .env.production

# Load and treat specific keys as non-secrets
deno deploy env load .env.production --non-secrets PUBLIC_URL SITE_NAME
```

### Database management

Manage database instances for your organization.

```sh
deno deploy database
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization

#### Provision a database

```sh
deno deploy database provision <name> --kind <denokv|prisma> [--region <region>]
```

Creates a new database instance.

**Options:**

- `--kind <denokv|prisma>` - The type of database to provision (required)
- `--region <region>` - The primary region for the database (required for
  Prisma)

```sh
# Provision a Deno KV database
deno deploy database provision my-kv-db --kind denokv

# Provision a Prisma Postgres database
deno deploy database provision my-pg-db --kind prisma --region us-east-1
```

#### Link an external database

```sh
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

```sh
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

```sh
deno deploy database assign <name> [--app <name>]
```

Assigns a database instance to an application. If `--app` is not provided, you
will be prompted to select one interactively.

```sh
deno deploy database assign my-db --app my-api
```

#### Detach a database from an app

```sh
deno deploy database detach <name> [--app <name>]
```

Removes the connection between a database instance and an application.

```sh
deno deploy database detach my-db --app my-api
```

#### Query a database

```sh
deno deploy database query <name> <database> [query...]
```

Executes a SQL query against a database.

```sh
deno deploy database query my-db mydb "SELECT * FROM users LIMIT 10"
```

#### List databases

```sh
deno deploy database list [search]
```

Lists all database instances in the organization. Also available as
`database ls`.

```sh
# List all databases
deno deploy database list

# Filter by name
deno deploy database list my-db
```

#### Delete a database

```sh
deno deploy database delete <name>
```

Permanently deletes a database instance. Also available as `database remove` or
`database rm`.

```sh
deno deploy database delete my-old-db
```

### Switch organization and application

Sets the default organization and application for subsequent commands, so you
don't have to pass `--org` and `--app` every time.

```sh
deno deploy switch [--org <name>] [--app <name>]
```

When run without flags, an interactive prompt lets you select the org and app.

**Options:**

- `--org <name>` - The organization to switch to
- `--app <name>` - The application to switch to

```sh
# Switch interactively
deno deploy switch

# Switch to a specific org and app
deno deploy switch --org my-company --app my-api
```

### Logout

Removes the stored authentication token.

```sh
deno deploy logout
```

### Application logs

Stream logs from a deployed application.

```sh
deno deploy logs
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization
- `--app <name>` - The name of the application
- `--start <date>` - The starting timestamp of the logs
- `--end <date>` - The ending timestamp of the logs (requires --start)

```sh
deno deploy logs --org my-org --app my-app --start "2024-01-01T00:00:00Z"
```

### Sandbox management

Interact with running sandboxes directly from the Deploy CLI.

```sh
deno deploy sandbox --help
```

**Options:**

- `-h, --help` - Show help information
- `--token <token>` - Override the auth token used for sandbox operations
- `--config <path>` - Custom path to a Deploy CLI config file
- `--org <name>` - Organization that owns the sandboxes

#### List sandboxes

```sh
deno deploy sandbox list --org my-org
```

Lists every sandbox in the organization along with status details.

#### Kill a sandbox

```sh
deno deploy sandbox kill <sandbox-id> --org my-org
```

Immediately terminates the specified sandbox when you no longer need it.

#### SSH into a sandbox

```sh
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

```sh
deno deploy setup-aws --org <name> --app <name>
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization (required)
- `--app <name>` - The name of the application (required)

```sh
deno deploy setup-aws --org my-org --app my-app
```

### Google Cloud Platform integration setup

[Configure Google Cloud Platform integration](/deploy/reference/cloud_connections/#setting-up-gcp)
for use as a Cloud Connection in your application.

```sh
deno deploy setup-gcp --org <name> --app <name>
```

**Options:**

- `-h, --help` - Show help information
- `--org <name>` - The name of the organization (required)
- `--app <name>` - The name of the application (required)

```sh
deno deploy setup-gcp --org my-org --app my-app
```

## Agent / CI usage

`deno deploy` is designed to be invokable from CI pipelines and AI agents
without a human at the terminal. This section documents the conventions that
make non-interactive use reliable: token-based auth (covered above), fail-fast
prompting, structured output, exit codes, and per-command JSON shapes.

For the global flags themselves, see [Global options](#global-options).
`--non-interactive` and `--json` are independent. The recommended agent
invocation combines both:
`deno deploy <subcommand> --json --non-interactive
<...>`.

### Exit codes

| Code | Name        | Meaning                                                                            |
| ---- | ----------- | ---------------------------------------------------------------------------------- |
| `0`  | `OK`        | Success.                                                                           |
| `1`  | `GENERIC`   | Unclassified failure.                                                              |
| `2`  | `USAGE`     | Bad flag, missing required value, or `--non-interactive` short-circuit.            |
| `3`  | `AUTH`      | Token missing, invalid, expired, or rejected by the backend.                       |
| `4`  | `NOT_FOUND` | The targeted org / app / database / revision doesn't exist or isn't reachable.     |
| `5`  | `CONFLICT`  | A resource with the supplied name already exists (idempotent re-runs return this). |
| `6`  | `NETWORK`   | Backend 5xx, transport failure, or unreachable endpoint.                           |

Agents should pattern-match on the exit code first, then parse stderr if
non-zero.

### Structured error envelope

In `--json` mode, every error is written to **stderr** as a single JSON object:

```json
{
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "The token specified via 'DENO_DEPLOY_TOKEN' or the '--token' flag is invalid or expired.",
    "hint": "Generate a new token at https://console.deno.com/account/tokens and re-export DENO_DEPLOY_TOKEN.",
    "traceId": "abc123"
  }
}
```

Fields:

- `code` - Stable string identifier. Examples: `AUTH_INVALID_TOKEN`,
  `NON_INTERACTIVE_REQUIRED`, `MISSING_FLAG`, `SLUG_ALREADY_IN_USE`,
  `POSTGRES_ERROR`. Agents should treat unknown codes as opaque.
- `message` - Human-readable description.
- `hint` - Optional. Suggests a concrete next step.
- `traceId` - Optional. Server-side trace identifier from the `x-deno-trace-id`
  response header. Useful for bug reports.

Human-mode errors go to stderr too but without the JSON envelope.

### Stdio discipline

- **stdout** carries the result of the command. In `--json` mode this is a
  single object or array (NDJSON for streaming commands like `logs`). In human
  mode it is the formatted table / URL / etc.
- **stderr** carries human progress, prompts, and the structured error envelope.
  `--quiet` suppresses progress but keeps the final result on stdout.

This lets you pipe cleanly:

```sh
deno deploy publish --json | jq -r '.url'
deno deploy logs --json --app my-app | jq -c 'select(.severityNumber >= 17)'
deno deploy env list --json | jq '.[] | select(.isSecret == false)'
```

### Required flags under `--non-interactive`

When a required flag is missing in `--non-interactive` mode, the CLI exits `2`
(`USAGE`) with an error envelope naming the missing flag.

| Subcommand                     | Required flags                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `deno deploy --prod`           | `--org`, `--app` (or pre-existing `deno.json` config)                                                                                     |
| `deno deploy create`           | `--org`, `--app`, `--source`, `--region`, plus per-source / per-mode flags                                                                |
| `deno deploy env list`         | `--org`, `--app`                                                                                                                          |
| `deno deploy env load`         | `--replace` or `--skip-existing` when existing keys overlap                                                                               |
| `deno deploy database *`       | `--org`, plus per-action flags                                                                                                            |
| `deno deploy setup-aws`        | `--org`, `--app`, `--policies <arn>` (repeatable), optional `--role-name`                                                                 |
| `deno deploy setup-gcp`        | `--org`, `--app`, `--roles <role>` (repeatable), optional `--service-account-name`, `--enable-apis` to bypass the API-enable confirmation |
| `deno deploy whoami`           | (none; reads token only)                                                                                                                  |
| `deno deploy apps list`        | `--org`                                                                                                                                   |
| `deno deploy orgs list`        | (none)                                                                                                                                    |
| `deno deploy deployments list` | `--org`, `--app`                                                                                                                          |

### JSON output schemas

These shapes are stable; new fields may be added but existing fields will not be
removed without a version bump.

#### `deno deploy whoami --json`

```json
{
  "authenticated": true,
  "user": {
    "id": "...",
    "name": "Ada Lovelace",
    "email": "[email protected]",
    "avatarUrl": "https://...",
    "githubLogin": "ada"
  },
  "tokenType": "user",
  "orgs": [
    { "id": "...", "slug": "myorg", "name": "My Org", "plan": "pro" }
  ]
}
```

For user-backed tokens (web sessions, `dop_` device tokens) `user` is
populated with `id`, `name`, `email`, `avatarUrl`, `githubLogin`. For
organization-scoped (`ddo_`) tokens, `user` is `null` and `tokenType`
identifies the token kind so the caller can fall back to `orgs[]`. Any
of the inner string fields may be `null` if the backend has no value.

#### `deno deploy orgs list --json`

```json
[
  { "id": "...", "slug": "myorg", "name": "My Org", "plan": "pro" }
]
```

#### `deno deploy apps list --json`

```json
{
  "items": [
    {
      "id": "...",
      "slug": "my-app",
      "createdAt": "2026-05-12T14:40:00.000Z",
      "updatedAt": "2026-05-12T14:40:00.000Z",
      "layers": ["base"]
    }
  ],
  "nextCursor": null,
  "org": "myorg"
}
```

#### `deno deploy deployments list --json`

```json
{
  "items": [
    {
      "id": "rev_...",
      "status": "routed",
      "prod": true,
      "createdAt": "...",
      "updatedAt": "...",
      "lastStep": "deployed"
    }
  ],
  "nextCursor": null,
  "org": "myorg",
  "app": "my-app"
}
```

#### `deno deploy env list --json`

```json
[
  {
    "id": "...",
    "key": "DATABASE_URL",
    "value": "postgres://...",
    "isSecret": false,
    "contexts": ["production"]
  },
  {
    "id": "...",
    "key": "API_KEY",
    "value": null,
    "isSecret": true,
    "contexts": null
  }
]
```

`value` is `null` for secrets; `contexts: null` means "all contexts".

#### `deno deploy database list --json`

```json
[
  {
    "name": "my-db",
    "engine": "postgresql",
    "createdAt": "...",
    "assignments": ["my-app"],
    "connection": {
      "hostname": "db.example.com",
      "port": 5432,
      "username": "deploy",
      "customCertificate": false
    },
    "databases": [{ "name": "main", "status": "ready", "createdAt": "..." }]
  }
]
```

#### `deno deploy database query --json`

```json
{ "rows": [{ "column1": "value1", "column2": 42 }] }
```

On query failure the structured error envelope appears on stderr with
`error.code: "POSTGRES_ERROR"` or `"QUERY_ERROR"`.

#### `deno deploy publish --json`

```json
{
  "org": "myorg",
  "app": "my-app",
  "revisionId": "rev_...",
  "url": "https://console.deno.com/myorg/my-app/builds/rev_...",
  "status": "ready",
  "timelines": [
    { "partition": "production", "domains": ["https://my-app.deno.dev"] }
  ]
}
```

#### `deno deploy create --json --dry-run`

```json
{
  "dryRun": true,
  "org": "myorg",
  "app": "my-app",
  "repo": null,
  "buildDirectory": ".",
  "buildConfig": {
    "frameworkPreset": "astro",
    "mode": "static",
    "staticDir": "dist",
    "singlePageApp": false
  },
  "buildTimeout": 5,
  "buildMemoryLimit": 1024,
  "region": "us"
}
```

#### `deno deploy create --json` (GitHub source)

```json
{
  "org": "myorg",
  "app": "my-app",
  "url": "https://console.deno.com/myorg/my-app",
  "revisionId": "rev_...",
  "source": "github"
}
```

For local source, the command delegates to `publish --json` and emits its
envelope instead.

#### `deno deploy logs --json`

NDJSON, one record per line on stdout (shown here line-wrapped for readability):

```text
{"timestamp":"...","traceId":"...","spanId":"...","severity":"INFO","severityNumber":9,"body":"hello","scope":"app","revision":"rev_...","attributes":{}}
```

### Examples

#### Verify auth

```sh
export DENO_DEPLOY_TOKEN=ddo_...
deno deploy whoami --json
# {"authenticated":true,"user":null,"orgs":[{"id":"...","slug":"myorg",...}]}
```

#### Create + deploy a local app

```sh
deno deploy create --json --non-interactive \
  --org myorg --app my-app \
  --source local --app-directory . \
  --runtime-mode static --static-dir dist \
  --region us
```

#### Deploy to an existing app

```sh
deno deploy --json --non-interactive --org myorg --app my-app --prod .
```

#### Load secrets from .env, idempotently

```sh
deno deploy env load --org myorg --app my-app \
  --non-interactive --replace .env.production
```

#### List failed deployments

```sh
deno deploy deployments list --json --org myorg --app my-app \
  --status failed | jq '.items[] | .id'
```

#### Page through all apps

```sh
cursor=""
while :; do
  out=$(deno deploy apps list --json --org myorg ${cursor:+--cursor "$cursor"})
  echo "$out" | jq '.items[] | .slug'
  cursor=$(echo "$out" | jq -r '.nextCursor // empty')
  [ -z "$cursor" ] && break
done
```

#### Cloud setup (AWS) idempotently

```sh
deno deploy setup-aws --json --non-interactive \
  --org myorg --app my-app \
  --policies arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess \
  --policies arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess \
  --role-name DenoDeploy-myorg-my-app
```

The fixed `--role-name` makes the operation idempotent: re-running with the same
name surfaces `SLUG_ALREADY_IN_USE` (exit `5`, `CONFLICT`) rather than silently
creating a second resource with a random suffix.

### Compatibility

- JSON shapes are additive: new fields may be added but existing fields will not
  be removed without a version bump. Agents should ignore unknown fields.
- Exit-code values and `error.code` strings are stable; new values may be
  introduced.
- The flag set is stable; new flags may be added but existing ones will not be
  renamed or repurposed.

## Usage examples

### Basic deployment

```sh
# Deploy current directory to production
deno deploy --prod

# Deploy with specific org and app
deno deploy --org my-company --app my-api --prod
```

### Creating applications

```sh
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

```sh
# Set a default org and app so you don't have to pass --org/--app every time
deno deploy switch --org my-company --app my-api

# Now these commands use the saved org and app automatically
deno deploy env list
deno deploy logs
```

### Database management

```sh
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

```sh
# Set up environment variables
deno deploy env add DATABASE_URL "postgresql://..." --secret
deno deploy env add SITE_NAME "My App"

# Load from .env file
deno deploy env load .env.production
```

### Monitoring

```sh
# View recent logs
deno deploy logs --org my-company --app my-api

# View logs for specific time range
deno deploy logs --org my-company --app my-api \
  --start "2024-01-01T00:00:00Z" \
  --end "2024-01-01T23:59:59Z"
```

### Cloud integration

```sh
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
