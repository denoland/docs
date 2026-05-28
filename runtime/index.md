---
last_modified: 2025-10-10
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
experience.

## Why Deno?

- **Works with your existing [Node.js projects](/runtime/fundamentals/node/).**
  Drop Deno into a repo with `package.json` and `node_modules` and it just runs;
  mix `npm:` imports with native ES modules as you migrate.
- **Modern module system.** ES modules with URL imports, [JSR](https://jsr.io)
  for typed packages, and [workspaces](/runtime/fundamentals/workspaces/).
- **[TypeScript-first](/runtime/fundamentals/typescript/).** Run `.ts` files
  directly. No `tsc`, no build step, no config.
- **[Secure by default](/runtime/fundamentals/security/).** Code runs in a
  sandbox with no file, network, or environment access until you grant it.
- **A full toolchain, no plumbing.** Built-in
  [formatter](/runtime/fundamentals/linting_and_formatting/),
  [linter](/runtime/fundamentals/linting_and_formatting/),
  [test runner](/runtime/fundamentals/testing/), benchmarking, and
  [a lot more](/runtime/reference/cli/). No `devDependencies` to wire up.

## Quick install

Install the Deno runtime on your system using one of the terminal commands
below:

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```shell title="pwsh"
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
</deno-tabs>

[Additional installation options can be found here](/runtime/getting_started/installation/).
After installation, you should have the `deno` executable available on your
system path. You can verify the installation by running:

```sh
deno --version
```

## Next steps

With Deno installed, dive into the rest of the Getting Started guide:

- [Making a Deno project](/runtime/getting_started/first_project/)
- [Setting up your environment](/runtime/getting_started/setup_your_environment/)
- [Using the CLI](/runtime/getting_started/command_line_interface/)

For more installation options (package managers, Docker, building from source),
see the full [installation guide](/runtime/getting_started/installation/).
