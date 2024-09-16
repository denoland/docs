---
title: "How to use Apollo with Deno"
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/apollo/
  - /runtime/manual/node/how_to_with_npm/apollo/
---

[Apollo Server](https://www.apollographql.com/) is a GraphQL server that you can
set up in minutes and use with your existing data source (or REST API). You can
then connect any GraphQL client to it to receive the data and take advantage of
GraphQL benefits, such as type-checking and efficient fetching.

We're going to get a simple Apollo server up and running that will allow us to
query some local data. We're only going to need three files for this:

1. `schema.ts` to set up our data model
2. `resolvers.ts` to set up how we're going to populate the data fields in our
   schema
3. Our `main.ts` where the server is going to launch

We'll start by creating them:

```shell
touch schema.ts resolvers.ts main.ts
```

Let's go through setting up each.

[View source here.](https://github.com/denoland/examples/tree/main/with-apollo)

## schema.ts

Our `schema.ts` file describes our data. In this case, our data is a list of
dinosaurs. We want our users to be able to get the name and a short description
of each dino. In GraphQL language, this means that `Dinosaur` is our **type**,
and `name` and `description` are our **fields**. We can also define the data
type for each field. In this case, both are strings.

This is also where we describe the queries we allow for our data, using the
special **Query** type in GraphQL. We have two queries:

- `dinosaurs` which gets a list of all dinosaurs
- `dinosaur` which takes in the `name` of a dinosaur as an argument and returns
  information about that one type of dinosaur.

We're going to export all this within our `typeDefs` type definitions, variable:

```tsx
export const typeDefs = `
  type Dinosaur {
    name: String
    description: String
  }

  type Query {
    dinosaurs: [Dinosaur]
		dinosaur(name: String): Dinosaur
  }
`;
```

If we wanted to write data, this is also where we would describe the
**Mutation** to do so. Mutations are how you write data with GraphQL. Because we
are using a static dataset here, we won't be writing anything.

## resolvers.ts

A resolver is responsible for populating the data for each query. Here we have
our list of dinosaurs and all the resolver is going to do is either a) pass that
entire list to the client if the user requests the `dinosaurs` query, or pass
just one if the user requests the `dinosaur` query.

```tsx
const dinosaurs = [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    name: "Abelisaurus",
    description: '"Abel\'s lizard" has been reconstructed from a single skull.',
  },
];

export const resolvers = {
  Query: {
    dinosaurs: () => dinosaurs,
    dinosaur: (_: any, args: any) => {
      return dinosaurs.find((dinosaur) => dinosaur.name === args.name);
    },
  },
};
```

With the latter, we pass the arguments from the client into a function to match
the name to a name in our dataset.

## main.ts

In our `main.ts` we're going to import the `ApolloServer` as well as `graphql`
and our `typeDefs` from the schema and our resolvers:

```tsx
import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { graphql } from "npm:graphql@16.6";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);
```

We pass our `typeDefs` and `resolvers` to `ApolloServer` to spool up a new
server. Finally, `startStandaloneServer` is a helper function to get the server
up and running quickly.

## Running the server

All that is left to do now is run the server:

```shell
deno run --allow-net --allow-read --allow-env main.ts
```

You should see `Server running on: 127.0.0.1:8000` in your terminal. If you go
to that address you will see the Apollo sandbox where we can enter our
`dinosaurs` query:

```graphql
query {
  dinosaurs {
    name
    description
  }
}
```

This will return our dataset:

```graphql
{
  "data": {
    "dinosaurs": [
      {
        "name": "Aardonyx",
        "description": "An early stage in the evolution of sauropods."
      },
      {
        "name": "Abelisaurus",
        "description": "\"Abel's lizard\" has been reconstructed from a single skull."
      }
    ]
  }
}
```

Or if we want just one `dinosaur`:

```graphql
query {
  dinosaur(name:"Aardonyx") {
    name
    description
  }
}
```

Which returns:

```graphql
{
  "data": {
    "dinosaur": {
      "name": "Aardonyx",
      "description": "An early stage in the evolution of sauropods."
    }
  }
}
```

Awesome!

[Learn more about using Apollo and GraphQL in their tutorials](https://www.apollographql.com/tutorials/).
