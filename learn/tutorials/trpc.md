---
title: "Build a Typesafe API with tRPC and Deno"
---

Deno is an
[all-in-one, zero-config toolchain](https://docs.deno.com/runtime/manual/tools)
for writing JavaScript and
[TypeScript](https://docs.deno.com/runtime/fundamentals/typescript/) with
[natively supports Web Platform APIs](https://docs.deno.com/runtime/reference/web_platform_apis/),
making it an ideal choice for quickly
[building backends and APIs](https://deno.com/learn/api-servers). To make our
API easier to maintain, we can use [tRPC](https://trpc.io/), a TypeScript RPC
([Remote Procedure Call](https://en.wikipedia.org/wiki/Remote_procedure_call))
framework that enables you to build fully type-safe APIs without schema
declarations or code generation.

In this tutorial, we'll build a simple type-safe API with tRPC and Deno that
returns information about dinosaurs:

- [Set up tPRC](#set-up-trpc)
- [Set up the server](#set-up-the-trpc-server)
- [Set up the client](#set-up-the-trpc-client)
- [What's next?](#whats-next)

You can find all the code for this tutorial in
[this GitHub repo](https://github.com/denoland/examples/tree/main/with-trpc).

## Set up tRPC

To get started with tRPC in Deno, we'll need to install the required
dependencies. Thanks to Deno's npm compatibility, we can use the npm versions of
tRPC packages along with Zod for input validation:

```bash
deno install npm:@trpc/server@next npm:@trpc/client@next npm:zod jsr:@std/path
```

This installs the most recent tRPC server and client packages,
[Zod](https://zod.dev/) for runtime type validation, and
[the Deno Standard Library's `path`](https://jsr.io/@std/path) utility. These
packages will allow us to build a type-safe API layer between our client and
server code.

This will create a `deno.json` file in the project root to manage the npm and
[jsr](https://jsr.io/) dependencies:

```tsx
{
  "imports": {
    "@std/path": "jsr:@std/path@^1.0.6",
    "@trpc/client": "npm:@trpc/client@^11.0.0-rc.593",
    "@trpc/server": "npm:@trpc/server@^11.0.0-rc.593",
    "zod": "npm:zod@^3.23.8"
  }
}
```

## Set up the tRPC server

The first step in building our tRPC application is setting up the server. We'll
start by initializing tRPC and creating our base router and procedure builders.
These will be the foundation for defining our API endpoints.

Create a `server/trpc.ts` file:

```tsx
// server/trpc.ts

import { initTRPC } from "@trpc/server";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export const router = t.router;
export const publicProcedure = t.procedure;
```

This initializes tRPC and exports the router and procedure builders that we'll
use to define our API endpoints. The `publicProcedure` allows us to create
endpoints that don't require authentication.

Next, we'll create a simple data layer to manage our dinosaur data. Create a
`server/db.ts` file with the below:

```tsx
// server/db.ts
import { join } from "@std/path";

type Dino = { name: string; description: string };

const dataPath = join("data", "data.json");

async function readData(): Promise<Dino[]> {
  const data = await Deno.readTextFile(dataPath);
  return JSON.parse(data);
}

async function writeData(dinos: Dino[]): Promise<void> {
  await Deno.writeTextFile(dataPath, JSON.stringify(dinos, null, 2));
}

export const db = {
  dino: {
    findMany: () => readData(),
    findByName: async (name: string) => {
      const dinos = await readData();
      return dinos.find((dino) => dino.name === name);
    },
    create: async (data: { name: string; description: string }) => {
      const dinos = await readData();
      const newDino = { ...data };
      dinos.push(newDino);
      await writeData(dinos);
      return newDino;
    },
  },
};
```

This creates a simple file-based database that reads and writes dinosaur data to
a JSON file. In a production environment, you'd typically use a proper database,
but this will work well for our demo.

> ⚠️️ In this tutorial, we hard code data and use a file-based database. However,
> you can
> [connect to a variety of databases](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
> and use ORMs like [Drizzle](https://docs.deno.com/learn/tutorials/drizzle) or
> [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/).

Finally, we'll need to provide the actual data. Let's create a `./data.json`
file with some sample dinosaur data:

```tsx
// data/data.json
[
  {
    "name": "Aardonyx",
    "description": "An early stage in the evolution of sauropods."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel's lizard\" has been reconstructed from a single skull."
  },
  {
    "name": "Abrictosaurus",
    "description": "An early relative of Heterodontosaurus."
  },
  {
    "name": "Abrosaurus",
    "description": "A close Asian relative of Camarasaurus."
  },
  ...
 ]
```

Now, we can create our main server file that defines our tRPC router and
procedures. Create a `server/index.ts` file:

```tsx
// server/index.ts

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "./db.ts";
import { publicProcedure, router } from "./trpc.ts";

const appRouter = router({
  dino: {
    list: publicProcedure.query(async () => {
      const dinos = await db.dino.findMany();
      return dinos;
    }),
    byName: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts;
      const dino = await db.dino.findByName(input);
      return dino;
    }),
    create: publicProcedure
      .input(z.object({ name: z.string(), description: z.string() }))
      .mutation(async (opts) => {
        const { input } = opts;
        const dino = await db.dino.create(input);
        return dino;
      }),
  },
  examples: {
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
```

This sets up three main endpoints:

- `dino.list`: Returns all dinosaurs
- `dino.byName`: Returns a specific dinosaur by name
- `dino.create`: Creates a new dinosaur
- `examples.iterable`: A demonstration of tRPC's support for async iterables

The server is configured to listen on port 3000 and will handle all tRPC
requests.

While you can run the server now, you won't be able to access any of the routes
and have it return data. Let's fix that!

## Set up the tRPC client

With our server ready, we can create a client that consumes our API with full
type safety. Create a `client/index.ts` file:

```tsx
// client/index.ts
/**
 * This is the client-side code that uses the inferred types from the server
 */
import {
  createTRPCClient,
  splitLink,
  unstable_httpBatchStreamLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */
import type { AppRouter } from "../server/index.ts";

// Initialize the tRPC client
const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: unstable_httpSubscriptionLink({
        url: "http://localhost:3000",
      }),
      false: unstable_httpBatchStreamLink({
        url: "http://localhost:3000",
      }),
    }),
  ],
});

const dinos = await trpc.dino.list.query();
console.log("Dinos:", dinos);

const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
    "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
});
console.log("Created dino:", createdDino);

const dino = await trpc.dino.byName.query("Denosaur");
console.log("Denosaur:", dino);

const iterable = await trpc.examples.iterable.query();

for await (const i of iterable) {
  console.log("Iterable:", i);
}
```

This client code demonstrates several key features of tRPC:

1. **Type inference from the server router**. The client automatically inherits
   all type definitions from the server through the `AppRouter` type import.
   This means you get complete type support and compile-time type checking for
   all your API calls. If you modify a procedure on the server, TypeScript will
   immediately flag any incompatible client usage.
2. **Making queries and mutations**. The example demonstrates two types of API
   calls: Queries (`list` and `byName`) used for fetching data without side
   effects, and mutations (`create`) used for operations that modify server-side
   state. The client automatically knows the input and output types for each
   procedure, providing type safety throughout the entire request cycle.
3. **Working with async iterables**. The `examples.iterable` demonstrates tRPC's
   support for streaming data using async iterables. This feature is
   particularly useful for real-time updates or processing large datasets in
   chunks.

Now, let's start our server to see it in action. In our `deno.json` config file,
let's create a new property `tasks` with the following commands:

```json
{
  "tasks": {
    "start": "deno -A server/index.ts",
    "client": "deno -A client/index.ts"
  }
  // Other properties in deno.json remain the same.
}
```

We can list our available tasks with `deno task`:

```bash
deno task
Available tasks:
- start
    deno -A server/index.ts
- client
    deno -A client/index.ts
```

Now, we can start the server with `deno task start`. After that's running, we
can run the client with `deno task client`. You should see an output like this:

```bash
deno task client
Dinos: [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods."
  },
  {
    name: "Abelisaurus",
    description: "Abel's lizard has been reconstructed from a single skull."
  },
  {
    name: "Abrictosaurus",
    description: "An early relative of Heterodontosaurus."
  },
  ...
]
Created dino: {
  name: "Denosaur",
  description: "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast."
}
Denosaur: {
  name: "Denosaur",
  description: "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast."
}
Iterable: 0
Iterable: 1
Iterable: 2
```

Success! Running the `./client/index.ts` shows how to create a tRPC client and
use its JavaScript API to interact with the database. But how can we check if
the tRPC client is inferring the right types from the database? Let's modify the
code snippet below in `./client/index.ts` to pass a `number` instead of a
`string` as the `description`:

```diff
// ...
const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
-   "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
+   100,
});
console.log("Created dino:", createdDino);
// ...
```

When we re-run the client:

```bash
deno task client
...
error: Uncaught (in promise) TRPCClientError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [
      "description"
    ],
    "message": "Expected string, received number"
  }
]
    at Function.from (file:///Users/andyjiang/Library/Caches/deno/npm/registry.npmjs.org/@trpc/client/11.0.0-rc.608/dist/TRPCClientError.mjs:35:20)
    at file:///Users/andyjiang/Library/Caches/deno/npm/registry.npmjs.org/@trpc/client/11.0.0-rc.608/dist/links/httpBatchStreamLink.mjs:118:56
    at eventLoopTick (ext:core/01_core.js:175:7)
```

tRPC successfully threw an `invalid_type` error, since it was expecting a
`string` instead of a `number`.

## What’s next?

Now that you have a basic understanding of how to use tRPC with Deno, you could:

1. Build out an actual frontend using
   [Next.js](https://trpc.io/docs/client/nextjs) or
   [React](https://trpc.io/docs/client/react)
2. [Add authentication to your API using tRPC middleware](https://trpc.io/docs/server/middlewares#authorization)
3. Implement real-time features
   [using tRPC subscriptions](https://trpc.io/docs/server/subscriptions)
4. Add [input validation](https://trpc.io/docs/server/validators) for more
   complex data structures
5. Integrate with a proper database like
   [PostgreSQL](https://docs.deno.com/runtime/tutorials/connecting_to_databases/#postgres)
   or use an ORM like [Drizzle](https://docs.deno.com/learn/tutorials/drizzle)
   or [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/)
6. Deploy your application to [Deno Deploy](https://deno.com/deploy) or
   [any public cloud via Docker](https://docs.deno.com/runtime/tutorials/#deploying-deno-projects)

🦕 Happy type safety coding with Deno and tRPC!
