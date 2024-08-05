---
title: "Initializing a Deno Project with deno init"
---

Deno provides a built-in command to initialize a new project. The `deno init`
command creates a new directory with a basic project structure.

## Initialize a new project

Navigate to the directory where you want to create your new project and run the
following command:

```bash
deno init
```

or if you want to create a project with a specific name, in a named directory:

```bash
deno init my_project_name
```

This command will create a new directory named my_deno_project with the
following structure:

```bash
your_project
├── deno.json
├── main.ts
└── main_test.ts
```

- `deno.json` is the project configuration file.
- `main.ts` is the main entry point of your Deno application. It contains a
  simple example function.
- `main_test.ts` is where you can write tests. It contains a simple test for the
  example function in `main.ts`.

If you created a new directory then `cd` into the directory. You can now run the
example function in `main.ts` with the following command:

```bash
$ deno run main.ts
Add 2 + 3 = 5
```

### main.ts

Let's take a look at the contents of the `main.ts` file:

```typescript
export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
```

This file is a simple example of a module in Deno. You can learn more about
modules in the [module metadata tutorial](/tutorials/module_metadata).

The `add` function takes two arguments `a` and `b`, both of which are numbers,
and returns their sum.

The `import.meta.main` check ensures that the function is only called when the
file is executed directly with `deno run main.ts`. This is useful when you want
to write code that can be both imported as a module and executed as a standalone
script.

### main_test.ts

The `main_test.ts` file contains a simple test for the `add` function in
`main.ts`:

```typescript
import { assertEquals } from "jsr:@std/assert";
import { add } from "./main.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
```

The test uses the `assertEquals` function from Deno's standard library of
assertion functions [std/assert](https://jsr.io/@std/assert) to compare the
result of the `add` function with the expected value. We take a look at
importing modules in a little more depth in the tutorial on
[importing and using third party modules](/tutorials/importing_modules).

The file defines a test named `addTest` that calls the `add` function with the
arguments `2` and `3` and asserts that the result is `5`.

You can run the test with the following command:

```bash
$ deno test main_test.ts
running 1 test from ./main_test.ts
addTest ... ok (0ms)

ok | 1 passed | 0 failed (3ms)
```

The test passes, which means that the `add` function is working as expected.

## Next steps

Now you can build upon your initialized Deno project. You could start by
expanding the functionality in main.ts or you could add new modules, create more
complex functions, and integrate third-party libraries. As you go, you can
enhance your project structure by organizing your code into directories like
`src` for source files and `tests` for test files. Implement robust error
handling and logging to make your application more resilient. Don’t forget to
write comprehensive tests in `main_test.ts` to ensure your code is reliable. You
can also explore Deno’s built-in tools for formatting, linting, and bundling
your code.

// links go in here ^
