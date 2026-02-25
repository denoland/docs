---
title: "Connecting to databases"
description: "A guide to database connectivity in Deno. Learn how to use MySQL, PostgreSQL, MongoDB, SQLite, Firebase, Supabase, and popular ORMs to build data-driven applications with TypeScript."
url: /examples/connecting_to_databases_tutorial/
oldUrl:
  - /runtime/tutorials/connecting_to_databases/
---

It is common for applications to store and retrieve data from databases. Deno
supports connecting to many database management systems.

Deno supports multiple third-party modules that allow you to connect to SQL and
NoSQL databases, including MySQL, PostgreSQL, MongoDB, SQLite, Firebase, and
Supabase.

You can find helpful database connectivity modules on [JSR](https://jsr.io/@db)
and deno supports many npm packages with the use of
[npm specifiers](/runtime/fundamentals/node/#using-npm-packages).

## SQLite

SQLite is a self-contained, serverless, zero-configuration, and transactional
SQL database engine. It is a popular choice for local storage in applications.

You can use multiple modules to connect to SQLite in Deno, including the
built-in [`node:sqlite` module](/api/node_sqlite/) and the
[sqlite](https://jsr.io/@db/sqlite) module on JSR.

To use the [sqlite](https://jsr.io/@db/sqlite) module to connect to SQLite in
your Deno apps:

```sh
deno add jsr:@db/sqlite
```

Then, import the `Database` class from the module and create a new database
instance. You can then execute SQL queries against the database:

```ts title="main.ts
import { Database } from "@db/sqlite";

const db = new Database("test.db");

const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
console.log(version);

db.close();
```

This module depends on Deno FFI, so you need to run your script with the
`--allow-ffi` flag:

```sh
deno run --allow-ffi main.ts
```

## MySQL

You can use the [mysql npm module](https://www.npmjs.com/package/mysql) to
connect to MySQL databases. Install the module with the npm specifier:

```sh
deno add npm:mysql
```

Then, import the `mysql` module and create a connection to your MySQL database:

```ts
import mysql from "mysql";

// Minimal connection config (edit as needed or use env vars)
const connection = mysql.createConnection({
  host: Deno.env.get("MYSQL_HOST") || "localhost",
  port: Number(Deno.env.get("MYSQL_PORT") || "3306"),
  user: Deno.env.get("MYSQL_USER") || "root",
  password: Deno.env.get("MYSQL_PASSWORD") || "",
  database: Deno.env.get("MYSQL_DATABASE") || "test",
});

connection.connect((err) => {
  if (err) {
    console.error("Connection error:", err);
    return;
  }
  console.log("Connected!");
  connection.query("SELECT VERSION() AS version", (err, results) => {
    if (err) {
      console.error("Query error:", err);
    } else {
      console.log("MySQL version:", results[0].version);
    }
    connection.end();
  });
});
```

## Postgres

PostgreSQL is a powerful, open source object-relational database system. You can
use multiple modules to connect to PostgreSQL in Deno, including
[pg](https://www.npmjs.com/package/pg) or
[postgresjs](https://www.npmjs.com/package/postgres).

Install the module with the npm specifier:

```sh
deno add npm:pg
```

First, import the `Client` class from the `pg` module and create a new client
instance. Then connect to the database passing an object with the connection
details:

```ts
import { Client } from "pg";

// Connection config (edit or use env vars)
const client = new Client({
  host: Deno.env.get("PGHOST") || "localhost",
  port: Number(Deno.env.get("PGPORT") || "5432"),
  user: Deno.env.get("PGUSER") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "postgres",
  database: Deno.env.get("PGDATABASE") || "postgres",
});

async function main() {
  try {
    await client.connect();
    console.log("Connected!");
    const res = await client.query("SELECT version() AS version");
    console.log("Postgres version:", res.rows[0].version);
  } catch (err) {
    console.error("Connection/query error:", err);
  } finally {
    await client.end();
  }
}

main();
```

## MongoDB

MongoDB is a popular NoSQL database that stores data in flexible, JSON-like
documents. You can use the official
[MongoDB Node.js](https://www.npmjs.com/package/mongodb) driver to connect to
MongoDB, or the [Mongo db driver](https://jsr.io/@db/mongo) from JSR.

Import the MongoDB driver, set up connection configuration then connect to a
MongoDB instance:

```ts title="main.js"
import { MongoClient } from "mongodb";

const url = "mongodb://mongo:mongo@localhost:27017"; // username:password@host:port
const client = new MongoClient(url);
const dbName = "myProject";

await client.connect();
console.log("Connected successfully to server");

const db = client.db(dbName);
const collection = db.collection("documents");

const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }]);
console.log("Inserted documents =>", insertResult);

await client.close();
```

## Firebase

Firebase is a platform developed by Google for creating mobile and web
applications. It provides a variety of services, including a NoSQL database,
authentication, and hosting.

To connect to Firebase, you can use the official npm modules provided by
Firebase, you will need to update your `deno.json` to tell deno to use a
`node_modules` directory, and allow scripts when installing:

```json title="deno.json"
"nodeModulesDir": auto
```

```sh
deno add npm:firebase --allow-scripts
```

Then import the necessary functions from the Firebase modules and initialize
your app and services:

```js
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

// Replace with your Firebase config (get from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo: write and read a document
async function demo() {
  const ref = doc(db, "demo", "testdoc");
  await setDoc(ref, { hello: "world", time: Date.now() });
  const snap = await getDoc(ref);
  console.log("Document data:", snap.data());
}

demo().catch(console.error);
```

## Supabase

Supabase is an open-source Firebase alternative that provides a suite of tools
and services to help you build and scale applications. It offers a hosted
PostgreSQL database, authentication, real-time subscriptions, and storage.

To connect to Supabase, you can use the
[@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) npm
module.

First, install the module with the npm specifier:

```sh
deno add npm:@supabase/supabase-js --allow-scripts
```

Then, import the `createClient` function from the module and create a new
Supabase client instance. You will need your Supabase project URL and an API
key, which you can find in your Supabase project settings:

```ts
import { createClient } from "@supabase/supabase-js";

const url = Deno.env.get("SUPABASE_URL") ??
  "https://YOUR-PROJECT.ref.supabase.co";
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(url, key);

async function main() {
  const { data, error } = await supabase
    .from("demo")
    .insert({ message: `Hello @ ${new Date().toISOString()}` })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Insert failed:", error.message);
    console.error(
      "Hint: If this is an RLS error, either disable RLS on 'demo' or add a policy allowing anon inserts.",
    );
    return;
  }

  console.log("Inserted row:", data);
}

if (import.meta.main) main();
```

## ORMs

Object-Relational Mappings (ORM) define your data models as classes that you can
persist to a database. You can read and write data in your database through
instances of these classes.

Deno supports multiple ORMs, including Prisma, Drizzle, and Kysely.

🦕 Now you can connect your Deno project to a database you'll be able to work
with persistent data, perform CRUD operations and start building more complex
applications.
