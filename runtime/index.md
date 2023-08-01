---
sidebar_position: 1
sidebar_label: Quick Start
displayed_sidebar: runtime
---

# Deno Runtime Quick Start

[Deno](https://www.deno.com)
([/ˈdiːnoʊ/](http://ipa-reader.xyz/?text=%CB%88di%CB%90no%CA%8A), pronounced
`dee-no`) is a JavaScript, TypeScript, and WebAssembly runtime with secure
defaults and a great developer experience. It's built on [V8](https://v8.dev/),
[Rust](https://www.rust-lang.org/), and [Tokio](https://tokio.rs/). Let's create
and run your first Deno program in under five minutes, and introduce you to a
few key features of the runtime.

## Install Deno

Install the Deno runtime on your system using one of the terminal commands
below.

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
  <TabItem value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

</TabItem>
  <TabItem  value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</TabItem>
  <TabItem value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

</TabItem>
</Tabs>

[Additional installation options can be found here](./guide/getting_started/installation.md).
After installation, you should have the `deno` executable available on your
system path. You can confirm this is the case by running this command in your
terminal:

```sh
deno --version
```

## Create and run a TypeScript program

While you are welcome to use pure JavaScript, Deno has built-in support for
[TypeScript](https://www.typescriptlang.org/) as well. In your terminal, create
a new file called `hello.ts`, and include the following code.

```ts title="hello.ts"
interface Person {
  firstName: string,
  lastName: string
}

function sayHello(p: Person) {
  console.log(`Hello, ${p.firstName}!`);
}

sayHello({
  firstName: "Ada",
  lastName: "Lovelace"
});
```

This program declares an
[interface](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
for a Person, and defines a function that prints a message to the console using
this data type. You can execute the code in this example using the `deno run`
command.

```
deno run hello.ts
```

## Built-in web APIs and the Deno namespace

**TODO:** introduce the idea that, like the browser, many APIs are built in and
globally available. Also introduce the `Deno` namespace, and when you'd use it.

## Executing code with permissions

**TODO:** introduce the concept of permissions with an `--allow-net` example,
using `fetch`.

## Importing JavaScript modules

**TODO:** talk about how Deno embraces
[modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
and give local and remote examples (using standard library).

## Configure your project with deno.json

**TODO:** introduce config file concept (with import maps), building on the
previous example.

## Node.js APIs and npm packages

**TODO:** ensure developers know they can leverage modules from the npm
ecosystem with an `npm:` or `node:` specifier.

## Tools for local development

**TODO:** talk about built-in linter, formatter. Briefly introduce dev tools
like the VS Code plugin.

## Web application frameworks

**TODO:** talk about Fresh, oak, and aleph. Also point out express, and the Deno
adapter for SvelteKit.

## Deploying to production

talk about deno deploy and other hosting options
