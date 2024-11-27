---
title: "Hello World"
oldUrl:
  - /runtime/manual/examples/hello_world/
  - /runtime/tutorials/init_project/
  - /runtime/tutorials/hello_world/
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

## Running a script

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

## Initialize a project

As you've just seen, while it is possible to run scripts directly with
`deno run`, for larger projects it is recommended to create a project structure.
This way you can organize your code, manage dependencies, script tasks and run
tests more easily.

Initialize a new project by running the following command:

```sh
deno init my_project
```

Where `my_project` is the name of your project. You can
[read more about the project structure](/runtime/getting_started/first_project/).

### Run your project

Navigate to the project directory:

```sh
cd my_project
```

Then you can run the project directly using the `deno task` command:

```sh
deno task dev
```

Take a look in the `deno.json` file in your new project. You should see a `dev`
task in the "tasks" field.

```json title="deno.json"
"tasks": {
  "dev": "deno run --watch main.ts"
},
```

The `dev` task is a common task that runs the project in development mode. As
you can see, it runs the `main.ts` file with the `--watch` flag, which will
automatically reload the script when changes are made. You can see this in
action if you open the `main.ts` file and make a change.

### Run the tests

In the project directory run:

```sh
deno test
```

This will execute all the tests in the project. You can read more about
[testing in Deno](/runtime/fundamentals/testing/) and we'll cover tests in a
little more depth in a later tutorial. At the moment you have one test file,
`main_test.ts`, which tests the `add` function in `main.ts`.

### Adding to your project

The `main.ts` file serves as the entry point for your application. It’s where
you’ll write your main program logic. When developing your project you will
start by removing the default addition program and replace it with your own
code. For example, if you’re building a web server, this is where you’d set up
your routes and handle requests.

Beyond the initial files, you’ll likely create additional modules (files) to
organize your code. Consider grouping related functionality into separate files.
Remember that Deno [supports ES modules](/runtime/fundamentals/modules/), so you
can use import and export statements to structure your code.

Example folder structure for a deno project:

```sh
my_project/
├── deno.json
├── main.ts
├── main_test.ts
├── routes/
│   ├── home.ts
│   ├── about.ts
├── services/
│   ├── user.ts
│   ├── post.ts
└──utils/
    ├── logger.ts
    ├── logger_test.ts
    ├── validator_test.ts
    └── validator.ts
```

This kind of structure keeps your project clean and makes it easier to find and
manage files.

🦕 Congratulations! Now you know how to create a simple script in both JS and TS
and how to run it in Deno with the `deno run` command and how to create a brand
new project with `deno init`. Remember that Deno encourages simplicity and
avoids complex build tools. Keep your project modular, testable, and organized.
As your project grows, adapt the structure to fit your needs. And most
importantly, have fun exploring Deno’s capabilities!
