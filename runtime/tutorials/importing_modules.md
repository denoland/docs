---
title: "Importing and using modules"
---

While making a Deno project, you may want to use modules to organize your code
better and leverage reusable components. Modules allow you to break down your
application into smaller, manageable pieces, making it easier to maintain and
scale.

In this tutorial, we’ll guide you through the process of creating, importing,
and using both local and third-party modules in Deno. By the end, you’ll have a
solid understanding of how to effectively manage and use modules, enabling you
to build more modular and maintainable applications.

## Local Modules

Initialise a new deno project, and `cd` into the project directory:

```bash
deno init my_deno_project
cd my_deno_project
```

We'll create a module which will contain two functions: `add` and `subtract`.
Create a new file called `math.ts` and add the following code:

```typescript title="math.ts"
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}
```

Next we'll import these functions so that we can use them in `main.ts`. Rewrite
your `main.ts` file with the following code:

```typescript title="main.ts"
import { add, subtract } from "./math.ts";

console.log("5 + 3 =", add(5, 3));
console.log("5 - 3 =", subtract(5, 3));
```

You can now run the `main.ts` script using the following command:

```bash
$ deno run main.ts
5 + 3 = 8
5 - 3 = 2
```

You should see the sum and difference of the numbers printed to the console.

## Using Third-Party Modules

In this tutorial we're going to use the
[@luca/cases](https://jsr.io/@luca/cases) package to convert text strings to
different case formats (camel case, kebab case etc).

```bash
deno add @luca/cases
```

This will add an imports map to your `deno.json` file, which will allow you to
import the `cases` package in your project.

Update your `main.ts` file to import two of the methods from the `cases` package
and use them to change the format of the string `hello world`:

```typescript title="main.ts"
import { camelCase, splitPieces } from "@luca/cases";

console.log(camelCase("hello world")); // helloWorld
console.log(splitPieces("hello world")); // ["hello", "World"]
```

You can now run the `main.ts` script using the following command:

```bash
$ deno run main.ts
helloWorld
[ "hello", "world" ]
```

You should see the string `hello world` converted to camel case and split into
an array of separate strings.

To read more about importing modules in Deno, check out our documentation on
[ECMAScript Modules in Deno](/runtime/manual/basics/modules/).
