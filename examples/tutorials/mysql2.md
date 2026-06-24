---
last_modified: 2026-06-18
title: "How to use MySQL2 with Deno"
description: "Step-by-step guide to using MySQL2 with Deno. Learn how to set up database connections, execute queries, handle transactions, and build data-driven applications using MySQL's Node.js driver."
url: /examples/mysql2_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mysql2/
  - /runtime/tutorials/how_to_with_npm/mysql2/
---

[MySQL](https://www.mysql.com/) is the most popular database in the
[2022 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2022/#most-popular-technologies-database)
and counts Facebook, Twitter, YouTube, and Netflix among its users.

[View source here.](https://github.com/denoland/examples/tree/main/with-mysql2)

You can manipulate and query a MySQL database with Deno using the `mysql2` node
package and importing via `npm:mysql2`. This allows us to use its Promise
wrapper and take advantage of top-level await.

```tsx
import mysql from "npm:mysql2@^3/promise";
```

## Connecting to MySQL

We can connect to our MySQL server using the `createConnection()` method. You
need the host (`localhost` if you are testing, or more likely a cloud database
endpoint in production) and the user and password:

```tsx
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});
```

You can also optionally specify a database during the connection creation. Here
we are going to use `mysql2` to create the database on the fly.

## Creating and populating the database

Now that you have the connection running, you can use `connection.query()` with
SQL commands to create databases and tables as well as insert the initial data.

First we want to generate and select the database to use:

```tsx
await connection.query("CREATE DATABASE denos");
await connection.query("use denos");
```

Then we want to create the table:

```tsx
await connection.query(
  "CREATE TABLE `dinosaurs` (   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,   `name` varchar(255) NOT NULL,   `description` varchar(255) )",
);
```

After the table is created we can populate the data:

```tsx
await connection.query(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

We now have all the data ready to start querying.

## Querying MySQL

We can use the same `connection.query()` method to read data back. The
`mysql2/promise` driver resolves to a `[rows, fields]` tuple, so destructure to
pull out the rows directly:

```tsx
const [rows] = await connection.query("SELECT * FROM `dinosaurs`");
console.log(rows);
```

This prints every row in the table:

```tsx
[
  {
    id: 1,
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    id: 2,
    name: "Abelisaurus",
    description: "Abels lizard has been reconstructed from a single skull.",
  },
  { id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." },
];
```

### Parameterized queries

To filter by a value, do not paste it directly into the SQL string — that's how
SQL injection bugs get shipped. Use `connection.execute()` with `?`
placeholders. The driver prepares the statement on the server and binds the
values separately, so anything you pass in the values array is treated strictly
as data, never parsed as SQL:

```tsx
const name = "Deno"; // imagine this came from a user request
const [rows] = await connection.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = ?",
  [name],
);
console.log(rows);
```

Which gives us a single matching row:

```tsx
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

`?` placeholders are positional, so the values must appear in the same order as
the placeholders in the SQL. The same pattern works for `INSERT`, `UPDATE`, and
`DELETE`; `mysql2` also caches each prepared statement, so repeated calls with
different values skip the parse step on subsequent runs.

Finally, we can close the connection:

```tsx
await connection.end();
```

For more on `mysql2`, check out their documentation
[here](https://github.com/sidorares/node-mysql2).
