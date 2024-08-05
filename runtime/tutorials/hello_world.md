---
title: "Hello World"
oldUrl:
  - /runtime/manual/examples/hello_world/
---

In this tutorial we'll walk through how to create and run a simple hello world
program with Deno. Since Deno can run JavaScript or TypeScript out of the box
with no additional tools or config required we'll take a look at both a JS and a
TS example.

## Hello World, running JavaScript

In this JavaScript example the message `Hello from JavaScript` is printed to the
console. Create a new file called `hello-world.js` and add the following code:

```js
const greeting = "Hello from JavaScript";

console.log(greeting);
```

In your terminal, navigate to the directory where your `hello-world.js` file is
located and run the file using the `deno run` command:

```bash
$ deno run hello-world.js
Hello from JavaScript
```

## TypeScript

This TypeScript example is exactly the same as the JavaScript example above, the
code just has the additional type information which TypeScript supports.

The `deno run` command is exactly the same, it just references a `*.ts` file
rather than a `*.js` file.

```ts
const greeting: string = "Hello from TypeScript";

console.log(greeting);
```

As before, run this file using the `deno run` command in your terminal:

```bash
$ deno run hello-world.ts
Hello from TypeScript
```

## Conclusion

In this tutorial we've seen how to create and run a simple hello world program
with Deno. We've seen how to run both JavaScript and TypeScript files and how to
use the `deno run` command to execute them.
