---
title: Prisma Postgres
description: Provision and manage Prisma Postgres databases for your Deno Deploy applications.
oldUrl: /deploy/reference/prisma-postgres/
---

Prisma Postgres is a serverless PostgreSQL database that is instantly responsive
and effortlessly scalable. Built on bare metal infrastructure with zero cold
starts and built-in global caching, it scales to zero when idle and handles
traffic spikes seamlessly. Through Deno Deploy's database provisioning feature,
you can create and manage Prisma Postgres instances that automatically integrate
with your applications and their deployment environments.

## Overview

When you provision a Prisma Postgres database and assign it to an app, Deno
Deploy automatically creates separate databases for each deployment environment:

- Production deployments use `{app-id}-production`
- Git branches get `{app-id}--{branch-name}`
- Preview deployments use `{app-id}-preview`

Your code automatically connects to the correct database for each environment
without requiring timeline detection or manual configuration.

## Provisioning a Prisma Postgres Database

### Creating the Instance

1. Navigate to your organization dashboard and click "Databases" in the
   navigation bar.
2. Click "Provision Database".
3. Select "Prisma Postgres" from the available options.
4. Give your database instance a name.
5. Complete the provisioning flow.

### Assigning to an App

Once your Prisma Postgres instance is provisioned:

1. From the database instances list, click "Assign" next to your Prisma Postgres
   instance.
2. Select the app from the dropdown.
3. Optionally, configure a migration command that will run automatically after
   each build (see [Automated Migrations](#automated-migrations) for details).
4. Deno Deploy will automatically provision separate databases for production,
   Git branches, and preview environments.
5. Monitor the provisioning status as it changes to "Connected".

## Using Prisma Postgres in Your Code

### Zero Configuration Required

Once assigned, your code automatically connects to the correct Prisma Postgres
database for each environment. Deno Deploy injects standard PostgreSQL
environment variables into your runtime:

- `PGHOST` - Database host (db.prisma.io)
- `PGPORT` - Database port (5432)
- `PGDATABASE` - Database name (automatically selected for your environment)
- `PGUSER` - Database username
- `PGPASSWORD` - Database password
- `PGSSLMODE` - SSL mode configuration
- `DATABASE_URL` - Standard PostgreSQL connection string
  (`postgresql://user:password@db.prisma.io:5432/database`)
- `PRISMA_ACCELERATE_URL` - Connection URL for Prisma Accelerate, a global
  connection pooling and caching layer that provides optimized database access
  with reduced latency

### Example with pg

```typescript
import { Pool } from "npm:pg";

// No configuration needed - Deno Deploy handles this automatically
const pool = new Pool();

Deno.serve(async () => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [123]);

  return new Response(JSON.stringify(result.rows), {
    headers: { "content-type": "application/json" },
  });
});
```

### Example with Prisma ORM

```typescript
import { PrismaClient } from "@prisma/client";

// Prisma Client automatically uses DATABASE_URL environment variable
const prisma = new PrismaClient();

Deno.serve(async () => {
  const users = await prisma.user.findMany();

  return new Response(JSON.stringify(users), {
    headers: { "content-type": "application/json" },
  });
});
```

## Environment-Specific Databases

Each environment automatically receives its own isolated database:

- **Production**: When code is deployed to production, it connects to
  `{app-id}-production`
- **Git Branches**: Branch deployments connect to `{app-id}--{branch-name}`
- **Preview Deployments**: Preview timelines connect to `{app-id}-preview`

This isolation ensures production data stays safe while developing and testing.

## Schema Management and Migrations

Since each environment has its own database, you can safely test schema changes
and migrations without affecting production data.

### Automated Migrations

When assigning a Prisma Postgres database to an app, you can configure a
migration command that automatically runs after each successful build. This
ensures your database schema stays synchronized with your application code
across all environments.

**Setting Up Automated Migrations:**

1. When assigning a database to an app (or editing an existing assignment),
   enter a migration command in the "Migration Command" field.
2. This command executes automatically after every successful build of a new
   revision.
3. The command runs once for each database that the revision can connect to -
   meaning it executes separately for production, each Git branch database, and
   preview databases.
4. The migration command runs with the same environment variables available to
   your application, including `DATABASE_URL`.

**Example using Prisma Migrate:**

Add a task to your `deno.json`:

```json
{
  "tasks": {
    "migrate": "deno run --allow-net --allow-env --allow-read npm:prisma migrate deploy"
  }
}
```

Then set your migration command to `deno task migrate` when assigning the
database to your app. Deno Deploy will automatically run this command after each
build, applying your migrations to all environment-specific databases.

### Using Prisma Tooling Locally

To manage your database schema with Prisma from your local machine, you'll need
the connection string for the specific environment database you want to work
with. You can obtain the `DATABASE_URL` by clicking the URL button found in the
database table on your database instance detail page in the Deno Deploy
dashboard.

#### Generate Prisma Client

After defining or updating your Prisma schema, generate the Prisma Client:

```bash
npx prisma generate
```

This creates the type-safe database client based on your schema.

#### Run Migrations

To apply migrations to a specific environment database from your local machine,
use the connection string for that environment:

```bash
# Apply migrations to production database
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-production" npx prisma migrate deploy

# Apply migrations to a branch database
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b--feature-branch" npx prisma migrate deploy

# Apply migrations to preview database
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-preview" npx prisma migrate deploy
```

For development, you can create and apply migrations interactively:

```bash
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-dev" npx prisma migrate dev
```

#### Seed the Database

To populate your database with initial data using Prisma's seeding feature:

```bash
# Seed production database
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-production" npx prisma db seed

# Seed branch database
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b--feature-branch" npx prisma db seed
```

## Local Development

When developing locally with a Prisma Postgres database from Deploy, create a
`.env` file in your project root with the connection details. You can obtain the
`DATABASE_URL` by clicking the URL button found in the database table on your
database instance detail page in the Deno Deploy dashboard.

```bash
PGHOST=db.prisma.io
PGPORT=5432
PGDATABASE=3ba03b-dev
PGUSER=your-username
PGPASSWORD=your-password
PGSSLMODE=require
DATABASE_URL=postgresql://your-username:your-password@db.prisma.io:5432/3ba03b-dev
```

Run your application with the `--env` flag:

```bash
deno run --env --allow-all main.ts
```

## Managing Your Prisma Postgres Instance

### Viewing Details

Click on your Prisma Postgres instance in the Databases dashboard to view:

- Connection information
- Assigned apps
- Individual databases created for each environment
- Health and connection status

### Claiming Your Prisma Project

When you provision a Prisma Postgres database, Deno Deploy creates a free-tier
project on prisma.io. This free tier includes 100K operations per month, 500 MB
storage, and 5 databases.

To upgrade your Prisma subscription plan and lift the free tier limits, you'll
need to claim your database project on prisma.io:

1. Go to your database instance detail page in the Deno Deploy dashboard.
2. Click the "Claim on Prisma" button.
3. You'll be guided through the Prisma project claim flow.
4. Select a workspace in Prisma where you want to claim the project.

Once claimed, you can manage your Prisma subscription and upgrade your plan
directly through prisma.io to increase operation limits, storage capacity, and
access additional features.

### Status Indicators

- **🟢 Connected** - All databases are ready and working
- **🟡 Creating** - Databases are being provisioned
- **🔴 Error** - Some databases failed to create
- **⚪ Unassigned** - No apps are using this database yet

### Managing App Assignments

To edit an existing app-database assignment (including updating the migration
command):

1. Go to the database detail page
2. Find the app in the "Assigned Apps" table
3. Click "Edit" next to the app

To disconnect an app from your Prisma Postgres instance:

1. Go to the database detail page
2. Find the app in the "Assigned Apps" table
3. Click "Remove" next to the app

The databases remain in your Prisma Postgres instance - only the connection
between your app and the instance is removed.

## Troubleshooting

### Provisioning Issues

**"Database creation failed"** may indicate:

- Insufficient capacity or quota limits
- Naming conflicts with existing databases
- Temporary service issues

Try using the "Fix" button to retry failed operations.

### Connection Issues

**"Error" status** can be resolved by:

- Using the "Fix" button to retry failed operations
- Checking the database detail page for more information
- Verifying your app is deployed and running

## Frequently Asked Questions

**Q: Can multiple apps share the same Prisma Postgres instance?**

Yes! Multiple apps can be assigned to the same Prisma Postgres instance. Each
app gets its own isolated databases within that instance.

**Q: What happens to my data when I remove an app assignment?**

The databases remain in your Prisma Postgres instance. Only the connection
between your app and the database is removed.

**Q: How do I access my Prisma Postgres databases directly?**

Use the connection details from your Deno Deploy dashboard with any PostgreSQL
client tool (psql, pgAdmin, TablePlus, etc.). Connect using the specific
database name shown for each environment.

**Q: Can I use the same database for multiple environments?**

By default, each environment gets its own database for isolation. You can
override this by explicitly configuring your database connection in code, though
this is not recommended for production applications.

**Q: How do I delete a Prisma Postgres instance?**

First remove all app assignments, then click "Delete" on the database instance.
This removes the Prisma Postgres instance and all its data permanently.
