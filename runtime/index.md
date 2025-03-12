---
title: "Getting Started"
description: "A step-by-step guide to getting started with Deno. Learn how to install Deno, create your first program, and understand the basics of this secure JavaScript, TypeScript, and WebAssembly runtime."
pagination_next: /runtime/getting_started/first_project/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
---

[Deno](https://deno.com)
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A), pronounced
`dee-no`) is an
[open source](https://github.com/denoland/deno/blob/main/LICENSE.md) JavaScript,
TypeScript, and WebAssembly runtime with secure defaults and a great developer
experience. It's built on [V8](https://v8.dev/),
[Rust](https://www.rust-lang.org/), and [Tokio](https://tokio.rs/).

Let's create and run your first Deno program in under five minutes.

## Install Deno

Install the Deno runtime on your system using one of the terminal commands
below.

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

[Additional installation options can be found here](/runtime/getting_started/installation/).
After installation, you should have the `deno` executable available on your
system path. You can verify the installation by running:

```sh
deno --version
```

## Hello World

Deno can run JavaScript and [TypeScript](https://www.typescriptlang.org/) with
no additional tools or configuration required. Let's create a simple "hello
world" program and run it with Deno.

Create a TypeScript or JavaScript file called `main` and include the following
code:

<deno-tabs group-id="code">
<deno-tab value="TypeScript" label="TypeScript" default>

```ts title="main.ts"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

</deno-tab>
<deno-tab value="JavaScript" label="JavaScript">

```js title="main.js"
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

</deno-tab>
</deno-tabs>

Save the file and run it with Deno:

<deno-tabs group-id="commands">
<deno-tab value="ts" label="main.ts" default>

```sh
$ deno main.ts
Hello, world!
```

</deno-tab>
<deno-tab value="js" label="main.js">

```sh
$ deno main.js
Hello, world!
```

</deno-tab >
</deno-tabs>

## Next Steps

Congratulations! You've just run your first Deno program. Read on to learn more
about the Deno runtime.

- [Making a Deno project](/runtime/getting_started/first_project/)
- [Setting up your environment](/runtime/getting_started/setup_your_environment/)
- [Using the CLI](/runtime/getting_started/command_line_interface)
