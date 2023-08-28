# Deno KV

Deno Deploy now offers a built-in serverless key-value database called Deno KV,
which is currently in closed beta testing. To join the waitlist for this
exclusive beta, please [sign up here.](https://dash.deno.com/kv). While in
closed beta, Deno KV will not charge for storage and includes up to 1GB of
storage per user.

Additionally, Deno KV is available within Deno itself, utilizing SQLite as its
backend. This feature has been accessible since Deno v1.32 with the `--unstable`
flag.

[Discover how to effectively use the Deno KV database by referring to the Deno Runtime user guide.](/runtime/manual/runtime/kv)

## Getting started

Upon receiving an invitation from the waitlist, a new “KV” tab will appear in
all your projects. This tab displays basic usage statistics and a data browser.

For GitHub projects, two separate databases are generated: one for the
production branch (usually `main`) and another for all other branches. For
playground projects, a single database is created.

No additional configuration is required. If a Deno project utilizing KV works on
a local setup, it will seamlessly function on Deploy without any modifications.

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

- Loss of one data center in the primary region: RPO=0 (no data loss), RTO<5s
  (system restoration in under 5 seconds)
- Loss of any number of data centers in a replica region: RPO=0, RTO<5s
- Loss of two or more data centers in the primary region: RPO<60s (under 60
  seconds of data loss)
