---
title: "Migrating from Node.js to Deno"
---

To migrate an existing Node.js program to Deno, there are a number of
differences to take into account between the Node and Deno runtimes. This guide
will attempt to call out several of those differences, and describe how you can
begin to migrate your Node.js project to work on Deno.

:::info About Node.js Compatibility

Node.js compatibility is an ongoing project in Deno - you may encounter some
modules or packages on npm that do not work as you expect. If you do run into a
problem with Node.js compatibility, please let us know by
[opening an issue on GitHub](https://github.com/denoland/deno/issues).

:::

## Module imports and exports

Deno supports [ECMAScript modules](../basics/modules/index.md) exclusively,
rather than a combination of ESM and
[CommonJS](https://nodejs.org/api/modules.html), as found in Node. If your
Node.js code uses `require`, you should update it to use `import` statements
instead. If your internal code uses CommonJS-style exports, those will need to
be changed as well.

Consider the following two files in a Node.js program, located in the same
directory:

```js title="index.js"
const addNumbers = require("./add_numbers");
console.log(addNumbers(2, 2));
```

```js title="add_numbers.js"
module.exports = function addNumbers(num1, num2) {
  return num1 + num2;
};
```

Running `node index.js` with the files above works fine in Node.js 20 and
earlier. However, this code will not run unchanged if you attempt to use
`deno run index.js` instead. You will need to change both the code that is
consuming the module, and how you export functionality from the `add_numbers`
module.

### Replace `require` with `import`

Replace `require` statements with an `import`, like so:

```js
import addNumbers from "./add_numbers.js";
```

This statement uses the ES6 module standard, but does pretty much the same
thing. Also, note that we **include the full file extension when importing
modules**, much as you would in the browser. There is also no special handling
of files named `index.js`.

### Replace `module.exports` with `export default`

In the `add_numbers.js` file that exports the function, we would use a default
export from ES6 modules rather than the `module.exports` provided by CommonJS.

```js title="add_numbers.js"
export default function addNumbers(num1, num2) {
  return num1 + num2;
}
```

After making those two changes, this code would run successfully with
`deno run index.js`. Learn more about
[ES modules in Deno here](../basics/modules/index.md).

## Node.js built-ins

In Node.js 20 and earlier, built-in modules in the Node.js standard library
could be imported with "bare specifiers". Consider the Node program below with a
`.mjs` extension:

```js title="index.mjs"
import * as os from "os";
console.log(os.cpus());
```

The [`os` module](https://nodejs.org/api/os.html#oscpus) is built in to the
Node.js runtime, and can be imported using a bare specifier as above.

:::info .mjs extensions not required in Deno

The `.mjs` file extension is supported but not required in Deno. Because Node
doesn't support ESM by default, it requires you to name any files that use ESM
with a `.mjs` file extension.

:::

Deno provides a compatibility layer that allows the use of Node.js built-in APIs
within Deno programs. However, in order to use them, you will need to add the
[`node:` specifier](./node_specifiers.md) to any import statements that use
them.

For example - if you update the code above to be this instead:

```js
import * as os from "node:os";
console.log(os.cpus());
```

And run it with `deno run index.mjs` - you will notice you get the same output
as running the program in Node.js. Updating any imports in your application to
use `node:` specifiers should enable any code using Node built-ins to function
as it did in Node.js.

## Runtime permissions in Deno

Deno features [runtime security by default](../basics/permissions.md), meaning
that you as the developer must opt in to giving your code access to the
filesystem, network, system environment, and more. Doing this prevents supply
chain attacks and other potential vulnerabilities in your code. By comparison,
Node.js has no concept of runtime security, with all code executed with the same
level of permission as the user running the code.

### Running your code with only the necessary flags

When you run a Node.js project ported to Deno for the first time, the runtime
will likely prompt you for access to the permissions it needs to execute your
code. Consider the following simple [express](https://expressjs.com/) server:

```js
import express from "npm:express@4";

const app = express();

app.get("/", function (_req, res) {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Express listening on :3000");
});
```

If you run it with `deno run server.js`, it would prompt you for a number of
permissions required to execute the code and its dependencies. These prompts can
show you what runtime permission flags need to be passed in to grant the access
you need. Running the code above with the necessary permissions provided would
look like this:

```shell
deno run --allow-net --allow-read --allow-env server.js
```

### Reusing runtime flag configuration with `deno task`

A common pattern for configuring a set of runtime flags is to set up scripts to
be run with [`deno task`](../tools/task_runner.md). The following `deno.json`
file has a task called `dev` which will run the express server from above with
all the necessary flags.

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-env server.js"
  }
}
```

You can then run the task with `deno task dev`.

### Running with all permissions enabled

It is possible, but not recommended in production or sensitive environments, to
run your programs with all runtime permissions enabled. This would be the
default behavior of Node, which lacks a permission system. To run a program with
all permissions enabled, you can do so with:

```shell
deno run -A server.js
```

## Running scripts from `package.json`

Many Node.js projects make use of
[npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts) to drive local
development. In Deno, you can continue to use your existing npm scripts while
migrating over time to [`deno task`](../tools/task_runner.md).

### Running npm scripts in Deno

One of the ways [Deno supports existing `package.json` files](./package_json.md)
is by executing any scripts configured there with `deno task`. Consider the
following Node.js project with a package.json and a script configured within it.

```js title="bin/my_task.mjs"
console.log("running my task...");
```

```json title="package.json"
{
  "name": "test",
  "scripts": {
    "start": "node bin/my_task.mjs"
  }
}
```

You can execute this script with Deno by running `deno task start`.

## Using and managing npm dependencies

Deno supports
[managing npm dependencies through a `package.json` file](./package_json.md).
Note that unlike using npm at the command line, you can simply run your project
with `deno run`, and the first time your script runs, Deno will cache all the
necessary dependencies for your application.

Going forward, we'd recommend that you manage dependencies through
[`deno.json`](../getting_started/configuration_file.md) instead, which supports
other types of imports as well.

When importing npm packages, you would use the `npm:` specifier, much like you
would the `node:` specifier for any built-in Node modules.

```js
import express from "npm:express@4";

const app = express();

app.get("/", function (_req, res) {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Express listening on :3000");
});
```

## Node.js global objects

In Node.js, there are a number of
[global objects](https://nodejs.org/api/globals.html) that are available in the
scope of all programs, like the `process` object or `__dirname` and
`__filename`.

Deno does not add additional objects and variables to the global scope, other
than the [`Deno` namespace](../runtime/builtin_apis.md). Any API that doesn't
exist as a web standard browser API will be found in this namespace.

The equivalent Deno expression for every Node.js built-in global object will
vary, but it should be possible to accomplish everything you can do in Node
using a slightly different method in Deno. For example, the
[process.cwd()](https://nodejs.org/api/process.html#processcwd) function in
Node.js exists in Deno as [Deno.cwd()](https://www.deno.com/api?s=Deno.cwd).

### `__filename` and `__dirname`

Two very common Node.js global variables in CommonJS modules are
[`__filename`](https://nodejs.org/api/globals.html#__filename) and
[`__dirname`](https://nodejs.org/api/globals.html#__dirname). These globals are
[not supported](https://nodejs.org/api/esm.html#no-__filename-or-__dirname) in
ECMAScript modules in Deno or Node.js, but there is still a way to get the same
information in Deno Runtime APIs:

```js
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
```
