---
title: Databases
description: Connect to external database instances and integrate your applications and their environments seamlessly.
---

Deno Deploy's databases feature enables your applications to easily connect to a
variety of databases, enabling seamless state management in your apps.
Currently, PostgreSQL and Deno KV are supported.

After creating or linking a database instance, Deno Deploy automatically creates
isolated (logical) databases inside of that instance for each deployment
environment, including production, Git branches, and preview timelines. Your
application code connects to the appropriate database based on the current
environment, using automatically injected environment variables. This ensures
that your data remains consistent and isolated across different stages of
development and deployment.

Deno Deploy currently supports two database engines:

- **PostgreSQL** — Connect an existing externally hosted PostgreSQL instance, or
  provision a managed PostgreSQL database through Deno Deploy, hosted by Prisma.
- **Deno KV** — Provision a fast, globally distributed key‑value store built for
  the edge.

## Creating a database instance

There are two ways to add a database instance to your Deno Deploy organization:

- **Link Database**: Connect an existing external database instance (for
  example, a PostgreSQL server you run or a managed instance from a cloud
  provider).
- **Provision Database**: Create and attach a managed data store from Deno
  Deploy (Deno KV or Prisma Postgres).

### Linking an external database

#### Using the dashboard

To link an existing external database instance you can either:

- go to the "Databases" page in your organization dashboard and click the "Link
  Database" button,
- go to the "Databases" tab in your app settings, click on "Attach Database",
  then select "Link Database" in database instance selection dropdown.

From here, enter the connection details for your external database instance. You
will need to provide:

- **Engine**: Select the database engine (currently only PostgreSQL is
  supported).
- **Connection Details**: Enter the hostname, port, username, password, and
  optionally a CA certificate if required by your provider. You can also paste a
  connection string to automatically populate these fields.
- **Slug**: Give your database instance a descriptive name to identify it in the
  dashboard. This name is only used within Deno Deploy and does not affect your
  actual database server.

Once you've filled out the form, click "Test Connection" to verify your
settings. If the connection is successful, click "Save" to add the database
instance to your organization.

If the connection fails, double-check your connection details and ensure that
your database server is accessible from Deno Deploy's network. We are unable to
provide a list of IP addresses for Deno Deploy at this time, so please ensure
your database server allows connections from all IPs. If you continue to have
trouble, you can [contact support](/deploy/support/) for assistance.

:::info

Because Deno Deploy creates isolated databases for each environment (production,
Git branches, and previews), ensure that the database user you provide has
sufficient privileges to create new databases on the server.

:::

#### TLS/SSL configuration

When linking an external database, Deno Deploy supports secure SSL/TLS
connections. Depending on your database provider, you may need to upload a CA
certificate to verify the server's identity.

If your database provider uses a trusted root Certificate Authority (CA), such
as Let's Encrypt, no certificate upload is needed and SSL connections work
automatically.

For users of AWS RDS, we will automatically detect RDS instances and provide an
option to "Use AWS Certificate Bundle" to configure the necessary certificates
without manual downloads.

For Google Cloud SQL users, you will need to download the Google Cloud SQL CA
certificate from your Google Cloud Console and upload it when linking your
database.

For other providers using self-signed certificates or private CAs, you will need
to upload the specific CA certificate that was used to sign your database's
certificate. You can usually obtain this from your database provider's
documentation or console.

#### Using the CLI

You can also link an external PostgreSQL database using the CLI:

```bash
deno deploy database link my-db "postgres://user:pass@host:5432/mydb" --org my-org
```

Or use individual flags instead of a connection string:

```bash
deno deploy database link my-db \
  --hostname db.example.com \
  --username admin \
  --password secret \
  --port 5432 \
  --org my-org
```

Use `--dry-run` to test the connection without actually linking:

```bash
deno deploy database link my-db "postgres://user:pass@host:5432/mydb" --dry-run
```

For the full list of options, see the
[`deno deploy database link` CLI reference](/runtime/reference/cli/deploy/#link-an-external-database).

### Provisioning a managed database

#### Using the dashboard

To create and attach a managed database instance from Deno Deploy, you can
either:

- go to the "Databases" page in your organization dashboard and click the
  "Provision Database" button,
- go to the "Databases" tab in your app settings, click on "Attach Database",
  then select "Provision Database" in database instance selection dropdown.

From here, select the database engine you want to provision. Available today:

- **Deno KV** — a fast, globally distributed key‑value store built for the edge,
  hosted by Deno on your behalf.
- **Prisma Postgres** — the world's most advanced open source relational
  database, hosted by [Prisma](https://www.prisma.io/).

You will have to provide a **Slug** to identify the database instance in the
dashboard. This name is only used within Deno Deploy and does not affect your
actual database server.

Depending on the engine you select, there may be additional configuration
options, such as choosing a region. Choosing a region close to your
application's users can help reduce latency and improve performance of your
database queries.

Once you're ready, click "Provision" to create the database instance. Deno
Deploy will handle the provisioning process and set up the necessary
infrastructure on your behalf.

#### Using the CLI

You can also provision a managed database from the CLI:

```bash
# Provision a Deno KV database
deno deploy database provision my-kv-db --kind denokv --org my-org

# Provision a Prisma Postgres database (region is required)
deno deploy database provision my-pg-db --kind prisma --region us-east-1 --org my-org
```

For the full list of options, see the
[`deno deploy database provision` CLI reference](/runtime/reference/cli/deploy/#provision-a-database).

## Linking databases to your apps

After creating or linking a database instance, you can assign it to your apps.
Each database instance can be assigned to multiple apps. Each app gets its own
isolated databases within the instance for each deployment environment
(production, Git branches, and preview timelines).

:::info

It is not currently possible to link multiple database instances to a single
app. It is thus not possible to link both a Deno KV and a PostgreSQL database to
the same app at this time.

:::

Once assigned, Deno Deploy automatically creates an isolated database for each
timeline within that app. The naming scheme for these databases is as follows:

- The single production database uses the format `{app-id}-production`
- Each Git branch database uses the format `{app-id}--{branch-name}`
- A singular preview database exists, with the format `{app-id}-preview`

:::info

Currently only one preview database is created per app, shared across all
preview deployments. In future releases, each preview deployment will get its
own isolated database.

:::

To assign a database to an app you can either:

- Go to the "Databases" page in your organization dashboard, find the database
  instance you want to assign, click "Assign", then select the app from the
  dropdown.
- Go to the "Databases" tab in your app settings, click on "Attach Database",
  then select the database instance from the dropdown.
- Use the CLI:

```bash
deno deploy database assign my-db --app my-api --org my-org
```

To detach a database from an app:

```bash
deno deploy database detach my-db --app my-api --org my-org
```

Once assigned, Deno Deploy will automatically create the necessary isolated
databases for each environment within that app.

## Connecting to databases from your code

Once you've assigned a database to your app, connecting to it from your code is
simple. Deno Deploy automatically handles connection details, credentials, and
environment variables for you.

### Deno KV

For Deno KV, you can use the built-in `Deno.openKv()` API to connect to your
assigned Deno KV instance. No additional configuration is needed - Deno Deploy
automatically connects your app to the correct Deno KV instance based on the
current environment.

```typescript
// No arguments needed - Deno Deploy handles this automatically
const kv = await Deno.openKv();

Deno.serve(async () => {
  // Use the Deno KV instance
  await kv.set(["user", "123"], { name: "Alice", age: 30 });
  const user = await kv.get(["user", "123"]);

  return new Response(JSON.stringify(user.value), {
    headers: { "content-type": "application/json" },
  });
});
```

### PostgreSQL

For PostgreSQL databases (both external and provisioned), Deno Deploy
automatically injects standard database environment variables into your app's
runtime environment:

- `DATABASE_URL`: A full connection string for the current environment, in the
  format `postgresql://username:password@hostname:port/database`.
- `PGHOST`: The database server hostname.
- `PGPORT`: The database server port.
- `PGDATABASE`: The database name for the current environment.
- `PGUSER`: The database username.
- `PGPASSWORD`: The database password.

If your database requires a custom SSL/TLS certificate, Deno Deploy also injects
that certificate into the default certificate store, so that all SSL connections
work automatically.

You can use your favorite PostgreSQL client library (such as `pg` from npm) to
connect to your database using these environment variables. Most libraries
automatically detect and use these standard environment variables without any
configuration.

As an example, here's how to connect to PostgreSQL in your Deno Deploy app:

```typescript
import { Pool } from "npm:pg";

// No arguments needed - the library reads connection details from environment variables automatically
const pool = new Pool();

Deno.serve(async () => {
  // Use the database
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [123]);

  return new Response(JSON.stringify(result.rows), {
    headers: { "content-type": "application/json" },
  });
});
```

## Running migrations and seeding data

Since each environment has its own isolated database, you will often have many
separate databases to manage in every app. It is not practical to manually run
migrations or insert seed data into each database individually every time you
deploy a new revision.

To streamline this process, Deno Deploy allows you to configure an automated
pre-deploy command that runs every time a revision is rolled out to a timeline,
before the deployment starts serving traffic.

This command runs with the same environment variables available to your
application, including `PGHOST`, `PGPORT`, `PGDATABASE`, etc., so you can use it
to run migrations or seed data using your existing migration tools.

To set up an automated migration command, head to the Settings page of your app,
and go to the App Config section. There you can edit the app configuration to
set a pre-deploy command in the "Pre-Deploy Command" field (for example,
`deno task migrate` or `npm run migrate`).

You can see the detailed logs of the pre-deploy command execution in the
revision build logs, in the "Deployment" section.

As an example, you could set up a migration script using
[`node-pg-migrate`](https://github.com/salsita/node-pg-migrate):

1. Add a task to your `deno.json`:
   ```json
   {
     "tasks": {
       "migrate": "deno run --allow-net --allow-env --allow-read --allow-write npm:node-pg-migrate up"
     }
   }
   ```
2. Create a migrations directory and add migration files. For example,
   `migrations/1234567890_create-users-table.js`:
   ```javascript
   exports.up = (pgm) => {
     pgm.createTable("users", {
       id: "id",
       name: { type: "varchar(100)", notNull: true },
       email: { type: "varchar(100)", notNull: true },
       created_at: {
         type: "timestamp",
         notNull: true,
         default: pgm.func("current_timestamp"),
       },
     });
   };
   exports.down = (pgm) => {
     pgm.dropTable("users");
   };
   ```
3. Set your pre-deploy command to `deno task migrate` in the app settings.

Deno Deploy will automatically run this command before each deployment, ensuring
all your environment-specific databases stay up to date.

Other migration tools such as Prisma Migrate, Drizzle, or Kysely can also be
used in a similar way.

## Local Development

When developing locally, you have two options for your database setup:

- Use a local database instance running on your machine, for example a local
  PostgreSQL server or the built-in Deno KV backend in Deno.
- Connect to a hosted isolated local development instance provisioned on Deno
  Deploy, through `--tunnel`.

### Using a local database instance

#### Deno KV

For Deno KV, you can use the built-in `Deno.openKv()` API to connect to a local
Deno KV instance. By default, this uses a local file-based backend stored in
your home directory.

```typescript
const kv = await Deno.openKv(); // connects to local Deno KV instance

Deno.serve(async () => {
  // Use the Deno KV instance
  await kv.set(["user", "123"], { name: "Alice", age: 30 });
  const user = await kv.get(["user", "123"]);

  return new Response(JSON.stringify(user.value), {
    headers: { "content-type": "application/json" },
  });
});
```

#### PostgreSQL

To install PostgreSQL locally, follow the instructions for your operating system
on [postgresql.org](https://www.postgresql.org/download/). On macOS, you can use
`brew install postgresql`, while many Linux distributions provide PostgreSQL
packages through their package managers.

After installing PostgreSQL, create a new database and user for your local
development:

```bash
createdb myapp_dev
createuser myuser --pwprompt
```

Set up a `.env` file in your project root with the connection details for your
local PostgreSQL instance:

```bash
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/myapp_dev
```

You can then use your favorite PostgreSQL client library (such as `pg` from npm)
to connect to your local database using the `DATABASE_URL` environment variable.

If you are using Deno for local development, you can pass the `--env-file` flag
to automatically load environment variables from your `.env` file on startup:

```bash
deno run -A --env-file main.ts
```

### Using a hosted isolated local development instance

Deno Deploy allows you to connect to a hosted isolated local development
database when using the
[`--tunnel` flag in Deno](https://docs.deno.com/deploy/reference/tunnel).

To set this up, first provision a database instance in your Deno Deploy
organization, and assign it to your app as usual.

Next, start your local development server with the `--tunnel` flag:

```bash
deno task --tunnel dev
# or
deno run -A --tunnel main.ts
```

Deno Deploy will automatically inject the appropriate database environment
variables into your local environment, allowing your code to connect to the
hosted isolated database instance. Please note that this database instance is
shared across all developers using the same app, so be cautious when modifying
data.

:::info

When using the `--tunnel` flag, Deno Deploy also enables other features such as:

- exporting your logs, traces, and metrics from your local environment to the
  Deno Deploy dashboard
- pulling environment variables from the "Local" context to your local
  environment
- exposing your local server to a public URL for easy sharing and testing

If you do not want to use these features, consider using a local database
instance instead.

:::

## Database management

### Using the CLI

You can manage databases entirely from the command line:

```bash
# List all databases in your organization
deno deploy database list --org my-org

# Query a database
deno deploy database query my-db mydb "SELECT * FROM users LIMIT 10"

# Delete a database
deno deploy database delete my-old-db --org my-org
```

For the full list of database commands, see the
[`deno deploy database` CLI reference](/runtime/reference/cli/deploy/#database-management).

### Organization level

You can view and manage your database instances from the "Databases" page in
your organization dashboard. Here you will find all your linked and provisioned
database instances, along with their status, assigned apps, and connection
details (if applicable).

Clicking on a database instance takes you to the database detail page, where you
can view more information about the instance, including assigned apps,
individual databases created within the instance. For each database provisioned
in the instance, you can see its name, status, and associated app and timeline.

If a database fails to create, you'll see an error status with a "Fix" button
that you can use to retry the operation and view more detailed error
information.

From this page, you can also detach database instances from an app, or delete
the instance entirely.

Next to each database in the instance, you can open the database explorer (for
PostgreSQL databases), or copy the connection string (`DATABASE_URL`), allowing
you to easily connect to your databases from your local machine for debugging.

### App level

You can also manage database instances from the "Databases" tab in your app
settings. Here you can see the database instance assigned to your app, along
with its status and connection details.

You can see all databases created for your app within the assigned instance,
including those for production, Git branches, and preview timelines. For each
database, you can see its name and status.

You can open the database explorer (for PostgreSQL databases), and copy the
connection string (`DATABASE_URL`) for each database directly from this page,
allowing you to easily connect to your databases from your local machine for
debugging.

## Database explorer

Deno Deploy provides a built-in database explorer for PostgreSQL databases,
allowing you to browse and manage your data directly from the Deno Deploy
dashboard.

To access the database explorer, go to the "Databases" tab in your app settings,
find the assigned PostgreSQL database instance, and click "Explore Database".
This opens the database explorer interface, where you can view tables, run
queries, and manage your data.

:::info

The database explorer is not available for Deno KV databases at this time.

:::

## Prisma Postgres instances and claiming

When you provision a managed Prisma Postgres database instance through Deno
Deploy, the instance is initially "unclaimed". This means that the instance is
managed by Deno Deploy on your behalf, but you do not have direct access to the
Prisma account that owns the instance. Unclaimed instances have default limits
on the number of databases and size based on Deno Deploy's plans.

If you want to have full control over the Prisma Postgres instance, including to
upgrade to a higher Prisma plan, you can "claim" the instance into your own
Prisma account. To do this, go to the database instance detail page in the Deno
Deploy dashboard, and click the "Claim Instance" button. You will be guided
through the process of linking the instance to your Prisma account.

:::warning

Claiming a Prisma Postgres instance is a permanent action and cannot be undone.
Once claimed, the instance is managed through your Prisma account and will make
use of your Prisma account limits (based on plan). The Deno Deploy integration
to automatically create isolated databases for each app will continue to work as
before.

:::

## Limits

There is no limit on the number of linked database instances, or Deno KV
instances you can create in your organization.

For managed Prisma Postgres instances, only a couple of instances can be created
per organization. In each Prisma Postgres instance, there is a limit to the
number of databases that can be created, which directly affects the number of
apps that can be assigned to that instance. Once a Prisma Postgres instance
reaches its database limit, no more databases can be created in that instance.

If a Prisma Postgres instance is "claimed" through your own Prisma account, the
database limit is determined by your Prisma plan. For unclaimed Prisma Postgres
instances, a default limit applies.

For managed Prisma Postgres instances, each database has a size limit and
operation count limit based on the plan you are on. The usage is shown at the
bottom of the database instance detail page. If you are on a claimed Prisma
Postgres instance, the limits are determined by your Prisma plan. For unclaimed
Prisma Postgres instances, a default limit applies.

## Frequently Asked Questions

**Q: Can multiple apps share the same database instance?**

Yes! Multiple apps can be assigned to the same database instance. Each app gets
its own isolated databases within that instance.

**Q: What happens to my data when I remove an app assignment?**

The databases remain on your database server. Only the connection between your
app and the database instance is removed.

**Q: Can I use the same database for multiple environments?**

By default, each environment (production, branch, preview) gets its own database
to ensure isolation and prevent data conflicts. However, you can customize the
database your code connects to using options in your database library.

**Q: How do I access my databases directly?**

You can connect directly to your database server using the connection details
you provided. Use the database names shown in the Deno Deploy dashboard.

**Q: Can I change database connection details?**

Yes, click "Edit" on any database instance to update connection details. Test
the connection before saving to ensure it works.

**Q: How do I delete a database instance?**

First remove all app assignments, then click "Delete" on the database instance.
This only removes the connection from Deno Deploy - your actual database server
is not affected.
