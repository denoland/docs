---
title: Making a Deno project
description: "Step-by-step guide to creating your first Deno project. Learn how to initialize a project, build an HTTP server, add dependencies, and run tests."
oldUrl: /runtime/manual/getting_started/first_steps/
---

This guide walks you through creating a Deno project from scratch, building a
small HTTP server, adding a dependency, and running tests.

## Initialize a project

```bash
deno init my_project
cd my_project
```

This creates a directory with three files:

```plaintext
my_project
├── deno.json
├── main.ts
└── main_test.ts
```

Run it to make sure everything works:

```bash
$ deno main.ts
Add 2 + 3 = 5
```

## Build a server

Replace the contents of `main.ts` with a simple HTTP server:

```ts title="main.ts"
Deno.serve((_req) => {
  return new Response("Hello, world!");
});
```

Run it:

```bash
$ deno run --allow-net main.ts
Listening on http://0.0.0.0:8000/
```

Open [http://localhost:8000](http://localhost:8000) in your browser and you'll
see "Hello, world!".

## Add routing

Let's make it more interesting. Update `main.ts` to handle different routes:

```ts title="main.ts"
Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response("Home");
  }

  if (url.pathname === "/about") {
    return new Response("About page");
  }

  return new Response("Not found", { status: 404 });
});
```

Restart the server and try
[http://localhost:8000/about](http://localhost:8000/about).

:::tip

Use `deno run --watch --allow-net main.ts` to automatically restart the server
when you save changes.

:::

## Add a dependency

Install a package using `deno add`. Let's add
[`zod`](https://www.npmjs.com/package/zod) from npm to validate query
parameters:

```bash
$ deno add npm:zod
Add zod - npm:zod@4.3.6
```

This updates your `deno.json` automatically. Now update `main.ts` to use it:

```ts title="main.ts"
import { z } from "zod";

const GreetParams = z.object({
  name: z.string().min(1),
});

Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response("Home");
  }

  if (url.pathname === "/greet") {
    const result = GreetParams.safeParse({
      name: url.searchParams.get("name"),
    });

    if (!result.success) {
      return new Response("Invalid params: name is required", { status: 400 });
    }

    return new Response(`Hello, ${result.data.name}!`);
  }

  return new Response("Not found", { status: 404 });
});
```

Restart the server and try
[http://localhost:8000/greet?name=Alice](http://localhost:8000/greet?name=Alice).
Try it without the `name` parameter to see the validation error.

## Write a test

Replace the contents of `main_test.ts` with a test for your server:

```ts title="main_test.ts"
import { assertEquals } from "@std/assert";

Deno.test("home route returns 200", async () => {
  const server = Deno.serve(
    { port: 9000, onListen() {} },
    (req) => {
      const url = new URL(req.url);
      if (url.pathname === "/") {
        return new Response("Home");
      }
      return new Response("Not found", { status: 404 });
    },
  );

  const res = await fetch("http://localhost:9000/");
  assertEquals(res.status, 200);
  assertEquals(await res.text(), "Home");

  await server.shutdown();
});
```

Run the tests:

```bash
$ deno test --allow-net
running 1 test from ./main_test.ts
home route returns 200 ... ok (5ms)

ok | 1 passed | 0 failed (12ms)
```

## Next steps

You now have a working project with an HTTP server, a dependency, and tests.
From here you can:

- Browse [examples and tutorials](/examples/) for more ideas
- Learn about [modules and dependencies](/runtime/fundamentals/modules/)
- Explore the [Deno Standard Library](/runtime/reference/std/)
- Set up your [editor/IDE](/runtime/getting_started/setup_your_environment/)
