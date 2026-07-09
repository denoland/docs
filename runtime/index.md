---
last_modified: 2026-05-28
title: "Get started with Deno"
description: "Install Deno and build your first project: why Deno, install, create, run, test, add a dependency, and use the built-in toolchain. No build step, no config."
pagination_next: /runtime/getting_started/installation/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
  - /
  - /runtime/getting_started/
  - /runtime/getting_started/first_project/
---

[Deno](https://deno.com)
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A), pronounced
`dee-no`) is an
[open source](https://github.com/denoland/deno/blob/main/LICENSE.md) JavaScript,
TypeScript, and WebAssembly runtime with secure defaults and a great developer
experience. This page takes you from nothing to a running, tested project in a
few minutes.

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
  [formatter](/runtime/lint_and_format/), [linter](/runtime/lint_and_format/),
  [test runner](/runtime/test/), benchmarking, and
  [a lot more](/runtime/reference/cli/). No `devDependencies` to wire up.

## Install Deno

Install the runtime with one command:

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS / Linux" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```shell
# pwsh
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
</deno-tabs>

Verify the install:

```sh
deno --version
```

See [Installation](/runtime/getting_started/installation/) for package managers,
Docker, and other options.

## Create a project

Scaffold a new project with [`deno init`](/runtime/reference/cli/init/):

```sh
deno init my_project
```

That creates a small, ready-to-run project:

```plaintext
my_project
├── deno.json      # project configuration: tasks, imports, lint/fmt settings
├── main.ts        # a tiny HTTP server built on Deno.serve
└── main_test.ts   # its tests
```

[`deno.json`](/runtime/reference/deno_json/) is where your tasks, dependencies,
and tooling config live. Think `package.json` plus your tool configs, in one
file.

## Run it

```sh
$ cd my_project
$ deno -N main.ts
Listening on http://localhost:8000/
```

Notice the `-N` (short for `--allow-net`). Deno is
[secure by default](/runtime/fundamentals/security/): code can't touch the
network, filesystem, or environment until you grant it. Open the URL to see the
response.

`main.ts` is TypeScript and it ran directly: **no `tsc`, no build step**. It's
also built on the web-standard [`Deno.serve`](/api/deno/~/Deno.serve) with
`Request`/`Response`, so what you learn here is the platform, not a framework.

## Test it

The project ships with tests. Run them with [`deno test`](/runtime/test/). The
test runner is built in, so there's nothing to install:

```sh
$ deno test
running 2 tests from ./main_test.ts
returns html on / ... ok (12ms)
returns json on /api ... ok (0ms)

ok | 2 passed | 0 failed (15ms)
```

## Add a dependency

Pull in packages from npm or [JSR](https://jsr.io) with
[`deno install`](/runtime/reference/cli/install/):

```sh
deno install express            # any npm package, like npm install
deno install jsr:@std/assert    # the Deno standard library, on JSR
```

Then import and use them:

```ts
import { assertEquals } from "@std/assert";

assertEquals(1 + 1, 2);
```

## Use the built-in toolchain

Formatting, linting, and more come with the runtime, no setup needed:

```sh
deno fmt     # format your code
deno lint    # catch problems
deno task    # run scripts defined in deno.json
```

## Next steps

- **[Set up your editor](/runtime/getting_started/setup_your_environment/).**
  Autocomplete, inline errors, and formatting on save.
- **[Run code](/runtime/run/).** Servers, tasks, web APIs, and debugging.
- **[Manage packages](/runtime/packages/).** Dependencies, workspaces,
  publishing.
- **[Migrate from Node.js](/runtime/migrate/).** Bring an existing project
  across.
- **[Examples and tutorials](/examples/).** Ideas for what to build next.
