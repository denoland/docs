---
title: "Deno KV Quick Start"
oldUrl:
  - /kv/
  - /kv/manual/
  - /runtime/manual/runtime/kv/
---

**Deno KV** is a
[key-value database](https://en.wikipedia.org/wiki/Key%E2%80%93value_database)
built directly into the Deno runtime, available in the
[`Deno.Kv` namespace](https://docs.deno.com/api/deno/~/Deno.Kv). It can be used
for many kinds of data storage use cases, but excels at storing simple data
structures that benefit from very fast reads and writes. Deno KV is available in
the Deno CLI and on [Deno Deploy](./on_deploy).

<deno-admonition></deno-admonition>

Let's walk through the key features of Deno KV.

## Opening a database

In your Deno program, you can get a reference to a KV database using
[`Deno.openKv()`](https://docs.deno.com/api/deno/~/Deno.openKv). You may pass in
an optional file system path to where you'd like to store your database,
otherwise one will be created for you based on the current working directory of
your script.

```ts
const kv = await Deno.openKv();
```

## Creating, updating, and reading a key-value pair

Data in Deno KV is stored as key-value pairs, much like properties of a
JavaScript object literal or a
[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
[Keys](./key_space) are represented as an array of JavaScript types, like
`string`, `number`, `bigint`, or `boolean`. Values can be arbitrary JavaScript
objects. In this example, we create a key-value pair representing a user's UI
preferences, and save it with
[`kv.set()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.set).

```ts
const kv = await Deno.openKv();

const prefs = {
  username: "ada",
  theme: "dark",
  language: "en-US",
};

const result = await kv.set(["preferences", "ada"], prefs);
```

Once a key-value pair is set, you can read it from the database with
[`kv.get()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get):

```ts
const entry = await kv.get(["preferences", "ada"]);
console.log(entry.key);
console.log(entry.value);
console.log(entry.versionstamp);
```

Both `get` and `list` [operations](./operations) return a
[KvEntry](https://docs.deno.com/api/deno/~/Deno.KvEntry) object with the
following properties:

- `key` - the array key you used to set the value
- `value` - the JavaScript object you set for this key
- `versionstamp` - a generated value used to determine if a key has been
  updated.

The `set` operation is also used to update objects that already exist for a
given key. When a key's value is updated, its `versionstamp` will change to a
new generated value.

## Listing several key-value pairs

To get values for a finite number of keys, you may use
[`kv.getMany()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.getMany).
Pass in several keys as arguments, and you'll receive an array of values for
each key. Note that **values and versionstamps can be `null`** if no value
exists for the given key(s).

```ts
const kv = await Deno.openKv();
const result = await kv.getMany([
  ["preferences", "ada"],
  ["preferences", "grace"],
]);
result[0].key; // ["preferences", "ada"]
result[0].value; // { ... }
result[0].versionstamp; // "00000000000000010000"
result[1].key; // ["preferences", "grace"]
result[1].value; // null
result[1].versionstamp; // null
```

Often, it is useful to retrieve a list of key-value pairs from all keys that
share a given prefix. This type of operation is possible using
[`kv.list()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.list). In this
example, we get a list of key-value pairs that share the `"preferences"` prefix.

```ts
const kv = await Deno.openKv();
const entries = kv.list({ prefix: ["preferences"] });
for await (const entry of entries) {
  console.log(entry.key); // ["preferences", "ada"]
  console.log(entry.value); // { ... }
  console.log(entry.versionstamp); // "00000000000000010000"
}
```

Returned keys are ordered lexicographically based on the next component of the
key after the prefix. So KV pairs with these keys:

- `["preferences", "ada"]`
- `["preferences", "bob"]`
- `["preferences", "cassie"]`

Will be returned in that order by `kv.list()`.

Read operations can either be performed in
[**strong or eventual consistency mode**](./operations). Strong consistency mode
guarantees that the read operation will return the most recently written value.
Eventual consistency mode may return a stale value, but is faster. By contrast,
writes are always performed in strong consistency mode.

## Deleting key-value pairs

You can delete a key from the database using
[`kv.delete()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.delete). No
action is taken if no value is found for the given key.

```ts
const kv = await Deno.openKv();
await kv.delete(["preferences", "alan"]);
```

## Atomic transactions

Deno KV is capable of executing [atomic transactions](./transactions), which
enables you to conditionally execute one or many data manipulation operations at
once. In the following example, we create a new preferences object only if it
hasn't been created already.

```ts
const kv = await Deno.openKv();

const key = ["preferences", "alan"];
const value = {
  username: "alan",
  theme: "light",
  language: "en-GB",
};

const res = await kv.atomic()
  .check({ key, versionstamp: null }) // `null` versionstamps mean 'no value'
  .set(key, value)
  .commit();
if (res.ok) {
  console.log("Preferences did not yet exist. Inserted!");
} else {
  console.error("Preferences already exist.");
}
```

Learn more about transactions in Deno KV [here](./transactions).

## Improve querying with secondary indexes

[Secondary indexes](./secondary_indexes) store the same data by multiple keys,
allowing for simpler queries of the data you need. Let's say that we need to be
able to access user preferences by both username AND email. To enable this, you
could provide a function that wraps the logic to save the preferences to create
two indexes.

```ts
const kv = await Deno.openKv();

async function savePreferences(prefs) {
  const key = ["preferences", prefs.username];

  // Set the primary key
  const r = await kv.set(key, prefs);

  // Set the secondary key's value to be the primary key
  await kv.set(["preferencesByEmail", prefs.email], key);

  return r;
}

async function getByUsername(username) {
  // Use as before...
  const r = await kv.get(["preferences", username]);
  return r;
}

async function getByEmail(email) {
  // Look up the key by email, then second lookup for actual data
  const r1 = await kv.get(["preferencesByEmail", email]);
  const r2 = await kv.get(r1.value);
  return r2;
}
```

Learn more about [secondary indexes in the manual here](./secondary_indexes).

## Watching for updates in Deno KV

You can also listen for updates from Deno KV with `kv.watch()`, which will emit
a new value or values of the key or keys you provide. In the below chat example,
we watch for updates on the key `["last_message_id", roomId]`. We retrieve
`messageId`, which we then use with `kv.list()` to grab all the new messages
from `seen` and `messageId`.

```ts
let seen = "";
for await (const [messageId] of kv.watch([["last_message_id", roomId]])) {
  const newMessages = await Array.fromAsync(kv.list({
    start: ["messages", roomId, seen, ""],
    end: ["messages", roomId, messageId, ""],
  }));
  await websocket.write(JSON.stringify(newMessages));
  seen = messageId;
}
```

Learn more about [using Deno KV watch here](./operations#watch).

## Production usage

Deno KV is available for use in live applications on [Deno Deploy](./on_deploy).
In production, Deno KV is backed by
[FoundationDB](https://www.foundationdb.org/), the open source key-value store
created by Apple.

**No additional configuration is necessary** to run your Deno programs that use
KV on Deploy - a new Deploy database will be provisioned for you when required
by your code. Learn more about Deno KV on Deno Deploy [here](./on_deploy).

## Testing

By default, [`Deno.openKv()`](https://docs.deno.com/api/deno/~/Deno.openKv)
creates or opens a persistent store based on the path from which the script that
invoked it was run. This isn't usually desirable for tests, which need to
produce the same behavior when run many times in a row.

To test code that uses Deno KV, you can use the special argument `":memory:"` to
create an ephemeral Deno KV datastore.

```ts
async function setDisplayName(
  kv: Deno.Kv,
  username: string,
  displayname: string,
) {
  await kv.set(["preferences", username, "displayname"], displayname);
}

async function getDisplayName(
  kv: Deno.Kv,
  username: string,
): Promise<string | null> {
  return (await kv.get(["preferences", username, "displayname"]))
    .value as string;
}

Deno.test("Preferences", async (t) => {
  const kv = await Deno.openKv(":memory:");

  await t.step("can set displayname", async () => {
    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, null);

    await setDisplayName(kv, "example", "Exemplary User");

    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, "Exemplary User");
  });
});
```

This works because Deno KV is backed by SQLite when run for local development.
Just like in-memory SQLite databases, multiple ephemeral Deno KV stores can
exist at once without interfering with one another. For more information about
special database addressing modes, see
[the SQLite docs on the topic](https://www.sqlite.org/inmemorydb.html).

## Next steps

At this point, you're just beginning to scratch the surface with Deno KV. Be
sure to check out our guide on the [Deno KV key space](./key_space), and a
collection of [tutorials and example applications](../tutorials/index.md) here.
