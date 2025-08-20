---
title: Deno KV
description: Use Deno KV in your applications with a database for each timeline
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

[Deno KV] is supported in Deno Deploy EA as a possible database engine of the
[databases] feature, alongside PostgreSQL, and others. Thanks to the new
[timelines] capability of Deno Deploy EA, your apps now have full control over
the Deno KV databases used (one for production, one for each git branch, etc)
ensuring data isolation and security across all their environments.

Like with the rest of the database engines, your code automatically connects to
the correct database for each environment without requiring timeline detection
or manual database name handling.

## Getting Started

### Adding a Database

Navigate to your organization dashboard and click "Databases" in the navigation
bar. Click "Add Database", choose Deno KV as the database engine, provide a
memorable name and save.

### Connecting an App to a Database

Just like with any other [databases] engine, once you have a database instance
you can assign it to your apps. From the database instances list, click "Assign"
next to your database instance and select the app from the dropdown.

Deno Deploy automatically creates separate databases for each timeline. This
ensures your production data stays safe while developing and testing. You can
monitor the provisioning process and watch the status change to "Connected". If
there are any errors, use the "Fix" button to retry.

## Using Deno KV in Your Code

### Zero Configuration Required

Once you've assigned a database to your app, connecting to it from your code is
simple. Deno Deploy takes care of setting up the connection to the right
database according to environment being queried.

### Example

Here's how to connect to Deno KV in your Deno Deploy app:

```typescript
const kv = await Deno.openKv();

Deno.serve(async () => {
  const res = await kv.get<number>(["requests"]);
  const requests = res.value + 1;
  await kv.set(["requests"], requests);
  return new Response(JSON.stringify(requests));
});
```

For detailed information about Deno KV and its features, see the
[Deno KV documentation][Deno KV].

## Data distribution

Deno KV databases are replicated across at least 3 data centers in the primary
region, North Virginia (us-east4). Once a write operation is committed, its
mutations are persistently stored in a quorum of data centers within the primary
region. Cross-region replication is currently not available.

## Frequently Asked Questions

**Q: How is data stored during local development?**

In your local development environment, data is maintained in memory. No database needs to be created or allocated prior to using the KV APIs in local development, and your KV code can be consistent between environments.

**Q: What happens to my data when I remove an app assignment?**

The data in the databases remain on the servers. To recover or delete the data
in these databases, please [contact Deno support](../support).

**Q: Can I use the same database for multiple environments?**

This is currently not supported. If you are interested in this use case, please
[contact Deno support](../support).

**Q: How do I delete a database instance?**

Click "Delete" on the Deno KV entry in the database instances list. Unlike with
the rest of database engines, this action will delete all the existing Deno KV
databases and their data. Please make sure to backup your data before
proceeding.

[Deno KV]: /kv/
[databases]: ./databases.md
[timelines]: ./timelines.md
