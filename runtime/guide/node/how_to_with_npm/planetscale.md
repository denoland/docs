# How to use Planetscale with Deno

Planetscale is a MySQL-compatible serverless database that is designed with a
developer workflow where developers can create, branch, and deploy databases
from the command line.

[View source here.](https://github.com/denoland/examples/tree/main/with-planetscale)

We'll use the Planetscale serverless driver, `@planetscale/database`, to work
with Deno. First we want to create `main.ts` and import the connect method from
this package:

```tsx, ignore
import { connect } from "npm:@planetscale/database@^1.4";
```

## Configuring our connection

The connection requires three credentials: host, username, and password. These
are database-specific, so we first need to create a database in Planetscale. You
can do that by following the initial instructions
[here](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide).
Don't worry about adding the schema—we can do that through
`@planetscale/database`.

Once you have created the database, head to Overview, click "Connect", and
choose "Connect with `@planetscale/database`" to get the host and username. Then
click through to Passwords to create a new password for your database. Once you
have all three you can plug them in directly, or better, store them as
environment variables:

```bash
export HOST=<host>
export USERNAME=<username>
export PASSWORD=<password>
```

Then call them using `Deno.env`:

```tsx, ignore
const config = {
  host: Deno.env.get("HOST"),
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
};

const conn = connect(config);
```

This will also work on Deno Deploy if you set the environment variables in the
dashboard. Run with:

```shell, ignore
deno run --allow-net --allow-env main.ts
```

The `conn` object is now an open connection to our Planetscale database.

## Creating and populating our database table

Now that you have the connection running, you can `conn.execute()` with SQL
commands to create tables and insert the initial data:

```tsx, ignore
await conn.execute(
  "CREATE TABLE dinosaurs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255) NOT NULL, description varchar(255) NOT NULL);",
);
await conn.execute(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

## Querying Planetscale

We can use same `conn.execute()` to also write our queries. Let's get a list of
all our dinosaurs:

```tsx, ignore
const results = await conn.execute("SELECT * FROM `dinosaurs`");
console.log(results.rows);
```

The result:

```tsx, ignore
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

We can also get just a single row from the database by specifying a dinosaur
name:

```tsx, ignore
const result = await conn.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(result.rows);
```

Which gives us a single row result:

```tsx, ignore
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

You can find out more about working with Planetscale in their
[docs](https://planetscale.com/docs).
