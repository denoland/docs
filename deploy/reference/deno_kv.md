---
title: Deno KV
description: Use Deno KV in your applications with a dedicated database per timeline
oldUrl: /deploy/reference/deno-kv/
---

[Deno KV] is a Key Value database supported in Deno Deploy as a database engine
option in the [databases] feature. Thanks to the new [timelines] capability in
Deno Deploy Early Access (EA), your apps have full control over the Deno KV
databases they use (for example, one for production and one for each Git
branch), ensuring data isolation and security across environments.

As with other database engines, your code automatically connects to the correct
database for each environment—no timeline detection or manual database naming
required.

## Getting Started

### Add a KV database

Navigate to your organization dashboard and click "Databases" in the navigation
bar. Click "Provision Database", choose Deno KV as the database engine, provide
a memorable name, and save.

### Connect an app to a KV database

Once you have a database instance you can assign it to an app. From the database
instances list, click "Assign" next to the database you wish to use and select
the app from the dropdown.

Deno Deploy automatically creates a separate database for each timeline. This
keeps your production data safe while you develop and test. You can monitor
provisioning and watch the status change to "Connected." If any errors occur,
click "Fix" to retry.

## Using Deno KV in Your Code

Once you've assigned a database to your app, connecting from code is simple.
Deno Deploy sets up the connection to the correct database based on the current
environment.

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

## Un-assigning a KV database

If you remove a database assignment from an app, the app will no longer be able
to access that database. However, the database itself and its data will remain
intact and can be reassigned to another app or the same app at a later time.
Hover over the name of the assigned app in the databases list and click the
'remove app assignment' icon to un-assign it.

## Data Distribution

Deno KV databases are replicated across at least three data centers in the
primary region, Northern Virginia (us-east4). Once a write operation is
committed, its mutations are durably stored in a quorum of data centers within
the primary region. Cross-region replication is not currently available.

## Data storage

In local development, data is kept in memory. You do not need to create or
allocate a database before using the KV APIs locally, and your KV code remains
consistent across environments.

## Deleting a database instance

Click "Delete" on the Deno KV entry in the database instances list. Unlike other
database engines, this action deletes all existing Deno KV databases and their
data. Be sure to back up your data before proceeding.

[Deno KV]: /deploy/kv/
[databases]: /deploy/reference/databases/
[timelines]: /deploy/reference/timelines/
