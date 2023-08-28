# Deno KV

Since version 1.32, Deno has a built in key-value store that durably persists
data on disk, allowing for data storage and access across service and system
restarts.

The key-value store is designed to be fast and easy to use. Keys are sequences
(arrays) of JavaScript types like `string`, `number`, `bigint`, `boolean`, and
`Uint8Array`. Values are arbitrary JavaScript primitives, objects, and arrays.

The store supports seven different operations that can be composed together to
support many use-cases and enable persistence for most common patterns in modern
web applications. Atomic operations are available that allow grouping of any
number of modification operations into a single atomic transaction.

All data in the KV store is versioned, which allows atomic operations to be
conditional on versions in storage matching the value that user code expected.
This enables optimistic locking, enabling virtual asynchronous transactions.

All writes to the KV store are strongly consistent and immediately durably
persisted. Reads are strongly consistent by default, but alternative consistency
modes are available to enable different performance tradeoffs.

> ⚠️ Deno KV is currently **experimental** and **subject to change**. While we do
> our best to ensure data durability, data loss is possible, especially around
> Deno updates. We recommend that you backup your data regularly and consider
> storing data in a secondary store for the time being.

> 🌐 Deno KV is available in closed beta for Deno Deploy.
> [Read the Deno Deploy KV docs](/deploy/manual/kv).

## Getting started

> ⚠️ Because Deno KV is currently **experimental** and **subject to change**, it
> is only available when running with `--unstable` flag in Deno CLI.

All operations on the key-value store are performed via the `Deno.Kv` API.

A database can be opened using the `Deno.openKv()` function. This function
optionally takes a database path on disk as the first argument. If no path is
specified, the database is persisted in a global directory, bound to the script
that `Deno.openKv()` was called from. Future invocations of the same script will
use the same database.

Operations can be called on the `Deno.Kv`. The three primary operations on the
database are `get`, `set`, and `delete`. These allow reading, writing, and
deleting individual keys.

```tsx
// Open the default database for the script.
const kv = await Deno.openKv();

// Persist an object at the users/alice key.
await kv.set(["users", "alice"], { name: "Alice" });

// Read back this key.
const res = await kv.get(["users", "alice"]);
console.log(res.key); // [ "users", "alice" ]
console.log(res.value); // { name: "Alice" }

// Delete the key.
await kv.delete(["users", "alice"]);

// Reading back the key now returns null.
const res2 = await kv.get(["users", "alice"]);
console.log(res2.key); // [ "users", "alice" ]
console.log(res2.value); // null
```

The `list` operation can be used to list out all keys matching a specific
selector. In the below example all keys starting with some prefix are selected.

```tsx,ignore
await kv.set(["users", "alice"], { birthday: "January 1, 1990" });
await kv.set(["users", "sam"], { birthday: "February 14, 1985" });
await kv.set(["users", "taylor"], { birthday: "December 25, 1970" });

// List out all entries with keys starting with `["users"]`
for await (const entry of kv.list({ prefix: ["users"] })) {
  console.log(entry.key);
  console.log(entry.value);
}
```

> Note: in addition to prefix selectors, range selectors, and constrained prefix
> selectors are also available.

In addition to individual `get`, `set`, and `delete` operations, the key-value
store supports `atomic` operations that allow multiple modifications to take
place at once, optionally conditional on the existing data in the store.

In the below example, we insert a new user only if it does not yet exist by
performing an atomic operation that has a check that there is no existing value
for the given key:

```tsx,ignore
const key = ["users", "alice"];
const value = { birthday: "January 1, 1990" };
const res = await kv.atomic()
  .check({ key, versionstamp: null }) // `null` versionstamps mean 'no value'
  .set(key, value)
  .commit();
if (res.ok) {
  console.log("User did not yet exist. Inserted!");
} else {
  console.log("User already exists.");
}
```

## Examples

**Multi-player Tic-Tac-Toe**

- GitHub authentication
- Saved user state
- Real-time sync using BroadcastChannel
- [Source code](https://github.com/denoland/tic-tac-toe)
- [Live preview](https://tic-tac-toe-game.deno.dev/)

**Pixelpage**

- Persistent canvas state
- Multi-user collaboration
- Real-time sync using BroadcastChannel
- [Source code](https://github.com/denoland/pixelpage)
- [Live preview](https://pixelpage.deno.dev/)

**Todo list**

- Zod schema validation
- Built using Fresh
- Real-time collaboration using BroadcastChannel
- [Source code](https://github.com/denoland/showcase_todo)
- [Live preview](https://showcase-todo.deno.dev/)

**Sketch book**

- Stores drawings in KV
- GitHub authentication
- [Source code](https://github.com/hashrock/kv-sketchbook)
- [Live preview](https://hashrock-kv-sketchbook.deno.dev/)

**Deno KV OAuth**

- High-level OAuth 2.0 powered by Deno KV
- [Source code](https://github.com/denoland/deno_kv_oauth)
- [Live preview](https://kv-oauth.deno.dev/)

**Deno SaaSKit**

- Modern SaaS template built on Fresh.
- [Hacker News](https://news.ycombinator.com/)-like demo entirely built on KV.
- Uses Deno KV OAuth for GitHub OAuth 2.0 authentication
- [Source code](https://github.com/denoland/saaskit)
- [Live preview](https://hunt.deno.land/)

## Reference

- [API Reference](https://deno.land/api?unstable&s=Deno.Kv)
- [Key Space](./key_space.md)
- [Operations](./operations.md)
- Consistency (TODO)
- Limits (TODO)
- Performance (TODO)
- Backups & durability (TODO)

## Patterns

- [Transactions](./transactions.md)
- [Secondary Indexes](./secondary_indexes.md)
- Real-time data (TODO)
- Counters (TODO)

<!--

### Pagination

- How to use cursors
- Size limits on cursors

### Real-time data

- BroadcastChannel
- Versionstamp can be compared for staleness

### Counters

- Using KvU64 to count things

## Reference

### Consistency

- What is eventual vs strong consistency
- When to use which

### Limits

- Key size limits
- Value size limits
- Transaction size limits
- Throughput limits
- Database size limits on Deploy

### Performance

- Latency (consistency)
- Max throughput per key

### Backups

- For CLI:
  - uses sqlite
  - where is this stored
  - how to restore

-->
