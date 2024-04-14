# API server with FaunaDB

FaunaDB calls itself "The data API for modern applications". It's a database
with a GraphQL interface that enables you to use GraphQL to interact with it.
Since we communicate with it using HTTP requests, we don't need to manage
connections which suits very well for serverless applications.

The tutorial assumes that you have [FaunaDB](https://fauna.com) and Deno Deploy
accounts, Deno Deploy CLI installed, and some basic knowledge of GraphQL.

- [Overview](#overview)
- [Build the API Endpoints](#build-the-api-endpoints)
- [Use FaunaDB for Persistence](#use-faunadb-for-persistence)
- [Deploy the API](#deploy-the-api)

## Overview

In this tutorial, let's build a small quotes API with endpoints to insert and
retrieve quotes. And later use FaunaDB to persist the quotes.

Let's start by defining the API endpoints.

```sh
# A POST request to the endpoint should insert the quote to the list.
POST /quotes/
# Body of the request.
{
  "quote": "Don't judge each day by the harvest you reap but by the seeds that you plant.",
  "author": "Robert Louis Stevenson"
}

# A GET request to the endpoint should return all the quotes from the database.
GET /quotes/
# Response of the request.
{
  "quotes": [
    {
      "quote": "Don't judge each day by the harvest you reap but by the seeds that you plant.",
      "author": "Robert Louis Stevenson"
    }
  ]
}
```

Now that we understand how the endpoint should behave, let's proceed to build
it.

## Build the API Endpoints

First, create a file named `quotes.ts` and paste the following content.

Read through the comments in the code to understand what's happening.

```ts
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";

serve({
  "/quotes": handleQuotes,
});

// To get started, let's just use a global array of quotes.
const quotes = [
  {
    quote: "Those who can imagine anything, can create the impossible.",
    author: "Alan Turing",
  },
  {
    quote: "Any sufficiently advanced technology is equivalent to magic.",
    author: "Arthur C. Clarke",
  },
];

async function handleQuotes(request: Request) {
  // Make sure the request is a GET request.
  const { error } = await validateRequest(request, {
    GET: {},
  });
  // validateRequest populates the error if the request doesn't meet
  // the schema we defined.
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // Return all the quotes.
  return json({ quotes });
}
```

Run the above program using [the Deno CLI](https://deno.land).

```sh
deno run --allow-net=:8000 ./path/to/quotes.ts
# Listening on http://0.0.0.0:8000/
```

And curl the endpoint to see some quotes.

```sh
curl http://127.0.0.1:8000/quotes
# {"quotes":[
# {"quote":"Those who can imagine anything, can create the impossible.", "author":"Alan Turing"},
# {"quote":"Any sufficiently advanced technology is equivalent to magic.","author":"Arthur C. Clarke"}
# ]}
```

Let's proceed to handle the POST request.

Update the `validateRequest` function to make sure a POST request follows the
provided body scheme.

```diff
-  const { error } = await validateRequest(request, {
+  const { error, body } = await validateRequest(request, {
    GET: {},
+   POST: {
+      body: ["quote", "author"]
+   }
  });
```

Handle the POST request by updating `handleQuotes` function with the following
code.

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

+  // Handle POST requests.
+  if (request.method === "POST") {
+    const { quote, author } = body as { quote: string; author: string };
+    quotes.push({ quote, author });
+    return json({ quote, author }, { status: 201 });
+  }

  return json({ quotes });
}
```

Let's test it by inserting some data.

```sh
curl --dump-header - --request POST --data '{"quote": "A program that has not been tested does not work.", "author": "Bjarne Stroustrup"}' http://127.0.0.1:8000/quotes
```

The output might look like something below.

```console
HTTP/1.1 201 Created
transfer-encoding: chunked
content-type: application/json; charset=utf-8

{"quote":"A program that has not been tested does not work.","author":"Bjarne Stroustrup"}
```

Awesome! We built our API endpoint, and it's working as expected. Since the data
is stored in memory, it will be lost after a restart. Let's use FaunaDB to
persist our quotes.

## Use FaunaDB for Persistence

Let's define our database schema using GraphQL Schema.

```gql
# We're creating a new type named `Quote` to represent a quote and its author.
type Quote {
  quote: String!
  author: String!
}

type Query {
  # A new field in the Query operation to retrieve all quotes.
  allQuotes: [Quote!]
}
```

Fauna has a graphql endpoint for its database, and it generates essential
mutations like create, update, delete for a data type defined in the schema. For
example, fauna will generate a mutation named `createQuote` to create a new
quote in the database for the data type `Quote`. And we're additionally defining
a query field named `allQuotes` that returns all the quotes in the database.

Let's get to writing the code to interact with fauna from Deno Deploy
applications.

To interact with fauna, we need to make a POST request to its graphql endpoint
with appropriate query and parameters to get the data in return. So let's
construct a generic function that will handle those things.

```typescript
async function queryFauna(
  query: string,
  variables: { [key: string]: unknown },
): Promise<{
  data?: any;
  error?: any;
}> {
  // Grab the secret from the environment.
  const token = Deno.env.get("FAUNA_SECRET");
  if (!token) {
    throw new Error("environment variable FAUNA_SECRET not set");
  }

  try {
    // Make a POST request to fauna's graphql endpoint with body being
    // the query and its variables.
    const res = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();
    if (errors) {
      // Return the first error if there are any.
      return { data, error: errors[0] };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}
```

Add this code to the `quotes.ts` file. Now let's proceed to update the endpoint
to use fauna.

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
+    const { quote, author, error } = await createQuote(
+      body as { quote: string; author: string }
+    );
+    if (error) {
+      return json({ error: "couldn't create the quote" }, { status: 500 });
+    }

    return json({ quote, author }, { status: 201 });
  }

  return json({ quotes });
}

+async function createQuote({
+  quote,
+  author,
+}: {
+  quote: string;
+  author: string;
+}): Promise<{ quote?: string; author?: string; error?: string }> {
+  const query = `
+    mutation($quote: String!, $author: String!) {
+      createQuote(data: { quote: $quote, author: $author }) {
+        quote
+        author
+      }
+    }
+  `;
+
+  const { data, error } = await queryFauna(query, { quote, author });
+  if (error) {
+    return { error };
+  }
+
+  return data;
+}
```

Now that we've updated the code to insert new quotes let's set up a fauna
database before proceeding to test the code.

Create a new database:

1. Go to https://dashboard.fauna.com (login if required) and click on **New
   Database**
2. Fill the **Database Name** field and click on **Save**.
3. Click on **GraphQL** section visible on the left sidebar.
4. Create a file ending with `.gql` extension with the content being the schema
   we defined above.

Generate a secret to access the database:

1. Click on **Security** section and click on **New Key**.
2. Select **Server** role and click on **Save**. Copy the secret.

Let's now run the application with the secret.

```sh
FAUNA_SECRET=<the_secret_you_just_obtained> deno run --allow-net=:8000 --watch quotes.ts
# Listening on http://0.0.0.0:8000
```

```sh
curl --dump-header - --request POST --data '{"quote": "A program that has not been tested does not work.", "author": "Bjarne Stroustrup"}' http://127.0.0.1:8000/quotes
```

Notice how the quote was added to your collection in FaunaDB.

Let's write a new function to get all the quotes.

```ts
async function getAllQuotes() {
  const query = `
    query {
      allQuotes {
        data {
          quote
          author
        }
      }
    }
  `;

  const {
    data: {
      allQuotes: { data: quotes },
    },
    error,
  } = await queryFauna(query, {});
  if (error) {
    return { error };
  }

  return { quotes };
}
```

And update the `handleQuotes` function with the following code.

```diff
-// To get started, let's just use a global array of quotes.
-const quotes = [
-  {
-    quote: "Those who can imagine anything, can create the impossible.",
-    author: "Alan Turing",
-  },
-  {
-    quote: "Any sufficiently advanced technology is equivalent to magic.",
-    author: "Arthur C. Clarke",
-  },
-];

async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
    const { quote, author, error } = await createQuote(
      body as { quote: string; author: string },
    );
    if (error) {
      return json({ error: "couldn't create the quote" }, { status: 500 });
    }

    return json({ quote, author }, { status: 201 });
  }

+  // It's assumed that the request method is "GET".
+  {
+    const { quotes, error } = await getAllQuotes();
+    if (error) {
+      return json({ error: "couldn't fetch the quotes" }, { status: 500 });
+    }
+
+    return json({ quotes });
+  }
}
```

```sh
curl http://127.0.0.1:8000/quotes
```

You should see all the quotes we've inserted into the database. The final code
of the API is available at https://deno.com/examples/fauna.ts.

## Deploy the API

Now that we have everything in place, let's deploy your new API!

1. In your browser, visit [Deno Deploy](https://dash.deno.com/new_project) and
   link your GitHub account.
2. Select the repository which contains your new API.
3. You can give your project a name or allow Deno to generate one for you
4. Select `index.ts` in the Entrypoint dropdown
5. Click **Deploy Project**

In order for your Application to work, we will need to configure its environment
variables.

On your project's success page, or in your project dashboard, click on **Add
environmental variables**. Under Environment Variables, click **+ Add
Variable**. Create a new variable called `FAUNA_SECRET` - The value should be
the secret we created earlier.

Click to save the variables.

On your project overview, click **View** to view the project in your browser,
add `/quotes` to the end of the url to see the content of your FaunaDB.
