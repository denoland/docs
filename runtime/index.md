---
title: "Welcome to Deno"
description: "Learn the basics of Deno, a secure JavaScript, TypeScript, and WebAssembly runtime."
pagination_next: /runtime/getting_started/first_project/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
  - /
---

[Deno](https://deno.com)
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A), pronounced
`dee-no`) is an
[open source](https://github.com/denoland/deno/blob/main/LICENSE.md) JavaScript,
TypeScript, and WebAssembly runtime with secure defaults and a great developer
experience. It's built on [V8](https://v8.dev/),
[Rust](https://www.rust-lang.org/), and [Tokio](https://tokio.rs/).

## Why Deno?

- Deno is
  **[TypeScript-ready out of the box](/runtime/fundamentals/typescript/).** Zero
  config or additional steps necessary.
- Deno is **[secure by default](/runtime/fundamentals/security/).** Where other
  runtimes give full access every script they run, Deno allows you to enforce
  granular permissions.
- Deno has a **robust built-in toolchain.** Unlike Node or browser JavaScript,
  Deno includes a [standard library](/runtime/reference/std/), along with a
  first-party [linter/formatter](/runtime/fundamentals/linting_and_formatting/),
  [test runner](/runtime/fundamentals/testing/), and more.
- Deno is **fully compatible with [Node and npm](/runtime/fundamentals/node/).**
- Deno is **fast and reliable**.
- **[Deno is open-source](https://github.com/denoland/deno).**

## Quick install

Install the Deno runtime on your system using one of the terminal commands
below:

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

In Windows PowerShell:

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

## First steps

Deno can run JavaScript and [TypeScript](https://www.typescriptlang.org/) with
no additional tools or configuration required, all in a secure,
batteries-included runtime.

- [Making a Deno project](/runtime/getting_started/first_project/)
- [Setting up your environment](/runtime/getting_started/setup_your_environment/)
- [Using the CLI](/runtime/getting_started/command_line_interface)
