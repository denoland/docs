---
title: Databases
description: Connect to external database intances and integrate your applications and their
environments seamlessly.
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Connect your applications to external databases like PostgreSQL, MySQL, MongoDB,
and more. Deno Deploy automatically provisions isolated databases for your
different deployment environments.

## Overview

The databases feature allows you to connect your applications to external
database servers like PostgreSQL, MySQL, and MongoDB. When you assign a database
to your app, Deno Deploy automatically provisions separate databases for each
deployment environment - production, git branches, and preview timelines.

Your code automatically connects to the correct database for each environment
without requiring timeline detection or manual database name handling. Simply
use `new Pool()` and your app connects to the right database whether it's
running in production, a git branch, or a preview deployment.

## Getting Started

### Adding Your First Database

Start by navigating to your organization dashboard and clicking "Databases" in
the navigation bar. Click the "Add Database" button and choose your database
engine - PostgreSQL is currently supported with others planned.

You can either enter connection details manually or paste a connection string to
automatically fill the form. The connection details include your database server
hostname, port (usually 5432 for PostgreSQL), username, password, and optionally
an SSL certificate if needed.

Before saving, use the "Test Connection" button to verify your settings work
correctly. Fix any connection issues, give your database instance a memorable
name, and click "Save" to create it.

### Connecting an App to a Database

Once you have a database instance, you can assign it to your apps. From the
databases list, click "Assign" next to your database and select the app you want
to connect from the dropdown.

Deno Deploy will automatically create separate databases for each environment.
Production deployments use `{app-id}-production`, git branches get
`{app-id}--{branch-name}`, and preview deployments use `{app-id}-preview`. You
can monitor the provisioning process and watch the status change to "Connected".
If there are any errors, use the "Fix" button to retry.

## Understanding Database Provisioning

When you assign an app to a database instance, your app gets linked to the
database instance and individual databases are created for each deployment
environment. You can monitor this process in real-time through the dashboard.

**Database Naming Convention:** Databases follow a predictable pattern based on
your app and environment. Production uses `myappid-production`, git branches use
`myappid--branch-name`, and previews use `myappid-preview`.

**Environment Isolation:** Each deployment environment gets its own isolated
database. Production deployments use the production database, git branch
deployments get their own branch-specific database, and preview deployments use
the preview database. This ensures your production data stays safe while
developing and testing.

## Using Databases in Your Code

### Zero Configuration Required

Once you've assigned a database to your app, connecting to it from your code is
incredibly simple. You don't need to configure connection strings, set up
environment variables, or manage credentials - Deno Deploy handles all of this
automatically.

Simply use your favorite database library as you normally would, and it will
automatically connect to the correct database for your current environment.

### Automatic Environment Variables

Deno Deploy automatically injects standard database environment variables into
your app's runtime environment. For PostgreSQL these include `PGHOST`, `PGPORT`,
`PGDATABASE` (automatically selected for your environment), `PGUSER`,
`PGPASSWORD`, and `PGSSLMODE`. These variables follow standard conventions, so
most database libraries will automatically detect and use them without any
configuration.

### PostgreSQL Example

Here's how simple it is to connect to PostgreSQL in your Deno Deploy app:

```typescript
import { Pool } from "npm:pg";

// That's it! No configuration needed
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
(production, git branch, or preview), then selects the appropriate database
based on that environment. The correct connection details are automatically set
as environment variables, and your database library reads these standard
environment variables automatically.

Your code runs exactly the same way across all environments, but connects to
different databases. The same `new Pool()` code works in production (connecting
to `myappid-production`), git branches (connecting to `myappid--branch-name`),
and previews (connecting to `myappid-preview`).

### Development Tips

Use env variables to configure the connection to your local database. This way
the code remains the same also un your local development environment.

Use connection pooling for better performance - libraries like `pg` handle this
automatically, but you can configure pool size based on your app's needs. Always
handle database connection errors gracefully using try/catch blocks around
database operations, and log errors for debugging.

### Migration and Schema Management

Since each environment has its own database, you can safely test migrations in a
Git branch without risking changes to the production or other branch-specific
databases.

```typescript
// Run migrations for the current environment's database
import { Pool } from "npm:pg";

const pool = new Pool();

// This will run against the correct database for each environment
await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )
`);
```

## Connection Strings

### Using Connection Strings

Instead of filling out individual fields, you can paste a connection string like
`postgresql://username:password@hostname:port/database` and the form will
automatically parse it and fill in the appropriate fields.

**Common formats include:**

- PostgreSQL: `postgresql://user:pass@localhost:5432/dbname` or
  `postgres://user:pass@localhost:5432/dbname`
- MySQL: `mysql://user:pass@localhost:3306/dbname`
- MongoDB: `mongodb://user:pass@localhost:27017/dbname`

## SSL Configuration

All database connections use SSL encryption for security. The main difference is
how certificates are handled depending on your database provider.

### Certificate Types

**Trusted Root CA Certificates:** Some database providers use certificates
signed by trusted root Certificate Authorities (like Let's Encrypt, DigiCert,
etc.). These work automatically without any configuration.

**Private Root CA Certificates:** Some database providers use self-signed
certificates or private Certificate Authorities. In these cases, you need to
upload the CA certificate that was used to sign your database's certificate.

### Certificate Configuration

**For databases with certificates signed by trusted root CA:** No certificate
upload is needed and SSL connections work automatically. Some managed database
services fall into this category.

**For databases with certificates signed by private root CA:** AWS RDS users can
click the "Use AWS Certificate Bundle" button to automatically configure AWS RDS
certificates without having to download them from AWS documentation. Other
providers require you to upload the specific CA certificate provided by your
database provider.

### Common Providers

**AWS RDS** uses AWS's own Certificate Authority (not publicly trusted). Click
"Use AWS Certificate Bundle" for automatic configuration without needing to
manually download certificates from AWS docs.

**Google Cloud SQL** uses Google's own Certificate Authority (not publicly
trusted). You need to upload the Google Cloud SQL CA certificate, which you can
download from your Google Cloud Console.

**Self-Hosted Databases** require you to upload your custom CA certificate if
using self-signed certificates, or you can configure your database to use
trusted root CA certificates.

## Database Management

### Viewing Database Details

Click on any database instance to see connection information (hostname, port,
engine type), assigned apps, individual databases created within the instance,
and overall health and connection status.

### Database Status Indicators

The dashboard shows clear status indicators:

- **🟢 Connected** means all databases are ready and working
- **🟡 Creating** means databases are being provisioned
- **🔴 Error** means some databases failed to create
- **⚪ Unassigned** means no apps are using this database yet.

### Managing App Assignments

To assign a database to an app, click "Assign" on the database instance, select
the app from the dropdown, and confirm the assignment. To remove an app from a
database, go to the database detail page, find the app in the "Assigned Apps"
table, and click "Remove" next to the app.

### Editing Database Settings

Click "Edit" on any database instance to update connection details. Test the
connection to ensure it still works before saving your changes.

## Troubleshooting

### Connection Issues

**"Connection failed" errors** typically indicate incorrect hostname and port,
wrong username and password, database server not running, or network
connectivity issues. Verify all connection details and ensure your database
server is accessible.

**"Permission denied" errors** mean the database user lacks necessary
permissions. Verify the database user has necessary permissions, can create
databases, and can connect from Deno Deploy's servers.

**SSL connection issues** if your database instance uses a trusted root CA,
verify that SSL connectivity is configured correctly on your database server. If
it uses a private root CA, ensure you've uploaded the correct CA certificate.
Also make sure your database server supports SSL connections and verify the
certificate hasn't expired.

### Provisioning Issues

**"Database creation failed"** usually means the database user lacks CREATE
privileges, there's insufficient disk space, or there are naming conflicts with
existing databases. Check your database user permissions and server capacity.

**"Timeout" errors** suggest network connectivity issues between Deno Deploy and
your database server, or your database server is slow to respond. Check server
load and performance.

**"Error" status** can be resolved by using the "Fix" button to retry failed
operations or checking your database server logs for more detailed information.

## Best Practices

### Database Instance Management

Use descriptive names for your database instances and test connections before
saving configurations. Monitor status regularly to catch issues early.

### App Assignment

Monitor provisioning after assigning new apps and clean up unused assignments to
keep things organized.

### Security

Use strong passwords for database connections, rotate credentials regularly, and
limit database user permissions to what's necessary.

### Performance

Monitor database load when multiple apps share an instance, scale your database
server as your apps grow, and use connection pooling in your applications when
possible.

## Supported Database Engines

**Currently Supported:** PostgreSQL is fully supported with all features.

**Coming Soon:** MySQL, MongoDB, Redis, and more are planned for future
releases.

## Frequently Asked Questions

**Q: Can multiple apps share the same database instance?** A: Yes! Multiple apps
can be assigned to the same database instance. Each app gets its own isolated
databases within that instance.

**Q: What happens to my data when I remove an app assignment?** A: The databases
remain on your database server. Only the connection between your app and the
database instance is removed.

**Q: Can I use the same database for multiple environments?** A: By default,
each environment (production, branch, preview) gets its own database to ensure
isolation and prevent data conflicts. However, you can always use the options in
our database library to customize the database your code connects to.

**Q: How do I access my databases directly?** A: You can connect directly to
your database server using the connection details you provided. Use the database
names shown in the Deno Deploy dashboard.

**Q: Can I change database connection details?** A: Yes, click "Edit" on any
database instance to update connection details. Test the connection before
saving to ensure it works.

**Q: How do I delete a database instance?** A: First remove all app assignments,
then click "Delete" on the database instance. This only removes the connection
from Deno Deploy - your actual database server is not affected.

## Getting Help

If you encounter issues, check the status indicators and error messages in the
dashboard, review the troubleshooting section above, or contact support with
specific error messages and steps to reproduce the issue.

Remember: The databases feature only manages connections and provisioning. Your
actual database server management (backups, scaling, maintenance) is still your
responsibility.
