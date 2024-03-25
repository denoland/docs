# API server with Postgres

Postgres is a popular database for web applications because of its flexibility
and ease of use. This guide will show you how to use Deno Deploy with Postgres.

- [Overview](#overview)
- [Setup Postgres](#setup-postgres)
- [Write and deploy the application](#write-and-deploy-the-application)

## Overview

We are going to build the API for a simple todo list application. It will have
two endpoints:

`GET /todos` will return a list of all todos, and `POST /todos` will create a
new todo.

```
GET /todos
# returns a list of all todos
[
  {
    "id": 1,
    "title": "Buy bread"
  },
  {
    "id": 2,
    "title": "Buy rice"
  },
  {
    "id": 3,
    "title": "Buy spices"
  }
]

POST /todos
# creates a new todo
"Buy milk"
# returns a 201 status code
```

In this tutorial, we will be:

- Creating and setting up a [Postgres](https://www.postgresql.org/) instance on
  [Neon Postgres](https://neon.tech/) or [Supabase](https://supabase.com).
- Using a [Deno Deploy](/deploy) Playground to develop and deploy the
  application.
- Testing our application using [cURL](https://curl.se/).

## Setup Postgres

> This tutorial will focus entirely on connecting to Postgres unencrypted. If
> you would like to use encryption with a custom CA certificate, use the
> documentation [here](https://deno-postgres.com/#/?id=ssltls-connection).

To get started we need to create a new Postgres instance for us to connect to.
For this tutorial, you can use either [Neon Postgres](https://neon.tech/) or
[Supabase](https://supabase.com), as they both provide free, managed Postgres
instances. If you like to host your database somewhere else, you can do that
too.

### Neon Postgres

1. Visit https://neon.tech/ and click **Sign up** to sign up with an email,
   Github, Google, or partner account. After signing up, you are directed to the
   Neon Console to create your first project.
2. Enter a name for your project, select a Postgres version, provide a database
   name, and select a region. Generally, you'll want to select the region
   closest to your application. When you're finished, click **Create project**.
3. You are presented with the connection string for your new project, which you
   can use to connect to your database. Save the connection string, which looks
   something like this:

   ```sh
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Supabase

1. Visit https://app.supabase.io/ and click "New project".
2. Select a name, password, and region for your database. Make sure to save the
   password, as you will need it later.
3. Click "Create new project". Creating the project can take a while, so be
   patient.
4. Once the project is created, navigate to the "Database" tab on the left.
5. Go to the "Connection Pooling" settings, and copy the connection string from
   the "Connection String" field. This is the connection string you will use to
   connect to your database. Insert the password you saved earlier into this
   string, and then save the string somewhere - you will need it later.

## Write and deploy the application

We can now start writing our application. To start, we will create a new Deno
Deploy playground in the control panel: press the "New Playground" button on
https://dash.deno.com/projects.

This will open up the playground editor. Before we can actually start writing
code, we'll need to put our Postgres connection string into the environment
variables. To do this, click on the project name in the top left corner of the
editor. This will open up the project settings.

From here, you can navigate to the "Settings" -> "Environment Variable" tab via
the left navigation menu. Enter "DATABASE_URL" into the "Key" field, and paste
your connection string into the "Value" field. Now, press "Add". Your
environment variables is now set.

Let's return back to the editor: to do this, go to the "Overview" tab via the
left navigation menu, and press "Open Playground". Let's start by serving HTTP
requests using `Deno.serve()`:

```ts
Deno.serve(async (req) => {
  return new Response("Not Found", { status: 404 });
});
```

You can already save this code using <kbd>Ctrl</kbd>+<kbd>S</kbd> (or
<kbd>Cmd</kbd>+<kbd>S</kbd> on Mac). You should see the preview page on the
right refresh automatically: it now says "Not Found".

Next, let's import the Postgres module, read the connection string from the
environment variables, and create a connection pool.

```ts
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);
```

Again, you can save this code now, but this time you should see no changes. We
are creating a connection pool, but we are not actually running any queries
against the database yet. Before we can do that, we need to set up our table
schema.

We want to store a list of todos. Let's create a table called `todos` with an
auto-increment `id` column and a `title` column:

```ts
const pool = new postgres.Pool(databaseUrl, 3, true);

// Connect to the database
const connection = await pool.connect();
try {
  // Create the table
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} finally {
  // Release the connection back into the pool
  connection.release();
}
```

Now that we have a table, we can add the HTTP handlers for the GET and POST
endpoints.

```ts
Deno.serve(async (req) => {
  // Parse the URL and check that the requested endpoint is /todos. If it is
  // not, return a 404 response.
  const url = new URL(req.url);
  if (url.pathname !== "/todos") {
    return new Response("Not Found", { status: 404 });
  }

  // Grab a connection from the database pool
  const connection = await pool.connect();

  try {
    switch (req.method) {
      case "GET": { // This is a GET request. Return a list of all todos.
        // Run the query
        const result = await connection.queryObject`
          SELECT * FROM todos
        `;

        // Encode the result as JSON
        const body = JSON.stringify(result.rows, null, 2);

        // Return the result as JSON
        return new Response(body, {
          headers: { "content-type": "application/json" },
        });
      }
      case "POST": { // This is a POST request. Create a new todo.
        // Parse the request body as JSON. If the request body fails to parse,
        // is not a string, or is longer than 256 chars, return a 400 response.
        const title = await req.json().catch(() => null);
        if (typeof title !== "string" || title.length > 256) {
          return new Response("Bad Request", { status: 400 });
        }

        // Insert the new todo into the database
        await connection.queryObject`
          INSERT INTO todos (title) VALUES (${title})
        `;

        // Return a 201 Created response
        return new Response("", { status: 201 });
      }
      default: // If this is neither a POST, or a GET return a 405 response.
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (err) {
    console.error(err);
    // If an error occurs, return a 500 response
    return new Response(`Internal Server Error\n\n${err.message}`, {
      status: 500,
    });
  } finally {
    // Release the connection back into the pool
    connection.release();
  }
});
```

And there we go - application done. Deploy this code by saving the editor. You
can now POST to the `/todos` endpoint to create a new todo, and you can get a
list of all todos by making a GET request to `/todos`:

```sh
$ curl -X GET https://tutorial-postgres.deno.dev/todos
[]⏎

$ curl -X POST -d '"Buy milk"' https://tutorial-postgres.deno.dev/todos

$ curl -X GET https://tutorial-postgres.deno.dev/todos
[
  {
    "id": 1,
    "title": "Buy milk"
  }
]⏎
```

It's all working 🎉

The full code for the tutorial:

<iframe width="100%" height="600" src="https://embed.deno.com/playground/tutorial-postgres?layout=code-only&corp"></iframe>

As an extra challenge, try add a `DELETE /todos/:id` endpoint to delete a todo.
The [URLPattern][urlpattern] API can help with this.

[urlpattern]: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
