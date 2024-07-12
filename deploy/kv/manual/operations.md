---
title: "Operations"
oldUrl:
  - /runtime/manual/runtime/kv/operations/
  - /kv/manual/operations/
---

<deno-admonition></deno-admonition>

The Deno KV API provides a set of operations that can be performed on the key
space.

There are two operations that read data from the store, and five operations that
write data to the store.

Read operations can either be performed in strong or eventual consistency mode.
Strong consistency mode guarantees that the read operation will return the most
recently written value. Eventual consistency mode may return a stale value, but
is faster.

Write operations are always performed in strong consistency mode.

## `get`

The `get` operation returns the value and versionstamp associated with a given
key. If a value does not exist, get returns a `null` value and versionstamp.

There are two APIs that can be used to perform a `get` operation. The
[`Deno.Kv.prototype.get(key, options?)`][get] API, which can be used to read a
single key, and the [`Deno.Kv.prototype.getMany(keys, options?)`][getMany] API,
which can be used to read multiple keys at once.

Get operations are performed as a "snapshot read" in all consistency modes. This
means that when retrieving multiple keys at once, the values returned will be
consistent with each other.

```ts
const res = await kv.get<string>(["config"]);
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }

const res = await kv.get<string>(["config"], { consistency: "eventual" });
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }

const [res1, res2, res3] = await kv.getMany<[string, string, string]>([
  ["users", "sam"],
  ["users", "taylor"],
  ["users", "alex"],
]);
console.log(res1); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
console.log(res2); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
console.log(res3); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
```

## `list`

The `list` operation returns a list of keys that match a given selector. The
associated values and versionstamps for these keys are also returned. There are
2 different selectors that can be used to filter the keys matched.

The `prefix` selector matches all keys that start with the given prefix key
parts, but not inclusive of an exact match of the key. The prefix selector may
optionally be given a `start` OR `end` key to limit the range of keys returned.
The `start` key is inclusive, and the `end` key is exclusive.

The `range` selector matches all keys that are lexographically between the given
`start` and `end` keys. The `start` key is inclusive, and the `end` key is
exclusive.

> Note: In the case of the prefix selector, the `prefix` key must consist only
> of full (not partial) key parts. For example, if the key `["foo", "bar"]`
> exists in the store, then the prefix selector `["foo"]` will match it, but the
> prefix selector `["f"]` will not.

The list operation may optionally be given a `limit` to limit the number of keys
returned.

List operations can be performed using the
[`Deno.Kv.prototype.list<string>(selector, options?)`][list] method. This method
returns a `Deno.KvListIterator` that can be used to iterate over the keys
returned. This is an async iterator, and can be used with `for await` loops.

```ts
// Return all users
const iter = kv.list<string>({ prefix: ["users"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
console.log(users[2]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }

// Return the first 2 users
const iter = kv.list<string>({ prefix: ["users"] }, { limit: 2 });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }

// Return all users lexicographically after "taylor"
const iter = kv.list<string>({ prefix: ["users"], start: ["users", "taylor"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }

// Return all users lexicographically before "taylor"
const iter = kv.list<string>({ prefix: ["users"], end: ["users", "taylor"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }

// Return all users starting with characters between "a" and "n"
const iter = kv.list<string>({ start: ["users", "a"], end: ["users", "n"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
```

The list operation reads data from the store in batches. The size of each batch
can be controlled using the `batchSize` option. The default batch size is 500
keys. Data within a batch is read in a single snapshot read, so the values are
consistent with each other. Consistency modes apply to each batch of data read.
Across batches, data is not consistent. The borders between batches is not
visible from the API as the iterator returns individual keys.

The list operation can be performed in reverse order by setting the `reverse`
option to `true`. This will return the keys in lexicographically descending
order. The `start` and `end` keys are still inclusive and exclusive
respectively, and are still interpreted as lexicographically ascending.

```ts
// Return all users in reverse order, ending with "sam"
const iter = kv.list<string>({ prefix: ["users"], start: ["users", "sam"] }, {
  reverse: true,
});
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
```

> Note: in the above example we set the `start` key to `["users", "sam"]`, even
> though the first key returned is `["users", "taylor"]`. This is because the
> `start` and `end` keys are always evaluated in lexicographically ascending
> order, even when the list operation is performed in reverse order (which
> returns the keys in lexicographically descending order).

## `set`

The `set` operation sets the value of a key in the store. If the key does not
exist, it is created. If the key already exists, its value is overwritten.

The `set` operation can be performed using the
[`Deno.Kv.prototype.set(key, value)`][set] method. This method returns a
`Promise` that resolves to a `Deno.KvCommitResult` object, which contains the
`versionstamp` of the commit.

Set operations are always performed in strong consistency mode.

```ts
const res = await kv.set(["users", "alex"], "alex");
console.log(res.versionstamp); // "00a44a3c3e53b9750000"
```

## `delete`

The `delete` operation deletes a key from the store. If the key does not exist,
the operation is a no-op.

The `delete` operation can be performed using the
[`Deno.Kv.prototype.delete(key)`][delete] method.

Delete operations are always performed in strong consistency mode.

```ts
await kv.delete(["users", "alex"]);
```

## `sum`

The `sum` operation atomically adds a value to a key in the store. If the key
does not exist, it is created with the value of the sum. If the key already
exists, its value is added to the sum.

The `sum` operation can only be performed as part of an atomic operation. The
[`Deno.AtomicOperation.prototype.mutate({ type: "sum", value })`][mutate] method
can be used to add a sum mutation to an atomic operation.

The sum operation can only be performed on values of type `Deno.KvU64`. Both the
operand and the value in the store must be of type `Deno.KvU64`.

If the new value of the key is greater than `2^64 - 1` or less than `0`, the sum
operation wraps around. For example, if the value in the store is `2^64 - 1` and
the operand is `1`, the new value will be `0`.

Sum operations are always performed in strong consistency mode.

```ts
await kv.atomic()
  .mutate({
    type: "sum",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `min`

The `min` operation atomically sets a key to the minimum of its current value
and a given value. If the key does not exist, it is created with the given
value. If the key already exists, its value is set to the minimum of its current
value and the given value.

The `min` operation can only be performed as part of an atomic operation. The
[`Deno.AtomicOperation.prototype.mutate({ type: "min", value })`][mutate] method
can be used to add a min mutation to an atomic operation.

The min operation can only be performed on values of type `Deno.KvU64`. Both the
operand and the value in the store must be of type `Deno.KvU64`.

Min operations are always performed in strong consistency mode.

```ts
await kv.atomic()
  .mutate({
    type: "min",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `max`

The `max` operation atomically sets a key to the maximum of its current value
and a given value. If the key does not exist, it is created with the given
value. If the key already exists, its value is set to the maximum of its current
value and the given value.

The `max` operation can only be performed as part of an atomic operation. The
[`Deno.AtomicOperation.prototype.mutate({ type: "max", value })`][mutate] method
can be used to add a max mutation to an atomic operation.

The max operation can only be performed on values of type `Deno.KvU64`. Both the
operand and the value in the store must be of type `Deno.KvU64`.

Max operations are always performed in strong consistency mode.

```ts
await kv.atomic()
  .mutate({
    type: "max",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `watch`

The `watch` operation accepts an array of keys, and returns a
[`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream),
which emits a new value whenever any of the watched keys change their
`versionstamp`. The emitted value is an array of
[Deno.KvEntryMaybe](https://docs.deno.com/api/deno/~/Deno.KvEntryMaybe&unstable=)
objects.

Note that the returned stream does not return every single intermediate state of
the watched keys, but keeps you up to date with the latest state of keys. This
means if a key is modified multiple times quickly, you may not receive a
notification for every change, but the latest state of the key.

```ts
const db = await Deno.openKv();

const stream = db.watch([["foo"], ["bar"]]);
for await (const entries of stream) {
  entries[0].key; // ["foo"]
  entries[0].value; // "bar"
  entries[0].versionstamp; // "00000000000000010000"
  entries[1].key; // ["bar"]
  entries[1].value; // null
  entries[1].versionstamp; // null
}
```

[get]: https://docs.deno.com/api/deno/~/Deno.Kv&p=prototype.get&unstable
[getMany]: https://docs.deno.com/api/deno/~/Deno.Kv&p=prototype.getMany&unstable
[list]: https://docs.deno.com/api/deno/~/Deno.Kv&p=prototype.list&unstable
[set]: https://docs.deno.com/api/deno/~/Deno.Kv&p=prototype.set&unstable
[delete]: https://docs.deno.com/api/deno/~/Deno.Kv&p=prototype.delete&unstable
[mutate]: https://docs.deno.com/api/deno/~/Deno.AtomicOperation&p=prototype.mutate&unstable
