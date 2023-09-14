# How to use MySQL2 with Deno

[MySQL](https://www.mysql.com/) is the most popular database in the
[2022 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2022/#most-popular-technologies-database)
and counts Facebook, Twitter, YouTube, and Netflix among its users.

[View source here.](https://github.com/denoland/examples/tree/main/with-mysql2)

You can manipulate and query a MySQL database with Deno using the `mysql2` node
package and importing via `npm:mysql2`. This allows us to use its Promise
wrapper and take advantage of top-level await.

```tsx, ignore
import mysql from "npm:mysql2@^2.3.3/promise";
```

## Connecting to MySQL

We can connect to our MySQL server using the `createConnection()` method. You
need the host (`localhost` if you are testing, or more likely a cloud database
endpoint in production) and the user and password:

```tsx, ignore
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

```tsx, ignore
await connection.query("CREATE DATABASE denos");
await connection.query("use denos");
```

Then we want to create the table:

```tsx, ignore
await connection.query(
  "CREATE TABLE `dinosaurs` (   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,   `name` varchar(255) NOT NULL,   `description` varchar(255) )",
);
```

After the table is created we can populate the data:

```tsx, ignore
await connection.query(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

We now have all the data ready to start querying.

## Querying MySQL

We can use the same connection.query() method to write our queries. First we try
and get all the data in our `dinosaurs` table:

```tsx, ignore
const results = await connection.query("SELECT * FROM `dinosaurs`");
console.log(results);
```

The result from this query is all the data in our database:

```tsx, ignore
[
  [
    {
      id: 1,
      name: "Aardonyx",
      description: "An early stage in the evolution of sauropods."
    },
    {
      id: 2,
      name: "Abelisaurus",
      description: `Abel's lizard" has been reconstructed from a single skull.`
    },
    { id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }
  ],
```

If we want to just get a single element from the database, we can change our
query:

```tsx, ignore
const [results, fields] = await connection.query(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(results);
```

Which gives us a single row result:

```tsx, ignore
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

Finally, we can close the connection:

```tsx, ignore
await connection.end();
```

For more on `mysql2`, check out their documentation
[here](https://github.com/sidorares/node-mysql2).
