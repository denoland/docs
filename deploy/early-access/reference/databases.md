---
title: Databases
description: Connect to external database instances and integrate your applications and their environments seamlessly.
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

The databases feature allows you to connect your applications to external
database servers. When you assign a database to an app, Deno Deploy
automatically provisions separate databases for each deployment environment -
production, Git branches, and preview timelines.

Your code automatically connects to the correct database for each environment
without requiring timeline detection or manual database name handling. Simply
use your favorite database driver to connect - Deno Deploy handles the
connection details automatically via environment variables.

## Getting Started

### Adding a Database

Navigate to your organization dashboard and click "Databases" in the navigation
bar. Click "Add Database" and choose your database engine - PostgreSQL is
currently supported with others planned.

You can either enter connection details manually or paste a connection string to
automatically populate the form. Connection details include your database server
hostname, port (usually 5432 for PostgreSQL), username, password, and optionally
an SSL certificate if needed.

Before saving, use the "Test Connection" button to verify your settings work
correctly. Fix any connection issues, give your database instance a memorable
name, and click "Save" to create it.

#### Using Connection Strings

Instead of filling out individual fields, you can paste a connection string like
`postgresql://username:password@hostname:port/database` to automatically
populate the form fields.

**Common formats:**

- PostgreSQL: `postgresql://user:pass@localhost:5432/dbname` or
  `postgres://user:pass@localhost:5432/dbname`

### Connecting an App to a Database

Once you have a database instance, you can assign it to your apps. From the
databases list, click "Assign" next to your database and select the app from the
dropdown.

Deno Deploy automatically creates separate databases for each timeline:

- Production deployments use `{app-id}-production`
- Git branches get `{app-id}--{branch-name}`
- Preview deployments use `{app-id}-preview`

This ensures your production data stays safe while developing and testing. You
can monitor the provisioning process and watch the status change to "Connected".
If there are any errors, use the "Fix" button to retry.

## Using Databases in Your Code

### Zero Configuration Required

Once you've assigned a database to your app, connecting to it from your code is
simple. You don't need to configure connection strings, set up environment
variables, or manage credentials - Deno Deploy handles all of this
automatically.

Simply use your favorite database library as you normally would, and it will
automatically connect to the correct database for your current environment.

### Automatic Environment Variables

Deno Deploy automatically injects standard database environment variables into
your app's runtime environment. For PostgreSQL, these include `PGHOST`,
`PGPORT`, `PGDATABASE` (automatically selected for your environment), `PGUSER`,
`PGPASSWORD`, and `PGSSLMODE`. These variables follow standard conventions, so
most database libraries automatically detect and use them without any
configuration.

### PostgreSQL Example

Here's how to connect to PostgreSQL in your Deno Deploy app:

```typescript
import { Pool } from "npm:pg";

// No configuration needed - Deno Deploy handles this automatically
const pool = new Pool();

Deno.serve(() => {
  // Use the database
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [123]);

  return new Response(JSON.stringify(result.rows), {
    headers: { "content-type": "application/json" },
  });
});
```

### How It Works

Deno Deploy automatically detects which environment your code is running in
(production, Git branch, or preview), then selects the appropriate database
based on that environment. The correct connection details are automatically set
as environment variables, and your database library reads these standard
environment variables automatically.

Your code runs the same way across all environments but connects to different
databases. The same `new Pool()` code works in production (connecting to
`myappid-production`), Git branches (connecting to `myappid--branch-name`), and
previews (connecting to `myappid-preview`).

### Migration and Schema Management

Since each environment has its own database, you can safely test migrations in a
Git branch without affecting production or other branch-specific databases.

```typescript
// Run migrations for the current environment's database
import { Pool } from "npm:pg";

const pool = new Pool();

// This runs against the correct database for each environment
await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )
`);
```

### Local Development

When developing locally, you can use either a local PostgreSQL instance (install
PostgreSQL through your package manager or download it from postgresql.org) or
connect to a remote database server.

Create a `.env` file (if one does not yet exist) in your project root and add to
it the PostgreSQL connection details:

```bash
PGHOST=localhost        # or your remote host
PGPORT=5432
PGDATABASE=myapp_dev
PGUSER=myuser
PGPASSWORD=mypassword
PGSSLMODE=prefer        # or `require` for remote connections
```

Then run your application with the `--env` flag to automatically load these
environment variables:

```bash
deno run --env --allow-all main.ts
```

Your application code remains the same - it will automatically use these
environment variables to connect to your chosen database during local
development.

## SSL Configuration

All database connections use SSL encryption for security. The main difference is
how certificates are handled depending on your database provider.

### Certificate Types

**Trusted Root CA Certificates:** Some database providers use certificates
signed by trusted root Certificate Authorities (like Let's Encrypt or DigiCert).
These work automatically without any configuration.

**Private Root CA Certificates:** Some providers use self-signed certificates or
private Certificate Authorities. In these cases, you need to upload the CA
certificate that was used to sign your database's certificate.

### Certificate Configuration

**For databases with trusted root CA certificates:** No certificate upload is
needed and SSL connections work automatically. Some managed database services
fall into this category.

**For databases with private root CA certificates:** AWS RDS users can click
"Use AWS Certificate Bundle" to automatically configure AWS RDS certificates
without downloading them from AWS documentation. Other providers require you to
upload the specific CA certificate provided by your database provider.

### Common Providers

**AWS RDS** uses AWS's own Certificate Authority (not publicly trusted). Click
"Use AWS Certificate Bundle" for automatic configuration without needing to
manually download certificates from AWS docs.

**Google Cloud SQL** uses Google's own Certificate Authority (not publicly
trusted). You need to upload the Google Cloud SQL CA certificate, which you can
download from your Google Cloud Console.

**Self-Hosted Databases** require you to upload your custom CA certificate if
using self-signed certificates, or you can configure your database to use
publicly trusted CA certificates.

## Database Management

### Viewing Database Details

Click on any database instance to see connection information (hostname, port,
engine type), assigned apps, individual databases created within the instance,
and overall health and connection status.

### Database Status Indicators

The dashboard shows clear status indicators:

- **🟢 Connected** - All databases are ready and working
- **🟡 Creating** - Databases are being provisioned
- **🔴 Error** - Some databases failed to create
- **⚪ Unassigned** - No apps are using this database yet

### Managing App Assignments

To assign a database to an app, click "Assign" on the database instance, select
the app from the dropdown, and confirm the assignment. To remove an app from a
database, go to the database detail page, find the app in the "Assigned Apps"
table, and click "Remove" next to the app.

### Editing Database Settings

Click "Edit" on any database instance to update connection details. Test the
connection to ensure it still works before saving your changes.

## Supported Database Engines

**Currently Supported:** PostgreSQL is fully supported with all features.

**Coming Soon:** MySQL, MongoDB, Redis, and more are planned for future
releases.

## Troubleshooting

### Connection Issues

**"Connection failed" errors** typically indicate:

- Incorrect hostname and port
- Wrong username and password
- Database server not running
- Network connectivity issues

Verify all connection details and ensure your database server is accessible.

**"Permission denied" errors** mean the database user lacks necessary
permissions. Verify the database user has the required permissions, can create
databases, and can connect from Deno Deploy's servers.

**SSL connection issues** occur when:

- Database instance uses a trusted root CA, but SSL connectivity is not
  configured correctly on your database server
- Database instance uses a private root CA, but you haven't uploaded the correct
  CA certificate
- Database server doesn't support SSL connections
- Certificate has expired

Check your database server's SSL configuration and certificate validity.

### Provisioning Issues

**"Database creation failed"** usually indicates:

- Database user lacks CREATE privileges
- Insufficient disk space
- Naming conflicts with existing databases

Check your database user permissions and server capacity.

**"Timeout" errors** suggest:

- Network connectivity issues between Deno Deploy and your database server
- Database server is slow to respond

Check server load and performance.

**"Error" status** can be resolved by:

- Using the "Fix" button to retry failed operations
- Checking your database server logs for more detailed information

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
