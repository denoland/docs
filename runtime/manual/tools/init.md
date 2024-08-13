---
title: "`deno init`, start a new project"
---

Starting a new project with Deno has always been incredibly simple: you just
need a single file to get going. No need for any configuration files, dependency
manifests, or build scripts.

Users coming from other ecosystems are often not used to this simplicity - they
often look for a tool to scaffold out a basic project structure to get them
started on the right path. `deno init` subcommand scaffolds a basic Deno
project.

```sh
$ deno init
✅ Project initialized
Run these commands to get started

  // Run the program
  deno run main.ts

  // Run the program and watch for file changes
  deno task dev

  // Run the tests
  deno test

$ deno run main.ts
Add 2 + 3 = 5

$ deno test
Check file:///dev/main_test.ts
running 1 test from main_test.ts
addTest ... ok (6ms)

ok | 1 passed | 0 failed (29ms)
```

This subcommand will create two files (`main.ts` and `main_test.ts`). These
files provide a basic example of how to write a Deno program and how to write
tests for it. The `main.ts` file exports a `add` function that adds two numbers
together and the `main_test.ts` file contains a test for this function.

You can also specify an argument to `deno init` to initialize a project in a
specific directory:

```sh
$ deno init my_deno_project
✅ Project initialized

Run these commands to get started

  cd my_deno_project

  // Run the program
  deno run main.ts

  // Run the program and watch for file changes
  deno task dev

  // Run the tests
  deno test
```

## Init a JSR package

By running `deno init --lib` Deno will bootstrap a project that is ready to be
published on [JSR](https://jsr.io/).

```sh
$ deno init --lib
✅ Project initialized

Run these commands to get started

  # Run the tests
  deno test

  # Run the tests and watch for file changes
  deno task dev

  # Publish to JSR (dry run)
  deno publish --dry-run
```

Inside `deno.json` you'll see that the entries for `name`, `exports` and
`version` are prefilled.

```json
{
  "name": "my-lib",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "dev": "deno test --watch mod.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```
