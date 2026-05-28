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
configuration. `main.ts` is a small HTTP server built on
[`Deno.serve`](/api/deno/~/Deno.serve), and `main_test.ts` has the tests for it.

## Run your project

Move into the new project directory:

```bash
cd my_project
```

You can run this program with the following command:

```bash
$ deno -N main.ts
Listening on http://localhost:8000/
```

The server needs network permission, granted here via `-N` (short for
`--allow-net`). See [security](/runtime/fundamentals/security/) for more.

Open the URL in your browser to see the response.

## Run your tests

Run the tests with [`deno test`](/runtime/fundamentals/testing/):

```bash
$ deno test
running 2 tests from ./main_test.ts
handler returns hello ... ok (1ms)
handler returns 404 for unknown route ... ok (1ms)

ok | 2 passed | 0 failed (3ms)
```

You're set. Browse our [examples and tutorials](/examples/) for ideas on what to
build next.
