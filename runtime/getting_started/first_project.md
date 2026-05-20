---
last_modified: 2025-03-10
title: Making a Deno project
description: "Step-by-step guide to creating your first Deno project. Learn how to initialize a project, understand the basic file structure, run TypeScript code, and execute tests using Deno's built-in test runner."
oldUrl: /runtime/manual/getting_started/first_steps/
---

Deno has many [built in tools](/runtime/reference/cli/) to make your development
experience as smooth as possible. One of these tools is the
[project initializer](/runtime/reference/cli/init), which creates a new Deno
project with a basic file structure and configuration.

While you are welcome to use JavaScript, Deno has built-in support for
[TypeScript](https://www.typescriptlang.org/) as well, so we'll be using
TypeScript in this guide. If you'd prefer to use JavaScript, you can rename the
files to `.js` and remove the type annotations.

## Initialize a new project

To initialize a new Deno project, run the following command in your terminal:

```bash
deno init my_project
```

This will create a new directory called `my_project` with the following
structure:

```plaintext
my_project
├── deno.json
├── main_test.ts
└── main.ts
```

A `deno.json` file is created to
[configure your project](/runtime/fundamentals/configuration/), and two
TypeScript files are created; `main.ts` and `main_test.ts`. As of Deno 2.8 the
`main.ts` file contains a small HTTP server built on
[`Deno.serve`](/api/deno/~/Deno.serve) — it shows off Deno's built-in HTTP
server, `Response.json()`, and TypeScript working out of the box. The handler
is exported and guarded by `import.meta.main`, so `main_test.ts` can import
and call it directly without binding to a port.

## Run your project

You can run this program with the following command:

```bash
$ deno main.ts
Listening on http://localhost:8000/
```

Open the URL in your browser to see the response.

## Run your tests

Deno has a [built in test runner](/runtime/fundamentals/testing/). You can write
tests for your code and run them with the `deno test` command. Run the tests in
your new project with:

```bash
$ deno test
running 2 tests from ./main_test.ts
handler returns hello ... ok (1ms)
handler returns 404 for unknown route ... ok (1ms)

ok | 2 passed | 0 failed (3ms)
```

Now that you have a basic project set up you can start building your
application. Check out our [examples and tutorials](/examples/) for more ideas
on what to build with Deno.

You can
[learn more about using TypeScript in Deno here](/runtime/fundamentals/typescript).
