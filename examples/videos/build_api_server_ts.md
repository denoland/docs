---
title: "Build an API server with TypeScript"
description: "A guide to creating a RESTful API server using Hono and TypeScript in Deno. Watch how to implement CRUD operations, handle routing, manage data persistence, and build a production-ready backend service."
url: /examples/build_api_server_ts/
videoUrl: https://www.youtube.com/watch?v=J8kZ-s-5-ms&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=13
layout: video.tsx
---

## Video description

Use the light-weight Hono framework (spiritual successor to Express) to build a
RESTful API server that supports CRUD operations with a database.

## Transcript and code

If you’ve worked on a Node project in the past, you might have used Express to
set up a web server or to host an API. Let’s take a look at how we might do
something similar by using Hono, a small simple framework that we can use with
any runtime, but we’re going to use it with Deno. Basic Hono Setup

We’ll add Hono to our project with [JSR](https://jsr.io):

```shell
deno add jsr:@hono/hono
```

That will then be added to the deno.json file.

Then in our main file, we’ll create the basic Hono setup.

```ts
import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from the Trees!");
});

Deno.serve(app.fetch);
```

Let’s run that `deno run --allow-net main.ts` and we’ll see it in the browser at
`localhost:8000`.

## CRUD Operations

Now that we’ve set up the simple server with Hono, we can start to build out our
database.

We’re going to use localStorage for this, but keep in mind that you can use any
persistent data storage with Deno - postgres, sql - Wherever you like to store
your data.

Let’s start by creating a container for some data. We’ll start with an interface
that describes a tree type:

```ts
interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}
```

Then we’ll create some data:

```ts
const oak: Tree = {
  id: "3",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};
```

Then we’re going to create a few helper functions that will help us interact
with localStorage:

```ts
const setItem = (key: string, value: Tree) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): Tree | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
```

Now let’s use them:

```ts
setItem(`trees_${oak.id}`, oak);
const newTree = getItem(`trees_${oak.id}`);
console.log(newTree);
```

```shell
deno --allow-net main.ts
```

- `setItem` is adding the tree
- You can also use `setItem` to update the record -- if the key already exists
  the value will be updated

```ts
const oak: Tree = {
  id: "3",
  species: "oak",
  age: 4,
  location: "Jim's Park",
};

localStorage.setItem(`trees_${oak.id}`, JSON.stringify(oak));
```

Ok, so now let’s use Hono’s routing to create some REST API routes now that we
understand how to work with these database methods:

```ts
app.post("/trees", async (c) => {
  const { id, species, age, location } = await c.req.json();
  const tree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, tree);
  return c.json({
    message: `We just added a ${species} tree!`,
  });
});
```

To test this out we’ll send a curl request:

```shell
curl -X POST http://localhost:8000/trees \
  -H "Content-Type: application/json" \
  -d '{"id": "2", "species": "Willow", "age": 100, "location": "Juniper Park"}'
```

To prove that we created that tree, let’s get the data by its ID:

```ts
app.get("/trees/:id", async (c) => {
  const id = c.req.param("id");
  const tree = await kv.get(["trees", id]);
  if (!tree.value) {
    return c.json({ message: "Tree not found" }, 404);
  }
  return c.json(tree.value);
});
```

To test that, let’s run a curl request for the data

```shell
curl http://localhost:8000/trees/1
```

Or you can go to it in the browser: `http://localhost:8000/trees/1`

We can update a tree of course. Kind of like before but we’ll create a route for
that:

```ts
app.put("/trees/:id", (c) => {
  const id = c.req.param("id");
  const { species, age, location } = c.req.json();
  const updatedTree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, updatedTree);
  return c.json({
    message: `Tree has relocated to ${location}!`,
  });
});
```

And we’ll change the location because we’re going to PUT this tree somewhere
else:

```shell
curl -X PUT http://localhost:8000/trees/1 \
  -H "Content-Type: application/json" \
  -d '{"species": "Oak", "age": 8, "location": "Theft Park"}'
```

Finally if we wanted to delete a tree we can using the Hono delete function.

```ts
const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

app.delete("/trees/:id", (c) => {
  const id = c.req.param("id");
  deleteItem(`trees_${id}`);
  return c.json({
    message: `Tree ${id} has been cut down!`,
  });
});
```

We’ve used Deno in combination with Hono to build a little REST API for our tree
data. If we wanted to deploy this, we could and we could deploy with zero config
to [Deno deploy](https://deno.com/deploy).

You can deploy this to any cloud VPS like AWS, GCP, Digital Ocean, with the
[official Docker image](https://github.com/denoland/deno_docker)

## Complete code sample

```ts
import { Hono } from "@hono/hono";

const app = new Hono();

interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}

const setItem = (key: string, value: Tree) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): Tree | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

const oak: Tree = {
  id: "3",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};

setItem(`trees_${oak.id}`, oak);
const newTree = getItem(`trees_${oak.id}`);
console.log(newTree);

app.get("/", (c) => {
  return c.text("Hello from the Trees!");
});

app.post("/trees", async (c) => {
  const { id, species, age, location } = await c.req.json();
  const tree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, tree);
  return c.json({
    message: `We just added a ${species} tree!`,
  });
});

app.get("/trees/:id", async (c) => {
  const id = await c.req.param("id");
  const tree = getItem(`trees_${id}`);
  if (!tree) {
    return c.json({ message: "Tree not found" }, 404);
  }
  return c.json(tree);
});

app.put("/trees/:id", async (c) => {
  const id = c.req.param("id");
  const { species, age, location } = await c.req.json();
  const updatedTree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, updatedTree);
  return c.json({
    message: `Tree has relocated to ${location}!`,
  });
});

app.delete("/trees/:id", (c) => {
  const id = c.req.param("id");
  deleteItem(`trees_${id}`);
  return c.json({
    message: `Tree ${id} has been cut down!`,
  });
});

Deno.serve(app.fetch);
```
