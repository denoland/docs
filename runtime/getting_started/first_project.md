---
last_modified: 2026-05-14
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
TypeScript files are created: `main.ts` and `main_test.ts`. Let's look at what
`deno init` put in each of them, so the rest of this guide makes sense.

`main.ts` exports an `add` function and, when run as the entry point, prints the
result of calling it. The `import.meta.main` guard means this top-level call
only runs when you execute the file directly — not when another module imports
the `add` function from it:

```ts title="main.ts"
export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
```

`main_test.ts` imports the `add` function and asserts it returns the expected
result. `Deno.test` is built into the runtime, so there's no test framework to
install:

```ts title="main_test.ts"
import { assertEquals } from "@std/assert";
import { add } from "./main.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
```

`deno.json` is the project's
[configuration file](/runtime/fundamentals/configuration/). The generated one
declares a `dev` task that re-runs `main.ts` whenever a file changes, and pins
`@std/assert` from [JSR](https://jsr.io/@std/assert) so the test above can
resolve it:

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```

## Run your project

`cd` into the new directory and run `main.ts` with `deno run`:

```bash
$ cd my_project
$ deno run main.ts
Add 2 + 3 = 5
```

For an iterative workflow, use the generated `dev` task instead. It runs the
program in watch mode, restarting it every time you save a file:

```bash
deno task dev
```

## Run your tests

Deno has a [built in test runner](/runtime/fundamentals/testing/). You can write
tests for your code and run them with the `deno test` command. Run the tests in
your new project with:

```bash
$ deno test
running 1 test from ./main_test.ts     
addTest ... ok (1ms)

ok | 1 passed | 0 failed (3ms)
```

Now that you have a basic project set up you can start building your
application. Check out our [examples and tutorials](/examples/) for more ideas
on what to build with Deno.

You can
[learn more about using TypeScript in Deno here](/runtime/fundamentals/typescript).
