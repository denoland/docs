---
last_modified: 2026-06-16
title: "Databases"
description: "Connect Deno to SQLite, Postgres, MySQL, MongoDB, Redis, and Deno KV, with runnable examples and ORM tutorials."
---

Deno connects to databases the same way Node does — through npm drivers, which
run under [Node.js compatibility](/runtime/fundamentals/node/) — plus two
batteries-included options: the built-in `node:sqlite` module and the built-in
[Deno KV](#deno-kv). Each entry below links a runnable example or a tutorial.

## SQL databases

- **SQLite** — built in, no install, via `node:sqlite`:
  [Connect to SQLite](/examples/sqlite/)
- **Postgres** — [Connect to Postgres](/examples/postgres/), or
  [Supabase](/examples/supabase/)
- **MySQL** — [Use MySQL with Deno](/examples/mysql2_tutorial/), or
  [PlanetScale](/examples/planetscale_tutorial/)
- **DuckDB** — [Connect to DuckDB](/examples/duckdb/)

## Document and key-value stores

- **MongoDB** — [Connect to MongoDB](/examples/mongo/), or
  [Mongoose](/examples/mongoose_tutorial/)
- **Redis** — [Redis quick start](/examples/redis/), or the
  [Redis tutorial](/examples/redis_tutorial/)

## Deno KV

[Deno KV](/deploy/kv/) is a key-value database built into the runtime, so there
is nothing to install. It is currently unstable, so run with the `--unstable-kv`
flag. See the [Deno KV docs](/deploy/kv/) and the
[Deno KV example](/examples/kv/) to get started.

## ORMs

- **Drizzle** — [Use Drizzle with Deno](/examples/drizzle_tutorial/)
- **Prisma** — [Use Prisma with Deno](/examples/prisma_tutorial/)

## More

New to databases in Deno? The
[Connecting to databases](/examples/connecting_to_databases_tutorial/) tutorial
is an overview of the options above.
