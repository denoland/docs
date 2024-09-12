---
title: "Hello World"
oldUrl:
  - /runtime/manual/examples/hello_world/
---

Deno is a secure runtime for JavaScript and TypeScript.

A runtime is the environment where your code executes. It provides the necessary
infrastructure for your programs to run, handling things like memory management,
I/O operations, and interaction with external resources. The runtime is
responsible for translating your high-level code (JavaScript or TypeScript) into
machine instructions that the computer can understand.

When you run JavaScript in a web browser (like Chrome, Firefox, or Edge), you’re
using a browser runtime.

Browser runtimes are tightly coupled with the browser itself. They provide APIs
for manipulating the Document Object Model (DOM), handling events, making
network requests, and more. These runtimes are sandboxed, they operate within
the browser’s security model. They can’t access resources outside the browser,
such as the file system or environment variables.

When you run your code with Deno, you’re executing your JavaScript or TypeScript
code directly on your machine, outside the browser context. Therefore, Deno
programs can access resources on the host computer, such as the file system,
environment variables, and network sockets.

Deno provides a seamless experience for running JavaScript and TypeScript code.
Whether you prefer the dynamic nature of JavaScript or the type safety of
TypeScript, Deno has you covered.

## Tutorial

In this tutorial we'll create a simple "Hello World" example in both JavaScript
and TypeScript using Deno.

We'll define a `capitalize` function that capitalizes the first letter of a
word. Then, we define a `hello` function that returns a greeting message with
the capitalized name. Finally, we call the `hello` function with different names
and print the output to the console.

### JavaScript

First, create a `hello-world.js` file and add the following code:

```js title="hello-world.js"
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name) {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));
```

Run the script using the `deno run` command:

```sh
$ deno run hello-world.js
Hello John
Hello Sarah
Hello Kai
```

### TypeScript

This TypeScript example is exactly the same as the JavaScript example above, the
code just has the additional type information which TypeScript supports.

Create a `hello-world.ts` file and add the following code:

```ts title="hello-world.ts"
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function hello(name: string): string {
  return "Hello " + capitalize(name);
}

console.log(hello("john"));
console.log(hello("Sarah"));
console.log(hello("kai"));
```

Run the TypeScript script using the `deno run` command:

```sh
$ deno run hello-world.ts
Hello John
Hello Sarah
Hello Kai
```

🦕 Congratulations! Now you know how to create a simple script in both JS and TS
and how to run it in Deno with the `deno run` command.
