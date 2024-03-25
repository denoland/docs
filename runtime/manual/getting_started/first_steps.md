import { replacements } from "@site/src/components/Replacement";

# First Steps

Welcome to Deno! If you're just getting started, here's a primer on some key
features and functionality of the runtime. If you haven't already, make sure to
[install the Deno runtime](./installation.md).

## Create and run a TypeScript program

While you are welcome to use JavaScript, Deno has built-in support for
[TypeScript](https://www.typescriptlang.org/) as well. In your terminal, create
a new file called `hello.ts`, and include the following code.

```ts title="hello.ts"
interface Person {
  firstName: string;
  lastName: string;
}

function sayHello(p: Person): string {
  return `Hello, ${p.firstName}!`;
}

const ada: Person = {
  firstName: "Ada",
  lastName: "Lovelace",
};

console.log(sayHello(ada));
```

This program declares an
[interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
for a Person, and defines a function that prints a message to the console using
this data type. You can execute the code in this example using the `deno run`
command.

```console
deno run -A hello.ts
```

You can
[learn more about using TypeScript in Deno here](../advanced/typescript/overview.md).

## Built-in web APIs and the Deno namespace

Deno aims to provide a browser-like programming environment,
[implementing web standard APIs](../runtime/web_platform_apis.md) that exist in
front-end JavaScript. For example, the
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API is
available in the global scope, just as in the browser. To see this in action,
replace the contents of `hello.ts` with the following code.

```ts
const site = await fetch("https://www.deno.com");

console.log(await site.text());
```

And then run it.

```console
deno run -A hello.ts
```

For APIs that don't exist as a web standard (like accessing variables from the
system environment, or manipulating the file system), those APIs are exposed in
the [Deno namespace](../runtime/builtin_apis.md). Replace the contents of
`hello.ts` with the following code, which will start
[an HTTP server](https://deno.land/api?s=Deno.serve) on
[localhost:8000](http://localhost:8000).

```ts
Deno.serve((_request: Request) => {
  return new Response("Hello, world!");
});
```

Save your changes and run the script.

```console
deno run -A hello.ts
```

Learn more about the [web-standard APIs](../runtime/web_platform_apis.md) built
in to Deno and the [Deno namespace APIs](../runtime/builtin_apis.md).

## Runtime security

A major feature of Deno is
[runtime security by default](../basics/permissions.md), meaning that you must
explicitly allow your code to access potentially sensitive APIs like file system
access, network connectivity, and access to environment variables.

So far, we've been running all of our scripts with the `-A` flag, which grants
all runtime feature access to our scripts. This is the most permissive mode to
run a Deno program, but usually you'll want to grant your code only the
permissions it needs to run.

To see this in action, let's replace the contents of `hello.ts` with the `fetch`
example from earlier.

```ts
const site = await fetch("https://www.deno.com");

console.log(await site.text());
```

Run this program **without** the `-A` flag - what happens then?

```console
deno run hello.ts
```

Without any permission flags passed in, you'll see security prompts that look
something like this:

```console
kevin@kevin-deno scratchpad % deno run index.ts
✅ Granted net access to "www.deno.com".
┌ ⚠️  Deno requests net access to "deno.com".
├ Requested by `fetch()` API.
├ Run again with --allow-net to bypass this prompt.
└ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) >
```

In the prompt, you might have noticed that it mentions the CLI flag you'd need
to run your code with permission to access the network - the `--allow-net` flag.
If you run the script again using this flag, you won't be prompted to
interactively grant network access to your script:

```console
deno run --allow-net hello.ts
```

For simplicity, we will sometimes show examples that use `deno run -A ...`, but
whenever possible (and in your production or CI environments), we encourage you
to take advantage of Deno's full suite of
[configurable runtime security options](../basics/permissions.md).

## Importing JavaScript modules

Most of the time, you will want to break up your program into multiple files.
Again favoring web standards and a browser-like programming model, Deno supports
this through
[ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
Consider the earlier TypeScript example we showed you:

```ts title="hello.ts"
interface Person {
  firstName: string;
  lastName: string;
}

function sayHello(p: Person): string {
  return `Hello, ${p.firstName}!`;
}

const ada: Person = {
  firstName: "Ada",
  lastName: "Lovelace",
};

console.log(sayHello(ada));
```

You might want to break this program up such that the `Person` interface and the
`sayHello` function are in a separate module. To do this, create a new file in
the same directory called `person.ts` and include the following code:

```ts title="person.ts"
export default interface Person {
  firstName: string;
  lastName: string;
}

export function sayHello(p: Person): string {
  return `Hello, ${p.firstName}!`;
}
```

This module creates a
[named export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#exporting_module_features)
for the `sayHello` function, and a
[default export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#default_exports_versus_named_exports)
for the `Person` interface.

Back in `hello.ts`, you can consume this module using the `import` keyword.

```ts title="hello.ts"
import Person, { sayHello } from "./person.ts";

const ada: Person = {
  lastName: "Lovelace",
  firstName: "Ada",
};

console.log(sayHello(ada));
```

:::info File extensions required in imports

Note that **file extensions are required** when importing modules - import logic
in Deno works as it does in the browser, where you would include the full file
name of your imports.

:::

[You can learn more about the module system in Deno here](../basics/modules/index.md).

## Remote modules and the Deno standard library

Deno supports loading and executing code from URLs, much as you would using a
`<script>` tag in the browser. In Deno 1.x, the
[standard library](https://jsr.io/@std) and most
[third-party modules](https://deno.land/x) are distributed on HTTPS URLs.

To see this in action, let's create a test for the `person.ts` module we created
above. Deno provides a [built-in test runner](../basics/testing/index.md), which
uses an assertion module distributed via HTTPS URL.

```ts title="person_test.ts"
import { assertEquals } from "jsr:std/assert@^0";
import Person, { sayHello } from "./person.ts";

Deno.test("sayHello function", () => {
  const grace: Person = {
    lastName: "Hopper",
    firstName: "Grace",
  };

  assertEquals("Hello, Grace!", sayHello(grace));
});
```

Run this test with:

```bash
deno test person_test.ts
```

The output should look something like this:

```bash
kevin@kevin-deno scratchpad % deno test person_test.ts
Check file:///Users/kevin/dev/denoland/scratchpad/person_test.ts
running 1 test from ./person_test.ts
sayHello function ... ok (4ms)

ok | 1 passed | 0 failed (66ms)
```

There's much more to explore with [the standard library](https://jsr.io/@std)
and [third-party modules](https://deno.land/x) - be sure to check them out!

## Configure your project with deno.json

Deno projects don't require a configuration file by default, but sometimes it's
convenient to store settings, admin scripts, and dependency configuration in a
well-known location. In Deno, that file is
[`deno.json` or `deno.jsonc`](../getting_started/configuration_file.md). This
file acts a bit like a `package.json` file in Node.js.

One of the things you can use `deno.json` for is configuring an
[import map](../basics/import_maps.md), which will let you set up aliases for
frequently used modules.

<p>
  To demonstrate, let's pin the version of the assert package of the standard library we want to
  use in our project to version <code>^0</code>.
</p>

Create a `deno.jsonc` file with the following contents.

```js title="deno.jsonc"
{
  "imports": {
    "@std/assert": "jsr:std/assert@^0"
  }
}
```

Now, open up your test file from before, and change it to use this import alias.

```ts title="person_test.ts"
import { assertEquals } from "@std/assert/mod.ts";
import Person, { sayHello } from "./person.ts";

Deno.test("sayHello function", () => {
  const grace: Person = {
    lastName: "Hopper",
    firstName: "Grace",
  };

  assertEquals("Hello, Grace!", sayHello(grace));
});
```

Running the test with `deno test person_test.ts` should work just as before, but
you might notice that Deno downloads a few extra files and generates a
`deno.lock` file, specifying a set of files depended on by your code. Both
`deno.jsonc` and `deno.lock` can be checked in to source control.

Learn more about
[configuring your project here](../getting_started/configuration_file.md).

## Node.js APIs and npm packages

Deno provides a compatibility layer that enables your code to use
[Node.js built-in modules and third-party modules from npm](../node/index.md).
Using Node and npm modules in your code looks a lot like using standard Deno
modules, except you'll use either a `node:` or `npm:` specifier when importing
Node built-ins or npm modules, respectively.

To see how it works, create a file called `server.js` and include the
following - a simple HTTP server using the popular
[Express](https://expressjs.com) framework.

```js
import express from "npm:express@4";

const app = express();

app.get("/", (request, response) => {
  response.send("Hello from Express!");
});

app.listen(3000);
```

With `node:` and `npm:` specifiers, you can bring the best of the Node.js
ecosystem with you to Deno.
[Learn more about Node and npm support](../node/index.md).

## Configure your IDE

Deno development is supported in a number of
[major IDEs](../getting_started/setup_your_environment.md). A popular option is
**Visual Studio Code**, with an
[official extension](../references/vscode_deno/index.md) maintained by the Deno
team.
[Install the extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
and enable it in your VS Code workspace by choosing the
`Deno: Initialize Workspace Configuration` option in the
[command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

![command palette setup](../images/command_palette.png)

Not a VS Code user? Find an integration for your favorite editor
[here](../getting_started/setup_your_environment.md).

## Web application frameworks

A common use case for Deno is building data-driven web applications. Doing that
usually requires use of a higher-level web framework, for which many options
exist in the Deno ecosystem. Here are a few of the most popular choices.

### Deno-native frameworks

- [Deno Fresh](https://fresh.deno.dev) - Fresh is a web framework designed for
  Deno. Pages are server-rendered by default, with the option to include
  interactive islands that run JavaScript on the client. If you're new to Deno
  and looking for a place to start, we recommend trying Fresh first!
- [Hono](https://hono.dev/getting-started/deno) - Hono is a light-weight web
  framework in the tradition of [Express](https://expressjs.com). Great for API
  servers and simple web applications.

### Deno-compatible frameworks

- [SvelteKit](https://kit.svelte.dev/) - SvelteKit is another more
  runtime-agnostic web framework that can be used with Deno. We recommend
  starting with
  [this template](https://github.com/denoland/deno-sveltekit-template).
- [Nuxt (Vue)](https://nuxt.com/) - Nuxt is a hybrid SSR and client-side
  framework that works with Deno. We recommend starting with
  [this template](https://github.com/denoland/deno-nuxt-template).
- [Astro](https://astro.build/) - Astro is a modern web framework that was
  originally designed for Node.js, but runs great on Deno as well. We recommend
  starting with
  [this template](https://github.com/denoland/deno-astro-template).

Many more frameworks support Deno than are listed here, but we'd recommend these
as a great starting point.

## Deploying to production

When you're ready to move into production, your easiest option will be
[Deno Deploy](/deploy/manual). Deno Deploy makes it easy to create fast,
globally distributed serverless applications with Deno.

You can also host Deno
[in almost any cloud environment](../advanced/deploying_deno/index.md).

## Next Steps

We've only just scratched the surface of what's possible with Deno. Here are a
few resources to check out next.

- [Set up your dev environment](./setup_your_environment.md) - Learn about
  options for configuring your local dev environment
- [Tutorials and Examples](../../tutorials/index.md) - Sample code and use cases
  for Deno
- [Deno by Example](https://examples.deno.land) - Code snippets to learn Deno by
  example
