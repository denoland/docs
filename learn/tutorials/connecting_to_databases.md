---
title: "Connecting to databases"
oldUrl:
- /runtime/tutorials/connecting_to_databases/
---

It is common for applications to store and retrieve data from databases. Deno
supports connecting to many database management systems.

The Deno community has published a number of third-party modules that make it
easy to connect to popular databases like MySQL, Postgres, and MongoDB.

They are hosted at Deno's third-party module site
[deno.land/x](https://deno.land/x).

## MySQL

[deno_mysql](https://deno.land/x/mysql) is a MySQL and MariaDB database driver
for Deno.

### Connect to MySQL with deno_mysql

First import the `mysql` module and create a new client instance. Then connect
to the database passing an object with the connection details:

```ts title="main.js"
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  password: "password",
});
```

Once connected, you can execute queries, insert data and retrive information.

## Postgres

[deno-postgres](https://deno.land/x/postgres) is a lightweight PostgreSQL driver
for Deno focused on developer experience.

### Connect to Postgres with deno-postgres

First, import the `Client` class from the `deno-postgres` module and create a
new client instance. Then connect to the database passing an object with the
connection details:

```ts
import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "user",
  database: "dbname",
  hostname: "127.0.0.1",
  port: 5432,
  password: "password",
});
await client.connect();
```

[postgresjs](https://deno.land/x/postgresjs) is a full-featured Postgres client
for Node.js and Deno.

### Connect to Postgres with postgresjs

Import the `postgres` module and create a new client instance. Then connect to
the database passing a connection string as an argument:

```js
import postgres from "https://deno.land/x/postgresjs/mod.js";

const sql = postgres("postgres://username:password@host:port/database");
```

## MongoDB

We suggest using
[npm specifiers](/runtime/fundamentals/node/#using-npm-packages) to work with
the official [MongoDB driver on npm](https://www.npmjs.com/package/mongodb). You
can learn more about how to work with the driver
[in the official docs](https://www.mongodb.com/docs/drivers/node/current/). The
only difference using this module in the context of Deno will be how you import
the module using an `npm:` specifier.

Import the MongoDB driver, set up connection configuration then connect to a
MongoDB instance. You can then perform operations like inserting documents into
a collection before closing the connection:

```ts title="main.js"
import { MongoClient } from "npm:mongodb@6";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

await client.connect();
console.log("Connected successfully to server");

// Get a reference to a collection
const db = client.db(dbName);
const collection = db.collection("documents");

// Execute an insert operation
const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }]);
console.log("Inserted documents =>", insertResult);

client.close();
```

## SQLite

There are two primary solutions to connect to SQLite in Deno:

### Connect to SQLite with the FFI Module

[@db/sqlite](https://jsr.io/@db/sqlite) provides JavaScript bindings to the
SQLite3 C API, using [Deno FFI](runtime/reference/deno_namespace_apis/#ffi).

```ts
import { Database } from "jsr:@db/sqlite@0.12";

const db = new Database("test.db");

const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
console.log(version);

db.close();
```

### Connect to SQLite with the Wasm-Optimized Module

[sqlite](https://deno.land/x/sqlite) is a SQLite module for JavaScript and
TypeScript. The wrapper made specifically for Deno and uses a version of SQLite3
compiled to WebAssembly (Wasm).

```ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("test.db");

db.close();
```

## Firebase

To connect to Firebase with Deno, import the
[firestore npm module](https://firebase.google.com/docs/firestore/quickstart)
with the [ESM CDN](https://esm.sh/). To learn more about using npm modules in
Deno with a CDN, see
[Using npm packages with CDNs](/runtime/fundamentals/modules/#https-imports).

### Connect to Firebase with the firestore npm module

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const app = initializeApp({
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
  measurementId: Deno.env.get("FIREBASE_MEASUREMENT_ID"),
});
const db = getFirestore(app);
const auth = getAuth(app);
```

## Supabase

To connect to Supabase with Deno, import the
[supabase-js npm module](https://supabase.com/docs/reference/javascript) with
the [esm.sh CDN](https://esm.sh/). To learn more about using npm modules in Deno
with a CDN, see
[Using npm packages with CDNs](/runtime/fundamentals/modules/#https-imports).

### Connect to Supabase with the supabase-js npm module

```js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key",
  options,
);
```

## ORMs

Object-Relational Mappings (ORM) define your data models as classes that you can
persist to a database. You can read and write data in your database through
instances of these classes.

Deno supports multiple ORMs, including Prisma and DenoDB.

### DenoDB

[DenoDB](https://deno.land/x/denodb) is a Deno-specific ORM.

#### Connect to DenoDB

```ts
import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://deno.land/x/denodb/mod.ts";

const connection = new PostgresConnector({
  host: "...",
  username: "user",
  password: "password",
  database: "airlines",
});

const db = new Database(connection);
```

## GraphQL

GraphQL is an API query language often used to compose disparate data sources
into client-centric APIs. To set up a GraphQL API, you should first set up a
GraphQL server. This server exposes your data as a GraphQL API that your client
applications can query for data.

### Server

You can use [gql](https://deno.land/x/gql), an universal GraphQL HTTP middleware
for Deno, to run a GraphQL API server in Deno.

#### Run a GraphQL API server with gql

```ts
import { GraphQLHTTP } from "https://deno.land/x/gql/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

Deno.serve({ port: 3000 }, async () => {
  const { pathname } = new URL(req.url);

  return pathname === "/graphql"
    ? await GraphQLHTTP<Request>({
      schema,
      graphiql: true,
    })(req)
    : new Response("Not Found", { status: 404 });
});
```

### Client

To make GraphQL client calls in Deno, import the
[graphql npm module](https://www.npmjs.com/package/graphql) with the
[esm CDN](https://esm.sh/). To learn more about using npm modules in Deno via
CDN read [here](/runtime/fundamentals/modules/#https-imports).

#### Make GraphQL client calls with the graphql npm module

```js
import { buildSchema, graphql } from "https://esm.sh/graphql";

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

const response = await graphql({
  schema,
  source: "{ hello }",
  rootValue,
});

console.log(response);
```

🦕 Now you can connect your Deno project to a database you'll be able to work
with persistent data, perform CRUD operations and start building more complex
applications.
