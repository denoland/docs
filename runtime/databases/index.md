---
last_modified: 2026-06-16
title: "Databases"
description: "Use databases with Deno: the built-in node:sqlite and Deno KV, plus Postgres, MySQL, MongoDB, and Redis through the same npm drivers you use in Node.js."
---

Deno ships two databases inside the runtime, with nothing to install:

- **`node:sqlite`** — a built-in SQLite module (added in Deno 2.2).
- **Deno KV** — a built-in key-value store that needs zero configuration on
  [Deno Deploy](/deploy/).

For every other database — Postgres, MySQL, MongoDB, Redis, and the rest — you
use the **same npm driver you would in Node.js**. Deno reads npm packages
directly through [Node.js compatibility](/runtime/fundamentals/node/), so the
connection code is identical to a Node project: import the driver and connect.

## SQLite, built in

SQLite runs in-process with no server and no dependency to add. Import
`DatabaseSync` from `node:sqlite`, open a file, and run SQL:

```ts title="main.ts"
import { DatabaseSync } from "node:sqlite";

// Open (or create) a database file
const db = new DatabaseSync("test.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
  );
`);

// Insert a row with bound parameters
db.prepare("INSERT INTO people (name, age) VALUES (?, ?);").run("Bob", 40);

// Query it back
const rows = db.prepare("SELECT id, name, age FROM people").all();
console.log(rows);

db.close();
```

Because it reads and writes a file, run it with read and write permission:

```sh
deno run -R -W main.ts
```

See the [full SQLite example](/examples/sqlite/) for more operations.

## Deno KV, built in

[Deno KV](/deploy/kv/) is a key-value database built into the runtime. Open the
default store with [`Deno.openKv()`](/api/deno/~/Deno.openKv); keys are arrays,
so you can lay data out hierarchically and list by prefix:

```ts title="main.ts"
const kv = await Deno.openKv();

// Store, then read back a single record
await kv.set(["players", "alice"], { rank: "gold" });
const alice = await kv.get(["players", "alice"]);
console.log(alice.key, alice.value);

// List every record under a key prefix, ordered lexicographically
for await (const entry of kv.list({ prefix: ["players"] })) {
  console.log(entry.key, entry.value);
}

await kv.delete(["players", "alice"]);
```

Deno KV is currently unstable, so run it with the `--unstable-kv` flag:

```sh
deno run --unstable-kv main.ts
```

It's a good fit for fast reads that don't need the query flexibility of SQL, and
it works with zero configuration when you deploy to Deno Deploy. For atomic
transactions, secondary indexes, and the full API, see the
[Deno KV docs](/deploy/kv/) and the [Deno KV example](/examples/kv/).

## Other databases (npm drivers)

Any database with an npm driver works under Deno. Import the driver with an
`npm:` specifier (or list it in `package.json`) and connect exactly as you would
in Node.js. Keep connection settings in environment variables so the same code
runs locally and in production. Here is Postgres with the `postgres` driver:

```ts title="main.ts"
import postgres from "npm:postgres";

// Connection settings come from the standard PG* environment variables
const sql = postgres();

const people = await sql`SELECT id, name FROM people`;
console.log(people);

await sql.end();
```

This needs network and environment access (add `--env-file` if you keep the
variables in a `.env` file):

```sh
deno run -N -E main.ts
```

The same pattern covers the rest. Each link below is a runnable example or a
tutorial:

- **Postgres** — [Connect to Postgres](/examples/postgres/), or
  [Supabase](/examples/supabase/)
- **MySQL** — [Use MySQL with Deno](/examples/mysql2_tutorial/), or
  [PlanetScale](/examples/planetscale_tutorial/)
- **MongoDB** — [Connect to MongoDB](/examples/mongo/), or
  [Mongoose](/examples/mongoose_tutorial/)
- **Redis** — [Redis quick start](/examples/redis/), or the
  [Redis tutorial](/examples/redis_tutorial/)
- **DuckDB** — [Connect to DuckDB](/examples/duckdb/)

## ORMs

ORMs that run on npm work the same way:

- **Drizzle** — [Use Drizzle with Deno](/examples/drizzle_tutorial/)
- **Prisma** — [Use Prisma with Deno](/examples/prisma_tutorial/)

New to databases in Deno? The
[Connecting to databases](/examples/connecting_to_databases_tutorial/) tutorial
walks through the options above.
