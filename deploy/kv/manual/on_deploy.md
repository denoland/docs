---
title: "KV on Deno Deploy"
oldUrl:
  - /deploy/manual/kv/
  - /kv/manual/on_deploy/
---

<deno-admonition></deno-admonition>

Deno Deploy now offers a built-in serverless key-value database called Deno KV.

Additionally, Deno KV is available within Deno itself, utilizing SQLite as its
backend. This feature has been accessible since Deno v1.32 with the `--unstable`
flag. Learn more about [Deno KV](/deploy/kv/manual).

## Consistency

Deno KV, by default, is a strongly-consistent database. It provides the
strictest form of strong consistency called _external consistency_, which
implies:

- **Serializability**: This is the highest level of isolation for transactions.
  It ensures that the concurrent execution of multiple transactions results in a
  system state that would be the same as if the transactions were executed
  sequentially, one after another. In other words, the end result of
  serializable transactions is equivalent to some sequential order of these
  transactions.
- **Linearizability**: This consistency model guarantees that operations, such
  as read and write, appear to be instantaneous and occur in real-time. Once a
  write operation completes, all subsequent read operations will immediately
  return the updated value. Linearizability ensures a strong real-time ordering
  of operations, making the system more predictable and easier to reason about.

Meanwhile, you can choose to relax consistency constraints by setting the
`consistency: "eventual"` option on individual read operations. This option
allows the system to serve the read from global replicas and caches for minimal
latency.

Below are the latency figures observed in our top regions:

| Region                     | Latency (Eventual Consistency) | Latency (Strong Consistency) |
| -------------------------- | ------------------------------ | ---------------------------- |
| North Virginia (us-east4)  | 7ms                            | 7ms                          |
| Frankfurt (europe-west3)   | 7ms                            | 94ms                         |
| Netherlands (europe-west4) | 13ms                           | 95ms                         |
| California (us-west2)      | 72ms                           | 72ms                         |
| Hong Kong (asia-east2)     | 42ms                           | 194ms                        |

## Distributed queues

Serverless distributed queues are available on Deno Deploy. See
[Queues on Deno Deploy](/deploy/kv/manual/queue_overview#queues-on-deno-deploy)
for more details.

## Connect to managed databases from outside of Deno Deploy

You can connect to your Deno Deploy KV database from your Deno application
outside of Deno Deploy. To open a managed database, set the
`DENO_KV_ACCESS_TOKEN` environment variable to a Deno Deploy personal access
token and provide the URL of the database to `Deno.openKv`:

```ts
const kv = await Deno.openKv(
  "https://api.deno.com/databases/<database-id>/connect",
);
```

Please check the
[docs](https://github.com/denoland/deno/tree/main/ext/kv#kv-connect) for the
specification of the protocol for connecting to a remote KV database

## Data distribution

Deno KV databases are replicated across at least 6 data centers, spanning 3
regions (US, Europe, and Asia). Once a write operation is committed, its
mutations are persistently stored in a minimum of two data centers within the
primary region. Asynchronous replication typically transfers these mutations to
the other two regions in under 10 seconds.

The system is designed to tolerate most data center-level failures without
experiencing downtime or data loss. Recovery Point Objectives (RPO) and Recovery
Time Objectives (RTO) help quantify the system's resilience under various
failure modes. RPO represents the maximum acceptable amount of data loss
measured in time, whereas RTO signifies the maximum acceptable time required to
restore the system to normal operations after a failure.

- Loss of one data center in the primary region: RPO=0 (no data loss), RTO&lt;5s
  (system restoration in under 5 seconds)
- Loss of any number of data centers in a replica region: RPO=0, RTO&lt;5s
- Loss of two or more data centers in the primary region: RPO&lt;60s (under 60
  seconds of data loss)
