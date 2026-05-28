---
last_modified: 2025-03-10
title: Making a Deno project
description: "Step-by-step guide to creating your first Deno project. Learn how to initialize a project, understand the basic file structure, run TypeScript code, and execute tests using Deno's built-in test runner."
oldUrl: /runtime/manual/getting_started/first_steps/
---

In this guide, you'll create your first Deno project, run it, and execute its
tests. We'll use [TypeScript](https://www.typescriptlang.org/) throughout. To
follow along in JavaScript instead, rename the files to `.js` and remove the
type annotations.

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

[`deno.json`](/runtime/fundamentals/configuration/) holds your project
configuration. `main.ts` contains a small HTTP server built on
[`Deno.serve`](/api/deno/~/Deno.serve), showing off the built-in HTTP server,
`Response.json()`, and TypeScript working out of the box. The handler is
exported and guarded by `import.meta.main`, so `main_test.ts` can import and
call it directly without binding to a port.

## Run your project

Move into the new project directory:

```bash
cd my_project
```

You can run this program with the following command:

```bash
$ deno main.ts
Listening on http://localhost:8000/
```

When you pass a file path directly, Deno infers the `run` subcommand, so
`deno main.ts` is equivalent to `deno run main.ts`.

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
