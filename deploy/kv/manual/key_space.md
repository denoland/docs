---
title: "Key Space"
oldUrl:
  - /runtime/manual/runtime/kv/key_space/
  - /kv/manual/key_space/
---

<deno-admonition></deno-admonition>

Deno KV is a key value store. The key space is a flat namespace of
key+value+versionstamp pairs. Keys are sequences of key parts, which allow
modeling of hierarchical data. Values are arbitrary JavaScript objects.
Versionstamps represent when a value was inserted / modified.

## Keys

Keys in Deno KV are sequences of key parts, which can be `string`s, `number`s,
`boolean`s, `Uint8Array`s, or `bigint`s.

Using a sequence of parts, rather than a single string eliminates the
possibility of delimiter injection attacks, because there is no visible
delimiter.

> A key injection attack occurs when an attacker manipulates the structure of a
> key-value store by injecting delimiters used in the key encoding scheme into a
> user controlled variable, leading to unintended behavior or unauthorized
> access. For example, consider a key-value store using a slash (/) as a
> delimiter, with keys like "user/alice/settings" and "user/bob/settings". An
> attacker could create a new user with the name "alice/settings/hacked" to form
> the key "user/alice/settings/hacked/settings", injecting the delimiter and
> manipulating the key structure. In Deno KV, the injection would result in the
> key `["user", "alice/settings/hacked", "settings"]`, which is not harmful.

Between key parts, invisible delimiters are used to separate the parts. These
delimiters are never visible, but ensure that one part can not be confused with
another part. For example, the key parts `["abc", "def"]`, `["ab", "cdef"]`,
`["abc", "", "def"]` are all different keys.

Keys are case sensitive and are ordered lexicographically by their parts. The
first part is the most significant, and the last part is the least significant.
The order of the parts is determined by both the type and the value of the part.

### Key Part Ordering

Key parts are ordered lexicographically by their type, and within a given type,
they are ordered by their value. The ordering of types is as follows:

1. `Uint8Array`
1. `string`
1. `number`
1. `bigint`
1. `boolean`

Within a given type, the ordering is:

- `Uint8Array`: byte ordering of the array
- `string`: byte ordering of the UTF-8 encoding of the string
- `number`: -Infinity < -1.0 < -0.5 < -0.0 < 0.0 < 0.5 < 1.0 < Infinity < NaN
- `bigint`: mathematical ordering, largest negative number first, largest
  positive number last
- `boolean`: false < true

This means that the part `1.0` (a number) is ordered before the part `2.0` (also
a number), but is greater than the part `0n` (a bigint), because `1.0` is a
number and `0n` is a bigint, and type ordering has precedence over the ordering
of values within a type.

### Key Examples

```js
["users", 42, "profile"]; // User with ID 42's profile
["posts", "2023-04-23", "comments"]; // Comments for all posts on 2023-04-23
["products", "electronics", "smartphones", "apple"]; // Apple smartphones in the electronics category
["orders", 1001, "shipping", "tracking"]; // Tracking information for order ID 1001
["files", new Uint8Array([1, 2, 3]), "metadata"]; // Metadata for a file with Uint8Array identifier
["projects", "openai", "tasks", 5]; // Task with ID 5 in the OpenAI project
["events", "2023-03-31", "location", "san_francisco"]; // Events in San Francisco on 2023-03-31
["invoices", 2023, "Q1", "summary"]; // Summary of Q1 invoices for 2023
["teams", "engineering", "members", 1n]; // Member with ID 1n in the engineering team
```

### Universally Unique Lexicographically Sortable Identifiers (ULIDs)

Key part ordering allows keys consisting of timestamps and ID parts to be listed
chronologically. Typically, you can generate a key using the following:
[`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
and
[`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID):

```js
async function setUser(user) {
  await kv.set(["users", Date.now(), crypto.randomUUID()], user);
}
```

Run multiple times sequentially, this produces the following keys:

```js
["users", 1691377037923, "8c72fa25-40ad-42ce-80b0-44f79bc7a09e"]; // First user
["users", 1691377037924, "8063f20c-8c2e-425e-a5ab-d61e7a717765"]; // Second user
["users", 1691377037925, "35310cea-58ba-4101-b09a-86232bf230b2"]; // Third user
```

However, having the timestamp and ID represented within a single key part may be
more straightforward in some cases. You can use a
[Universally Unique Lexicographically Sortable Identifier (ULID)](https://github.com/ulid/spec)
to do this. This type of identifier encodes a UTC timestamp, is
lexicographically sortable and is cryptographically random by default:

```js
import { ulid } from "jsr:@std/ulid";

const kv = await Deno.openKv();

async function setUser(user) {
  await kv.set(["users", ulid()], user);
}
```

```js
["users", "01H76YTWK3YBV020S6MP69TBEQ"]; // First user
["users", "01H76YTWK4V82VFET9YTYDQ0NY"]; // Second user
["users", "01H76YTWK5DM1G9TFR0Y5SCZQV"]; // Third user
```

Furthermore, you can generate ULIDs monotonically increasingly using
`monotonicUlid` function:

```js
import { monotonicUlid } from "jsr:@std/ulid";

async function setUser(user) {
  await kv.set(["users", monotonicUlid()], user);
}
```

```js
// Strict ordering for the same timestamp by incrementing the least-significant random bit by 1
["users", "01H76YTWK3YBV020S6MP69TBEQ"]; // First user
["users", "01H76YTWK3YBV020S6MP69TBER"]; // Second user
["users", "01H76YTWK3YBV020S6MP69TBES"]; // Third user
```

## Values

Values in Deno KV can be arbitrary JavaScript values that are compatible with
the [structured clone algorithm][structured clone algorithm]. This includes:

- `undefined`
- `null`
- `boolean`
- `number`
- `string`
- `bigint`
- `Uint8Array`
- `Array`
- `Object`
- `Map`
- `Set`
- `Date`
- `RegExp`

Objects and arrays can contain any of the above types, including other objects
and arrays. `Map`s and `Set`s can contain any of the above types, including
other `Map`s and `Set`s.

Circular references within values are supported.

Objects with a non-primitive prototype are not supported (such as class
instances or Web API objects). Functions and symbols can also not be serialized.

### `Deno.KvU64` type

In addition to structured serializable values, the special value `Deno.KvU64` is
also supported as a value. This object represents a 64-bit unsigned integer,
represented as a bigint. It can be used with the `sum`, `min`, and `max` KV
operations. It can not be stored within an object or array. It must be stored as
a top-level value.

It can be created with the `Deno.KvU64` constructor:

```js
const u64 = new Deno.KvU64(42n);
```

### Value Examples

```js,ignore
undefined;
null;
true;
false;
42;
-42.5;
42n;
"hello";
new Uint8Array([1, 2, 3]);
[1, 2, 3];
{ a: 1, b: 2, c: 3 };
new Map([["a", 1], ["b", 2], ["c", 3]]);
new Set([1, 2, 3]);
new Date("2023-04-23");
/abc/;

// Circular references are supported
const a = {};
const b = { a };
a.b = b;

// Deno.KvU64 is supported
new Deno.KvU64(42n);
```

## Versionstamp

All data in the Deno KV key-space is versioned. Every time a value is inserted
or modified, a versionstamp is assigned to it. Versionstamps are monotonically
increasing, non-sequential, 12 byte values that represent the time that the
value was modified. Versionstamps do not represent real time, but rather the
order in which the values were modified.

Because versionstamps are monotonically increasing, they can be used to
determine whether a given value is newer or older than another value. This can
be done by comparing the versionstamps of the two values. If versionstamp A is
greater than versionstamp B, then value A was modified more recently than value
B.

```js
versionstampA > versionstampB;
"000002fa526aaccb0000" > "000002fa526aacc90000"; // true
```

All data modified by a single transaction are assigned the same versionstamp.
This means that if two `set` operations are performed in the same atomic
operation, then the versionstamp of the new values will be the same.

Versionstamps are used to implement optimistic concurrency control. Atomic
operations can contain checks that ensure that the versionstamp of the data they
are operating on matches a versionstamp passed to the operation. If the
versionstamp of the data is not the same as the versionstamp passed to the
operation, then the transaction will fail and the operation will not be applied.

[structured clone algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
