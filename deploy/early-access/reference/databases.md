# Databases

Connect your applications to external databases like PostgreSQL, MySQL, MongoDB,
and more. Deno Deploy automatically provisions isolated databases for your
different deployment environments.

## Overview

The databases feature allows you to:

- Connect to external database servers
- Automatically provision databases for your apps
- Get separate databases for production, git branches, and preview timelines
- Manage database assignments across multiple apps

Your code automatically connects to the correct database for each timeline
without requiring timeline detection or manual database name handling. Simply
use `new Pool()` and your app connects to the right database whether it's
running in production, a git branch, or a preview deployment.

## Getting Started

### Adding Your First Database

1. **Navigate to Databases**

   - Go to your organization dashboard
   - Click "Databases" in the sidebar

2. **Add Database Instance**

   - Click "Add Database" button
   - Choose your database engine (PostgreSQL is currently supported)
   - Enter connection details or paste a connection string

3. **Configure Connection**

   - **Hostname**: Your database server address
   - **Port**: Database port (usually 5432 for PostgreSQL)
   - **Username**: Database username
   - **Password**: Database password
   - **SSL Certificate**: Upload if using SSL (optional)

4. **Test Connection**

   - Click "Test Connection" to verify settings
   - Fix any connection issues before saving

5. **Save**
   - Give your database instance a memorable name
   - Click "Save" to create the database instance

### Connecting an App to a Database

1. **Assign Database to App**

   - From the databases list, click "Assign" next to your database
   - Select the app you want to connect
   - Click "Assign"

2. **Automatic Provisioning**

   - Deno Deploy automatically creates separate databases for:
     - **Production**: `{app-id}-production`
     - **Git Branches**: `{app-id}--{branch-name}`
     - **Previews**: `{app-id}-preview`

3. **Monitor Status**
   - Watch the status indicator change to "Connected"
   - If there are errors, click "Fix" to retry provisioning

## Database Management

### Viewing Database Details

Click on any database instance to see:

- **Connection Information**: Hostname, port, engine type
- **Assigned Apps**: Which apps are using this database
- **Individual Databases**: All databases created within this instance
- **Status**: Overall health and connection status

### Database Status Indicators

- **🟢 Connected**: All databases are ready and working
- **🟡 Creating**: Databases are being provisioned
- **🔴 Error**: Some databases failed to create
- **⚪ Unassigned**: No apps are using this database yet

### Managing App Assignments

**To assign a database to an app:**

1. Click "Assign" on the database instance
2. Select the app from the dropdown
3. Confirm the assignment

**To remove an app from a database:**

1. Go to the database detail page
2. Find the app in the "Assigned Apps" table
3. Click "Remove" next to the app

### Editing Database Settings

1. Click "Edit" on any database instance
2. Update connection details as needed
3. Test the connection to ensure it still works
4. Save your changes

## Understanding Database Provisioning

When you assign an app to a database instance:

1. **Link Creation**: Your app is linked to the database instance
2. **Database Provisioning**: Individual databases are created for each
   deployment environment
3. **Status Updates**: You can monitor the provisioning process in real-time

### Database Naming Convention

Databases are automatically named based on your app and environment:

- Production: `myapp-production`
- Git branch: `myapp--feature-branch`
- Preview: `myapp-preview`

### Environment Isolation

Each deployment environment gets its own isolated database:

- **Production deployments** use the production database
- **Git branch deployments** get their own branch-specific database
- **Preview deployments** use the preview database

This ensures your production data stays safe while developing and testing.

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
your app's runtime environment:

- `PGHOST` - Database hostname
- `PGPORT` - Database port
- `PGDATABASE` - Database name (automatically selected for your environment)
- `PGUSER` - Database username
- `PGPASSWORD` - Database password
- `PGSSLMODE` - SSL mode configuration

These variables follow standard conventions, so most database libraries will
automatically detect and use them without any configuration.

### PostgreSQL Example

Here's how simple it is to connect to PostgreSQL in your Deno Deploy app:

```typescript
import { Pool } from "npm:pg";

// That's it! No configuration needed
const pool = new Pool();

// Use the database
export default async function handler(req: Request) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [123]);

  return new Response(JSON.stringify(result.rows), {
    headers: { "content-type": "application/json" },
  });
}
```

### How It Works

1. **Environment Detection**: Deno Deploy automatically detects which
   environment your code is running in (production, git branch, or preview)

2. **Database Selection**: Based on the environment, it selects the appropriate
   database:

   - Production timeline → `myapp-production`
   - Git branch timeline → `myapp--feature-branch`
   - Preview timeline → `myapp-preview`

3. **Environment Variables**: The correct connection details are automatically
   set as environment variables

4. **Library Integration**: Your database library (like `pg` for PostgreSQL)
   automatically reads these standard environment variables

### Other Database Examples

**MySQL:**

```typescript
import { Client } from "https://deno.land/x/mysql/mod.ts";

// MySQL libraries also auto-detect environment variables
const client = new Client();
await client.connect();
```

**MongoDB:**

```typescript
import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

// MongoDB connection string is automatically constructed
const client = new MongoClient();
await client.connect();
```

### Environment-Specific Behavior

Your code runs exactly the same way across all environments, but connects to
different databases:

```typescript
// This same code works in all environments
const pool = new Pool();

// In production: connects to myapp-production
// In git branch: connects to myapp--feature-branch
// In preview: connects to myapp-preview
```

### Custom Configuration (Optional)

If you need to customize connection settings, you can still do so:

```typescript
import { Pool } from "npm:pg";

const pool = new Pool({
  // Environment variables are still available if needed
  host: Deno.env.get("PGHOST"),
  port: parseInt(Deno.env.get("PGPORT") || "5432"),
  database: Deno.env.get("PGDATABASE"),
  user: Deno.env.get("PGUSER"),
  password: Deno.env.get("PGPASSWORD"),

  // Add your custom settings
  max: 20,
  idleTimeoutMillis: 30000,
});
```

### Development Tips

**Local Development:**

- Set up local environment variables that match the deployed environment
- Use the same database library and connection pattern
- Test with multiple database environments

**Connection Pooling:**

- Use connection pooling for better performance
- Libraries like `pg` handle this automatically
- Configure pool size based on your app's needs

**Error Handling:**

- Always handle database connection errors gracefully
- Use try/catch blocks around database operations
- Log errors for debugging

### Migration and Schema Management

Since each environment gets its own database, you'll need to manage schema
across environments:

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

The beauty of this system is that your application code remains
environment-agnostic while automatically connecting to the right database based
on where it's deployed.

## Connection Strings

### Using Connection Strings

Instead of filling out individual fields, you can paste a connection string:

```
postgresql://username:password@hostname:port/database
```

The form will automatically parse the connection string and fill in the
appropriate fields.

### Common Connection String Formats

**PostgreSQL:**

```
postgresql://user:pass@localhost:5432/dbname
postgres://user:pass@localhost:5432/dbname
```

**MySQL:**

```
mysql://user:pass@localhost:3306/dbname
```

**MongoDB:**

```
mongodb://user:pass@localhost:27017/dbname
```

## SSL Configuration

All database connections use SSL encryption for security. The main difference is
how certificates are handled depending on your database provider.

### Certificate Types

**Trusted Root CA Certificates (Most Common):** Many database providers use
certificates signed by trusted root Certificate Authorities (like Let's Encrypt,
DigiCert, etc.). These work automatically without any configuration.

**Self-Signed Certificates:** Some database providers use self-signed
certificates or private Certificate Authorities. In these cases, you need to
upload the CA certificate that was used to sign your database's certificate.

### Certificate Configuration

**For databases with certificates signed by trusted root CA:**

- No certificate upload needed
- SSL connections work automatically
- Some managed database services fall into this category

**For databases with certificates signed by private root CA:**

1. **AWS RDS**: Click the "Use AWS Certificate Bundle" button to automatically
   configure AWS RDS certificates without having to download them from AWS
   documentation
2. **Other Providers**: Upload the specific CA certificate provided by your
   database provider

### Common Providers

**AWS RDS:**

- Uses AWS's own Certificate Authority (not publicly trusted)
- Click "Use AWS Certificate Bundle" for automatic configuration
- No need to manually download certificates from AWS docs

**Google Cloud SQL:**

- Uses Google's own Certificate Authority (not publicly trusted)
- You need to upload the Google Cloud SQL CA certificate
- Download the certificate from your Google Cloud Console

**Self-Hosted Databases:**

- Upload your custom CA certificate if using self-signed certificates
- Or configure your database to use trusted root CA certificates

## Troubleshooting

### Connection Issues

**"Connection failed" errors:**

- Verify hostname and port are correct
- Check username and password
- Ensure your database server is running
- Test network connectivity

**"Permission denied" errors:**

- Verify database user has necessary permissions
- Check that the user can create databases
- Ensure the user can connect from Deno Deploy's servers

**SSL connection issues:**

- **Trusted root CA databases**: Verify SSL is configured on your database
  server
- **Private CA certificates**: Ensure you've uploaded the correct CA certificate
- Check that your database server supports SSL connections
- Verify the certificate hasn't expired

### Provisioning Issues

**"Database creation failed":**

- Check if database user has CREATE privileges
- Verify there's enough disk space
- Look for naming conflicts with existing databases

**"Timeout" errors:**

- Check the network connectivity between Deno Deploy and your database server
- Your database server might be slow to respond
- Check server load and performance

**"Error" status:**

- Use the "Fix" button to retry failed operations
- Check your database server logs for more information

## Best Practices

### Database Instance Management

- **Use descriptive names** for your database instances
- **Test connections** before saving configurations
- **Monitor status regularly** to catch issues early

### App Assignment

- **Monitor provisioning** after assigning new apps
- **Clean up unused assignments** to keep things organized

### Security

- **Use strong passwords** for database connections
- **Rotate credentials** regularly
- **Limit database user permissions** to what's necessary

### Performance

- **Monitor database load** when multiple apps share an instance
- **Scale your database server** as your apps grow
- **Use connection pooling** in your applications when possible

## Supported Database Engines

### Currently Supported

- **PostgreSQL** - Fully supported with all features

### Coming Soon

- **MySQL** - Support planned
- **MongoDB** - Support planned
- **Redis** - Support planned

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

If you encounter issues:

1. Check the status indicators and error messages in the dashboard
2. Review the troubleshooting section above
3. Contact support with specific error messages and steps to reproduce the issue

Remember: The databases feature only manages connections and provisioning. Your
actual database server management (backups, scaling, maintenance) is still your
responsibility.
