---
title: "`deno init`, start a new project"
oldUrl: /runtime/manual/tools/init/
command: init
---

## Examples

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

The `init` subcommand will create two files (`main.ts` and `main_test.ts`).
These files provide a basic example of how to write a Deno program and how to
write tests for it. The `main.ts` file exports a `add` function that adds two
numbers together and the `main_test.ts` file contains a test for this function.

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

## Initialize a web server

Running `deno init --serve` bootstraps a web server that works with
[`deno serve`](./serve).

```sh
$ deno init --serve
✅ Project initialized

Run these commands to get started

  # Run the server
  deno serve -R main.ts

  # Run the server and watch for file changes
  deno task dev

  # Run the tests
  deno -R test
```

Your [`deno.json`](/runtime/fundamentals/configuration/) file will look like
this:

```json
{
  "tasks": {
    "dev": "deno serve --watch -R main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "@std/http": "jsr:@std/http@1"
  }
}
```

Now, you can start your web server, which
[watches for changes](/runtime/getting_started/command_line_interface/#watch-mode),
by running `deno task dev`.

```sh
$ deno task dev
Task dev deno serve --watch -R main.ts
Watcher Process started.
deno serve: Listening on http://0.0.0.0:8000/
```

## Generate a library project

You can append a `--lib` flag to add extra parameters to your `deno.json`, such
as "name", "version" and an "exports" fields.

```sh
$ deno init my_deno_project --lib
✅ Project initialized
```

The resulting `deno.json will be as follows:

```jsonc
{
  "name": "my_deno_project",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "dev": "deno test --watch mod.ts"
  },
  "license": "MIT",
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```
